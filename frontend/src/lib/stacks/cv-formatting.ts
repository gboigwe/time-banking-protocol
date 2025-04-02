// cv-formatting.ts — format ClarityValues for display
import type { ClarityValue } from './cv-factory';

/** Maximum length for truncated principal display */
export const MAX_PRINCIPAL_DISPLAY_LENGTH = 12;

/**
 * Convert a ClarityValue to a concise string representation
 * @param cv - ClarityValue to convert
 */
export function cvToString(cv: ClarityValue): string {
  const cvAny = cv as Record<string, unknown>;
  switch (cv.type) {
    case 'uint':
    case 'int':
      return String(cvAny['value']);
    case 'true': return 'true';
    case 'false': return 'false';
    case 'string-ascii':
    case 'string-utf8':
      return `"${cvAny['value']}"`;
    case 'buffer':
      return `0x${Buffer.from(cvAny['value'] as Uint8Array).toString('hex')}`;
    case 'none': return 'none';
    case 'some': return `(some ${cvToString(cvAny['value'] as ClarityValue)})`;
    case 'ok': return `(ok ${cvToString(cvAny['value'] as ClarityValue)})`;
    case 'err': return `(err ${cvToString(cvAny['value'] as ClarityValue)})`;
    case 'address': return String(cvAny['value']);
    case 'contract_address': return `${cvAny['address']}.${cvAny['contractName']}`;
    case 'list': return `[${(cvAny['list'] as ClarityValue[]).map(cvToString).join(', ')}]`;
    case 'tuple': {
      const entries = Object.entries(cvAny['data'] as Record<string, ClarityValue>)
        .map(([k, v]) => `${k}: ${cvToString(v)}`).join(', ');
      return `{${entries}}`;
    }
    default: return JSON.stringify(cv);
  }
}

/**
 * Format ClarityValue for user-facing display (simplified)
 * @param cv - ClarityValue to format
 */
export function cvToDisplayString(cv: ClarityValue): string {
  return cvToString(cv);
}
