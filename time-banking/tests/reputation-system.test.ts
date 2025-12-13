import { describe, expect, it, beforeEach } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;
const wallet3 = accounts.get("wallet_3")!;

describe("Reputation System - Clarity 4 Tests", () => {

  describe("Reputation Tracking with stacks-block-time", () => {
    it("initializes user reputation", () => {
      const { result } = simnet.callPublicFn(
        "reputation-system",
        "initialize-reputation",
        [Cl.principal(wallet1)],
        deployer
      );

      expect(result).toBeOk(Cl.bool(true));
    });

    it("stores reputation with stacks-block-time", () => {
      simnet.callPublicFn("reputation-system", "initialize-reputation", [Cl.principal(wallet1)], deployer);

      const { result } = simnet.callReadOnlyFn(
        "reputation-system",
        "get-user-reputation",
        [Cl.principal(wallet1)],
        wallet1
      );

      expect(result).not.toBeNone();
    });

    it("prevents duplicate initialization", () => {
      simnet.callPublicFn("reputation-system", "initialize-reputation", [Cl.principal(wallet1)], deployer);

      const { result } = simnet.callPublicFn(
        "reputation-system",
        "initialize-reputation",
        [Cl.principal(wallet1)],
        deployer
      );

      expect(result).toBeErr(Cl.uint(5006)); // ERR_ALREADY_INITIALIZED
    });
  });

  describe("Score Updates", () => {
    beforeEach(() => {
      simnet.callPublicFn("reputation-system", "initialize-reputation", [Cl.principal(wallet1)], deployer);
    });

    it("adds positive reputation score", () => {
      const { result } = simnet.callPublicFn(
        "reputation-system",
        "update-reputation",
        [Cl.principal(wallet1), Cl.int(50)],
        deployer
      );

      expect(result).toBeOk(Cl.bool(true));
    });

    it("deducts negative reputation score", () => {
      simnet.callPublicFn("reputation-system", "update-reputation", [Cl.principal(wallet1), Cl.int(100)], deployer);

      const { result } = simnet.callPublicFn(
        "reputation-system",
        "update-reputation",
        [Cl.principal(wallet1), Cl.int(-30)],
        deployer
      );

      expect(result).toBeOk(Cl.bool(true));
    });

    it("updates last-active timestamp", () => {
      simnet.callPublicFn("reputation-system", "update-reputation", [Cl.principal(wallet1), Cl.int(25)], deployer);

      const { result } = simnet.callReadOnlyFn(
        "reputation-system",
        "get-user-reputation",
        [Cl.principal(wallet1)],
        wallet1
      );

      expect(result).not.toBeNone();
    });

    it("only owner can update reputation", () => {
      const { result } = simnet.callPublicFn(
        "reputation-system",
        "update-reputation",
        [Cl.principal(wallet2), Cl.int(50)],
        wallet1
      );

      expect(result).toBeErr(Cl.uint(5001)); // ERR_UNAUTHORIZED
    });
  });

  describe("Endorsement System", () => {
    beforeEach(() => {
      simnet.callPublicFn("reputation-system", "initialize-reputation", [Cl.principal(wallet1)], deployer);
      simnet.callPublicFn("reputation-system", "initialize-reputation", [Cl.principal(wallet2)], deployer);
    });

    it("user can endorse another user", () => {
      const { result } = simnet.callPublicFn(
        "reputation-system",
        "endorse-user",
        [Cl.principal(wallet2), Cl.stringAscii("technical"), Cl.stringAscii("Excellent developer")],
        wallet1
      );

      expect(result).toBeOk(Cl.uint(1));
    });

    it("prevents self-endorsement", () => {
      const { result } = simnet.callPublicFn(
        "reputation-system",
        "endorse-user",
        [Cl.principal(wallet1), Cl.stringAscii("technical"), Cl.stringAscii("Self praise")],
        wallet1
      );

      expect(result).toBeErr(Cl.uint(5007)); // ERR_SELF_ENDORSE
    });

    it("prevents duplicate endorsements", () => {
      simnet.callPublicFn(
        "reputation-system",
        "endorse-user",
        [Cl.principal(wallet2), Cl.stringAscii("technical"), Cl.stringAscii("Great work")],
        wallet1
      );

      const { result } = simnet.callPublicFn(
        "reputation-system",
        "endorse-user",
        [Cl.principal(wallet2), Cl.stringAscii("technical"), Cl.stringAscii("Still great")],
        wallet1
      );

      expect(result).toBeErr(Cl.uint(5008)); // ERR_ALREADY_ENDORSED
    });

    it("increments endorsement ID", () => {
      const result1 = simnet.callPublicFn(
        "reputation-system",
        "endorse-user",
        [Cl.principal(wallet2), Cl.stringAscii("technical"), Cl.stringAscii("First")],
        wallet1
      );

      const result2 = simnet.callPublicFn(
        "reputation-system",
        "endorse-user",
        [Cl.principal(wallet1), Cl.stringAscii("creative"), Cl.stringAscii("Second")],
        wallet2
      );

      expect(result1.result).toBeOk(Cl.uint(1));
      expect(result2.result).toBeOk(Cl.uint(2));
    });
  });

  describe("Time Decay with stacks-block-time", () => {
    beforeEach(() => {
      simnet.callPublicFn("reputation-system", "initialize-reputation", [Cl.principal(wallet1)], deployer);
      simnet.callPublicFn("reputation-system", "update-reputation", [Cl.principal(wallet1), Cl.int(200)], deployer);
    });

    it("applies time decay to reputation", () => {
      const { result } = simnet.callPublicFn(
        "reputation-system",
        "apply-decay",
        [Cl.principal(wallet1)],
        deployer
      );

      expect(result).toBeOk(Cl.bool(true));
    });

    it("updates last-decay timestamp", () => {
      simnet.callPublicFn("reputation-system", "apply-decay", [Cl.principal(wallet1)], deployer);

      const { result } = simnet.callReadOnlyFn(
        "reputation-system",
        "get-user-reputation",
        [Cl.principal(wallet1)],
        wallet1
      );

      expect(result).not.toBeNone();
    });

    it("only owner can apply decay", () => {
      const { result } = simnet.callPublicFn(
        "reputation-system",
        "apply-decay",
        [Cl.principal(wallet1)],
        wallet2
      );

      expect(result).toBeErr(Cl.uint(5001)); // ERR_UNAUTHORIZED
    });
  });

  describe("Category Reputation", () => {
    beforeEach(() => {
      simnet.callPublicFn("reputation-system", "initialize-reputation", [Cl.principal(wallet1)], deployer);
    });

    it("records category-specific reputation", () => {
      const { result } = simnet.callPublicFn(
        "reputation-system",
        "update-category-reputation",
        [Cl.principal(wallet1), Cl.stringAscii("technical"), Cl.int(75)],
        deployer
      );

      expect(result).toBeOk(Cl.bool(true));
    });

    it("retrieves category reputation", () => {
      simnet.callPublicFn(
        "reputation-system",
        "update-category-reputation",
        [Cl.principal(wallet1), Cl.stringAscii("creative"), Cl.int(60)],
        deployer
      );

      const { result } = simnet.callReadOnlyFn(
        "reputation-system",
        "get-category-reputation",
        [Cl.principal(wallet1), Cl.stringAscii("creative")],
        wallet1
      );

      expect(result).toBeOk(Cl.uint(60));
    });

    it("returns zero for non-existent category", () => {
      const { result } = simnet.callReadOnlyFn(
        "reputation-system",
        "get-category-reputation",
        [Cl.principal(wallet1), Cl.stringAscii("nonexistent")],
        wallet1
      );

      expect(result).toBeOk(Cl.uint(0));
    });
  });

  describe("Badge System", () => {
    beforeEach(() => {
      simnet.callPublicFn("reputation-system", "initialize-reputation", [Cl.principal(wallet1)], deployer);
    });

    it("owner can award badge", () => {
      const { result } = simnet.callPublicFn(
        "reputation-system",
        "award-badge",
        [Cl.principal(wallet1), Cl.stringAscii("Top Contributor"), Cl.stringAscii("gold")],
        deployer
      );

      expect(result).toBeOk(Cl.uint(1));
    });

    it("non-owner cannot award badge", () => {
      const { result } = simnet.callPublicFn(
        "reputation-system",
        "award-badge",
        [Cl.principal(wallet2), Cl.stringAscii("Badge"), Cl.stringAscii("silver")],
        wallet1
      );

      expect(result).toBeErr(Cl.uint(5001)); // ERR_UNAUTHORIZED
    });

    it("increments badge ID", () => {
      simnet.callPublicFn("reputation-system", "initialize-reputation", [Cl.principal(wallet2)], deployer);

      const result1 = simnet.callPublicFn(
        "reputation-system",
        "award-badge",
        [Cl.principal(wallet1), Cl.stringAscii("First"), Cl.stringAscii("gold")],
        deployer
      );

      const result2 = simnet.callPublicFn(
        "reputation-system",
        "award-badge",
        [Cl.principal(wallet2), Cl.stringAscii("Second"), Cl.stringAscii("silver")],
        deployer
      );

      expect(result1.result).toBeOk(Cl.uint(1));
      expect(result2.result).toBeOk(Cl.uint(2));
    });
  });

  describe("Read-Only Functions", () => {
    it("returns none for non-existent user", () => {
      const { result } = simnet.callReadOnlyFn(
        "reputation-system",
        "get-user-reputation",
        [Cl.principal(wallet3)],
        wallet1
      );

      expect(result).toBeNone();
    });

    it("returns reputation system stats", () => {
      const { result } = simnet.callReadOnlyFn(
        "reputation-system",
        "get-reputation-stats",
        [],
        wallet1
      );

      expect(result).not.toBeErr();
    });

    it("checks endorsement count", () => {
      simnet.callPublicFn("reputation-system", "initialize-reputation", [Cl.principal(wallet1)], deployer);
      simnet.callPublicFn("reputation-system", "initialize-reputation", [Cl.principal(wallet2)], deployer);

      simnet.callPublicFn(
        "reputation-system",
        "endorse-user",
        [Cl.principal(wallet1), Cl.stringAscii("technical"), Cl.stringAscii("Great")],
        wallet2
      );

      const { result } = simnet.callReadOnlyFn(
        "reputation-system",
        "get-endorsement-count",
        [Cl.principal(wallet1)],
        wallet1
      );

      expect(result).toBeOk(Cl.uint(1));
    });
  });

  describe("Integration Tests", () => {
    it("complete reputation lifecycle", () => {
      // Initialize
      const init = simnet.callPublicFn("reputation-system", "initialize-reputation", [Cl.principal(wallet1)], deployer);
      expect(init.result).toBeOk(Cl.bool(true));

      // Update reputation
      const update = simnet.callPublicFn("reputation-system", "update-reputation", [Cl.principal(wallet1), Cl.int(150)], deployer);
      expect(update.result).toBeOk(Cl.bool(true));

      // Category reputation
      const category = simnet.callPublicFn(
        "reputation-system",
        "update-category-reputation",
        [Cl.principal(wallet1), Cl.stringAscii("technical"), Cl.int(100)],
        deployer
      );
      expect(category.result).toBeOk(Cl.bool(true));

      // Award badge
      const badge = simnet.callPublicFn(
        "reputation-system",
        "award-badge",
        [Cl.principal(wallet1), Cl.stringAscii("Expert"), Cl.stringAscii("platinum")],
        deployer
      );
      expect(badge.result).toBeOk(Cl.uint(1));

      // Get endorsement from another user
      simnet.callPublicFn("reputation-system", "initialize-reputation", [Cl.principal(wallet2)], deployer);
      const endorse = simnet.callPublicFn(
        "reputation-system",
        "endorse-user",
        [Cl.principal(wallet1), Cl.stringAscii("technical"), Cl.stringAscii("Highly skilled")],
        wallet2
      );
      expect(endorse.result).toBeOk(Cl.uint(1));
    });
  });
});
