/**
 * Post-Condition Builder for Stacks.js v8+
 * Helper utilities for creating transaction safety conditions
 */

import {
  PostCondition,
  FungibleConditionCode,
  NonFungibleConditionCode,
  makeStandardSTXPostCondition,
  makeContractSTXPostCondition,
  makeStandardFungiblePostCondition,
  makeContractFungiblePostCondition,
  createAssetInfo,
} from '@stacks/transactions';

/**
 * Post-Condition Builder
 * Fluent API for building post-conditions
 */
export class PostConditionBuilder {
  private conditions: PostCondition[] = [];

  /**
   * Add STX post-condition for a standard principal
   */
  addSTXCondition(
    address: string,
    conditionCode: FungibleConditionCode,
    amount: bigint
  ): this {
    const condition = makeStandardSTXPostCondition(
      address,
      conditionCode,
      amount
    );
    this.conditions.push(condition);
    return this;
  }

  /**
   * Add STX post-condition for a contract principal
   */
  addContractSTXCondition(
    contractAddress: string,
    contractName: string,
    conditionCode: FungibleConditionCode,
    amount: bigint
  ): this {
    const condition = makeContractSTXPostCondition(
      contractAddress,
      contractName,
      conditionCode,
      amount
    );
    this.conditions.push(condition);
    return this;
  }

  /**
   * Add fungible token post-condition for a standard principal
   */
  addFungibleTokenCondition(
    address: string,
    conditionCode: FungibleConditionCode,
    amount: bigint,
    assetAddress: string,
    assetContractName: string,
    assetName: string
  ): this {
    const assetInfo = createAssetInfo(
      assetAddress,
      assetContractName,
      assetName
    );
    const condition = makeStandardFungiblePostCondition(
      address,
      conditionCode,
      amount,
      assetInfo
    );
    this.conditions.push(condition);
    return this;
  }

  /**
   * Add fungible token post-condition for a contract principal
   */
  addContractFungibleTokenCondition(
    contractAddress: string,
    contractName: string,
    conditionCode: FungibleConditionCode,
    amount: bigint,
    assetAddress: string,
    assetContractName: string,
    assetName: string
  ): this {
    const assetInfo = createAssetInfo(
      assetAddress,
      assetContractName,
      assetName
    );
    const condition = makeContractFungiblePostCondition(
      contractAddress,
      contractName,
      conditionCode,
      amount,
      assetInfo
    );
    this.conditions.push(condition);
    return this;
  }

  /**
   * Build and return all post-conditions
   */
  build(): PostCondition[] {
    return this.conditions;
  }

  /**
   * Clear all post-conditions
   */
  clear(): this {
    this.conditions = [];
    return this;
  }

  /**
   * Get count of post-conditions
   */
  count(): number {
    return this.conditions.length;
  }
}

/**
 * Helper function to create a post-condition builder
 */
export function createPostConditionBuilder(): PostConditionBuilder {
  return new PostConditionBuilder();
}

/**
 * Quick STX transfer post-condition helper
 */
export function createSTXTransferCondition(
  sender: string,
  amount: bigint
): PostCondition {
  return makeStandardSTXPostCondition(
    sender,
    FungibleConditionCode.Equal,
    amount
  );
}

/**
 * Quick STX minimum transfer post-condition helper
 */
export function createSTXMinTransferCondition(
  sender: string,
  amount: bigint
): PostCondition {
  return makeStandardSTXPostCondition(
    sender,
    FungibleConditionCode.GreaterEqual,
    amount
  );
}

/**
 * Quick STX maximum transfer post-condition helper
 */
export function createSTXMaxTransferCondition(
  sender: string,
  amount: bigint
): PostCondition {
  return makeStandardSTXPostCondition(
    sender,
    FungibleConditionCode.LessEqual,
    amount
  );
}

/**
 * Condition code helpers
 */
export const ConditionCodes = {
  STX_EQUAL: FungibleConditionCode.Equal,
  STX_GREATER: FungibleConditionCode.Greater,
  STX_GREATER_EQUAL: FungibleConditionCode.GreaterEqual,
  STX_LESS: FungibleConditionCode.Less,
  STX_LESS_EQUAL: FungibleConditionCode.LessEqual,
  NFT_OWNS: NonFungibleConditionCode.Owns,
  NFT_DOES_NOT_OWN: NonFungibleConditionCode.DoesNotOwn,
} as const;

/**
 * Example usage patterns
 */
export const PostConditionExamples = {
  /**
   * Ensure sender sends exactly 100 STX
   */
  exactSTXTransfer: (sender: string) =>
    createSTXTransferCondition(sender, 100n * 1000000n),

  /**
   * Ensure sender sends at least 50 STX
   */
  minimumSTXTransfer: (sender: string) =>
    createSTXMinTransferCondition(sender, 50n * 1000000n),

  /**
   * Ensure sender sends no more than 200 STX
   */
  maximumSTXTransfer: (sender: string) =>
    createSTXMaxTransferCondition(sender, 200n * 1000000n),

  /**
   * Multiple conditions example
   */
  multipleConditions: (sender: string, contractAddress: string) => {
    const builder = createPostConditionBuilder();
    return builder
      .addSTXCondition(sender, FungibleConditionCode.GreaterEqual, 10n * 1000000n)
      .addContractSTXCondition(
        contractAddress,
        'time-bank-core',
        FungibleConditionCode.LessEqual,
        1000n * 1000000n
      )
      .build();
  },
};
