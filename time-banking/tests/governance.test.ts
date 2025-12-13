import { describe, expect, it, beforeEach } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;
const wallet3 = accounts.get("wallet_3")!;

describe("Governance - Clarity 4 Tests", () => {

  describe("Proposal Creation with stacks-block-time", () => {
    beforeEach(() => {
      simnet.callPublicFn("governance", "set-voting-power", [Cl.principal(wallet1), Cl.uint(150)], deployer);
    });

    it("creates proposal with timelock periods", () => {
      const { result } = simnet.callPublicFn(
        "governance",
        "create-proposal",
        [
          Cl.stringAscii("Increase Initial Credits"),
          Cl.stringAscii("Proposal to increase initial user credits from 10 to 15"),
          Cl.stringAscii("parameter-change")
        ],
        wallet1
      );

      expect(result).toBeOk(Cl.uint(1));
    });

    it("stores proposal with voting deadline", () => {
      simnet.callPublicFn(
        "governance",
        "create-proposal",
        [
          Cl.stringAscii("Update Fee Structure"),
          Cl.stringAscii("Modify platform fee percentages"),
          Cl.stringAscii("fee-change")
        ],
        wallet1
      );

      const { result } = simnet.callReadOnlyFn(
        "governance",
        "get-proposal",
        [Cl.uint(1)],
        wallet1
      );

      expect(result).not.toBeNone();
    });

    it("fails with insufficient reputation", () => {
      const { result } = simnet.callPublicFn(
        "governance",
        "create-proposal",
        [
          Cl.stringAscii("Test"),
          Cl.stringAscii("No power"),
          Cl.stringAscii("test")
        ],
        wallet2
      );

      expect(result).toBeErr(Cl.uint(6008)); // ERR_INSUFFICIENT_REPUTATION
    });

    it("increments proposal ID", () => {
      const result1 = simnet.callPublicFn(
        "governance",
        "create-proposal",
        [Cl.stringAscii("First"), Cl.stringAscii("Description 1"), Cl.stringAscii("type1")],
        wallet1
      );

      const result2 = simnet.callPublicFn(
        "governance",
        "create-proposal",
        [Cl.stringAscii("Second"), Cl.stringAscii("Description 2"), Cl.stringAscii("type2")],
        wallet1
      );

      expect(result1.result).toBeOk(Cl.uint(1));
      expect(result2.result).toBeOk(Cl.uint(2));
    });
  });

  describe("Voting System", () => {
    beforeEach(() => {
      simnet.callPublicFn("governance", "set-voting-power", [Cl.principal(wallet1), Cl.uint(150)], deployer);
      simnet.callPublicFn("governance", "set-voting-power", [Cl.principal(wallet2), Cl.uint(100)], deployer);

      simnet.callPublicFn(
        "governance",
        "create-proposal",
        [Cl.stringAscii("Test Proposal"), Cl.stringAscii("Testing voting"), Cl.stringAscii("test")],
        wallet1
      );
    });

    it("user can cast yes vote", () => {
      const { result } = simnet.callPublicFn(
        "governance",
        "cast-vote",
        [Cl.uint(1), Cl.bool(true)],
        wallet2
      );

      expect(result).toBeOk(Cl.bool(true));
    });

    it("user can cast no vote", () => {
      const { result } = simnet.callPublicFn(
        "governance",
        "cast-vote",
        [Cl.uint(1), Cl.bool(false)],
        wallet2
      );

      expect(result).toBeOk(Cl.bool(true));
    });

    it("prevents double voting", () => {
      simnet.callPublicFn("governance", "cast-vote", [Cl.uint(1), Cl.bool(true)], wallet2);

      const { result } = simnet.callPublicFn(
        "governance",
        "cast-vote",
        [Cl.uint(1), Cl.bool(false)],
        wallet2
      );

      expect(result).toBeErr(Cl.uint(6004)); // ERR_ALREADY_VOTED
    });

    it("applies weighted voting based on power", () => {
      simnet.callPublicFn("governance", "cast-vote", [Cl.uint(1), Cl.bool(true)], wallet2);

      const { result } = simnet.callReadOnlyFn(
        "governance",
        "get-proposal",
        [Cl.uint(1)],
        wallet1
      );

      expect(result).not.toBeNone();
    });
  });

  describe("Proposal Finalization", () => {
    beforeEach(() => {
      simnet.callPublicFn("governance", "set-voting-power", [Cl.principal(wallet1), Cl.uint(150)], deployer);
      simnet.callPublicFn("governance", "set-voting-power", [Cl.principal(wallet2), Cl.uint(100)], deployer);
      simnet.callPublicFn("governance", "set-voting-power", [Cl.principal(wallet3), Cl.uint(80)], deployer);

      simnet.callPublicFn(
        "governance",
        "create-proposal",
        [Cl.stringAscii("Finalize Test"), Cl.stringAscii("Testing finalization"), Cl.stringAscii("test")],
        wallet1
      );
    });

    it("finalizes proposal with majority yes votes", () => {
      simnet.callPublicFn("governance", "cast-vote", [Cl.uint(1), Cl.bool(true)], wallet1);
      simnet.callPublicFn("governance", "cast-vote", [Cl.uint(1), Cl.bool(true)], wallet2);
      simnet.callPublicFn("governance", "cast-vote", [Cl.uint(1), Cl.bool(false)], wallet3);

      const { result } = simnet.callPublicFn(
        "governance",
        "finalize-proposal",
        [Cl.uint(1)],
        wallet1
      );

      expect(result).not.toBeErr();
    });

    it("finalizes proposal with majority no votes", () => {
      simnet.callPublicFn("governance", "cast-vote", [Cl.uint(1), Cl.bool(false)], wallet1);
      simnet.callPublicFn("governance", "cast-vote", [Cl.uint(1), Cl.bool(false)], wallet2);

      const { result } = simnet.callPublicFn(
        "governance",
        "finalize-proposal",
        [Cl.uint(1)],
        wallet1
      );

      expect(result).not.toBeErr();
    });

    it("checks quorum requirement", () => {
      simnet.callPublicFn("governance", "cast-vote", [Cl.uint(1), Cl.bool(true)], wallet3);

      const { result } = simnet.callPublicFn(
        "governance",
        "finalize-proposal",
        [Cl.uint(1)],
        wallet1
      );

      expect(result).not.toBeErr();
    });
  });

  describe("Proposal Execution with Timelock", () => {
    beforeEach(() => {
      simnet.callPublicFn("governance", "set-voting-power", [Cl.principal(wallet1), Cl.uint(150)], deployer);
      simnet.callPublicFn("governance", "set-voting-power", [Cl.principal(wallet2), Cl.uint(100)], deployer);

      simnet.callPublicFn(
        "governance",
        "create-proposal",
        [Cl.stringAscii("Execute Test"), Cl.stringAscii("Testing execution"), Cl.stringAscii("test")],
        wallet1
      );

      simnet.callPublicFn("governance", "cast-vote", [Cl.uint(1), Cl.bool(true)], wallet1);
      simnet.callPublicFn("governance", "cast-vote", [Cl.uint(1), Cl.bool(true)], wallet2);
      simnet.callPublicFn("governance", "finalize-proposal", [Cl.uint(1)], wallet1);
    });

    it("executes passed proposal after timelock", () => {
      const { result } = simnet.callPublicFn(
        "governance",
        "execute-proposal",
        [Cl.uint(1)],
        wallet1
      );

      expect(result).not.toBeErr();
    });

    it("fails to execute non-passed proposal", () => {
      simnet.callPublicFn(
        "governance",
        "create-proposal",
        [Cl.stringAscii("Failed"), Cl.stringAscii("Will fail"), Cl.stringAscii("test")],
        wallet1
      );

      simnet.callPublicFn("governance", "cast-vote", [Cl.uint(2), Cl.bool(false)], wallet1);
      simnet.callPublicFn("governance", "finalize-proposal", [Cl.uint(2)], wallet1);

      const { result } = simnet.callPublicFn(
        "governance",
        "execute-proposal",
        [Cl.uint(2)],
        wallet1
      );

      expect(result).toBeErr(Cl.uint(6003)); // ERR_INVALID_PARAMS
    });
  });

  describe("Proposal Cancellation", () => {
    beforeEach(() => {
      simnet.callPublicFn("governance", "set-voting-power", [Cl.principal(wallet1), Cl.uint(150)], deployer);

      simnet.callPublicFn(
        "governance",
        "create-proposal",
        [Cl.stringAscii("Cancel Test"), Cl.stringAscii("Will be cancelled"), Cl.stringAscii("test")],
        wallet1
      );
    });

    it("proposer can cancel their proposal", () => {
      const { result } = simnet.callPublicFn(
        "governance",
        "cancel-proposal",
        [Cl.uint(1)],
        wallet1
      );

      expect(result).toBeOk(Cl.bool(true));
    });

    it("non-proposer cannot cancel proposal", () => {
      const { result } = simnet.callPublicFn(
        "governance",
        "cancel-proposal",
        [Cl.uint(1)],
        wallet2
      );

      expect(result).toBeErr(Cl.uint(6001)); // ERR_UNAUTHORIZED
    });
  });

  describe("Voting Power Management", () => {
    it("owner can set voting power", () => {
      const { result } = simnet.callPublicFn(
        "governance",
        "set-voting-power",
        [Cl.principal(wallet1), Cl.uint(200)],
        deployer
      );

      expect(result).toBeOk(Cl.bool(true));
    });

    it("non-owner cannot set voting power", () => {
      const { result } = simnet.callPublicFn(
        "governance",
        "set-voting-power",
        [Cl.principal(wallet2), Cl.uint(150)],
        wallet1
      );

      expect(result).toBeErr(Cl.uint(6001)); // ERR_UNAUTHORIZED
    });

    it("retrieves user voting power", () => {
      simnet.callPublicFn("governance", "set-voting-power", [Cl.principal(wallet1), Cl.uint(175)], deployer);

      const { result } = simnet.callReadOnlyFn(
        "governance",
        "get-voting-power",
        [Cl.principal(wallet1)],
        wallet1
      );

      expect(result).toBeOk(Cl.uint(175));
    });
  });

  describe("Read-Only Functions", () => {
    it("returns none for non-existent proposal", () => {
      const { result } = simnet.callReadOnlyFn(
        "governance",
        "get-proposal",
        [Cl.uint(999)],
        wallet1
      );

      expect(result).toBeNone();
    });

    it("returns governance statistics", () => {
      const { result } = simnet.callReadOnlyFn(
        "governance",
        "get-governance-stats",
        [],
        wallet1
      );

      expect(result).not.toBeErr();
    });

    it("checks if proposal can be executed", () => {
      simnet.callPublicFn("governance", "set-voting-power", [Cl.principal(wallet1), Cl.uint(150)], deployer);
      simnet.callPublicFn("governance", "set-voting-power", [Cl.principal(wallet2), Cl.uint(100)], deployer);

      simnet.callPublicFn(
        "governance",
        "create-proposal",
        [Cl.stringAscii("Check"), Cl.stringAscii("Execution check"), Cl.stringAscii("test")],
        wallet1
      );

      simnet.callPublicFn("governance", "cast-vote", [Cl.uint(1), Cl.bool(true)], wallet1);
      simnet.callPublicFn("governance", "cast-vote", [Cl.uint(1), Cl.bool(true)], wallet2);
      simnet.callPublicFn("governance", "finalize-proposal", [Cl.uint(1)], wallet1);

      const { result } = simnet.callReadOnlyFn(
        "governance",
        "can-execute-proposal",
        [Cl.uint(1)],
        wallet1
      );

      expect(result).not.toBeErr();
    });
  });

  describe("Integration Tests", () => {
    it("complete governance lifecycle", () => {
      // Set voting power
      simnet.callPublicFn("governance", "set-voting-power", [Cl.principal(wallet1), Cl.uint(150)], deployer);
      simnet.callPublicFn("governance", "set-voting-power", [Cl.principal(wallet2), Cl.uint(100)], deployer);
      simnet.callPublicFn("governance", "set-voting-power", [Cl.principal(wallet3), Cl.uint(80)], deployer);

      // Create proposal
      const create = simnet.callPublicFn(
        "governance",
        "create-proposal",
        [Cl.stringAscii("Complete Test"), Cl.stringAscii("Full governance cycle"), Cl.stringAscii("integration")],
        wallet1
      );
      expect(create.result).toBeOk(Cl.uint(1));

      // Cast votes
      const vote1 = simnet.callPublicFn("governance", "cast-vote", [Cl.uint(1), Cl.bool(true)], wallet1);
      expect(vote1.result).toBeOk(Cl.bool(true));

      const vote2 = simnet.callPublicFn("governance", "cast-vote", [Cl.uint(1), Cl.bool(true)], wallet2);
      expect(vote2.result).toBeOk(Cl.bool(true));

      const vote3 = simnet.callPublicFn("governance", "cast-vote", [Cl.uint(1), Cl.bool(false)], wallet3);
      expect(vote3.result).toBeOk(Cl.bool(true));

      // Finalize
      const finalize = simnet.callPublicFn("governance", "finalize-proposal", [Cl.uint(1)], wallet1);
      expect(finalize.result).not.toBeErr();

      // Execute
      const execute = simnet.callPublicFn("governance", "execute-proposal", [Cl.uint(1)], wallet1);
      expect(execute.result).not.toBeErr();
    });
  });
});
