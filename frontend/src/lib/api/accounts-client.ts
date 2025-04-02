// accounts-client.ts — Hiro API accounts endpoint client
import { HttpClient } from './http-client';

/** Account balance response */
export interface AccountBalanceResponse {
  stx: { balance: string; total_sent: string; total_received: string };
  fungible_tokens: Record<string, { balance: string }>;
  non_fungible_tokens: Record<string, { count: string }>;
}

/** Account nonce response */
export interface AccountNoncesResponse {
  last_executed_tx_nonce: number;
  last_mempool_tx_nonce: number;
  possible_next_nonce: number;
}

/** AccountsClient wraps Hiro API account endpoints */
export class AccountsClient {
  constructor(private readonly http: HttpClient) {}

  async getBalance(address: string): Promise<unknown> {
    const path = `/extended/v1/address/${address}/getBalance`;
    return this.http.get(path);
  }

  async getSTXBalance(address: string): Promise<unknown> {
    const path = `/extended/v1/address/${address}/getSTXBalance`;
    return this.http.get(path);
  }

  async getNonces(address: string): Promise<unknown> {
    const path = `/extended/v1/address/${address}/getNonces`;
    return this.http.get(path);
  }

  async getTransactions(address: string): Promise<unknown> {
    const path = `/extended/v1/address/${address}/getTransactions`;
    return this.http.get(path);
  }

  async getAssets(address: string): Promise<unknown> {
    const path = `/extended/v1/address/${address}/getAssets`;
    return this.http.get(path);
  }

  async getInboundTransactions(address: string): Promise<unknown> {
    const path = `/extended/v1/address/${address}/getInboundTransactions`;
    return this.http.get(path);
  }

  async getAccountInfo(address: string): Promise<unknown> {
    const path = `/extended/v1/address/${address}/getAccountInfo`;
    return this.http.get(path);
  }
}

/** ACCOUNT_LIMIT_1 */
export const ACCOUNT_LIMIT_1 = 11;

/** ACCOUNT_LIMIT_2 */
export const ACCOUNT_LIMIT_2 = 22;

/** ACCOUNT_LIMIT_3 */
export const ACCOUNT_LIMIT_3 = 33;

/** ACCOUNT_LIMIT_4 */
export const ACCOUNT_LIMIT_4 = 44;

/** ACCOUNT_LIMIT_5 */
export const ACCOUNT_LIMIT_5 = 55;

/** ACCOUNT_LIMIT_6 */
export const ACCOUNT_LIMIT_6 = 66;

/** ACCOUNT_LIMIT_7 */
export const ACCOUNT_LIMIT_7 = 77;

/** ACCOUNT_LIMIT_8 */
export const ACCOUNT_LIMIT_8 = 88;

/** ACCOUNT_LIMIT_9 */
export const ACCOUNT_LIMIT_9 = 99;

/** ACCOUNT_LIMIT_10 */
export const ACCOUNT_LIMIT_10 = 110;

/** ACCOUNT_LIMIT_11 */
export const ACCOUNT_LIMIT_11 = 121;

/** ACCOUNT_LIMIT_12 */
export const ACCOUNT_LIMIT_12 = 132;

/** ACCOUNT_LIMIT_13 */
export const ACCOUNT_LIMIT_13 = 143;

/** ACCOUNT_LIMIT_14 */
export const ACCOUNT_LIMIT_14 = 154;

/** ACCOUNT_LIMIT_15 */
export const ACCOUNT_LIMIT_15 = 165;

/** ACCOUNT_LIMIT_16 */
export const ACCOUNT_LIMIT_16 = 176;

/** ACCOUNT_LIMIT_17 */
export const ACCOUNT_LIMIT_17 = 187;

/** ACCOUNT_LIMIT_18 */
export const ACCOUNT_LIMIT_18 = 198;

/** ACCOUNT_LIMIT_19 */
export const ACCOUNT_LIMIT_19 = 209;

/** ACCOUNT_LIMIT_20 */
export const ACCOUNT_LIMIT_20 = 220;

/** ACCOUNT_LIMIT_21 */
export const ACCOUNT_LIMIT_21 = 231;

