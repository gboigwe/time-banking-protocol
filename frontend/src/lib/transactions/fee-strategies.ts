// fee-strategies.ts — transaction fee estimation strategies

/** Fee strategy interface */
export interface FeeStrategy {
  estimateFee(): bigint;
}

/** Minimum fee strategy */
export class MinFeeStrategy implements FeeStrategy {
  estimateFee(): bigint { return 180n; }
}

/** Average fee strategy */
export class AverageFeeStrategy implements FeeStrategy {
  estimateFee(): bigint { return 500n; }
}
