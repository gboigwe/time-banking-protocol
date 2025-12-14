// React Hook for Skill Registry Contract
// Clarity 4 with contract-hash? verification

import { useState } from 'react';
import {
  registerSkill,
  verifySkill,
  getSkillDetails,
  getSkillStats,
  approveSkillTemplate,
  getSkillTemplate,
} from '@/lib/contracts/skillRegistry';
import {
  UserSkill,
  SkillStats,
  SkillTemplate,
  SkillCategory,
} from '@/types/contracts';

export const useSkillRegistry = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegisterSkill = async (
    skillName: string,
    category: SkillCategory,
    description: string,
    hourlyRate: number
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await registerSkill(
        skillName,
        category,
        description,
        hourlyRate
      );

      if (result.success) {
        return { success: true, txId: result.txId, data: result.data };
      } else {
        setError(result.error || 'Failed to register skill');
        return { success: false, error: result.error };
      }
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to register skill';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifySkill = async (
    userAddress: string,
    skillId: number,
    endorsement: string
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await verifySkill(userAddress, skillId, endorsement);

      if (result.success) {
        return { success: true, txId: result.txId };
      } else {
        setError(result.error || 'Failed to verify skill');
        return { success: false, error: result.error };
      }
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to verify skill';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const loadSkillDetails = async (
    userAddress: string,
    skillId: number
  ): Promise<UserSkill | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const skill = await getSkillDetails(userAddress, skillId);
      return skill;
    } catch (err: any) {
      setError(err.message || 'Failed to load skill details');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const loadSkillStats = async (): Promise<SkillStats | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const stats = await getSkillStats();
      return stats;
    } catch (err: any) {
      setError(err.message || 'Failed to load skill stats');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveTemplate = async (
    templateName: string,
    templateContract: string
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await approveSkillTemplate(templateName, templateContract);

      if (result.success) {
        return { success: true, txId: result.txId, data: result.data };
      } else {
        setError(result.error || 'Failed to approve template');
        return { success: false, error: result.error };
      }
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to approve template';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const loadSkillTemplate = async (
    templateName: string
  ): Promise<SkillTemplate | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const template = await getSkillTemplate(templateName);
      return template;
    } catch (err: any) {
      setError(err.message || 'Failed to load skill template');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    registerSkill: handleRegisterSkill,
    verifySkill: handleVerifySkill,
    loadSkillDetails,
    loadSkillStats,
    approveTemplate: handleApproveTemplate,
    loadSkillTemplate,
  };
};
