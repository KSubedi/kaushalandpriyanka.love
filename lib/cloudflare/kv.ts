interface CloudflareError {
  code: number;
  message: string;
}

interface CloudflareErrorResponse {
  success: boolean;
  errors: CloudflareError[];
  messages: string[];
}

interface KVListResult<T> {
  result: T[];
  result_info: {
    count: number;
    cursor?: string;
  };
  success: boolean;
  errors: CloudflareError[];
  messages: string[];
}

export class CloudflareKV {
  private static getConfig() {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const namespaceId = process.env.CLOUDFLARE_KV_NAMESPACE_ID;
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;

    if (!accountId) throw new Error("CLOUDFLARE_ACCOUNT_ID is not configured");
    if (!namespaceId)
      throw new Error("CLOUDFLARE_KV_NAMESPACE_ID is not configured");
    if (!apiToken) throw new Error("CLOUDFLARE_API_TOKEN is not configured");

    return {
      accountId,
      namespaceId,
      apiToken,
      baseUrl: `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${namespaceId}`,
    };
  }

  static async get<T>(key: string): Promise<T | null> {
    const config = this.getConfig();
    const response = await fetch(`${config.baseUrl}/values/${key}`, {
      headers: {
        Authorization: `Bearer ${config.apiToken}`,
      },
    });

    if (!response.ok && response.status !== 404) {
      const errorData = (await response
        .json()
        .catch(() => null)) as CloudflareErrorResponse | null;
      throw new Error(
        `Failed to fetch KV value: ${response.status} ${response.statusText}${
          errorData ? "\n" + JSON.stringify(errorData, null, 2) : ""
        }`
      );
    }

    if (response.status === 404) return null;
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  }

  static async put(key: string, value: unknown): Promise<void> {
    const config = this.getConfig();
    const response = await fetch(`${config.baseUrl}/values/${key}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${config.apiToken}`,
        "Content-Type": "text/plain",
      },
      body: typeof value === "string" ? value : JSON.stringify(value),
    });

    if (!response.ok) {
      const errorData = (await response
        .json()
        .catch(() => null)) as CloudflareErrorResponse | null;
      throw new Error(
        `Failed to store KV value: ${response.status} ${response.statusText}${
          errorData ? "\n" + JSON.stringify(errorData, null, 2) : ""
        }`
      );
    }
  }

  static async delete(key: string): Promise<void> {
    const config = this.getConfig();
    const response = await fetch(`${config.baseUrl}/values/${key}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${config.apiToken}`,
      },
    });

    if (!response.ok) {
      const errorData = (await response
        .json()
        .catch(() => null)) as CloudflareErrorResponse | null;
      throw new Error(
        `Failed to delete KV value: ${response.status} ${response.statusText}${
          errorData ? "\n" + JSON.stringify(errorData, null, 2) : ""
        }`
      );
    }
  }

  static async putMany(
    entries: { key: string; value: unknown }[]
  ): Promise<void> {
    try {
      await Promise.all(entries.map(({ key, value }) => this.put(key, value)));
    } catch (error) {
      throw new Error(
        `Failed to store multiple KV values: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  static async list<T>(options: { prefix: string }): Promise<T[]> {
    const config = this.getConfig();
    const allResults: T[] = [];
    let cursor: string | undefined;

    do {
      const url = new URL(`${config.baseUrl}/keys`);
      url.searchParams.append("prefix", options.prefix);
      if (cursor) {
        url.searchParams.append("cursor", cursor);
      }

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${config.apiToken}`,
        },
      });

      if (!response.ok) {
        const errorData = (await response
          .json()
          .catch(() => null)) as CloudflareErrorResponse | null;
        throw new Error(
          `Failed to list KV keys: ${response.status} ${response.statusText}${
            errorData ? "\n" + JSON.stringify(errorData, null, 2) : ""
          }`
        );
      }

      const data = (await response.json()) as KVListResult<T>;
      if (!data.success) {
        throw new Error(
          `Failed to list KV keys: ${JSON.stringify(data.errors)}`
        );
      }

      allResults.push(...data.result);
      cursor = data.result_info.cursor;
    } while (cursor);

    return allResults;
  }
}
