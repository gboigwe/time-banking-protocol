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

/** TX_LIMIT_39 */
export const TX_LIMIT_39 = 429;

/** TX_LIMIT_40 */
export const TX_LIMIT_40 = 440;

/** TX_LIMIT_41 */
export const TX_LIMIT_41 = 451;

/** TX_LIMIT_42 */
export const TX_LIMIT_42 = 462;

/** TX_LIMIT_43 */
export const TX_LIMIT_43 = 473;

/** TX_LIMIT_44 */
export const TX_LIMIT_44 = 484;

/** TX_LIMIT_45 */
export const TX_LIMIT_45 = 495;

/** TX_LIMIT_46 */
export const TX_LIMIT_46 = 506;

/** TX_LIMIT_47 */
export const TX_LIMIT_47 = 517;

/** TX_LIMIT_48 */
export const TX_LIMIT_48 = 528;

/** TX_LIMIT_49 */
export const TX_LIMIT_49 = 539;

/** TX_LIMIT_50 */
export const TX_LIMIT_50 = 550;

/** TX_LIMIT_51 */
export const TX_LIMIT_51 = 561;

/** TX_LIMIT_52 */
export const TX_LIMIT_52 = 572;

/** TX_LIMIT_53 */
export const TX_LIMIT_53 = 583;

/** TX_LIMIT_54 */
export const TX_LIMIT_54 = 594;

/** TX_LIMIT_55 */
export const TX_LIMIT_55 = 605;

/** TX_LIMIT_56 */
export const TX_LIMIT_56 = 616;

/** TX_LIMIT_57 */
export const TX_LIMIT_57 = 627;

/** TX_LIMIT_58 */
export const TX_LIMIT_58 = 638;

/** TX_LIMIT_59 */
export const TX_LIMIT_59 = 649;

/** TX_LIMIT_60 */
export const TX_LIMIT_60 = 660;

/** TX_LIMIT_61 */
export const TX_LIMIT_61 = 671;

/** TX_LIMIT_62 */
export const TX_LIMIT_62 = 682;

/** TX_LIMIT_63 */
export const TX_LIMIT_63 = 693;

/** TX_LIMIT_64 */
export const TX_LIMIT_64 = 704;

/** TX_LIMIT_65 */
export const TX_LIMIT_65 = 715;

/** TX_LIMIT_66 */
export const TX_LIMIT_66 = 726;

/** TX_LIMIT_67 */
export const TX_LIMIT_67 = 737;

/** TX_LIMIT_68 */
export const TX_LIMIT_68 = 748;

/** TX_LIMIT_69 */
export const TX_LIMIT_69 = 759;

/** TX_LIMIT_70 */
export const TX_LIMIT_70 = 770;

/** TX_LIMIT_71 */
export const TX_LIMIT_71 = 781;

/** TX_LIMIT_72 */
export const TX_LIMIT_72 = 792;

/** TX_LIMIT_73 */
export const TX_LIMIT_73 = 803;

/** TX_LIMIT_74 */
export const TX_LIMIT_74 = 814;

/** TX_LIMIT_75 */
export const TX_LIMIT_75 = 825;

/** TX_LIMIT_76 */
export const TX_LIMIT_76 = 836;

/** TX_LIMIT_77 */
export const TX_LIMIT_77 = 847;

/** TX_LIMIT_78 */
export const TX_LIMIT_78 = 858;

/** TX_LIMIT_79 */
export const TX_LIMIT_79 = 869;
