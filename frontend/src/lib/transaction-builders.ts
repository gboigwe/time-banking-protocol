/**
 * Transaction Builders
 * High-level builders for time-banking contract transactions
 */

import {
  makeContractCall,
  AnchorMode,
  PostConditionMode,
  uintCV,
  stringAsciiCV,
  principalCV,
  someCV,
  noneCV,
  boolCV,
  ClarityValue,
  broadcastTransaction,
  StacksTransaction,
} from '@stacks/transactions';
import type { StacksNetworkClient } from './stacks-network-client';
import type { FeeEstimator } from './fee-estimator';

export interface ContractCallParams {
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgs: ClarityValue[];
  senderKey: string;
  fee?: bigint;
  nonce?: number;
  postConditionMode?: PostConditionMode;
  postConditions?: any[];
}

export interface TxBroadcastResult {
  txId: string;
  success: boolean;
  error?: string;
}

export class TimeBankingTxBuilders {
  constructor(
    private networkClient: StacksNetworkClient,
    private feeEstimator: FeeEstimator
  ) {}

  async buildRegisterUser(
    senderKey: string,
    contractId: string
  ): Promise<StacksTransaction> {
    const [contractAddress, contractName] = contractId.split('.');
    const fee = await this.feeEstimator.estimateContractCallFee(contractAddress, contractName, 'register-user');
    return this.buildContractCall({
      contractAddress,
      contractName,
      functionName: 'register-user',
      functionArgs: [],
      senderKey,
      fee: fee.recommended,
    });
  }

  async buildTransferCredits(
    senderKey: string,
    contractId: string,
    to: string,
    amount: number
  ): Promise<StacksTransaction> {
    const [contractAddress, contractName] = contractId.split('.');
    const fee = await this.feeEstimator.estimateContractCallFee(contractAddress, contractName, 'transfer-credits');
    return this.buildContractCall({
      contractAddress,
      contractName,
      functionName: 'transfer-credits',
      functionArgs: [principalCV(to), uintCV(BigInt(amount))],
      senderKey,
      fee: fee.recommended,
    });
  }

  async buildCreateEscrow(
    senderKey: string,
    contractId: string,
    beneficiary: string,
    amount: number,
    duration: number,
    exchangeId?: number
  ): Promise<StacksTransaction> {
    const [contractAddress, contractName] = contractId.split('.');
    const fee = await this.feeEstimator.estimateContractCallFee(contractAddress, contractName, 'create-escrow');
    return this.buildContractCall({
      contractAddress,
      contractName,
      functionName: 'create-escrow',
      functionArgs: [
        principalCV(beneficiary),
        uintCV(BigInt(amount)),
        uintCV(BigInt(duration)),
        exchangeId !== undefined ? someCV(uintCV(BigInt(exchangeId))) : noneCV(),
      ],
      senderKey,
      fee: fee.recommended,
    });
  }

  async buildCreateSchedule(
    senderKey: string,
    contractId: string,
    recipient: string,
    amount: number,
    interval: number,
    scheduleType: number
  ): Promise<StacksTransaction> {
    const [contractAddress, contractName] = contractId.split('.');
    const fee = await this.feeEstimator.estimateContractCallFee(contractAddress, contractName, 'create-schedule');
    return this.buildContractCall({
      contractAddress,
      contractName,
      functionName: 'create-schedule',
      functionArgs: [
        principalCV(recipient),
        uintCV(BigInt(amount)),
        uintCV(BigInt(interval)),
        uintCV(BigInt(scheduleType)),
      ],
      senderKey,
      fee: fee.recommended,
    });
  }

  async buildStakeTokens(
    senderKey: string,
    contractId: string,
    amount: bigint
  ): Promise<StacksTransaction> {
    const [contractAddress, contractName] = contractId.split('.');
    const fee = await this.feeEstimator.estimateContractCallFee(contractAddress, contractName, 'stake');
    return this.buildContractCall({
      contractAddress,
      contractName,
      functionName: 'stake',
      functionArgs: [uintCV(amount)],
      senderKey,
      fee: fee.recommended,
    });
  }

  async buildCastVote(
    senderKey: string,
    contractId: string,
    proposalId: number,
    vote: boolean
  ): Promise<StacksTransaction> {
    const [contractAddress, contractName] = contractId.split('.');
    const fee = await this.feeEstimator.estimateContractCallFee(contractAddress, contractName, 'cast-vote');
    return this.buildContractCall({
      contractAddress,
      contractName,
      functionName: 'cast-vote',
      functionArgs: [uintCV(BigInt(proposalId)), boolCV(vote)],
      senderKey,
      fee: fee.recommended,
    });
  }

  async broadcast(transaction: StacksTransaction): Promise<TxBroadcastResult> {
    try {
      const network = this.networkClient.getStacksNetwork();
      const result = await broadcastTransaction(transaction, network);
      if ('error' in result) {
        return { txId: '', success: false, error: String(result.error) };
      }
      return { txId: result.txid, success: true };
    } catch (e) {
      return {
        txId: '',
        success: false,
        error: e instanceof Error ? e.message : 'Broadcast failed',
      };
    }
  }

  private async buildContractCall(params: ContractCallParams): Promise<StacksTransaction> {
    return makeContractCall({
      contractAddress: params.contractAddress,
      contractName: params.contractName,
      functionName: params.functionName,
      functionArgs: params.functionArgs,
      senderKey: params.senderKey,
      network: this.networkClient.getStacksNetwork(),
      anchorMode: AnchorMode.Any,
      fee: params.fee,
      nonce: params.nonce !== undefined ? BigInt(params.nonce) : undefined,
      postConditionMode: params.postConditionMode ?? PostConditionMode.Deny,
      postConditions: params.postConditions ?? [],
    });
  }
}

export function createTxBuilders(
  networkClient: StacksNetworkClient,
  feeEstimator: FeeEstimator
): TimeBankingTxBuilders {
  return new TimeBankingTxBuilders(networkClient, feeEstimator);
}
