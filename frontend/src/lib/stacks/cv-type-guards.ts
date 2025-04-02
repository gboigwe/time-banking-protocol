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
