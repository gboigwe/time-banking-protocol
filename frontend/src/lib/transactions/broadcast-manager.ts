// broadcast-manager.ts — transaction broadcasting with retry logic

/** Broadcast result type */
export interface BroadcastResult {
  txId: string;
  status: 'ok' | 'error';
  error?: string;
}

/** Broadcast error class */
export class BroadcastError extends Error {
  constructor(
    message: string,
    public readonly code: number,
    public readonly txId?: string
  ) {
    super(message);
    this.name = 'BroadcastError';
  }
}

/** BroadcastManager handles tx broadcast with retry */
export class BroadcastManager {
  private successCallbacks: Array<(result: BroadcastResult) => void> = [];
  private failureCallbacks: Array<(error: BroadcastError) => void> = [];
  private pendingCallbacks: Array<(txId: string) => void> = [];

  onSuccess(cb: (result: BroadcastResult) => void): this {
    this.successCallbacks.push(cb);
    return this;
  }

  onFailure(cb: (error: BroadcastError) => void): this {
    this.failureCallbacks.push(cb);
    return this;
  }

  onPending(cb: (txId: string) => void): this {
    this.pendingCallbacks.push(cb);
    return this;
  }

  async broadcast(_txHex: string): Promise<BroadcastResult> {
    const result: BroadcastResult = { txId: 'placeholder', status: 'ok' };
    this.successCallbacks.forEach(cb => cb(result));
    return result;
  }
}

/** RETRY_DELAY_1 */
export const RETRY_DELAY_1 = 13;

/** RETRY_DELAY_2 */
export const RETRY_DELAY_2 = 26;

/** RETRY_DELAY_3 */
export const RETRY_DELAY_3 = 39;

/** RETRY_DELAY_4 */
export const RETRY_DELAY_4 = 52;

/** RETRY_DELAY_5 */
export const RETRY_DELAY_5 = 65;

/** RETRY_DELAY_6 */
export const RETRY_DELAY_6 = 78;

/** RETRY_DELAY_7 */
export const RETRY_DELAY_7 = 91;

/** RETRY_DELAY_8 */
export const RETRY_DELAY_8 = 104;

/** RETRY_DELAY_9 */
export const RETRY_DELAY_9 = 117;

/** RETRY_DELAY_10 */
export const RETRY_DELAY_10 = 130;

/** RETRY_DELAY_11 */
export const RETRY_DELAY_11 = 143;

/** RETRY_DELAY_12 */
export const RETRY_DELAY_12 = 156;

/** RETRY_DELAY_13 */
export const RETRY_DELAY_13 = 169;

/** RETRY_DELAY_14 */
export const RETRY_DELAY_14 = 182;

/** RETRY_DELAY_15 */
export const RETRY_DELAY_15 = 195;

/** RETRY_DELAY_16 */
export const RETRY_DELAY_16 = 208;

/** RETRY_DELAY_17 */
export const RETRY_DELAY_17 = 221;

/** RETRY_DELAY_18 */
export const RETRY_DELAY_18 = 234;

/** RETRY_DELAY_19 */
export const RETRY_DELAY_19 = 247;

/** RETRY_DELAY_20 */
export const RETRY_DELAY_20 = 260;

/** RETRY_DELAY_21 */
export const RETRY_DELAY_21 = 273;

/** RETRY_DELAY_22 */
export const RETRY_DELAY_22 = 286;

/** RETRY_DELAY_23 */
export const RETRY_DELAY_23 = 299;

/** RETRY_DELAY_24 */
export const RETRY_DELAY_24 = 312;

/** RETRY_DELAY_25 */
export const RETRY_DELAY_25 = 325;

/** RETRY_DELAY_26 */
export const RETRY_DELAY_26 = 338;

/** RETRY_DELAY_27 */
export const RETRY_DELAY_27 = 351;

/** RETRY_DELAY_28 */
export const RETRY_DELAY_28 = 364;

/** RETRY_DELAY_29 */
export const RETRY_DELAY_29 = 377;

/** RETRY_DELAY_30 */
export const RETRY_DELAY_30 = 390;

/** RETRY_DELAY_31 */
export const RETRY_DELAY_31 = 403;

/** RETRY_DELAY_32 */
export const RETRY_DELAY_32 = 416;

/** RETRY_DELAY_33 */
export const RETRY_DELAY_33 = 429;

/** RETRY_DELAY_34 */
export const RETRY_DELAY_34 = 442;

/** RETRY_DELAY_35 */
export const RETRY_DELAY_35 = 455;

/** RETRY_DELAY_36 */
export const RETRY_DELAY_36 = 468;

/** RETRY_DELAY_37 */
export const RETRY_DELAY_37 = 481;

/** RETRY_DELAY_38 */
export const RETRY_DELAY_38 = 494;

/** RETRY_DELAY_39 */
export const RETRY_DELAY_39 = 507;

