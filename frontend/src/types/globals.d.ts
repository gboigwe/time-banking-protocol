// Global type declarations

declare global {
  interface Window {
    StacksProvider?: any;
  }

  interface BigInt {
    toJSON(): string;
  }
}

export {};
