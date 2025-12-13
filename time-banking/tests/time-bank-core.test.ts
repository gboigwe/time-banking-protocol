import { describe, expect, it, beforeEach } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;
const wallet3 = accounts.get("wallet_3")!;

describe("Time Bank Core - Clarity 4 Tests", () => {

  describe("User Registration with stacks-block-time", () => {
    it("registers user with initial credits", () => {
      const { result } = simnet.callPublicFn(
        "time-bank-core",
        "register-user",
        [],
        wallet1
      );

      expect(result).toBeOk(Cl.bool(true));
    });

    it("stores user with stacks-block-time timestamp", () => {
      simnet.callPublicFn("time-bank-core", "register-user", [], wallet1);

      const { result } = simnet.callReadOnlyFn(
        "time-bank-core",
        "get-user-info",
        [Cl.principal(wallet1)],
        wallet1
      );

      expect(result).not.toBeNone();
    });

    it("fails if already registered", () => {
      simnet.callPublicFn("time-bank-core", "register-user", [], wallet1);

      const { result } = simnet.callPublicFn(
        "time-bank-core",
        "register-user",
        [],
        wallet1
      );

      expect(result).toBeErr(Cl.uint(1006)); // ERR_ALREADY_REGISTERED
    });

    it("initializes user with 10 credits", () => {
      simnet.callPublicFn("time-bank-core", "register-user", [], wallet1);

      const { result } = simnet.callReadOnlyFn(
        "time-bank-core",
        "get-user-balance",
        [Cl.principal(wallet1)],
        wallet1
      );

      expect(result).toBeOk(Cl.uint(10));
    });
  });

  describe("Credit Transfer", () => {
    beforeEach(() => {
      simnet.callPublicFn("time-bank-core", "register-user", [], wallet1);
      simnet.callPublicFn("time-bank-core", "register-user", [], wallet2);
    });

    it("transfers credits between users", () => {
      const { result } = simnet.callPublicFn(
        "time-bank-core",
        "transfer-credits",
        [Cl.principal(wallet2), Cl.uint(5)],
        wallet1
      );

      expect(result).toBeOk(Cl.bool(true));
    });

    it("updates balances correctly", () => {
      simnet.callPublicFn(
        "time-bank-core",
        "transfer-credits",
        [Cl.principal(wallet2), Cl.uint(5)],
        wallet1
      );

      const sender = simnet.callReadOnlyFn(
        "time-bank-core",
        "get-user-balance",
        [Cl.principal(wallet1)],
        wallet1
      );

      const receiver = simnet.callReadOnlyFn(
        "time-bank-core",
        "get-user-balance",
        [Cl.principal(wallet2)],
        wallet1
      );

      expect(sender.result).toBeOk(Cl.uint(5));
      expect(receiver.result).toBeOk(Cl.uint(15));
    });

    it("fails with insufficient balance", () => {
      const { result } = simnet.callPublicFn(
        "time-bank-core",
        "transfer-credits",
        [Cl.principal(wallet2), Cl.uint(100)],
        wallet1
      );

      expect(result).toBeErr(Cl.uint(1010)); // ERR_INSUFFICIENT_CREDITS
    });

    it("prevents self-transfer", () => {
      const { result } = simnet.callPublicFn(
        "time-bank-core",
        "transfer-credits",
        [Cl.principal(wallet1), Cl.uint(5)],
        wallet1
      );

      expect(result).toBeErr(Cl.uint(1011)); // ERR_SELF_TRANSFER
    });
  });

  describe("User Management with stacks-block-time", () => {
    beforeEach(() => {
      simnet.callPublicFn("time-bank-core", "register-user", [], wallet1);
    });

    it("user can deactivate account", () => {
      const { result } = simnet.callPublicFn(
        "time-bank-core",
        "deactivate-user",
        [],
        wallet1
      );

      expect(result).toBeOk(Cl.bool(true));
    });

    it("user can reactivate account", () => {
      simnet.callPublicFn("time-bank-core", "deactivate-user", [], wallet1);

      const { result } = simnet.callPublicFn(
        "time-bank-core",
        "reactivate-user",
        [],
        wallet1
      );

      expect(result).toBeOk(Cl.bool(true));
    });

    it("inactive users cannot transfer credits", () => {
      simnet.callPublicFn("time-bank-core", "register-user", [], wallet2);
      simnet.callPublicFn("time-bank-core", "deactivate-user", [], wallet1);

      const { result } = simnet.callPublicFn(
        "time-bank-core",
        "transfer-credits",
        [Cl.principal(wallet2), Cl.uint(5)],
        wallet1
      );

      expect(result).toBeErr(Cl.uint(1012)); // ERR_USER_INACTIVE
    });
  });

  describe("Admin Functions", () => {
    beforeEach(() => {
      simnet.callPublicFn("time-bank-core", "register-user", [], wallet1);
    });

    it("owner can mint credits", () => {
      const { result } = simnet.callPublicFn(
        "time-bank-core",
        "mint-credits",
        [Cl.principal(wallet1), Cl.uint(50)],
        deployer
      );

      expect(result).toBeOk(Cl.bool(true));
    });

    it("non-owner cannot mint credits", () => {
      const { result } = simnet.callPublicFn(
        "time-bank-core",
        "mint-credits",
        [Cl.principal(wallet1), Cl.uint(50)],
        wallet2
      );

      expect(result).toBeErr(Cl.uint(1001)); // ERR_UNAUTHORIZED
    });

    it("owner can burn credits", () => {
      const { result } = simnet.callPublicFn(
        "time-bank-core",
        "burn-credits",
        [Cl.principal(wallet1), Cl.uint(5)],
        deployer
      );

      expect(result).toBeOk(Cl.bool(true));
    });

    it("owner can toggle protocol pause", () => {
      const { result } = simnet.callPublicFn(
        "time-bank-core",
        "toggle-protocol-pause",
        [],
        deployer
      );

      expect(result).toBeOk(Cl.bool(true));
    });
  });

  describe("Read-Only Functions", () => {
    it("returns none for non-existent user", () => {
      const { result } = simnet.callReadOnlyFn(
        "time-bank-core",
        "get-user-info",
        [Cl.principal(wallet3)],
        wallet1
      );

      expect(result).toBeNone();
    });

    it("returns protocol stats", () => {
      simnet.callPublicFn("time-bank-core", "register-user", [], wallet1);

      const { result } = simnet.callReadOnlyFn(
        "time-bank-core",
        "get-protocol-stats",
        [],
        wallet1
      );

      expect(result).not.toBeErr();
    });

    it("checks if user is active", () => {
      simnet.callPublicFn("time-bank-core", "register-user", [], wallet1);

      const { result } = simnet.callReadOnlyFn(
        "time-bank-core",
        "is-user-active",
        [Cl.principal(wallet1)],
        wallet1
      );

      expect(result).toBeOk(Cl.bool(true));
    });
  });

  describe("Integration Tests", () => {
    it("complete user lifecycle", () => {
      // Register
      const register = simnet.callPublicFn(
        "time-bank-core",
        "register-user",
        [],
        wallet1
      );
      expect(register.result).toBeOk(Cl.bool(true));

      // Transfer
      simnet.callPublicFn("time-bank-core", "register-user", [], wallet2);
      const transfer = simnet.callPublicFn(
        "time-bank-core",
        "transfer-credits",
        [Cl.principal(wallet2), Cl.uint(3)],
        wallet1
      );
      expect(transfer.result).toBeOk(Cl.bool(true));

      // Check balance
      const balance = simnet.callReadOnlyFn(
        "time-bank-core",
        "get-user-balance",
        [Cl.principal(wallet1)],
        wallet1
      );
      expect(balance.result).toBeOk(Cl.uint(7));
    });
  });
});
