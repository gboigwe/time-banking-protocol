// Skill Registry Contract Integration
// Clarity 4 contract with contract-hash? verification

import {
  standardPrincipalCV,
  uintCV,
  stringAsciiCV,
  contractPrincipalCV,
  noneCV,
  ClarityValue,
  cvToValue,
  PostCondition,
} from '@stacks/transactions';
import {
  RegisteredSkill,
  SkillVerification,
  SkillTemplate,
  SkillBadge,
  RegistryStats,
  ContractCallResult,
  SkillCategory,
} from '@/types/contracts';
import {
  getContractIdentifier,
  getContractAddress,
  CONTRACT_NAMES,
  FUNCTION_NAMES,
  getErrorMessage,
} from '../contractConfig';
import { callReadOnlyFunction, makeContractCall } from '../stacksApi';

const contractName = 'skillRegistry';

// ============================================
// WRITE FUNCTIONS (State-changing operations)
// ============================================

/**
 * Register a new skill on-chain
 * @param skillName - Name of the skill
 * @param category - Skill category (technical, creative, etc.)
 * @param description - Skill description
 * @param hourlyRate - Hourly rate in time credits
 */
export const registerSkill = async (
  skillName: string,
  category: SkillCategory,
  description: string,
  hourlyRate: number
): Promise<ContractCallResult<number>> => {
  try {
    const functionArgs: ClarityValue[] = [
      stringAsciiCV(skillName),
      stringAsciiCV(category),
      stringAsciiCV(description),
      uintCV(hourlyRate),
    ];

    const result = await makeContractCall({
      contractAddress: getContractAddress(contractName),
      contractName: CONTRACT_NAMES[contractName],
      functionName: FUNCTION_NAMES.skillRegistry.registerSkill,
      functionArgs,
      postConditions: [],
    });

    return {
      success: true,
      data: result.txId ? parseInt(result.txId, 16) : undefined,
      txId: result.txId,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to register skill',
    };
  }
};

/**
 * Verify another user's skill (Clarity 4 feature)
 * @param userAddress - Address of the skill owner
 * @param skillId - ID of the skill to verify
 * @param endorsement - Endorsement message
 * @param treasuryContract - Optional treasury contract for verification
 */
export const verifySkill = async (
  userAddress: string,
  skillId: number,
  endorsement: string,
  treasuryContract?: string
): Promise<ContractCallResult<void>> => {
  try {
    const functionArgs: ClarityValue[] = [
      standardPrincipalCV(userAddress),
      uintCV(skillId),
      stringAsciiCV(endorsement),
      treasuryContract
        ? contractPrincipalCV(
            treasuryContract.split('.')[0],
            treasuryContract.split('.')[1]
          )
        : contractPrincipalCV(
            getContractAddress(contractName),
            CONTRACT_NAMES[contractName]
          ),
    ];

    const result = await makeContractCall({
      contractAddress: getContractAddress(contractName),
      contractName: CONTRACT_NAMES[contractName],
      functionName: FUNCTION_NAMES.skillRegistry.verifySkill,
      functionArgs,
      postConditions: [],
    });

    return {
      success: true,
      txId: result.txId,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to verify skill',
    };
  }
};

/**
 * Approve a skill template using contract-hash? (Clarity 4)
 * Only owner can call this function
 * @param templateName - Name of the template
 * @param templateContract - Contract principal to verify
 */
export const approveSkillTemplate = async (
  templateName: string,
  templateContract: string
): Promise<ContractCallResult<string>> => {
  try {
    const [contractAddress, contractName] = templateContract.split('.');

    const functionArgs: ClarityValue[] = [
      stringAsciiCV(templateName),
      contractPrincipalCV(contractAddress, contractName),
    ];

    const result = await makeContractCall({
      contractAddress: getContractAddress('skillRegistry'),
      contractName: CONTRACT_NAMES.skillRegistry,
      functionName: FUNCTION_NAMES.skillRegistry.approveSkillTemplate,
      functionArgs,
      postConditions: [],
    });

    return {
      success: true,
      data: result.txId,
      txId: result.txId,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to approve skill template',
    };
  }
};

/**
 * Award a badge to a user
 * Only owner can call this function
 * @param recipient - Address of the badge recipient
 * @param badgeName - Name of the badge
 * @param tier - Badge tier (bronze, silver, gold, platinum)
 */
export const awardBadge = async (
  recipient: string,
  badgeName: string,
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
): Promise<ContractCallResult<number>> => {
  try {
    const functionArgs: ClarityValue[] = [
      standardPrincipalCV(recipient),
      stringAsciiCV(badgeName),
      stringAsciiCV(tier),
    ];

    const result = await makeContractCall({
      contractAddress: getContractAddress(contractName),
      contractName: CONTRACT_NAMES[contractName],
      functionName: FUNCTION_NAMES.skillRegistry.awardBadge,
      functionArgs,
      postConditions: [],
    });

    return {
      success: true,
      data: result.txId ? parseInt(result.txId, 16) : undefined,
      txId: result.txId,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to award badge',
    };
  }
};

// ============================================
// READ-ONLY FUNCTIONS
// ============================================