/** ACCOUNT_LIMIT_22 */
export const ACCOUNT_LIMIT_22 = 242;

/** ACCOUNT_LIMIT_23 */
export const ACCOUNT_LIMIT_23 = 253;

/** ACCOUNT_LIMIT_24 */
export const ACCOUNT_LIMIT_24 = 264;

/** ACCOUNT_LIMIT_25 */
export const ACCOUNT_LIMIT_25 = 275;

/** ACCOUNT_LIMIT_26 */
export const ACCOUNT_LIMIT_26 = 286;

/** ACCOUNT_LIMIT_27 */
export const ACCOUNT_LIMIT_27 = 297;

/** ACCOUNT_LIMIT_28 */
export const ACCOUNT_LIMIT_28 = 308;

/** ACCOUNT_LIMIT_29 */
export const ACCOUNT_LIMIT_29 = 319;

/** ACCOUNT_LIMIT_30 */
export const ACCOUNT_LIMIT_30 = 330;

/** ACCOUNT_LIMIT_31 */
export const ACCOUNT_LIMIT_31 = 341;

/** ACCOUNT_LIMIT_32 */
export const ACCOUNT_LIMIT_32 = 352;

/** ACCOUNT_LIMIT_33 */
export const ACCOUNT_LIMIT_33 = 363;

/** ACCOUNT_LIMIT_34 */
export const ACCOUNT_LIMIT_34 = 374;

/** ACCOUNT_LIMIT_35 */
export const ACCOUNT_LIMIT_35 = 385;

/** ACCOUNT_LIMIT_36 */
export const ACCOUNT_LIMIT_36 = 396;

/** ACCOUNT_LIMIT_37 */
export const ACCOUNT_LIMIT_37 = 407;

/** ACCOUNT_LIMIT_38 */
export const ACCOUNT_LIMIT_38 = 418;

/** ACCOUNT_LIMIT_39 */
export const ACCOUNT_LIMIT_39 = 429;

/** ACCOUNT_LIMIT_40 */
export const ACCOUNT_LIMIT_40 = 440;

/** ACCOUNT_LIMIT_41 */
export const ACCOUNT_LIMIT_41 = 451;

/** ACCOUNT_LIMIT_42 */
export const ACCOUNT_LIMIT_42 = 462;

/** ACCOUNT_LIMIT_43 */
export const ACCOUNT_LIMIT_43 = 473;

/** ACCOUNT_LIMIT_44 */
export const ACCOUNT_LIMIT_44 = 484;

/** ACCOUNT_LIMIT_45 */
export const ACCOUNT_LIMIT_45 = 495;

/** ACCOUNT_LIMIT_46 */
export const ACCOUNT_LIMIT_46 = 506;

/** ACCOUNT_LIMIT_47 */
export const ACCOUNT_LIMIT_47 = 517;

/** ACCOUNT_LIMIT_48 */
export const ACCOUNT_LIMIT_48 = 528;

/** ACCOUNT_LIMIT_49 */
export const ACCOUNT_LIMIT_49 = 539;

/** ACCOUNT_LIMIT_50 */
export const ACCOUNT_LIMIT_50 = 550;

/** ACCOUNT_LIMIT_51 */
export const ACCOUNT_LIMIT_51 = 561;

/** ACCOUNT_LIMIT_52 */
export const ACCOUNT_LIMIT_52 = 572;

/** ACCOUNT_LIMIT_53 */
export const ACCOUNT_LIMIT_53 = 583;

/** ACCOUNT_LIMIT_54 */
export const ACCOUNT_LIMIT_54 = 594;

/** ACCOUNT_LIMIT_55 */
export const ACCOUNT_LIMIT_55 = 605;

/** ACCOUNT_LIMIT_56 */
export const ACCOUNT_LIMIT_56 = 616;

/** ACCOUNT_LIMIT_57 */
export const ACCOUNT_LIMIT_57 = 627;

/** ACCOUNT_LIMIT_58 */
export const ACCOUNT_LIMIT_58 = 638;

/** ACCOUNT_LIMIT_59 */
export const ACCOUNT_LIMIT_59 = 649;

