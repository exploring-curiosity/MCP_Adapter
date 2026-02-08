import asyncio
import json
from typing import Any
from dedalus_mcp.client import MCPClient

async def test_list_tools(client: MCPClient) -> None:
    """Verify all 16 tools are registered."""
    tools = await client.list_tools()
    assert len(tools) == 16, f"Expected 16 tools, got {len(tools)}"
    print("✅ test_list_tools passed")

async def test_tool_schemas(client: MCPClient) -> None:
    """Verify each tool has name and description."""
    tools = await client.list_tools()
    for tool in tools:
        assert "name" in tool, f"Tool missing name: {tool}"
        assert "description" in tool, f"Tool {tool['name']} missing description"
    print("✅ test_tool_schemas passed")

async def run_tests() -> None:
    """Run all test cases against the MCP server."""
    client = await MCPClient.connect("http://127.0.0.1:8000/mcp")
    try:
        await test_list_tools(client)
        await test_tool_schemas(client)
    finally:
        await client.close()

def main() -> None:
    """Run tests and print results."""
    try:
        asyncio.run(run_tests())
    except Exception as e:
        print(f"❌ Tests failed: {e}")
        raise

if __name__ == "__main__":
    main()