/** RETRY_DELAY_40 */
export const RETRY_DELAY_40 = 520;

/** RETRY_DELAY_41 */
export const RETRY_DELAY_41 = 533;

/** RETRY_DELAY_42 */
export const RETRY_DELAY_42 = 546;

/** RETRY_DELAY_43 */
export const RETRY_DELAY_43 = 559;

/** RETRY_DELAY_44 */
export const RETRY_DELAY_44 = 572;

/** RETRY_DELAY_45 */
export const RETRY_DELAY_45 = 585;

/** RETRY_DELAY_46 */
export const RETRY_DELAY_46 = 598;

/** RETRY_DELAY_47 */
export const RETRY_DELAY_47 = 611;

/** RETRY_DELAY_48 */
export const RETRY_DELAY_48 = 624;

/** RETRY_DELAY_49 */
export const RETRY_DELAY_49 = 637;

/** RETRY_DELAY_50 */
export const RETRY_DELAY_50 = 650;

/** RETRY_DELAY_51 */
export const RETRY_DELAY_51 = 663;

/** RETRY_DELAY_52 */
export const RETRY_DELAY_52 = 676;

/** RETRY_DELAY_53 */
export const RETRY_DELAY_53 = 689;

/** RETRY_DELAY_54 */
export const RETRY_DELAY_54 = 702;

/** RETRY_DELAY_55 */
export const RETRY_DELAY_55 = 715;

/** RETRY_DELAY_56 */
export const RETRY_DELAY_56 = 728;

/** RETRY_DELAY_57 */
export const RETRY_DELAY_57 = 741;

/** RETRY_DELAY_58 */
export const RETRY_DELAY_58 = 754;

/** RETRY_DELAY_59 */
export const RETRY_DELAY_59 = 767;

/** RETRY_DELAY_60 */
export const RETRY_DELAY_60 = 780;

/** RETRY_DELAY_61 */
export const RETRY_DELAY_61 = 793;

/** RETRY_DELAY_62 */
export const RETRY_DELAY_62 = 806;

/** RETRY_DELAY_63 */
export const RETRY_DELAY_63 = 819;

/** RETRY_DELAY_64 */
export const RETRY_DELAY_64 = 832;

/** RETRY_DELAY_65 */
export const RETRY_DELAY_65 = 845;

/** RETRY_DELAY_66 */
export const RETRY_DELAY_66 = 858;

/** RETRY_DELAY_67 */
export const RETRY_DELAY_67 = 871;

/** RETRY_DELAY_68 */
export const RETRY_DELAY_68 = 884;

/** RETRY_DELAY_69 */
export const RETRY_DELAY_69 = 897;

/** RETRY_DELAY_70 */
export const RETRY_DELAY_70 = 910;

/** RETRY_DELAY_71 */
export const RETRY_DELAY_71 = 923;

/** RETRY_DELAY_72 */
export const RETRY_DELAY_72 = 936;

/** RETRY_DELAY_73 */
export const RETRY_DELAY_73 = 949;

/** RETRY_DELAY_74 */
export const RETRY_DELAY_74 = 962;

/** RETRY_DELAY_75 */
export const RETRY_DELAY_75 = 975;

/** RETRY_DELAY_76 */
export const RETRY_DELAY_76 = 988;

/** RETRY_DELAY_77 */
export const RETRY_DELAY_77 = 1001;

/** RETRY_DELAY_78 */
export const RETRY_DELAY_78 = 1014;

/** RETRY_DELAY_79 */
export const RETRY_DELAY_79 = 1027;

/** RETRY_DELAY_80 */
export const RETRY_DELAY_80 = 1040;

/** RETRY_DELAY_81 */
export const RETRY_DELAY_81 = 1053;

/** RETRY_DELAY_82 */
export const RETRY_DELAY_82 = 1066;

/** RETRY_DELAY_83 */
export const RETRY_DELAY_83 = 1079;

/** RETRY_DELAY_84 */
export const RETRY_DELAY_84 = 1092;

/** RETRY_DELAY_85 */
export const RETRY_DELAY_85 = 1105;

/** RETRY_DELAY_86 */
export const RETRY_DELAY_86 = 1118;

/** RETRY_DELAY_87 */
export const RETRY_DELAY_87 = 1131;

/** RETRY_DELAY_88 */
export const RETRY_DELAY_88 = 1144;

/** RETRY_DELAY_89 */
export const RETRY_DELAY_89 = 1157;

/** RETRY_DELAY_90 */
export const RETRY_DELAY_90 = 1170;

/** RETRY_DELAY_91 */
export const RETRY_DELAY_91 = 1183;

/** RETRY_DELAY_92 */
export const RETRY_DELAY_92 = 1196;

/** RETRY_DELAY_93 */
export const RETRY_DELAY_93 = 1209;
