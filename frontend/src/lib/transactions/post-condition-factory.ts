// post-condition-factory.ts — builders for Stacks post-conditions

/** Fungible condition code */
export enum FungibleConditionCode {
  Equal = 0x01,
  Greater = 0x02,
  GreaterEqual = 0x03,
  Less = 0x04,
  LessEqual = 0x05,
}

/** Non-fungible condition code */
export enum NonFungibleConditionCode {
  Sends = 0x10,
  DoesNotSend = 0x11,
}
