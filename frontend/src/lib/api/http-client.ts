// http-client.ts — base HTTP client for Hiro API

/** Request configuration */
export interface RequestConfig {
  timeout?: number;
  retries?: number;
  headers?: Record<string, string>;
}
