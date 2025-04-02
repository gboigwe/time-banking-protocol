// useSkillRegistry_new.ts — useSkillRegistry React hook for time-banking UI
import { useState, useCallback, useEffect } from 'react';

/** State interface for useSkillRegistry */
export interface useSkillRegistryState {
  skills: unknown;
  isLoading: unknown;
  error: unknown;
  searchSkills: unknown;
  getSkillById: unknown;
