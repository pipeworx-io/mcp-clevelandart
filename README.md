# @pipeworx/clevelandart

Cleveland Museum of Art Open Access API MCP — search/lookup ~63 000 artworks, including high-res CC0 images. Keyless.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

- `search(query?, filters?)` — search artworks with optional filters (artist, type, has_image, cc0)
- `get_artwork(id)` — full artwork record by accession number or numeric id
- `creators(query?, limit?)` — search creators (artists)
- `exhibitions(query?, limit?)` — search exhibitions

## Data source

`https://openaccess-api.clevelandart.org/api/`

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

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

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

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
