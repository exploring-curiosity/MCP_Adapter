"""Pytest configuration: skip e2e tests that require external deps."""

collect_ignore_glob = [
    "e2e_tests.py",
    "output/math-api-mcp/run_server.py",
    "output/petstore-mcp/run_server.py",
]
