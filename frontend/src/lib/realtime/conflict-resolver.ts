/**
 * Conflict Resolver
 * Handles conflicts between local and remote state
 */

import { StateConflict, ConflictStrategy } from '@/types/realtime';

export class ConflictResolver {
  /**
   * Detect conflicts between local and remote state
   */
  public detectConflicts(
    localState: Record<string, any>,
    remoteState: Record<string, any>,
    timestamp: number
  ): StateConflict[] {
    const conflicts: StateConflict[] = [];

    // Find keys that exist in both states with different values
    const allKeys = new Set([
      ...Object.keys(localState),
      ...Object.keys(remoteState),
    ]);

    allKeys.forEach((key) => {
      const localValue = localState[key];
      const remoteValue = remoteState[key];

      if (
        localValue !== undefined &&
        remoteValue !== undefined &&
        !this.areEqual(localValue, remoteValue)
      ) {
        conflicts.push({
          key,
          localValue,
          remoteValue,
          timestamp,
          source: 'remote',
        });
      }
    });

    return conflicts;
  }

  /**
   * Resolve conflicts using a strategy
   */
  public resolveConflicts(
    conflicts: StateConflict[],
    strategy: ConflictStrategy = 'remote-wins'
  ): Record<string, any> {
    const resolved: Record<string, any> = {};

    conflicts.forEach((conflict) => {
      switch (strategy) {
        case 'remote-wins':
          resolved[conflict.key] = conflict.remoteValue;
          break;

        case 'local-wins':
          resolved[conflict.key] = conflict.localValue;
          break;

        case 'merge':
          resolved[conflict.key] = this.mergeValues(
            conflict.localValue,
            conflict.remoteValue
          );
          break;

        case 'manual':
          // Manual resolution requires user input
          // For now, default to remote wins
          resolved[conflict.key] = conflict.remoteValue;
          break;

        default:
          resolved[conflict.key] = conflict.remoteValue;
      }
    });

    return resolved;
  }

  /**
   * Merge two values intelligently
   */
  private mergeValues(local: any, remote: any): any {
    // If both are objects, merge them
    if (this.isPlainObject(local) && this.isPlainObject(remote)) {
      return { ...local, ...remote };
    }

    // If both are arrays, concatenate unique values
    if (Array.isArray(local) && Array.isArray(remote)) {
      return [...new Set([...local, ...remote])];
    }

    // If both are numbers, take the maximum
    if (typeof local === 'number' && typeof remote === 'number') {
      return Math.max(local, remote);
    }

    // Default to remote value
    return remote;
  }

  /**
   * Check if two values are equal
   */
  private areEqual(a: any, b: any): boolean {
    if (a === b) return true;

    if (typeof a !== typeof b) return false;

    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) return false;
      return a.every((val, idx) => this.areEqual(val, b[idx]));
    }

    if (this.isPlainObject(a) && this.isPlainObject(b)) {
      const keysA = Object.keys(a);
      const keysB = Object.keys(b);
      if (keysA.length !== keysB.length) return false;
      return keysA.every((key) => this.areEqual(a[key], b[key]));
    }

    return false;
  }

  /**
   * Check if value is a plain object
   */
  private isPlainObject(value: any): boolean {
    return (
      value !== null &&
      typeof value === 'object' &&
      value.constructor === Object
    );
  }

  /**
   * Apply resolved conflicts to state
   */
  public applyResolution(
    currentState: Record<string, any>,
    resolvedConflicts: Record<string, any>
  ): Record<string, any> {
    return {
      ...currentState,
      ...resolvedConflicts,
    };
  }

  /**
   * Get conflict summary
   */
  public getConflictSummary(conflicts: StateConflict[]): {
    total: number;
    byKey: Record<string, number>;
    highestTimestamp: number;
  } {
    const byKey: Record<string, number> = {};

    conflicts.forEach((conflict) => {
      byKey[conflict.key] = (byKey[conflict.key] || 0) + 1;
    });

    return {
      total: conflicts.length,
      byKey,
      highestTimestamp: Math.max(...conflicts.map((c) => c.timestamp), 0),
    };
  }
}

// Singleton instance
let conflictResolver: ConflictResolver | null = null;

/**
 * Get or create conflict resolver instance
 */
export function getConflictResolver(): ConflictResolver {
  if (!conflictResolver) {
    conflictResolver = new ConflictResolver();
  }
  return conflictResolver;
}
