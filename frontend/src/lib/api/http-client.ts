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

  async get<T>(path: string, config?: RequestConfig): Promise<ResponseConfig<T>> {
    const url = `${this.baseUrl}${path}`;
    const timeout = config?.timeout ?? this.defaultConfig.timeout ?? DEFAULT_TIMEOUT_MS;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: { ...this.defaultConfig.headers, ...config?.headers },
        signal: controller.signal,
      });
      const data = await res.json() as T;
      return { data, status: res.status, headers: Object.fromEntries(res.headers.entries()) };
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async post<T>(path: string, body: unknown, config?: RequestConfig): Promise<ResponseConfig<T>> {
    const url = `${this.baseUrl}${path}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...this.defaultConfig.headers, ...config?.headers },
      body: JSON.stringify(body),
    });
    const data = await res.json() as T;
    return { data, status: res.status, headers: Object.fromEntries(res.headers.entries()) };
  }
}

/** HTTP_STATUS_1 */
export const HTTP_STATUS_1 = 11;

/** HTTP_STATUS_2 */
export const HTTP_STATUS_2 = 22;

/** HTTP_STATUS_3 */
export const HTTP_STATUS_3 = 33;

/** HTTP_STATUS_4 */
export const HTTP_STATUS_4 = 44;

/** HTTP_STATUS_5 */
export const HTTP_STATUS_5 = 55;

/** HTTP_STATUS_6 */
export const HTTP_STATUS_6 = 66;

/** HTTP_STATUS_7 */
export const HTTP_STATUS_7 = 77;

/** HTTP_STATUS_8 */
export const HTTP_STATUS_8 = 88;

/** HTTP_STATUS_9 */
export const HTTP_STATUS_9 = 99;

/** HTTP_STATUS_10 */
export const HTTP_STATUS_10 = 110;

/** HTTP_STATUS_11 */
export const HTTP_STATUS_11 = 121;

/** HTTP_STATUS_12 */
export const HTTP_STATUS_12 = 132;
