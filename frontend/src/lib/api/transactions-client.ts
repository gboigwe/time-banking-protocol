// transactions-client.ts — Hiro API transactions endpoint client
import { HttpClient } from './http-client';

/** TransactionsClient wraps Hiro API transaction endpoints */
export class TransactionsClient {
  constructor(private readonly http: HttpClient) {}

  async getTransaction(...args: unknown[]): Promise<unknown> {
    return this.http.get(`/tx/getTransaction`, { headers: {} });
  }

  async broadcastTransaction(...args: unknown[]): Promise<unknown> {
    return this.http.get(`/tx/broadcastTransaction`, { headers: {} });
  }

  async getTransactionList(...args: unknown[]): Promise<unknown> {
    return this.http.get(`/tx/getTransactionList`, { headers: {} });
  }

  async getMempoolTxs(...args: unknown[]): Promise<unknown> {
    return this.http.get(`/tx/getMempoolTxs`, { headers: {} });
  }

  async getDroppedTxs(...args: unknown[]): Promise<unknown> {
    return this.http.get(`/tx/getDroppedTxs`, { headers: {} });
  }

  async estimateFees(...args: unknown[]): Promise<unknown> {
    return this.http.get(`/tx/estimateFees`, { headers: {} });
  }

  async getTxEvents(...args: unknown[]): Promise<unknown> {
    return this.http.get(`/tx/getTxEvents`, { headers: {} });
  }
}

/** TX_LIMIT_1 */
export const TX_LIMIT_1 = 11;

/** TX_LIMIT_2 */
export const TX_LIMIT_2 = 22;

/** TX_LIMIT_3 */
export const TX_LIMIT_3 = 33;

/** TX_LIMIT_4 */
export const TX_LIMIT_4 = 44;

/** TX_LIMIT_5 */
export const TX_LIMIT_5 = 55;

/** TX_LIMIT_6 */
export const TX_LIMIT_6 = 66;

/** TX_LIMIT_7 */
export const TX_LIMIT_7 = 77;

/** TX_LIMIT_8 */
export const TX_LIMIT_8 = 88;

/** TX_LIMIT_9 */
export const TX_LIMIT_9 = 99;

/** TX_LIMIT_10 */
export const TX_LIMIT_10 = 110;

/** TX_LIMIT_11 */
export const TX_LIMIT_11 = 121;

/** TX_LIMIT_12 */
export const TX_LIMIT_12 = 132;

/** TX_LIMIT_13 */
export const TX_LIMIT_13 = 143;

/** TX_LIMIT_14 */
export const TX_LIMIT_14 = 154;

/** TX_LIMIT_15 */
export const TX_LIMIT_15 = 165;

/** TX_LIMIT_16 */
export const TX_LIMIT_16 = 176;

/** TX_LIMIT_17 */
export const TX_LIMIT_17 = 187;

/** TX_LIMIT_18 */
export const TX_LIMIT_18 = 198;

/** TX_LIMIT_19 */
export const TX_LIMIT_19 = 209;

/** TX_LIMIT_20 */
export const TX_LIMIT_20 = 220;

/** TX_LIMIT_21 */
export const TX_LIMIT_21 = 231;

/** TX_LIMIT_22 */
export const TX_LIMIT_22 = 242;

/** TX_LIMIT_23 */
export const TX_LIMIT_23 = 253;

/** TX_LIMIT_24 */
export const TX_LIMIT_24 = 264;

/** TX_LIMIT_25 */
export const TX_LIMIT_25 = 275;

/** TX_LIMIT_26 */
export const TX_LIMIT_26 = 286;

/** TX_LIMIT_27 */
export const TX_LIMIT_27 = 297;

/** TX_LIMIT_28 */
export const TX_LIMIT_28 = 308;

/** TX_LIMIT_29 */
export const TX_LIMIT_29 = 319;

/** TX_LIMIT_30 */
export const TX_LIMIT_30 = 330;

/** TX_LIMIT_31 */
export const TX_LIMIT_31 = 341;

/** TX_LIMIT_32 */
export const TX_LIMIT_32 = 352;

/** TX_LIMIT_33 */
export const TX_LIMIT_33 = 363;

/** TX_LIMIT_34 */
export const TX_LIMIT_34 = 374;

/** TX_LIMIT_35 */
export const TX_LIMIT_35 = 385;

/** TX_LIMIT_36 */
export const TX_LIMIT_36 = 396;

/** TX_LIMIT_37 */
export const TX_LIMIT_37 = 407;

/** TX_LIMIT_38 */
export const TX_LIMIT_38 = 418;
