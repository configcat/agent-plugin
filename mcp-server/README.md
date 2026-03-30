# @configcat/mcp-server

A [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server that exposes ConfigCat feature flag management tools to AI assistants like Claude and Cursor.

## Setup

```sh
npm install
npm run build
```

## Usage

Set the `CONFIGCAT_API_KEY` environment variable to your [ConfigCat Public Management API key](https://app.configcat.com/my-account/public-api-credentials), then run:

```sh
node build/index.js
```

See the [root README](../README.md) for instructions on integrating with Claude Desktop and Cursor.

## Development

```sh
npm run watch   # watch mode TypeScript compilation
npm test        # run unit tests
```
