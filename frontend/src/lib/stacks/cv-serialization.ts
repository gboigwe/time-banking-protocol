// cv-serialization.ts — serialize and deserialize ClarityValues
import type { ClarityValue } from './cv-factory';

/**
 * Serialize a ClarityValue to a JSON-safe object
 * @param cv - ClarityValue to serialize
 * @returns JSON-compatible representation
 */
export function serializeCV(cv: ClarityValue): Record<string, unknown> {
  const result: Record<string, unknown> = { type: cv.type };
  const cvAny = cv as Record<string, unknown>;
  if ('value' in cvAny) {
    const val = cvAny['value'];
    result['value'] = typeof val === 'bigint' ? val.toString() : val;
  }
  if ('data' in cvAny) result['data'] = cvAny['data'];
  if ('list' in cvAny) result['list'] = cvAny['list'];
  if ('address' in cvAny) result['address'] = cvAny['address'];
  if ('contractName' in cvAny) result['contractName'] = cvAny['contractName'];
  return result;
}

/**
 * Convert a ClarityValue to hex representation
 * @param cv - ClarityValue to convert
 * @returns hex string
 */
export function cvToHex(cv: ClarityValue): string {
  const json = JSON.stringify(serializeCV(cv));
  return Buffer.from(json).toString('hex');
}

/**
 * Convert a hex string back to ClarityValue
 * @param hex - hex string
 * @returns ClarityValue
 */
export function hexToCV(hex: string): ClarityValue {
  const json = Buffer.from(hex, 'hex').toString('utf8');
  return JSON.parse(json) as ClarityValue;
}

/**
 * Convert ClarityValue to JSON string
 * @param cv - ClarityValue
 * @returns JSON string
 */
export function cvToJSON(cv: ClarityValue): string {
  return JSON.stringify(serializeCV(cv));
}

/**
 * Parse JSON string to ClarityValue
 * @param json - JSON string
 * @returns ClarityValue
 */
export function jsonToCV(json: string): ClarityValue {
  return JSON.parse(json) as ClarityValue;
}
