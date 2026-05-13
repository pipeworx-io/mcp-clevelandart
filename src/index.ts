interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * Cleveland Museum of Art Open Access MCP.
 *
 * Auth: none. Docs: https://openaccess-api.clevelandart.org/
 */


const BASE = 'https://openaccess-api.clevelandart.org/api';
const UA = 'pipeworx-mcp-clevelandart/1.0 (+https://pipeworx.io)';

const tools: McpToolExport['tools'] = [
  {
    name: 'search',
    description: 'Search artworks. Optional filters: type, artist, has_image, cc0.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Free-text search across title/description/artist.' },
        type: { type: 'string', description: 'e.g. "Painting", "Sculpture", "Drawing"' },
        artist: { type: 'string' },
        has_image: { type: 'boolean', description: 'Restrict to artworks with a web image.' },
        cc0: { type: 'boolean', description: 'Restrict to CC0-licensed images.' },
        limit: { type: 'number', description: '1-1000 (default 25)' },
        skip: { type: 'number', description: 'Offset (default 0)' },
      },
    },
  },
  {
    name: 'get_artwork',
    description: 'Single artwork by accession number (e.g. "1962.158") or numeric id.',
    inputSchema: {
      type: 'object',
      properties: { id: { type: 'string', description: 'e.g. "1962.158" or "94979"' } },
      required: ['id'],
    },
  },
  {
    name: 'creators',
    description: 'Search creators (artists) by name.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string' },
        limit: { type: 'number', description: '1-1000 (default 25)' },
      },
    },
  },
  {
    name: 'exhibitions',
    description: 'Search exhibitions by title/keyword.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string' },
        limit: { type: 'number', description: '1-1000 (default 25)' },
      },
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'search': {
      const params = new URLSearchParams();
      if (args.query) params.set('q', String(args.query));
      if (args.type) params.set('type', String(args.type));
      if (args.artist) params.set('artists', String(args.artist));
      if (args.has_image) params.set('has_image', '1');
      if (args.cc0) params.set('cc0', '1');
      params.set('limit', String(Math.min(1000, Math.max(1, (args.limit as number) ?? 25))));
      params.set('skip', String(Math.max(0, (args.skip as number) ?? 0)));
      return caGet(`/artworks?${params}`);
    }
    case 'get_artwork': {
      const id = reqStr(args, 'id', '"1962.158"');
      return caGet(`/artworks/${encodeURIComponent(id)}`);
    }
    case 'creators': {
      const params = new URLSearchParams();
      if (args.query) params.set('name', String(args.query));
      params.set('limit', String(Math.min(1000, Math.max(1, (args.limit as number) ?? 25))));
      return caGet(`/creators?${params}`);
    }
    case 'exhibitions': {
      const params = new URLSearchParams();
      if (args.query) params.set('title', String(args.query));
      params.set('limit', String(Math.min(1000, Math.max(1, (args.limit as number) ?? 25))));
      return caGet(`/exhibitions?${params}`);
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function caGet(path: string): Promise<unknown> {
  const res = await fetch(`${BASE}${path}`, { headers: { Accept: 'application/json', 'User-Agent': UA } });
  if (res.status === 404) throw new Error('Cleveland Art: not found');
  if (!res.ok) throw new Error(`Cleveland Art: ${res.status} ${await res.text().then((t) => t.slice(0, 200))}`);
  return res.json();
}

function reqStr(args: Record<string, unknown>, key: string, example: string): string {
  const v = args[key];
  if (typeof v !== 'string' || !v.trim()) {
    throw new Error(`Required argument "${key}" is missing. Pass a string like ${example}.`);
  }
  return v;
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
