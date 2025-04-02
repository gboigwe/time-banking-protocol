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
