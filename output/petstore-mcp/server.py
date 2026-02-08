from __future__ import annotations
import asyncio, json, os
from typing import Any
import httpx
from dedalus_mcp import MCPServer, tool

BASE_URL = os.getenv("SWAGGER_PETSTORE_BASE_URL", "https://petstore.swagger.io/v2")
API_KEY = os.getenv("SWAGGER_PETSTORE_API_KEY", "")

def _headers() -> dict[str, str]:
    h = {"Content-Type": "application/json", "Accept": "application/json"}
    if API_KEY:
        h["api_key"] = API_KEY
        h["Authorization"] = f"Bearer {API_KEY}"
    return h

async def _request(method: str, path: str, *, params: dict[str, Any] | None = None,
                   body: dict[str, Any] | None = None) -> str:
    url = f"{BASE_URL}{path}"
    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            resp = await client.request(method, url, headers=_headers(),
                                      params=params, json=body if body else None)
            resp.raise_for_status()
            try:
                return json.dumps(resp.json(), indent=2)
            except Exception:
                return resp.text
        except httpx.HTTPStatusError as e:
            return json.dumps({"error": str(e), "status": e.response.status_code})
        except Exception as e:
            return json.dumps({"error": str(e)})

@tool(description="Add a new pet to the store [WRITES DATA]")
async def addpet(body: dict) -> str:
    """Add a new pet to the store."""
    return await _request("POST", "/pet", body=body)

@tool(description="Create user [WRITES DATA]")
async def createuser(body: dict) -> str:
    """Create user."""
    return await _request("POST", "/user", body=body)

@tool(description="Creates list of users with given input array [WRITES DATA]")
async def createuserswitharrayinput(body: list) -> str:
    """Create users from array."""
    return await _request("POST", "/user/createWithArray", body=body)

@tool(description="Creates list of users with given input array [WRITES DATA]")
async def createuserswithlistinput(body: list) -> str:
    """Create users from list."""
    return await _request("POST", "/user/createWithList", body=body)

@tool(description="Delete purchase order by ID [DESTRUCTIVE]")
async def deleteorder(orderId: str) -> str:
    """Delete an order."""
    return await _request("DELETE", f"/store/order/{orderId}")

@tool(description="Deletes a pet [DESTRUCTIVE]")
async def deletepet(petId: str) -> str:
    """Delete a pet."""
    return await _request("DELETE", f"/pet/{petId}")

@tool(description="Delete user [DESTRUCTIVE]")
async def deleteuser(username: str) -> str:
    """Delete a user."""
    return await _request("DELETE", f"/user/{username}")

@tool(description="Returns pet inventories by status")
async def getinventory() -> str:
    """Get inventory status."""
    return await _request("GET", "/store/inventory")

@tool(description="Find purchase order by ID")
async def getorderbyid(orderId: str) -> str:
    """Get order by ID."""
    return await _request("GET", f"/store/order/{orderId}")

@tool(description="Place an order for a pet [WRITES DATA]")
async def placeorder(body: dict) -> str:
    """Place an order."""
    return await _request("POST", "/store/order", body=body)

@tool(description="Search or list pet with flexible filtering")
async def search_pet(status: str | None = None, tags: str | None = None, petId: str | None = None) -> str:
    """Search pets."""
    if petId:
        return await _request("GET", f"/pet/{petId}")
    params = {}
    if status:
        return await _request("GET", "/pet/findByStatus", params={"status": status})
    if tags:
        return await _request("GET", "/pet/findByTags", params={"tags": tags})
    return json.dumps({"error": "Must provide status, tags, or petId"})

@tool(description="Search or list user with flexible filtering")
async def search_user(username: str | None = None, password: str | None = None) -> str:
    """Search users."""
    if username:
        return await _request("GET", f"/user/{username}")
    if password:
        return await _request("GET", "/user/login", params={"username": username, "password": password})
    return await _request("GET", "/user/logout")

@tool(description="Update an existing pet [WRITES DATA]")
async def updatepet(body: dict) -> str:
    """Update a pet."""
    return await _request("PUT", "/pet", body=body)

@tool(description="Updates a pet in the store with form data [WRITES DATA]")
async def updatepetwithform(petId: str, name: str | None = None, status: str | None = None) -> str:
    """Update pet with form."""
    body = {}
    if name is not None:
        body["name"] = name
    if status is not None:
        body["status"] = status
    return await _request("POST", f"/pet/{petId}", body=body)

@tool(description="Updated user [WRITES DATA]")
async def updateuser(username: str, body: dict) -> str:
    """Update a user."""
    return await _request("PUT", f"/user/{username}", body=body)

@tool(description="uploads an image [WRITES DATA]")
async def uploadfile(petId: str, additionalMetadata: str | None = None, file: str | None = None) -> str:
    """Upload a file."""
    body = {}
    if additionalMetadata is not None:
        body["additionalMetadata"] = additionalMetadata
    if file is not None:
        body["file"] = file
    return await _request("POST", f"/pet/{petId}/uploadImage", body=body)

server = MCPServer("petstore-mcp")
server.collect(
    addpet,
    createuser,
    createuserswitharrayinput,
    createuserswithlistinput,
    deleteorder,
    deletepet,
    deleteuser,
    getinventory,
    getorderbyid,
    placeorder,
    search_pet,
    search_user,
    updatepet,
    updatepetwithform,
    updateuser,
    uploadfile
)
if __name__ == "__main__":
    asyncio.run(server.serve())