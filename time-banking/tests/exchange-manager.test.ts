import { describe, expect, it, beforeEach } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;
const wallet3 = accounts.get("wallet_3")!;

describe("Exchange Manager - Clarity 4 Tests", () => {

  describe("Exchange Creation with stacks-block-time", () => {
    beforeEach(() => {
      simnet.callPublicFn("time-bank-core", "register-user", [], wallet1);
      simnet.callPublicFn("time-bank-core", "register-user", [], wallet2);
    });

    it("creates exchange with time range validation", () => {
      const startTime = 1700000000;
      const endTime = 1700003600; // 1 hour later

      const { result } = simnet.callPublicFn(
        "exchange-manager",
        "create-exchange",
        [
          Cl.principal(wallet2),
          Cl.stringAscii("Web Development"),
          Cl.uint(5),
          Cl.uint(startTime),
          Cl.uint(endTime)
        ],
        wallet1
      );

      expect(result).toBeOk(Cl.uint(1));
    });

    it("stores exchange with stacks-block-time timestamp", () => {
      const startTime = 1700000000;
      const endTime = 1700003600;

      simnet.callPublicFn(
        "exchange-manager",
        "create-exchange",
        [
          Cl.principal(wallet2),
          Cl.stringAscii("Design"),
          Cl.uint(3),
          Cl.uint(startTime),
          Cl.uint(endTime)
        ],
        wallet1
      );

      const { result } = simnet.callReadOnlyFn(
        "exchange-manager",
        "get-exchange-details",
        [Cl.uint(1)],
        wallet1
      );

      expect(result).not.toBeNone();
    });

    it("fails with invalid time range", () => {
      const startTime = 1700000000;
      const endTime = 1699999999; // End before start

      const { result } = simnet.callPublicFn(
        "exchange-manager",
        "create-exchange",
        [
          Cl.principal(wallet2),
          Cl.stringAscii("Testing"),
          Cl.uint(2),
          Cl.uint(startTime),
          Cl.uint(endTime)
        ],
        wallet1
      );

      expect(result).toBeErr(Cl.uint(4004)); // ERR_INVALID_PARAMS
    });

    it("increments exchange ID correctly", () => {
      const startTime = 1700000000;
      const endTime = 1700003600;

      const result1 = simnet.callPublicFn(
        "exchange-manager",
        "create-exchange",
        [Cl.principal(wallet2), Cl.stringAscii("Skill 1"), Cl.uint(2), Cl.uint(startTime), Cl.uint(endTime)],
        wallet1
      );

      const result2 = simnet.callPublicFn(
        "exchange-manager",
        "create-exchange",
        [Cl.principal(wallet2), Cl.stringAscii("Skill 2"), Cl.uint(3), Cl.uint(startTime), Cl.uint(endTime)],
        wallet1
      );

      expect(result1.result).toBeOk(Cl.uint(1));
      expect(result2.result).toBeOk(Cl.uint(2));
    });
  });

  describe("Exchange Acceptance", () => {
    beforeEach(() => {
      simnet.callPublicFn("time-bank-core", "register-user", [], wallet1);
      simnet.callPublicFn("time-bank-core", "register-user", [], wallet2);

      const startTime = 1700000000;
      const endTime = 1700003600;

      simnet.callPublicFn(
        "exchange-manager",
        "create-exchange",
        [Cl.principal(wallet2), Cl.stringAscii("Coding"), Cl.uint(4), Cl.uint(startTime), Cl.uint(endTime)],
        wallet1
      );
    });

    it("provider can accept exchange", () => {
      const { result } = simnet.callPublicFn(
        "exchange-manager",
        "accept-exchange",
        [Cl.uint(1)],
        wallet2
      );

      expect(result).toBeOk(Cl.bool(true));
    });

    it("non-provider cannot accept exchange", () => {
      const { result } = simnet.callPublicFn(
        "exchange-manager",
        "accept-exchange",
        [Cl.uint(1)],
        wallet3
      );

      expect(result).toBeErr(Cl.uint(4001)); // ERR_UNAUTHORIZED
    });

    it("cannot accept already accepted exchange", () => {
      simnet.callPublicFn("exchange-manager", "accept-exchange", [Cl.uint(1)], wallet2);

      const { result } = simnet.callPublicFn(
        "exchange-manager",
        "accept-exchange",
        [Cl.uint(1)],
        wallet2
      );

      expect(result).toBeErr(Cl.uint(4008)); // ERR_ALREADY_ACCEPTED
    });
  });

  describe("Exchange Completion with Dual Confirmation", () => {
    beforeEach(() => {
      simnet.callPublicFn("time-bank-core", "register-user", [], wallet1);
      simnet.callPublicFn("time-bank-core", "register-user", [], wallet2);

      const startTime = 1700000000;
      const endTime = 1700003600;

      simnet.callPublicFn(
        "exchange-manager",
        "create-exchange",
        [Cl.principal(wallet2), Cl.stringAscii("Teaching"), Cl.uint(3), Cl.uint(startTime), Cl.uint(endTime)],
        wallet1
      );

      simnet.callPublicFn("exchange-manager", "accept-exchange", [Cl.uint(1)], wallet2);
    });

    it("requester can confirm completion", () => {
      const { result } = simnet.callPublicFn(
        "exchange-manager",
        "confirm-completion",
        [Cl.uint(1)],
        wallet1
      );

      expect(result).toBeOk(Cl.bool(true));
    });

    it("provider can confirm completion", () => {
      const { result } = simnet.callPublicFn(
        "exchange-manager",
        "confirm-completion",
        [Cl.uint(1)],
        wallet2
      );

      expect(result).toBeOk(Cl.bool(true));
    });

    it("exchange completes with dual confirmation", () => {
      simnet.callPublicFn("exchange-manager", "confirm-completion", [Cl.uint(1)], wallet1);
      simnet.callPublicFn("exchange-manager", "confirm-completion", [Cl.uint(1)], wallet2);

      const { result } = simnet.callReadOnlyFn(
        "exchange-manager",
        "is-exchange-completed",
        [Cl.uint(1)],
        wallet1
      );

      expect(result).toBeOk(Cl.bool(true));
    });

    it("unauthorized user cannot confirm", () => {
      const { result } = simnet.callPublicFn(
        "exchange-manager",
        "confirm-completion",
        [Cl.uint(1)],
        wallet3
      );

      expect(result).toBeErr(Cl.uint(4001)); // ERR_UNAUTHORIZED
    });
  });

  describe("Exchange Cancellation", () => {
    beforeEach(() => {
      simnet.callPublicFn("time-bank-core", "register-user", [], wallet1);
      simnet.callPublicFn("time-bank-core", "register-user", [], wallet2);

      const startTime = 1700000000;
      const endTime = 1700003600;

      simnet.callPublicFn(
        "exchange-manager",
        "create-exchange",
        [Cl.principal(wallet2), Cl.stringAscii("Consulting"), Cl.uint(2), Cl.uint(startTime), Cl.uint(endTime)],
        wallet1
      );
    });

    it("requester can cancel exchange", () => {
      const { result } = simnet.callPublicFn(
        "exchange-manager",
        "cancel-exchange",
        [Cl.uint(1)],
        wallet1
      );

      expect(result).toBeOk(Cl.bool(true));
    });

    it("provider cannot cancel exchange", () => {
      const { result } = simnet.callPublicFn(
        "exchange-manager",
        "cancel-exchange",
        [Cl.uint(1)],
        wallet2
      );

      expect(result).toBeErr(Cl.uint(4001)); // ERR_UNAUTHORIZED
    });

    it("cannot cancel completed exchange", () => {
      simnet.callPublicFn("exchange-manager", "accept-exchange", [Cl.uint(1)], wallet2);
      simnet.callPublicFn("exchange-manager", "confirm-completion", [Cl.uint(1)], wallet1);
      simnet.callPublicFn("exchange-manager", "confirm-completion", [Cl.uint(1)], wallet2);

      const { result } = simnet.callPublicFn(
        "exchange-manager",
        "cancel-exchange",
        [Cl.uint(1)],
        wallet1
      );

      expect(result).toBeErr(Cl.uint(4009)); // ERR_ALREADY_COMPLETED
    });
  });

  describe("Review System", () => {
    beforeEach(() => {
      simnet.callPublicFn("time-bank-core", "register-user", [], wallet1);
      simnet.callPublicFn("time-bank-core", "register-user", [], wallet2);

      const startTime = 1700000000;
      const endTime = 1700003600;

      simnet.callPublicFn(
        "exchange-manager",
        "create-exchange",
        [Cl.principal(wallet2), Cl.stringAscii("Mentoring"), Cl.uint(5), Cl.uint(startTime), Cl.uint(endTime)],
        wallet1
      );

      simnet.callPublicFn("exchange-manager", "accept-exchange", [Cl.uint(1)], wallet2);
      simnet.callPublicFn("exchange-manager", "confirm-completion", [Cl.uint(1)], wallet1);
      simnet.callPublicFn("exchange-manager", "confirm-completion", [Cl.uint(1)], wallet2);
    });

    it("requester can submit review", () => {
      const { result } = simnet.callPublicFn(
        "exchange-manager",
        "submit-review",
        [Cl.uint(1), Cl.uint(5), Cl.stringAscii("Excellent service")],
        wallet1
      );

      expect(result).toBeOk(Cl.bool(true));
    });

    it("provider can submit review", () => {
      const { result } = simnet.callPublicFn(
        "exchange-manager",
        "submit-review",
        [Cl.uint(1), Cl.uint(4), Cl.stringAscii("Great communication")],
        wallet2
      );

      expect(result).toBeOk(Cl.bool(true));
    });

    it("fails with invalid rating", () => {
      const { result } = simnet.callPublicFn(
        "exchange-manager",
        "submit-review",
        [Cl.uint(1), Cl.uint(6), Cl.stringAscii("Invalid")],
        wallet1
      );

      expect(result).toBeErr(Cl.uint(4004)); // ERR_INVALID_PARAMS
    });

    it("cannot review incomplete exchange", () => {
      const startTime = 1700000000;
      const endTime = 1700003600;

      simnet.callPublicFn(
        "exchange-manager",
        "create-exchange",
        [Cl.principal(wallet2), Cl.stringAscii("New Task"), Cl.uint(2), Cl.uint(startTime), Cl.uint(endTime)],
        wallet1
      );

      const { result } = simnet.callPublicFn(
        "exchange-manager",
        "submit-review",
        [Cl.uint(2), Cl.uint(5), Cl.stringAscii("Too early")],
        wallet1
      );

      expect(result).toBeErr(Cl.uint(4010)); // ERR_NOT_COMPLETED
    });
  });

  describe("Read-Only Functions", () => {
    it("returns none for non-existent exchange", () => {
      const { result } = simnet.callReadOnlyFn(
        "exchange-manager",
        "get-exchange-details",
        [Cl.uint(999)],
        wallet1
      );

      expect(result).toBeNone();
    });

    it("returns exchange statistics", () => {
      const { result } = simnet.callReadOnlyFn(
        "exchange-manager",
        "get-exchange-stats",
        [],
        wallet1
      );

      expect(result).not.toBeErr();
    });

    it("checks if exchange is active", () => {
      simnet.callPublicFn("time-bank-core", "register-user", [], wallet1);
      simnet.callPublicFn("time-bank-core", "register-user", [], wallet2);

      const startTime = 1700000000;
      const endTime = 1700003600;

      simnet.callPublicFn(
        "exchange-manager",
        "create-exchange",
        [Cl.principal(wallet2), Cl.stringAscii("Active"), Cl.uint(2), Cl.uint(startTime), Cl.uint(endTime)],
        wallet1
      );

      const { result } = simnet.callReadOnlyFn(
        "exchange-manager",
        "is-exchange-active",
        [Cl.uint(1)],
        wallet1
      );

      expect(result).toBeOk(Cl.bool(true));
    });
  });

  describe("Integration Tests", () => {
    it("complete exchange lifecycle", () => {
      simnet.callPublicFn("time-bank-core", "register-user", [], wallet1);
      simnet.callPublicFn("time-bank-core", "register-user", [], wallet2);

      const startTime = 1700000000;
      const endTime = 1700003600;

      // Create exchange
      const create = simnet.callPublicFn(
        "exchange-manager",
        "create-exchange",
        [Cl.principal(wallet2), Cl.stringAscii("Full Cycle"), Cl.uint(4), Cl.uint(startTime), Cl.uint(endTime)],
        wallet1
      );
      expect(create.result).toBeOk(Cl.uint(1));

      // Accept exchange
      const accept = simnet.callPublicFn("exchange-manager", "accept-exchange", [Cl.uint(1)], wallet2);
      expect(accept.result).toBeOk(Cl.bool(true));

      // Dual confirmation
      const confirm1 = simnet.callPublicFn("exchange-manager", "confirm-completion", [Cl.uint(1)], wallet1);
      expect(confirm1.result).toBeOk(Cl.bool(true));

      const confirm2 = simnet.callPublicFn("exchange-manager", "confirm-completion", [Cl.uint(1)], wallet2);
      expect(confirm2.result).toBeOk(Cl.bool(true));

      // Submit reviews
      const review1 = simnet.callPublicFn(
        "exchange-manager",
        "submit-review",
        [Cl.uint(1), Cl.uint(5), Cl.stringAscii("Perfect")],
        wallet1
      );
      expect(review1.result).toBeOk(Cl.bool(true));

      const review2 = simnet.callPublicFn(
        "exchange-manager",
        "submit-review",
        [Cl.uint(1), Cl.uint(5), Cl.stringAscii("Excellent")],
        wallet2
      );
      expect(review2.result).toBeOk(Cl.bool(true));
    });
  });
});
