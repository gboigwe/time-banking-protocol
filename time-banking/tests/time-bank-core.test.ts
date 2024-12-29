import { describe, expect, it } from "vitest";

const accounts = simnet.getAccounts();
const user1 = accounts.get("wallet_1")!;

describe("time-bank-core tests", () => {
  it("ensures simnet is well initialized", () => {
    expect(simnet.blockHeight).toBeDefined();
  });

  it("allows user registration", () => {
    const { result } = simnet.callPublicFn(
      "time-bank-core",
      "register-user",
      [],
      user1
    );
    
    console.log("Registration result:", result);
    expect(result).toBeDefined();
  });
});
