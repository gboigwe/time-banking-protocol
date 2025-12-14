// Escrow Manager Contract Integration
// Clarity 4 contract with time-locked escrow

import {
  standardPrincipalCV,
  uintCV,
  stringAsciiCV,
  boolCV,
  noneCV,
  someCV,
  ClarityValue,
  cvToValue,
} from '@stacks/transactions';
import {
  CreditEscrow,
  EscrowStats,
  ContractCallResult,
} from '@/types/contracts';
import {
  getContractAddress,
  CONTRACT_NAMES,
  FUNCTION_NAMES,
} from '../contractConfig';
import { callReadOnlyFunction, makeContractCall } from '../stacksApi';

const contractName = 'escrowManager';

export const createEscrow = async (
  beneficiary: string,
  amount: number,
  duration: number,
  exchangeId?: number
): Promise<ContractCallResult<number>> => {
  try {
    const result = await makeContractCall({
      contractAddress: getContractAddress(contractName),
      contractName: CONTRACT_NAMES[contractName],
      functionName: FUNCTION_NAMES.escrowManager.createEscrow,
      functionArgs: [
        standardPrincipalCV(beneficiary),
        uintCV(amount),
        uintCV(duration),
        exchangeId ? someCV(uintCV(exchangeId)) : noneCV(),
      ],
    });

    return { success: true, txId: result.txId };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const releaseEscrow = async (
  escrowId: number
): Promise<ContractCallResult<void>> => {
  try {
    const result = await makeContractCall({
      contractAddress: getContractAddress(contractName),
      contractName: CONTRACT_NAMES[contractName],
      functionName: FUNCTION_NAMES.escrowManager.releaseEscrow,
      functionArgs: [uintCV(escrowId)],
    });

    return { success: true, txId: result.txId };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const raiseDispute = async (
  escrowId: number,
  reason: string
): Promise<ContractCallResult<void>> => {
  try {
    const result = await makeContractCall({
      contractAddress: getContractAddress(contractName),
      contractName: CONTRACT_NAMES[contractName],
      functionName: FUNCTION_NAMES.escrowManager.raiseDispute,
      functionArgs: [uintCV(escrowId), stringAsciiCV(reason)],
    });

    return { success: true, txId: result.txId };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const getEscrowDetails = async (
  escrowId: number
): Promise<CreditEscrow | null> => {
  try {
    const result = await callReadOnlyFunction({
      contractAddress: getContractAddress(contractName),
      contractName: CONTRACT_NAMES[contractName],
      functionName: FUNCTION_NAMES.escrowManager.getEscrowDetails,
      functionArgs: [uintCV(escrowId)],
    });

    if (!result || result.type === 'none') return null;

    const value = cvToValue(result);
    return {
      escrowId,
      depositor: value.value.depositor.value,
      beneficiary: value.value.beneficiary.value,
      amount: parseInt(value.value.amount.value),
      createdAt: parseInt(value.value['created-at'].value),
      expiresAt: parseInt(value.value['expires-at'].value),
      released: value.value.released.value,
      refunded: value.value.refunded.value,
      releasedAt: value.value['released-at'].value
        ? parseInt(value.value['released-at'].value.value)
        : undefined,
      refundedAt: value.value['refunded-at'].value
        ? parseInt(value.value['refunded-at'].value.value)
        : undefined,
      exchangeId: value.value['exchange-id'].value
        ? parseInt(value.value['exchange-id'].value.value)
        : undefined,
      disputed: value.value.disputed.value,
      disputeReason: value.value['dispute-reason'].value
        ? value.value['dispute-reason'].value.value
        : undefined,
    };
  } catch (error) {
    console.error('Error fetching escrow details:', error);
    return null;
  }
};

export const getEscrowStats = async (): Promise<EscrowStats | null> => {
  try {
    const result = await callReadOnlyFunction({
      contractAddress: getContractAddress(contractName),
      contractName: CONTRACT_NAMES[contractName],
      functionName: FUNCTION_NAMES.escrowManager.getEscrowStats,
      functionArgs: [],
    });

    const value = cvToValue(result);
    return {
      totalEscrows: parseInt(value.value['total-escrows'].value),
      activeEscrows: parseInt(value.value['active-escrows'].value),
      releasedEscrows: parseInt(value.value['released-escrows'].value),
      refundedEscrows: parseInt(value.value['refunded-escrows'].value),
      disputedEscrows: parseInt(value.value['disputed-escrows'].value),
      totalAmountEscrowed: parseInt(value.value['total-amount-escrowed'].value),
    };
  } catch (error) {
    console.error('Error fetching escrow stats:', error);
    return null;
  }
};