/**
 * Get skill information
 * @param userAddress - Address of the skill owner
 * @param skillId - ID of the skill
 */
export const getSkillInfo = async (
  userAddress: string,
  skillId: number
): Promise<RegisteredSkill | null> => {
  try {
    const result = await callReadOnlyFunction({
      contractAddress: getContractAddress(contractName),
      contractName: CONTRACT_NAMES[contractName],
      functionName: FUNCTION_NAMES.skillRegistry.getSkillInfo,
      functionArgs: [standardPrincipalCV(userAddress), uintCV(skillId)],
    });

    if (!result || result.type === 'none') {
      return null;
    }

    const value = cvToValue(result);

    return {
      skillId,
      owner: userAddress,
      skillName: value.value['skill-name'].value,
      category: value.value.category.value as SkillCategory,
      description: value.value.description.value,
      hourlyRate: parseInt(value.value['hourly-rate'].value),
      verified: value.value.verified.value,
      verificationCount: parseInt(value.value['verification-count'].value),
      registeredAt: parseInt(value.value['registered-at'].value),
      lastVerifiedAt: value.value['last-verified-at'].value
        ? parseInt(value.value['last-verified-at'].value.value)
        : undefined,
    };
  } catch (error) {
    console.error('Error fetching skill info:', error);
    return null;
  }
};

/**
 * Get user's total skill count
 * @param userAddress - Address of the user
 */
export const getUserSkillCount = async (userAddress: string): Promise<number> => {
  try {
    const result = await callReadOnlyFunction({
      contractAddress: getContractAddress(contractName),
      contractName: CONTRACT_NAMES[contractName],
      functionName: FUNCTION_NAMES.skillRegistry.getUserSkillCount,
      functionArgs: [standardPrincipalCV(userAddress)],
    });

    const value = cvToValue(result);
    return parseInt(value.value);
  } catch (error) {
    console.error('Error fetching user skill count:', error);
    return 0;
  }
};

/**
 * Check if a skill is verified
 * @param userAddress - Address of the skill owner
 * @param skillId - ID of the skill
 */
export const isSkillVerified = async (
  userAddress: string,
  skillId: number
): Promise<boolean> => {
  try {
    const result = await callReadOnlyFunction({
      contractAddress: getContractAddress(contractName),
      contractName: CONTRACT_NAMES[contractName],
      functionName: FUNCTION_NAMES.skillRegistry.isSkillVerified,
      functionArgs: [standardPrincipalCV(userAddress), uintCV(skillId)],
    });

    const value = cvToValue(result);
    return value.value;
  } catch (error) {
    console.error('Error checking if skill is verified:', error);
    return false;
  }
};

/**
 * Get verification count for a skill
 * @param userAddress - Address of the skill owner
 * @param skillId - ID of the skill
 */
export const getVerificationCount = async (
  userAddress: string,
  skillId: number
): Promise<number> => {
  try {
    const result = await callReadOnlyFunction({
      contractAddress: getContractAddress(contractName),
      contractName: CONTRACT_NAMES[contractName],
      functionName: FUNCTION_NAMES.skillRegistry.getVerificationCount,
      functionArgs: [standardPrincipalCV(userAddress), uintCV(skillId)],
    });

    const value = cvToValue(result);
    return parseInt(value.value);
  } catch (error) {
    console.error('Error fetching verification count:', error);
    return 0;
  }
};

/**
 * Get skill registry statistics
 */
export const getRegistryStats = async (): Promise<RegistryStats | null> => {
  try {
    const result = await callReadOnlyFunction({
      contractAddress: getContractAddress(contractName),
      contractName: CONTRACT_NAMES[contractName],
      functionName: FUNCTION_NAMES.skillRegistry.getRegistryStats,
      functionArgs: [],
    });

    const value = cvToValue(result);

    return {
      totalSkills: parseInt(value.value['total-skills'].value),
      totalVerifications: parseInt(value.value['total-verifications'].value),
      totalBadges: parseInt(value.value['total-badges'].value),
      nextSkillId: parseInt(value.value['next-skill-id'].value),
      nextBadgeId: parseInt(value.value['next-badge-id'].value),
    };
  } catch (error) {
    console.error('Error fetching registry stats:', error);
    return null;
  }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Validate skill category
 */
export const isValidCategory = (category: string): category is SkillCategory => {
  return ['technical', 'creative', 'educational', 'practical', 'professional'].includes(
    category
  );
};

/**
 * Format skill category for display
 */
export const formatCategory = (category: SkillCategory): string => {
  return category.charAt(0).toUpperCase() + category.slice(1);
};

/**
 * Get all user skills
 * @param userAddress - Address of the user
 */
export const getAllUserSkills = async (
  userAddress: string
): Promise<RegisteredSkill[]> => {
  try {
    const skillCount = await getUserSkillCount(userAddress);
    const skills: RegisteredSkill[] = [];

    for (let i = 1; i <= skillCount; i++) {
      const skill = await getSkillInfo(userAddress, i);
      if (skill) {
        skills.push(skill);
      }
    }

    return skills;
  } catch (error) {
    console.error('Error fetching all user skills:', error);
    return [];
  }
};
