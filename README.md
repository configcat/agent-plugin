# agent-tools
ConfigCat's official collection of agent tools (agent skills, agent plugins)

This repository provides tools to integrate ConfigCat's feature flag management into AI agents and assistants, including Claude, Cursor, and other MCP-compatible platforms.

## What's included

| Tool | Description |
|------|-------------|
| [`mcp-server/`](./mcp-server/) | A [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server that exposes ConfigCat tools to Claude, Cursor, and any MCP-compatible AI assistant |
| [`skills/`](./skills/) | Declarative skill definitions (JSON) for use with OpenAI-compatible function calling and other agent platforms |

## Available tools

All tools interact with the [ConfigCat Public Management API](https://api.configcat.com/docs/):

| Tool | Description |
|------|-------------|
| `list_products` | List all products (organizations) in the ConfigCat account |
| `list_configs` | List all configs within a product |
| `list_feature_flags` | List all feature flags in a config |
| `get_feature_flag` | Get details of a specific feature flag |
| `create_feature_flag` | Create a new feature flag |
| `delete_feature_flag` | Delete a feature flag |
| `get_flag_value` | Get the value and targeting rules of a flag for an environment |
| `update_flag_value` | Update the value of a flag for an environment |
| `list_environments` | List all environments within a product |

## MCP Server (Claude & Cursor)

The MCP server (`mcp-server/`) implements the [Model Context Protocol](https://modelcontextprotocol.io), which is the standard used by Claude Desktop, Cursor, and other AI tools.

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- A [ConfigCat](https://configcat.com) account
- Your ConfigCat Public Management API credentials from [app.configcat.com/my-account/public-api-credentials](https://app.configcat.com/my-account/public-api-credentials)

### Build

```sh
cd mcp-server
npm install
npm run build
```

### Configure Claude Desktop

Add the server to your Claude Desktop configuration file:

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "configcat": {
      "command": "node",
      "args": ["/absolute/path/to/agent-tools/mcp-server/build/index.js"],
      "env": {
        "CONFIGCAT_API_KEY": "<your-configcat-api-key>"
      }
    }
  }
}
```

Restart Claude Desktop after saving the configuration.

### Configure Cursor

Add the server to your Cursor MCP configuration file:

- **macOS / Linux**: `~/.cursor/mcp.json`
- **Windows**: `%USERPROFILE%\.cursor\mcp.json`

```json
{
  "mcpServers": {
    "configcat": {
      "command": "node",
      "args": ["/absolute/path/to/agent-tools/mcp-server/build/index.js"],
      "env": {
        "CONFIGCAT_API_KEY": "<your-configcat-api-key>"
      }
    }
  }
}
```

Restart Cursor after saving the configuration. The ConfigCat tools will be available in Cursor's AI chat.

### Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `CONFIGCAT_API_KEY` | Yes | Your ConfigCat Public Management API key |
| `CONFIGCAT_BASE_URL` | No | Override the default API base URL (`https://api.configcat.com`) |

## Skills (OpenAI-compatible platforms)

The `skills/configcat-skills.json` file contains tool/function definitions compatible with OpenAI function calling format. It can be used with:

- OpenAI Assistants API
- Microsoft Copilot Studio
- Any platform that supports the OpenAI tools/functions format

## License

[MIT](./LICENSE)
