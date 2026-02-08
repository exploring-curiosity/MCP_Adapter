"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// ── Types ────────────────────────────────────────────────────────────────

export interface EndpointParam {
  name: string;
  location: string;
  description: string;
  required: boolean;
  schema_type: string;
}

export interface DiscoveredEndpoint {
  method: string;
  path: string;
  operation_id: string;
  summary: string;
  description: string;
  tags: string[];
  params: EndpointParam[];
  deprecated: boolean;
}

export interface ToolParam {
  name: string;
  description: string;
  json_type: string;
  required: boolean;
}

export interface ToolEndpoint {
  method: string;
  path: string;
}

export interface Tool {
  name: string;
  description: string;
  safety: string;
  params: ToolParam[];
  endpoints: ToolEndpoint[];
  tags: string[];
}

export interface SpecInfo {
  title: string;
  version: string;
  description: string;
  base_url: string;
  tags: string[];
}

export interface GeneratedFile {
  content: string;
  lines: number;
  lang: string;
}

export interface GenerateResult {
  server_name: string;
  tool_count: number;
  output_dir: string;
  files: Record<string, GeneratedFile>;
}

export interface TestInfo {
  test_file: string;
  test_names: string[];
  test_count: number;
}

export interface DeployInfo {
  repo_full_name: string;
  repo_url: string;
  clone_url: string;
  dashboard_url: string;
  env_vars: Record<string, { value: string; required: boolean; description: string }>;
  server_name: string;
  base_url: string;
}

export interface PipelineState {
  sessionId: string | null;
  spec: SpecInfo | null;
  endpoints: DiscoveredEndpoint[];
  tools: Tool[];
  generated: GenerateResult | null;
  testInfo: TestInfo | null;
  deployInfo: DeployInfo | null;
  loading: boolean;
  error: string | null;
}

interface PipelineContextValue extends PipelineState {
  runIngest: (source: string, sourceType: string) => Promise<void>;
  updatePolicies: (policies: { name: string; safety: string; auto_execute: boolean; rate_limit_qpm: number }[]) => Promise<void>;
  runGenerate: (serverName?: string) => Promise<void>;
  runTest: () => Promise<void>;
  runDeploy: (githubOrg?: string) => Promise<void>;
  reset: () => void;
}

const initialState: PipelineState = {
  sessionId: null,
  spec: null,
  endpoints: [],
  tools: [],
  generated: null,
  testInfo: null,
  deployInfo: null,
  loading: false,
  error: null,
};

const PipelineContext = createContext<PipelineContextValue | null>(null);

export function PipelineProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PipelineState>(initialState);

  const setLoading = (loading: boolean) => setState((s) => ({ ...s, loading, error: null }));
  const setError = (error: string) => setState((s) => ({ ...s, loading: false, error }));

  const runIngest = useCallback(async (source: string, sourceType: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/ingest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source, source_type: sourceType }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: res.statusText }));
        throw new Error(err.detail || "Ingestion failed");
      }
      const data = await res.json();
      setState((s) => ({
        ...s,
        loading: false,
        sessionId: data.session_id,
        spec: data.spec,
        endpoints: data.endpoints,
        tools: data.tools,
      }));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }, []);

  const updatePolicies = useCallback(async (policies: { name: string; safety: string; auto_execute: boolean; rate_limit_qpm: number }[]) => {
    if (!state.sessionId) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/policy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: state.sessionId, policies }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: res.statusText }));
        throw new Error(err.detail || "Policy update failed");
      }
      setState((s) => ({ ...s, loading: false }));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }, [state.sessionId]);

  const runGenerate = useCallback(async (serverName?: string) => {
    if (!state.sessionId) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: state.sessionId, server_name: serverName || null }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: res.statusText }));
        throw new Error(err.detail || "Generation failed");
      }
      const data = await res.json();
      setState((s) => ({ ...s, loading: false, generated: data }));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }, [state.sessionId]);

  const runTest = useCallback(async () => {
    if (!state.sessionId) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/test`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: state.sessionId }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: res.statusText }));
        throw new Error(err.detail || "Test failed");
      }
      const data = await res.json();
      setState((s) => ({ ...s, loading: false, testInfo: data }));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }, [state.sessionId]);

  const runDeploy = useCallback(async (githubOrg?: string) => {
    if (!state.sessionId) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/deploy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: state.sessionId, github_org: githubOrg || null }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: res.statusText }));
        throw new Error(err.detail || "Deploy failed");
      }
      const data = await res.json();
      setState((s) => ({ ...s, loading: false, deployInfo: data }));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }, [state.sessionId]);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  return (
    <PipelineContext.Provider
      value={{
        ...state,
        runIngest,
        updatePolicies,
        runGenerate,
        runTest,
        runDeploy,
        reset,
      }}
    >
      {children}
    </PipelineContext.Provider>
  );
}

export function usePipeline() {
  const ctx = useContext(PipelineContext);
  if (!ctx) throw new Error("usePipeline must be used inside PipelineProvider");
  return ctx;
}
