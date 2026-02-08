from __future__ import annotations
import asyncio
import json
from typing import Any
from dedalus_mcp.client import MCPClient

async def test_list_tools(client: MCPClient) -> None:
    """Verify all 5 tools are registered."""
    tools = await client.list_tools()
    assert len(tools) == 5, f"Expected 5 tools, got {len(tools)}"
    print("✅ test_list_tools passed")

async def test_tool_schemas(client: MCPClient) -> None:
    """Verify each tool has name and description."""
    tools = await client.list_tools()
    for tool in tools:
        assert "name" in tool, f"Tool missing name: {tool}"
        assert "description" in tool, f"Tool missing description: {tool}"
    print("✅ test_tool_schemas passed")

async def test_math_operations(client: MCPClient) -> None:
    """Test basic math operations."""
    # Test addnumbers
    result = await client.call_tool("addnumbers", {"a": 5, "b": 3})
    assert json.loads(result) == 8, f"Unexpected add result: {result}"
    
    # Test subtractnumbers
    result = await client.call_tool("subtractnumbers", {"a": 5, "b": 3})
    assert json.loads(result) == 2, f"Unexpected subtract result: {result}"
    
    # Test multiplynumbers
    result = await client.call_tool("multiplynumbers", {"a": 5, "b": 3})
    assert json.loads(result) == 15, f"Unexpected multiply result: {result}"
    
    # Test dividenumbers
    result = await client.call_tool("dividenumbers", {"a": 6, "b": 3})
    assert json.loads(result) == 2, f"Unexpected divide result: {result}"
    
    # Test healthcheck
    result = await client.call_tool("healthcheck", {})
    assert "status" in json.loads(result), f"Unexpected healthcheck response: {result}"
    
    print("✅ test_math_operations passed")

async def main() -> None:
    """Run all test cases."""
    client = await MCPClient.connect("http://127.0.0.1:8000/mcp")
    try:
        await test_list_tools(client)
        await test_tool_schemas(client)
        await test_math_operations(client)
    finally:
        await client.close()
    print("All tests passed!")

if __name__ == "__main__":
    asyncio.run(main())