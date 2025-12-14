// Governance Contract Integration
// Clarity 4 contract with proposal timelock

import {
  standardPrincipalCV,
  uintCV,
  stringAsciiCV,
  boolCV,
  ClarityValue,
  cvToValue,
} from '@stacks/transactions';
import {
  GovernanceProposal,
  GovernanceStats,
  ContractCallResult,
} from '@/types/contracts';
import {
  getContractAddress,
  CONTRACT_NAMES,
  FUNCTION_NAMES,
} from '../contractConfig';
import { callReadOnlyFunction, makeContractCall } from '../stacksApi';

const contractName = 'governance';

export const createProposal = async (
  title: string,
  description: string,
  proposalType: string
): Promise<ContractCallResult<number>> => {
  try {
    const result = await makeContractCall({
      contractAddress: getContractAddress(contractName),
      contractName: CONTRACT_NAMES[contractName],
      functionName: FUNCTION_NAMES.governance.createProposal,
      functionArgs: [
        stringAsciiCV(title),
        stringAsciiCV(description),
        stringAsciiCV(proposalType),
      ],
    });

    return { success: true, txId: result.txId };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const castVote = async (
  proposalId: number,
  vote: boolean
): Promise<ContractCallResult<void>> => {
  try {
    const result = await makeContractCall({
      contractAddress: getContractAddress(contractName),
      contractName: CONTRACT_NAMES[contractName],
      functionName: FUNCTION_NAMES.governance.castVote,
      functionArgs: [uintCV(proposalId), boolCV(vote)],
    });

    return { success: true, txId: result.txId };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const executeProposal = async (
  proposalId: number
): Promise<ContractCallResult<void>> => {
  try {
    const result = await makeContractCall({
      contractAddress: getContractAddress(contractName),
      contractName: CONTRACT_NAMES[contractName],
      functionName: FUNCTION_NAMES.governance.executeProposal,
      functionArgs: [uintCV(proposalId)],
    });

    return { success: true, txId: result.txId };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const getProposal = async (
  proposalId: number
): Promise<GovernanceProposal | null> => {
  try {
    const result = await callReadOnlyFunction({
      contractAddress: getContractAddress(contractName),
      contractName: CONTRACT_NAMES[contractName],
      functionName: FUNCTION_NAMES.governance.getProposal,
      functionArgs: [uintCV(proposalId)],
    });

    if (!result || result.type === 'none') return null;

    const value = cvToValue(result);
    return {
      proposalId,
      proposer: value.value.proposer.value,
      title: value.value.title.value,
      description: value.value.description.value,
      proposalType: value.value['proposal-type'].value,
      createdAt: parseInt(value.value['created-at'].value),
      votingEndsAt: parseInt(value.value['voting-ends-at'].value),
      executionAvailableAt: parseInt(value.value['execution-available-at'].value),
      yesVotes: parseInt(value.value['yes-votes'].value),
      noVotes: parseInt(value.value['no-votes'].value),
      totalVoters: parseInt(value.value['total-voters'].value),
      state: value.value.state.value,
      executedAt: value.value['executed-at'].value
        ? parseInt(value.value['executed-at'].value.value)
        : undefined,
    };
  } catch (error) {
    console.error('Error fetching proposal:', error);
    return null;
  }
};

export const getGovernanceStats = async (): Promise<GovernanceStats | null> => {
  try {
    const result = await callReadOnlyFunction({
      contractAddress: getContractAddress(contractName),
      contractName: CONTRACT_NAMES[contractName],
      functionName: FUNCTION_NAMES.governance.getGovernanceStats,
      functionArgs: [],
    });

    const value = cvToValue(result);
    return {
      totalProposals: parseInt(value.value['total-proposals'].value),
      totalPassedProposals: parseInt(value.value['total-passed-proposals'].value),
      totalActiveVoters: parseInt(value.value['total-active-voters'].value),
      nextProposalId: parseInt(value.value['next-proposal-id'].value),
      governanceEnabled: value.value['governance-enabled'].value,
      votingPeriod: parseInt(value.value['voting-period'].value),
      timelockPeriod: parseInt(value.value['timelock-period'].value),
      quorumPercentage: parseInt(value.value['quorum-percentage'].value),
    };
  } catch (error) {
    console.error('Error fetching governance stats:', error);
    return null;
  }
};