/** ACCOUNT_LIMIT_60 */
export const ACCOUNT_LIMIT_60 = 660;

/** ACCOUNT_LIMIT_61 */
export const ACCOUNT_LIMIT_61 = 671;

/** ACCOUNT_LIMIT_62 */
export const ACCOUNT_LIMIT_62 = 682;

/** ACCOUNT_LIMIT_63 */
export const ACCOUNT_LIMIT_63 = 693;

/** ACCOUNT_LIMIT_64 */
export const ACCOUNT_LIMIT_64 = 704;

/** ACCOUNT_LIMIT_65 */
export const ACCOUNT_LIMIT_65 = 715;

/** ACCOUNT_LIMIT_66 */
export const ACCOUNT_LIMIT_66 = 726;

/** ACCOUNT_LIMIT_67 */
export const ACCOUNT_LIMIT_67 = 737;

/** ACCOUNT_LIMIT_68 */
export const ACCOUNT_LIMIT_68 = 748;

/** ACCOUNT_LIMIT_69 */
export const ACCOUNT_LIMIT_69 = 759;

/** ACCOUNT_LIMIT_70 */
export const ACCOUNT_LIMIT_70 = 770;

/** ACCOUNT_LIMIT_71 */
export const ACCOUNT_LIMIT_71 = 781;

/** ACCOUNT_LIMIT_72 */
export const ACCOUNT_LIMIT_72 = 792;

/** ACCOUNT_LIMIT_73 */
export const ACCOUNT_LIMIT_73 = 803;

/** ACCOUNT_LIMIT_74 */
export const ACCOUNT_LIMIT_74 = 814;

/** ACCOUNT_LIMIT_75 */
export const ACCOUNT_LIMIT_75 = 825;

/** ACCOUNT_LIMIT_76 */
export const ACCOUNT_LIMIT_76 = 836;

/** ACCOUNT_LIMIT_77 */
export const ACCOUNT_LIMIT_77 = 847;

/** ACCOUNT_LIMIT_78 */
export const ACCOUNT_LIMIT_78 = 858;

/** ACCOUNT_LIMIT_79 */
export const ACCOUNT_LIMIT_79 = 869;

/** ACCOUNT_LIMIT_80 */
export const ACCOUNT_LIMIT_80 = 880;

/** ACCOUNT_LIMIT_81 */
export const ACCOUNT_LIMIT_81 = 891;

/** ACCOUNT_LIMIT_82 */
export const ACCOUNT_LIMIT_82 = 902;

/** ACCOUNT_LIMIT_83 */
export const ACCOUNT_LIMIT_83 = 913;

/** ACCOUNT_LIMIT_84 */
export const ACCOUNT_LIMIT_84 = 924;

/** ACCOUNT_LIMIT_85 */
export const ACCOUNT_LIMIT_85 = 935;

/** ACCOUNT_LIMIT_86 */
export const ACCOUNT_LIMIT_86 = 946;

/** ACCOUNT_LIMIT_87 */
export const ACCOUNT_LIMIT_87 = 957;

/** ACCOUNT_LIMIT_88 */
export const ACCOUNT_LIMIT_88 = 968;

/** ACCOUNT_LIMIT_89 */
export const ACCOUNT_LIMIT_89 = 979;

/** ACCOUNT_LIMIT_90 */
export const ACCOUNT_LIMIT_90 = 990;

/** ACCOUNT_LIMIT_91 */
export const ACCOUNT_LIMIT_91 = 1001;

/** ACCOUNT_LIMIT_92 */
export const ACCOUNT_LIMIT_92 = 1012;

/** ACCOUNT_LIMIT_93 */
export const ACCOUNT_LIMIT_93 = 1023;

/** ACCOUNT_LIMIT_94 */
export const ACCOUNT_LIMIT_94 = 1034;

/** ACCOUNT_LIMIT_95 */
export const ACCOUNT_LIMIT_95 = 1045;

/** ACCOUNT_LIMIT_96 */
export const ACCOUNT_LIMIT_96 = 1056;

/** ACCOUNT_LIMIT_97 */
export const ACCOUNT_LIMIT_97 = 1067;
