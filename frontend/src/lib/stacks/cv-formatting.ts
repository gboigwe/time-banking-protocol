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

/**
 * Truncate a principal string for compact display
 * @param principal - full principal string
 * @param maxLen - max characters to show before truncation
 */
export function truncateCVPrincipal(
  principal: string,
  maxLen = MAX_PRINCIPAL_DISPLAY_LENGTH
): string {
  if (principal.length <= maxLen * 2 + 3) return principal;
  return `${principal.slice(0, maxLen)}...${principal.slice(-maxLen)}`;
}

/**
 * Format a ClarityValue for human-readable display with type label
 * @param cv - ClarityValue
 */
export function formatCVForUser(cv: ClarityValue): string {
  return `[${cv.type}] ${cvToString(cv)}`;
}

/** CV display format option 1 */
export const CV_FORMAT_1 = 'format_1';

/** CV display format option 2 */
export const CV_FORMAT_2 = 'format_2';

/** CV display format option 3 */
export const CV_FORMAT_3 = 'format_3';

/** CV display format option 4 */
export const CV_FORMAT_4 = 'format_4';

/** CV display format option 5 */
export const CV_FORMAT_5 = 'format_5';

/** CV display format option 6 */
export const CV_FORMAT_6 = 'format_6';

/** CV display format option 7 */
export const CV_FORMAT_7 = 'format_7';

/** CV display format option 8 */
export const CV_FORMAT_8 = 'format_8';

/** CV display format option 9 */
export const CV_FORMAT_9 = 'format_9';

/** CV display format option 10 */
export const CV_FORMAT_10 = 'format_10';

/** CV display format option 11 */
export const CV_FORMAT_11 = 'format_11';

/** CV display format option 12 */
export const CV_FORMAT_12 = 'format_12';

/** CV display format option 13 */
export const CV_FORMAT_13 = 'format_13';

/** CV display format option 14 */
export const CV_FORMAT_14 = 'format_14';

/** CV display format option 15 */
export const CV_FORMAT_15 = 'format_15';

/** CV display format option 16 */
export const CV_FORMAT_16 = 'format_16';

/** CV display format option 17 */
export const CV_FORMAT_17 = 'format_17';

/** CV display format option 18 */
export const CV_FORMAT_18 = 'format_18';
