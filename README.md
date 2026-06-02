# mcp-clevelandart

Cleveland Museum of Art Open Access MCP.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 673+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `search` | Search artworks. Optional filters: type, artist, has_image, cc0. |
| `get_artwork` | Single artwork by accession number (e.g. "1962.158") or numeric id. |
| `creators` | Search creators (artists) by name. |
| `exhibitions` | Search exhibitions by title/keyword. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "clevelandart": {
      "url": "https://gateway.pipeworx.io/clevelandart/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 673+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Clevelandart data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [All tools and guides](https://github.com/pipeworx-io/examples)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
