// http-client.ts — base HTTP client for Hiro API

/** Request configuration */
export interface RequestConfig {
  timeout?: number;
  retries?: number;
  headers?: Record<string, string>;
}

/** Response configuration */
export interface ResponseConfig<T> {
  data: T;
  status: number;
  headers: Record<string, string>;
}

/** Default timeout in milliseconds */
export const DEFAULT_TIMEOUT_MS = 30000;

/** Default retry count */
export const DEFAULT_RETRIES = 3;

/** HttpClient class for API requests */
export class HttpClient {
  constructor(
    private readonly baseUrl: string,
    private readonly defaultConfig: RequestConfig = {}
  ) {}
