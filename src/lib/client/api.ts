export const api = {
  async dispatch<T>(method: string, url: string, body?: unknown) {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(response.statusText, { cause: response });
    }

    return response.json() as Promise<T>;
  },

  async get<T>(url: string) {
    return this.dispatch<T>("GET", url);
  },

  async post<T>(url: string, body: unknown) {
    return this.dispatch<T>("POST", url, body);
  },

  async patch<T>(url: string, body: unknown) {
    return this.dispatch<T>("PATCH", url, body);
  },

  async put<T>(url: string, body: unknown) {
    return this.dispatch<T>("PUT", url, body);
  },

  async delete<T>(url: string) {
    return this.dispatch<T>("DELETE", url);
  },
};
