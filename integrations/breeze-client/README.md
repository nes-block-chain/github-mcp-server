# Breeze client integration (optional)

Upstream: https://github.com/Breeze/breeze-client

This directory documents an **optional** client-side data layer for web dashboards that communicate with the GitHub MCP server through a separate authenticated API. Breeze is **not** a GitHub MCP transport and is not required for the MCP server to run.

## Integration plan
1. Keep the existing MCP server implementation unchanged.
2. In a separate JavaScript/TypeScript dashboard project, install the upstream Breeze client package according to its official documentation.
3. Add an authenticated application API between the dashboard and any MCP-backed operations; never expose MCP credentials or GitHub tokens to browsers.
4. Test read-only queries first; enable mutations only after authorization and validation.
5. Maintain the original upstream license and attribution when copying any upstream source.

## Repository topology
- Primary development: https://github.com/nes-block-chain/github-mcp-server
- Secondary repository: https://github.com/socity-in-crisis/github-mcp-server
- Sync direction: primary -> secondary, only with write access and conflict checks.

No Breeze source is vendored here, no GitHub fork has been created, and no automatic synchronization is enabled by this document.
