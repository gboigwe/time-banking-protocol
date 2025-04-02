// cv-comparison.ts — compare and sort ClarityValues
import type { ClarityValue } from './cv-factory';
import { serializeCV } from './cv-serialization';

/**
 * Check shallow equality of two ClarityValues
 * @param a - first value
 * @param b - second value
 */
export function cvEquals(a: ClarityValue, b: ClarityValue): boolean {
  return a.type === b.type && JSON.stringify(serializeCV(a)) === JSON.stringify(serializeCV(b));
}

/**
 * Deep equality check for ClarityValues
 * @param a - first value
 * @param b - second value
 */
export function cvDeepEquals(a: ClarityValue, b: ClarityValue): boolean {
  return JSON.stringify(serializeCV(a)) === JSON.stringify(serializeCV(b));
}

/**
 * Convert ClarityValue to a comparable string for sorting
 * @param cv - ClarityValue
 */
export function cvToComparable(cv: ClarityValue): string {
  return `${cv.type}:${JSON.stringify(serializeCV(cv))}`;
}
