/**
 * Either a Delete symbol or a patch for the type T. Values of optional keys also accept null.
 */
export type Mutation<T> =
  | typeof Delete
  | {
      [K in keyof T]?: T extends Record<K, unknown> ? T[K] : null | T[K];
    };

export const Delete = Symbol("delete");

export type Id = string;

export type Vote = {
  id: Id;
  cardId: Id;
  voterId: Id;
  createdAt: string;
  updatedAt: string;
};

export type Card = {
  id: Id;
  columnId: Id;
  createdAt: string;
  updatedAt: string;
  description: string;
  votes: Vote[];
};

export type Board = {
  id: Id;
  createdAt: string;
  updatedAt: string;
  presentsAt?: string;
  columns: Column[];
};

export type Column = {
  id: Id;
  boardId: Id;
  createdAt: string;
  updatedAt: string;
  description: string;
  cards: Card[];
};

export const api = {
  url(path: string) {
    return new URL(
      path,
      typeof location === "undefined" ? "http://localhost:3000" : location.href,
    );
  },

  async dispatch<T>(method: string, url: string, body?: unknown): Promise<T> {
    const response = await fetch(this.url(url), {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(response.statusText, { cause: response });
    }

    if (response.status === 204) {
      return null as T;
    }

    return await response.json();
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
