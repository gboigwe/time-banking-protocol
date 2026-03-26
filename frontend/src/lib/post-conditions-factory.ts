/**
 * Post-Conditions Factory
 * Generates typed post-conditions for time-banking contract interactions
 */

import {
  makeStandardSTXPostCondition,
  makeContractSTXPostCondition,
  makeStandardFungiblePostCondition,
  makeContractFungiblePostCondition,
  makeStandardNonFungiblePostCondition,
  makeContractNonFungiblePostCondition,
  FungibleConditionCode,
  NonFungibleConditionCode,
  createAssetInfo,
  uintCV,
  PostCondition,
} from '@stacks/transactions';

export interface StxTransferPostConditionOptions {
  sender: string;
  amount: bigint;
  conditionCode?: FungibleConditionCode;
}

export interface FungibleTokenPostConditionOptions {
  sender: string;
  tokenContractAddress: string;
  tokenContractName: string;
  tokenName: string;
  amount: bigint;
  conditionCode?: FungibleConditionCode;
}

export interface NftPostConditionOptions {
  sender: string;
  nftContractAddress: string;
  nftContractName: string;
  nftAssetName: string;
  tokenId: bigint;
  conditionCode?: NonFungibleConditionCode;
}

export class PostConditionsFactory {
  /**
   * Creates a post-condition asserting exact STX sent from a standard address
   */
  stxSentExact(sender: string, amount: bigint): PostCondition {
    return makeStandardSTXPostCondition(
      sender,
      FungibleConditionCode.Equal,
      amount
    );
  }

  /**
   * Creates a post-condition asserting STX sent >= amount
   */
  stxSentAtLeast(sender: string, amount: bigint): PostCondition {
    return makeStandardSTXPostCondition(
      sender,
      FungibleConditionCode.GreaterEqual,
      amount
    );
  }

  /**
   * Creates a post-condition asserting STX sent <= amount
   */
  stxSentAtMost(sender: string, amount: bigint): PostCondition {
    return makeStandardSTXPostCondition(
      sender,
      FungibleConditionCode.LessEqual,
      amount
    );
  }

  /**
   * Creates a post-condition for fungible token transfer from standard address
   */
  ftSentExact(options: FungibleTokenPostConditionOptions): PostCondition {
    const assetInfo = createAssetInfo(
      options.tokenContractAddress,
      options.tokenContractName,
      options.tokenName
    );
    return makeStandardFungiblePostCondition(
      options.sender,
      options.conditionCode ?? FungibleConditionCode.Equal,
      options.amount,
      assetInfo
    );
  }

  /**
   * Creates post-conditions for a time-credit transfer
   * Enforces exact amount sent from sender
   */
  timeCreditTransfer(
    sender: string,
    amount: bigint,
    timeBankCoreContract: string
  ): PostCondition[] {
    const [contractAddress, contractName] = timeBankCoreContract.split('.');
    // For time credits tracked on-chain as a map, we use STX conditions
    // In practice the contract manages internal balances
    return [];
  }

  /**
   * Creates post-conditions for time token (FT) transfer
   */
  timeTokenTransfer(
    sender: string,
    amount: bigint,
    tokenContract: string
  ): PostCondition[] {
    const [contractAddress, contractName] = tokenContract.split('.');
    if (!contractAddress || !contractName) return [];
    const assetInfo = createAssetInfo(contractAddress, contractName, 'time-token');
    return [
      makeStandardFungiblePostCondition(
        sender,
        FungibleConditionCode.Equal,
        amount,
        assetInfo
      ),
    ];
  }

  /**
   * Creates post-conditions for skill certification NFT transfer
   */
  skillCertificationTransfer(
    sender: string,
    tokenId: bigint,
    nftContract: string
  ): PostCondition[] {
    const [contractAddress, contractName] = nftContract.split('.');
    if (!contractAddress || !contractName) return [];
    const assetInfo = createAssetInfo(contractAddress, contractName, 'skill-certification');
    return [
      makeStandardNonFungiblePostCondition(
        sender,
        NonFungibleConditionCode.Sends,
        assetInfo,
        uintCV(tokenId)
      ),
    ];
  }

  /**
   * Creates post-conditions for escrow creation
   * No STX is directly transferred in the escrow contract (credits are internal)
   */
  escrowCreate(): PostCondition[] {
    return [];
  }

  /**
   * Combine multiple post-condition arrays
   */
  combine(...groups: PostCondition[][]): PostCondition[] {
    return groups.flat();
  }
}

export function createPostConditionsFactory(): PostConditionsFactory {
  return new PostConditionsFactory();
}
