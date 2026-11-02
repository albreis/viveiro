export class MemoryCache {
  entries = new Map();
  async put(request, response) {
    this.entries.set(String(request), response.clone());
  }
  async match(request) {
    return this.entries.get(String(request))?.clone();
  }
}
export class MemoryCaches {
  entries = new Map();
  async open(name) {
    if (!this.entries.has(name)) this.entries.set(name, new MemoryCache());
    return this.entries.get(name);
  }
  async has(name) {
    return this.entries.has(name);
  }
  async delete(name) {
    return this.entries.delete(name);
  }
  async keys() {
    return [...this.entries.keys()];
  }
}
export function publicResponse(body, url, headers = {}) {
  const response = new Response(body, {
    headers: { "cache-control": "public", ...headers },
  });
  Object.defineProperty(response, "url", { value: url });
  return response;
}
