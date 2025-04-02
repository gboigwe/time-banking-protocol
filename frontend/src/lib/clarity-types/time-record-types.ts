// time-record-types.ts — Clarity v4 type representations for time exchange records

// HoursUnit branded type
export type HoursUnit = number & { readonly __brand: 'HoursUnit' };
