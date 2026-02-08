"""FastAPI backend that wraps the mcp_adapter pipeline for the frontend.

Run:  uvicorn api_server:app --port 8080 --reload --reload-exclude output
"""

from __future__ import annotations

import json
import os
import pickle
import uuid
from pathlib import Path
from typing import Any

from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from mcp_adapter.ingest import ingest
from mcp_adapter.mine import mine_tools
from mcp_adapter.models import SafetyLevel, ToolDefinition
from mcp_adapter.safety import SafetyPolicy, apply_safety
from mcp_adapter.agentic_codegen import generate as agentic_generate
from mcp_adapter.deploy import deploy as deploy_to_github
from mcp_adapter.logger import setup_logging

setup_logging(verbose=False)

app = FastAPI(title="MCP Maker API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── File-backed session store (survives uvicorn reloads) ──────────────────

_SESSION_DIR = Path(__file__).parent / ".sessions"
_SESSION_DIR.mkdir(exist_ok=True)
OUTPUT_ROOT = Path(__file__).parent / "output"


def _save_session(session_id: str, data: dict[str, Any]) -> None:
    """Persist session to disk."""
    (_SESSION_DIR / f"{session_id}.pkl").write_bytes(pickle.dumps(data))


def _load_session(session_id: str) -> dict[str, Any] | None:
    """Load session from disk."""
    p = _SESSION_DIR / f"{session_id}.pkl"
    if p.exists():
        return pickle.loads(p.read_bytes())
    return None


# ── Request / response models ─────────────────────────────────────────────

class IngestRequest(BaseModel):
    source: str  # URL or file path
    source_type: str = "openapi"  # openapi, docs, sdk, postman

class PolicyUpdate(BaseModel):
    session_id: str
    policies: list[dict[str, Any]]  # [{name, safety, auto_execute, rate_limit_qpm}]

class GenerateRequest(BaseModel):
    session_id: str
    server_name: str | None = None

class DeployRequest(BaseModel):
    session_id: str
    github_org: str | None = None


# ── Endpoints ─────────────────────────────────────────────────────────────

@app.post("/api/ingest")
async def api_ingest(req: IngestRequest):
    """Stage 1: Ingest an API spec and return parsed endpoints."""
    try:
        api_spec = ingest(req.source)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Ingestion failed: {e}")

    session_id = str(uuid.uuid4())[:8]

    # Stage 2: Mine tools immediately
    tools = mine_tools(api_spec)

    # Stage 3: Apply default safety
    tools = apply_safety(tools)

    _save_session(session_id, {
        "spec": api_spec,
        "tools": tools,
        "generated": None,
        "output_dir": None,
    })

    return {
        "session_id": session_id,
        "spec": {
            "title": api_spec.title,
            "version": api_spec.version,
            "description": api_spec.description,
            "base_url": api_spec.base_url,
            "tags": api_spec.tags,
            "auth_schemes": [s.model_dump() for s in api_spec.auth_schemes],
        },
        "endpoints": [
            {
                "method": ep.method.value,
                "path": ep.path,
                "operation_id": ep.operation_id,
                "summary": ep.summary,
                "description": ep.description,
                "tags": ep.tags,
                "params": [
                    {
                        "name": p.name,
                        "location": p.location.value,
                        "description": p.description,
                        "required": p.required,
                        "schema_type": p.schema_type,
                    }
                    for p in ep.parameters
                ],
                "deprecated": ep.deprecated,
            }
            for ep in api_spec.endpoints
        ],
        "tools": [
            {
                "name": t.name,
                "description": t.description,
                "safety": t.safety.value,
                "params": [
                    {
                        "name": p.name,
                        "description": p.description,
                        "json_type": p.json_type,
                        "required": p.required,
                    }
                    for p in t.params
                ],
                "endpoints": [
                    {"method": e.method.value, "path": e.path}
                    for e in t.endpoints
                ],
                "tags": t.tags,
            }
            for t in tools
        ],
    }


@app.get("/api/session/{session_id}")
async def api_session(session_id: str):
    """Get current session state."""
    sess = _load_session(session_id)
    if not sess:
        raise HTTPException(status_code=404, detail="Session not found")

    api_spec = sess["spec"]
    tools = sess["tools"]

    return {
        "session_id": session_id,
        "spec": {
            "title": api_spec.title,
            "version": api_spec.version,
            "description": api_spec.description,
            "base_url": api_spec.base_url,
            "tags": api_spec.tags,
        },
        "endpoints": [
            {
                "method": ep.method.value,
                "path": ep.path,
                "summary": ep.summary,
                "description": ep.description,
                "tags": ep.tags,
                "params": [
                    {
                        "name": p.name,
                        "location": p.location.value,
                        "description": p.description,
                        "required": p.required,
                        "schema_type": p.schema_type,
                    }
                    for p in ep.parameters
                ],
            }
            for ep in api_spec.endpoints
        ],
        "tools": [
            {
                "name": t.name,
                "description": t.description,
                "safety": t.safety.value,
                "params": [
                    {
                        "name": p.name,
                        "description": p.description,
                        "json_type": p.json_type,
                        "required": p.required,
                    }
                    for p in t.params
                ],
                "endpoints": [
                    {"method": e.method.value, "path": e.path}
                    for e in t.endpoints
                ],
                "tags": t.tags,
            }
            for t in tools
        ],
        "has_generated": sess["generated"] is not None,
    }


@app.post("/api/policy")
async def api_policy(req: PolicyUpdate):
    """Stage 4: Update tool policies (safety level, auto_execute, rate_limit)."""
    sess = _load_session(req.session_id)
    if not sess:
        raise HTTPException(status_code=404, detail="Session not found")

    tools = sess["tools"]
    policy_map = {p["name"]: p for p in req.policies}

    for tool in tools:
        if tool.name in policy_map:
            p = policy_map[tool.name]
            if "safety" in p:
                tool.safety = SafetyLevel(p["safety"])

    sess["tools"] = tools
    _save_session(req.session_id, sess)
    return {"status": "ok", "tool_count": len(tools)}


@app.post("/api/generate")
async def api_generate(req: GenerateRequest):
    """Stage 5: Generate the MCP server code."""
    sess = _load_session(req.session_id)
    if not sess:
        raise HTTPException(status_code=404, detail="Session not found")

    api_spec = sess["spec"]
    tools = sess["tools"]
    name = req.server_name or None

    output_dir = OUTPUT_ROOT / (name or api_spec.title.lower().replace(" ", "-") + "-mcp")

    try:
        result = agentic_generate(api_spec, tools, server_name=name, output_dir=str(output_dir))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Code generation failed: {e}")

    sess["generated"] = result
    sess["output_dir"] = str(output_dir)
    _save_session(req.session_id, sess)

    # Read all generated files
    files: dict[str, dict] = {}
    if output_dir.exists():
        for f in sorted(output_dir.iterdir()):
            if f.is_file():
                try:
                    content = f.read_text(encoding="utf-8")
                    files[f.name] = {
                        "content": content,
                        "lines": len(content.splitlines()),
                        "lang": _detect_lang(f.name),
                    }
                except Exception:
                    files[f.name] = {"content": "(binary file)", "lines": 0, "lang": ""}

    return {
        "server_name": result.server_name,
        "tool_count": result.tool_count,
        "output_dir": str(output_dir),
        "files": files,
    }


@app.post("/api/test")
async def api_test(req: GenerateRequest):
    """Stage 6: Run the generated test suite."""
    sess = _load_session(req.session_id)
    if not sess:
        raise HTTPException(status_code=404, detail="Session not found")

    output_dir = sess.get("output_dir")
    if not output_dir:
        raise HTTPException(status_code=400, detail="No generated code to test")

    test_file = Path(output_dir) / "test_server.py"
    if not test_file.exists():
        raise HTTPException(status_code=400, detail="No test file found")

    # Return the test file content — actual test execution would need
    # the upstream API running. For now we return the test structure.
    test_code = test_file.read_text(encoding="utf-8")
    test_names = [
        line.strip().replace("async def ", "").replace("def ", "").split("(")[0]
        for line in test_code.splitlines()
        if line.strip().startswith(("async def test_", "def test_"))
    ]

    return {
        "test_file": test_code,
        "test_names": test_names,
        "test_count": len(test_names),
    }


@app.post("/api/deploy")
async def api_deploy(req: DeployRequest):
    """Stage 7: Deploy to GitHub."""
    sess = _load_session(req.session_id)
    if not sess:
        raise HTTPException(status_code=404, detail="Session not found")

    output_dir = sess.get("output_dir")
    generated = sess.get("generated")
    if not output_dir or not generated:
        raise HTTPException(status_code=400, detail="No generated code to deploy")

    api_spec = sess["spec"]

    try:
        deploy_info = deploy_to_github(
            output_dir=output_dir,
            repo_name=generated.server_name,
            description=f"Auto-generated MCP server for {api_spec.title}",
            org=req.github_org,
            open_dashboard=False,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Deploy failed: {e}")

    return deploy_info


def _detect_lang(filename: str) -> str:
    ext_map = {
        ".py": "python",
        ".json": "json",
        ".toml": "toml",
        ".txt": "text",
        ".env": "env",
        ".md": "markdown",
        ".yaml": "yaml",
        ".yml": "yaml",
    }
    for ext, lang in ext_map.items():
        if filename.endswith(ext):
            return lang
    if filename.startswith(".env"):
        return "env"
    return ""
