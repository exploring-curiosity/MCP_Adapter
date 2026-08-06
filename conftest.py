"""Shared pytest fixtures.

The generated servers under `output/` ship demo test functions that take a live
`MCPClient`. They were written to be run as scripts against a running server, so
pytest collects them but cannot supply the argument they ask for.

This fixture supplies it when a server is actually listening, and skips with a
clear reason when one is not, rather than erroring out the whole suite.
"""

import socket

import pytest

MCP_HOST = "127.0.0.1"
MCP_PORT = 8000
MCP_URL = f"http://{MCP_HOST}:{MCP_PORT}/mcp"


def _server_listening(timeout: float = 0.25) -> bool:
    """True when something accepts connections on the MCP port."""
    try:
        with socket.create_connection((MCP_HOST, MCP_PORT), timeout=timeout):
            return True
    except OSError:
        return False


@pytest.fixture
async def client():
    """A connected MCPClient, or a skip when no server is running locally."""
    if not _server_listening():
        pytest.skip(
            f"no MCP server on {MCP_HOST}:{MCP_PORT}. "
            f"Start one with `python output/math-api-mcp/server.py` to run these."
        )

    from dedalus_mcp.client import MCPClient

    connected = await MCPClient.connect(MCP_URL)
    try:
        yield connected
    finally:
        await connected.close()
