import { describe, expect, it, beforeEach } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;
const wallet3 = accounts.get("wallet_3")!;

describe("Escrow Manager - Clarity 4 Tests", () => {

  describe("Escrow Creation with stacks-block-time", () => {
    beforeEach(() => {
      simnet.callPublicFn("time-bank-core", "register-user", [], wallet1);
      simnet.callPublicFn("time-bank-core", "register-user", [], wallet2);
    });

    it("creates escrow with expiration timestamp", () => {
      const duration = 86400; // 1 day

      const { result } = simnet.callPublicFn(
        "escrow-manager",
        "create-escrow",
        [
          Cl.principal(wallet2),
          Cl.uint(10),
          Cl.uint(duration),
          Cl.none()
        ],
        wallet1
      );

      expect(result).toBeOk(Cl.uint(1));
    });

    it("stores escrow with stacks-block-time expiration", () => {
      const duration = 86400;

      simnet.callPublicFn(
        "escrow-manager",
        "create-escrow",
        [Cl.principal(wallet2), Cl.uint(5), Cl.uint(duration), Cl.none()],
        wallet1
      );

      const { result } = simnet.callReadOnlyFn(
        "escrow-manager",
        "get-escrow-details",
        [Cl.uint(1)],
        wallet1
      );

      expect(result).not.toBeNone();
    });

    it("fails with insufficient credits", () => {
      const duration = 86400;

      const { result } = simnet.callPublicFn(
        "escrow-manager",
        "create-escrow",
        [Cl.principal(wallet2), Cl.uint(1000), Cl.uint(duration), Cl.none()],
        wallet1
      );

      expect(result).toBeErr(Cl.uint(3010)); // ERR_INSUFFICIENT_CREDITS
    });

    it("increments escrow ID correctly", () => {
      const duration = 86400;

      const result1 = simnet.callPublicFn(
        "escrow-manager",
        "create-escrow",
        [Cl.principal(wallet2), Cl.uint(3), Cl.uint(duration), Cl.none()],
        wallet1
      );

      const result2 = simnet.callPublicFn(
        "escrow-manager",
        "create-escrow",
        [Cl.principal(wallet2), Cl.uint(2), Cl.uint(duration), Cl.none()],
        wallet1
      );

      expect(result1.result).toBeOk(Cl.uint(1));
      expect(result2.result).toBeOk(Cl.uint(2));
    });
  });

  describe("Escrow Release", () => {
    beforeEach(() => {
      simnet.callPublicFn("time-bank-core", "register-user", [], wallet1);
      simnet.callPublicFn("time-bank-core", "register-user", [], wallet2);

      const duration = 86400;
      simnet.callPublicFn(
        "escrow-manager",
        "create-escrow",
        [Cl.principal(wallet2), Cl.uint(8), Cl.uint(duration), Cl.none()],
        wallet1
      );
    });

    it("depositor can release escrow", () => {
      const { result } = simnet.callPublicFn(
        "escrow-manager",
        "release-escrow",
        [Cl.uint(1)],
        wallet1
      );

      expect(result).toBeOk(Cl.bool(true));
    });

    it("non-depositor cannot release escrow", () => {
      const { result } = simnet.callPublicFn(
        "escrow-manager",
        "release-escrow",
        [Cl.uint(1)],
        wallet3
      );

      expect(result).toBeErr(Cl.uint(3001)); // ERR_UNAUTHORIZED
    });

    it("cannot release already released escrow", () => {
      simnet.callPublicFn("escrow-manager", "release-escrow", [Cl.uint(1)], wallet1);

      const { result } = simnet.callPublicFn(
        "escrow-manager",
        "release-escrow",
        [Cl.uint(1)],
        wallet1
      );

      expect(result).toBeErr(Cl.uint(3011)); // ERR_ALREADY_RELEASED
    });

    it("transfers credits to beneficiary on release", () => {
      const balanceBefore = simnet.callReadOnlyFn(
        "time-bank-core",
        "get-user-balance",
        [Cl.principal(wallet2)],
        wallet2
      );

      simnet.callPublicFn("escrow-manager", "release-escrow", [Cl.uint(1)], wallet1);

      const balanceAfter = simnet.callReadOnlyFn(
        "time-bank-core",
        "get-user-balance",
        [Cl.principal(wallet2)],
        wallet2
      );

      expect(balanceAfter).not.toEqual(balanceBefore);
    });
  });

  describe("Escrow Refund with Time-Lock", () => {
    beforeEach(() => {
      simnet.callPublicFn("time-bank-core", "register-user", [], wallet1);
      simnet.callPublicFn("time-bank-core", "register-user", [], wallet2);

      const duration = 86400;
      simnet.callPublicFn(
        "escrow-manager",
        "create-escrow",
        [Cl.principal(wallet2), Cl.uint(6), Cl.uint(duration), Cl.none()],
        wallet1
      );
    });

    it("depositor can request refund", () => {
      const { result } = simnet.callPublicFn(
        "escrow-manager",
        "refund-escrow",
        [Cl.uint(1)],
        wallet1
      );

      expect(result).toBeOk(Cl.bool(true));
    });

    it("non-depositor cannot request refund", () => {
      const { result } = simnet.callPublicFn(
        "escrow-manager",
        "refund-escrow",
        [Cl.uint(1)],
        wallet2
      );

      expect(result).toBeErr(Cl.uint(3001)); // ERR_UNAUTHORIZED
    });

    it("cannot refund released escrow", () => {
      simnet.callPublicFn("escrow-manager", "release-escrow", [Cl.uint(1)], wallet1);

      const { result } = simnet.callPublicFn(
        "escrow-manager",
        "refund-escrow",
        [Cl.uint(1)],
        wallet1
      );

      expect(result).toBeErr(Cl.uint(3011)); // ERR_ALREADY_RELEASED
    });
  });

  describe("Dispute Resolution", () => {
    beforeEach(() => {
      simnet.callPublicFn("time-bank-core", "register-user", [], wallet1);
      simnet.callPublicFn("time-bank-core", "register-user", [], wallet2);

      const duration = 86400;
      simnet.callPublicFn(
        "escrow-manager",
        "create-escrow",
        [Cl.principal(wallet2), Cl.uint(10), Cl.uint(duration), Cl.none()],
        wallet1
      );
    });

    it("depositor can raise dispute", () => {
      const { result } = simnet.callPublicFn(
        "escrow-manager",
        "raise-dispute",
        [Cl.uint(1), Cl.stringAscii("Service not delivered")],
        wallet1
      );

      expect(result).toBeOk(Cl.bool(true));
    });

    it("beneficiary can raise dispute", () => {
      const { result } = simnet.callPublicFn(
        "escrow-manager",
        "raise-dispute",
        [Cl.uint(1), Cl.stringAscii("Payment issue")],
        wallet2
      );

      expect(result).toBeOk(Cl.bool(true));
    });

    it("unauthorized user cannot raise dispute", () => {
      const { result } = simnet.callPublicFn(
        "escrow-manager",
        "raise-dispute",
        [Cl.uint(1), Cl.stringAscii("Not my escrow")],
        wallet3
      );

      expect(result).toBeErr(Cl.uint(3001)); // ERR_UNAUTHORIZED
    });

    it("mediator can resolve dispute", () => {
      simnet.callPublicFn(
        "escrow-manager",
        "raise-dispute",
        [Cl.uint(1), Cl.stringAscii("Issue")],
        wallet1
      );

      const { result } = simnet.callPublicFn(
        "escrow-manager",
        "resolve-dispute",
        [Cl.uint(1), Cl.bool(true)],
        deployer
      );

      expect(result).toBeOk(Cl.bool(true));
    });

    it("non-mediator cannot resolve dispute", () => {
      simnet.callPublicFn(
        "escrow-manager",
        "raise-dispute",
        [Cl.uint(1), Cl.stringAscii("Issue")],
        wallet1
      );

      const { result } = simnet.callPublicFn(
        "escrow-manager",
        "resolve-dispute",
        [Cl.uint(1), Cl.bool(true)],
        wallet2
      );

      expect(result).toBeErr(Cl.uint(3001)); // ERR_UNAUTHORIZED
    });
  });

  describe("Expiration with stacks-block-time", () => {
    beforeEach(() => {
      simnet.callPublicFn("time-bank-core", "register-user", [], wallet1);
      simnet.callPublicFn("time-bank-core", "register-user", [], wallet2);
    });

    it("creates escrow with future expiration", () => {
      const duration = 172800; // 2 days

      const { result } = simnet.callPublicFn(
        "escrow-manager",
        "create-escrow",
        [Cl.principal(wallet2), Cl.uint(5), Cl.uint(duration), Cl.none()],
        wallet1
      );

      expect(result).toBeOk(Cl.uint(1));
    });

    it("checks if escrow is expired", () => {
      const duration = 86400;

      simnet.callPublicFn(
        "escrow-manager",
        "create-escrow",
        [Cl.principal(wallet2), Cl.uint(4), Cl.uint(duration), Cl.none()],
        wallet1
      );

      const { result } = simnet.callReadOnlyFn(
        "escrow-manager",
        "is-escrow-expired",
        [Cl.uint(1)],
        wallet1
      );

      expect(result).toBeOk(Cl.bool(false));
    });
  });

  describe("Read-Only Functions", () => {
    it("returns none for non-existent escrow", () => {
      const { result } = simnet.callReadOnlyFn(
        "escrow-manager",
        "get-escrow-details",
        [Cl.uint(999)],
        wallet1
      );

      expect(result).toBeNone();
    });

    it("returns escrow statistics", () => {
      const { result } = simnet.callReadOnlyFn(
        "escrow-manager",
        "get-escrow-stats",
        [],
        wallet1
      );

      expect(result).not.toBeErr();
    });

    it("checks escrow status", () => {
      simnet.callPublicFn("time-bank-core", "register-user", [], wallet1);
      simnet.callPublicFn("time-bank-core", "register-user", [], wallet2);

      const duration = 86400;
      simnet.callPublicFn(
        "escrow-manager",
        "create-escrow",
        [Cl.principal(wallet2), Cl.uint(5), Cl.uint(duration), Cl.none()],
        wallet1
      );

      const { result } = simnet.callReadOnlyFn(
        "escrow-manager",
        "is-escrow-active",
        [Cl.uint(1)],
        wallet1
      );

      expect(result).toBeOk(Cl.bool(true));
    });
  });

  describe("Integration Tests", () => {
    it("complete escrow lifecycle with release", () => {
      simnet.callPublicFn("time-bank-core", "register-user", [], wallet1);
      simnet.callPublicFn("time-bank-core", "register-user", [], wallet2);

      const duration = 86400;

      // Create escrow
      const create = simnet.callPublicFn(
        "escrow-manager",
        "create-escrow",
        [Cl.principal(wallet2), Cl.uint(7), Cl.uint(duration), Cl.none()],
        wallet1
      );
      expect(create.result).toBeOk(Cl.uint(1));

      // Check escrow details
      const details = simnet.callReadOnlyFn(
        "escrow-manager",
        "get-escrow-details",
        [Cl.uint(1)],
        wallet1
      );
      expect(details.result).not.toBeNone();

      // Release escrow
      const release = simnet.callPublicFn("escrow-manager", "release-escrow", [Cl.uint(1)], wallet1);
      expect(release.result).toBeOk(Cl.bool(true));
    });

    it("complete escrow lifecycle with dispute", () => {
      simnet.callPublicFn("time-bank-core", "register-user", [], wallet1);
      simnet.callPublicFn("time-bank-core", "register-user", [], wallet2);

      const duration = 86400;

      // Create escrow
      const create = simnet.callPublicFn(
        "escrow-manager",
        "create-escrow",
        [Cl.principal(wallet2), Cl.uint(9), Cl.uint(duration), Cl.none()],
        wallet1
      );
      expect(create.result).toBeOk(Cl.uint(1));

      // Raise dispute
      const dispute = simnet.callPublicFn(
        "escrow-manager",
        "raise-dispute",
        [Cl.uint(1), Cl.stringAscii("Disagreement on quality")],
        wallet1
      );
      expect(dispute.result).toBeOk(Cl.bool(true));

      // Resolve dispute
      const resolve = simnet.callPublicFn(
        "escrow-manager",
        "resolve-dispute",
        [Cl.uint(1), Cl.bool(false)],
        deployer
      );
      expect(resolve.result).toBeOk(Cl.bool(true));
    });
  });
});
