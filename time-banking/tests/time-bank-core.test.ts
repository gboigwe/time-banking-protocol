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
        expect(result).toEqual({
            type: 7,  // represents 'ok'
            value: { type: 3 }  // represents 'true'
        });
    });

    it("prevents double registration", () => {
        // First registration
        simnet.callPublicFn(
            "time-bank-core",
            "register-user",
            [],
            user1
        );
        
        // Second registration attempt
        const { result } = simnet.callPublicFn(
            "time-bank-core",
            "register-user",
            [],
            user1
        );
        
        console.log("Double registration result:", result);
        expect(result).toHaveProperty('type', 8); // type 8 represents 'err'
    });
});
