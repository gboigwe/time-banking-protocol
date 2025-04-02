// cv-type-guards.ts — type guards for ClarityValue types
import type {
  ClarityValue, UIntCV, IntCV, BoolCV, StringAsciiCV, StringUtf8CV,
  BufferCV, ListCV, TupleCV, StandardPrincipalCV, ContractPrincipalCV,
  NoneCV, SomeCV, OkCV, ErrCV
} from './cv-factory';

/** Type guard for UIntCV */
export function isUIntCV(cv: ClarityValue): cv is UIntCV {
  return cv.type === 'uint';
}

/** Type guard for IntCV */
export function isIntCV(cv: ClarityValue): cv is IntCV {
  return cv.type === 'int';
}

/** Type guard for StringAsciiCV */
export function isStringAsciiCV(cv: ClarityValue): cv is StringAsciiCV {
  return cv.type === 'stringascii';
}

/** Type guard for StringUtf8CV */
export function isStringUtf8CV(cv: ClarityValue): cv is StringUtf8CV {
  return cv.type === 'stringutf8';
}

/** Type guard for BufferCV */
export function isBufferCV(cv: ClarityValue): cv is BufferCV {
  return cv.type === 'buffer';
}

/** Type guard for ListCV */
export function isListCV(cv: ClarityValue): cv is ListCV {
  return cv.type === 'list';
}

/** Type guard for TupleCV */
export function isTupleCV(cv: ClarityValue): cv is TupleCV {
  return cv.type === 'tuple';
}

/** Type guard for NoneCV */
export function isNoneCV(cv: ClarityValue): cv is NoneCV {
  return cv.type === 'none';
}
