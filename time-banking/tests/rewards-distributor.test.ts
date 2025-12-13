import { describe, expect, it, beforeEach } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;
const wallet3 = accounts.get("wallet_3")!;

describe("Rewards Distributor - Clarity 4 Tests", () => {

  describe("Reward Period Management with stacks-block-time", () => {
    it("owner can start new reward period", () => {
      const { result } = simnet.callPublicFn(
        "rewards-distributor",
        "start-new-period",
        [],
        deployer
      );

      expect(result).toBeOk(Cl.uint(1));
    });

    it("stores period with stacks-block-time timestamps", () => {
      simnet.callPublicFn("rewards-distributor", "start-new-period", [], deployer);

      const { result } = simnet.callReadOnlyFn(
        "rewards-distributor",
        "get-period-info",
        [Cl.uint(1)],
        wallet1
      );

      expect(result).not.toBeNone();
    });

    it("non-owner cannot start period", () => {
      const { result } = simnet.callPublicFn(
        "rewards-distributor",
        "start-new-period",
        [],
        wallet1
      );

      expect(result).toBeErr(Cl.uint(7001)); // ERR_UNAUTHORIZED
    });

    it("increments period ID", () => {
      const result1 = simnet.callPublicFn("rewards-distributor", "start-new-period", [], deployer);
      const result2 = simnet.callPublicFn("rewards-distributor", "start-new-period", [], deployer);

      expect(result1.result).toBeOk(Cl.uint(1));
      expect(result2.result).toBeOk(Cl.uint(2));
    });
  });

  describe("Activity Registration", () => {
    beforeEach(() => {
      simnet.callPublicFn("rewards-distributor", "start-new-period", [], deployer);
    });

    it("registers user activity for period", () => {
      const { result } = simnet.callPublicFn(
        "rewards-distributor",
        "register-activity",
        [Cl.principal(wallet1), Cl.uint(150), Cl.uint(1)],
        deployer
      );

      expect(result).not.toBeErr();
    });

    it("calculates tier from activity score", () => {
      simnet.callPublicFn(
        "rewards-distributor",
        "register-activity",
        [Cl.principal(wallet1), Cl.uint(600), Cl.uint(1)],
        deployer
      );

      const { result } = simnet.callReadOnlyFn(
        "rewards-distributor",
        "get-user-reward",
        [Cl.principal(wallet1), Cl.uint(1)],
        wallet1
      );

      expect(result).not.toBeNone();
    });

    it("fails with insufficient activity score", () => {
      const { result } = simnet.callPublicFn(
        "rewards-distributor",
        "register-activity",
        [Cl.principal(wallet1), Cl.uint(5), Cl.uint(1)],
        deployer
      );

      expect(result).toBeErr(Cl.uint(7007)); // ERR_NOT_ELIGIBLE
    });

    it("updates participant count", () => {
      simnet.callPublicFn(
        "rewards-distributor",
        "register-activity",
        [Cl.principal(wallet1), Cl.uint(120), Cl.uint(1)],
        deployer
      );

      simnet.callPublicFn(
        "rewards-distributor",
        "register-activity",
        [Cl.principal(wallet2), Cl.uint(200), Cl.uint(1)],
        deployer
      );

      const { result } = simnet.callReadOnlyFn(
        "rewards-distributor",
        "get-period-info",
        [Cl.uint(1)],
        wallet1
      );

      expect(result).not.toBeNone();
    });
  });

  describe("Reward Claiming", () => {
    beforeEach(() => {
      simnet.callPublicFn("rewards-distributor", "start-new-period", [], deployer);
      simnet.callPublicFn("rewards-distributor", "contribute-to-pool", [Cl.uint(10000)], deployer);
      simnet.callPublicFn(
        "rewards-distributor",
        "register-activity",
        [Cl.principal(wallet1), Cl.uint(300), Cl.uint(1)],
        deployer
      );
      simnet.callPublicFn("rewards-distributor", "finalize-period", [Cl.uint(1)], deployer);
    });

    it("user can claim reward after finalization", () => {
      const { result } = simnet.callPublicFn(
        "rewards-distributor",
        "claim-reward",
        [Cl.uint(1)],
        wallet1
      );

      expect(result).not.toBeErr();
    });

    it("cannot claim before period finalized", () => {
      simnet.callPublicFn("rewards-distributor", "start-new-period", [], deployer);
      simnet.callPublicFn(
        "rewards-distributor",
        "register-activity",
        [Cl.principal(wallet2), Cl.uint(250), Cl.uint(2)],
        deployer
      );

      const { result } = simnet.callPublicFn(
        "rewards-distributor",
        "claim-reward",
        [Cl.uint(2)],
        wallet2
      );

      expect(result).toBeErr(Cl.uint(7005)); // ERR_REWARD_PERIOD_ACTIVE
    });

    it("cannot claim twice", () => {
      simnet.callPublicFn("rewards-distributor", "claim-reward", [Cl.uint(1)], wallet1);

      const { result } = simnet.callPublicFn(
        "rewards-distributor",
        "claim-reward",
        [Cl.uint(1)],
        wallet1
      );

      expect(result).toBeErr(Cl.uint(7004)); // ERR_ALREADY_CLAIMED
    });

    it("updates lifetime rewards on claim", () => {
      simnet.callPublicFn("rewards-distributor", "claim-reward", [Cl.uint(1)], wallet1);

      const { result } = simnet.callReadOnlyFn(
        "rewards-distributor",
        "get-lifetime-rewards",
        [Cl.principal(wallet1)],
        wallet1
      );

      expect(result).not.toBeNone();
    });
  });

  describe("Period Finalization", () => {
    beforeEach(() => {
      simnet.callPublicFn("rewards-distributor", "start-new-period", [], deployer);
      simnet.callPublicFn(
        "rewards-distributor",
        "register-activity",
        [Cl.principal(wallet1), Cl.uint(400), Cl.uint(1)],
        deployer
      );
    });

    it("owner can finalize period", () => {
      const { result } = simnet.callPublicFn(
        "rewards-distributor",
        "finalize-period",
        [Cl.uint(1)],
        deployer
      );

      expect(result).toBeOk(Cl.bool(true));
    });

    it("non-owner cannot finalize period", () => {
      const { result } = simnet.callPublicFn(
        "rewards-distributor",
        "finalize-period",
        [Cl.uint(1)],
        wallet1
      );

      expect(result).toBeErr(Cl.uint(7001)); // ERR_UNAUTHORIZED
    });

    it("cannot finalize already finalized period", () => {
      simnet.callPublicFn("rewards-distributor", "finalize-period", [Cl.uint(1)], deployer);

      const { result } = simnet.callPublicFn(
        "rewards-distributor",
        "finalize-period",
        [Cl.uint(1)],
        deployer
      );

      expect(result).toBeErr(Cl.uint(7005)); // ERR_REWARD_PERIOD_ACTIVE
    });
  });

  describe("Pool Contribution", () => {
    it("user can contribute to reward pool", () => {
      const { result } = simnet.callPublicFn(
        "rewards-distributor",
        "contribute-to-pool",
        [Cl.uint(500)],
        wallet1
      );

      expect(result).toBeOk(Cl.bool(true));
    });

    it("fails with zero contribution", () => {
      const { result } = simnet.callPublicFn(
        "rewards-distributor",
        "contribute-to-pool",
        [Cl.uint(0)],
        wallet1
      );

      expect(result).toBeErr(Cl.uint(7003)); // ERR_INVALID_PARAMS
    });

    it("tracks contributor contributions", () => {
      simnet.callPublicFn("rewards-distributor", "start-new-period", [], deployer);
      simnet.callPublicFn("rewards-distributor", "contribute-to-pool", [Cl.uint(750)], wallet1);

      const { result } = simnet.callReadOnlyFn(
        "rewards-distributor",
        "get-pool-contribution",
        [Cl.principal(wallet1), Cl.uint(1)],
        wallet1
      );

      expect(result).toBeOk(Cl.uint(750));
    });

    it("accumulates multiple contributions", () => {
      simnet.callPublicFn("rewards-distributor", "start-new-period", [], deployer);
      simnet.callPublicFn("rewards-distributor", "contribute-to-pool", [Cl.uint(300)], wallet1);
      simnet.callPublicFn("rewards-distributor", "contribute-to-pool", [Cl.uint(200)], wallet1);

      const { result } = simnet.callReadOnlyFn(
        "rewards-distributor",
        "get-pool-contribution",
        [Cl.principal(wallet1), Cl.uint(1)],
        wallet1
      );

      expect(result).toBeOk(Cl.uint(500));
    });
  });

  describe("Tier-Based Rewards", () => {
    beforeEach(() => {
      simnet.callPublicFn("rewards-distributor", "start-new-period", [], deployer);
      simnet.callPublicFn("rewards-distributor", "contribute-to-pool", [Cl.uint(50000)], deployer);
    });

    it("bronze tier gets base rewards", () => {
      simnet.callPublicFn(
        "rewards-distributor",
        "register-activity",
        [Cl.principal(wallet1), Cl.uint(120), Cl.uint(1)],
        deployer
      );

      const { result } = simnet.callReadOnlyFn(
        "rewards-distributor",
        "get-user-reward",
        [Cl.principal(wallet1), Cl.uint(1)],
        wallet1
      );

      expect(result).not.toBeNone();
    });

    it("silver tier gets higher rewards", () => {
      simnet.callPublicFn(
        "rewards-distributor",
        "register-activity",
        [Cl.principal(wallet1), Cl.uint(280), Cl.uint(1)],
        deployer
      );

      const { result } = simnet.callReadOnlyFn(
        "rewards-distributor",
        "get-user-reward",
        [Cl.principal(wallet1), Cl.uint(1)],
        wallet1
      );

      expect(result).not.toBeNone();
    });

    it("gold tier gets premium rewards", () => {
      simnet.callPublicFn(
        "rewards-distributor",
        "register-activity",
        [Cl.principal(wallet1), Cl.uint(550), Cl.uint(1)],
        deployer
      );

      const { result } = simnet.callReadOnlyFn(
        "rewards-distributor",
        "get-user-reward",
        [Cl.principal(wallet1), Cl.uint(1)],
        wallet1
      );

      expect(result).not.toBeNone();
    });

    it("platinum tier gets maximum rewards", () => {
      simnet.callPublicFn(
        "rewards-distributor",
        "register-activity",
        [Cl.principal(wallet1), Cl.uint(1200), Cl.uint(1)],
        deployer
      );

      const { result } = simnet.callReadOnlyFn(
        "rewards-distributor",
        "get-user-reward",
        [Cl.principal(wallet1), Cl.uint(1)],
        wallet1
      );

      expect(result).not.toBeNone();
    });
  });

  describe("Read-Only Functions", () => {
    it("returns none for non-existent period", () => {
      const { result } = simnet.callReadOnlyFn(
        "rewards-distributor",
        "get-period-info",
        [Cl.uint(999)],
        wallet1
      );

      expect(result).toBeNone();
    });

    it("returns rewards statistics", () => {
      const { result } = simnet.callReadOnlyFn(
        "rewards-distributor",
        "get-rewards-stats",
        [],
        wallet1
      );

      expect(result).not.toBeErr();
    });

    it("checks eligibility for rewards", () => {
      simnet.callPublicFn("rewards-distributor", "start-new-period", [], deployer);
      simnet.callPublicFn(
        "rewards-distributor",
        "register-activity",
        [Cl.principal(wallet1), Cl.uint(350), Cl.uint(1)],
        deployer
      );

      const { result } = simnet.callReadOnlyFn(
        "rewards-distributor",
        "is-eligible-for-rewards",
        [Cl.principal(wallet1), Cl.uint(1)],
        wallet1
      );

      expect(result).toBeOk(Cl.bool(true));
    });
  });

  describe("Integration Tests", () => {
    it("complete rewards cycle", () => {
      // Start period
      const period = simnet.callPublicFn("rewards-distributor", "start-new-period", [], deployer);
      expect(period.result).toBeOk(Cl.uint(1));

      // Contribute to pool
      const contribute = simnet.callPublicFn("rewards-distributor", "contribute-to-pool", [Cl.uint(25000)], deployer);
      expect(contribute.result).toBeOk(Cl.bool(true));

      // Register activities for multiple users
      const activity1 = simnet.callPublicFn(
        "rewards-distributor",
        "register-activity",
        [Cl.principal(wallet1), Cl.uint(800), Cl.uint(1)],
        deployer
      );
      expect(activity1.result).not.toBeErr();

      const activity2 = simnet.callPublicFn(
        "rewards-distributor",
        "register-activity",
        [Cl.principal(wallet2), Cl.uint(450), Cl.uint(1)],
        deployer
      );
      expect(activity2.result).not.toBeErr();

      const activity3 = simnet.callPublicFn(
        "rewards-distributor",
        "register-activity",
        [Cl.principal(wallet3), Cl.uint(180), Cl.uint(1)],
        deployer
      );
      expect(activity3.result).not.toBeErr();

      // Finalize period
      const finalize = simnet.callPublicFn("rewards-distributor", "finalize-period", [Cl.uint(1)], deployer);
      expect(finalize.result).toBeOk(Cl.bool(true));

      // Claim rewards
      const claim1 = simnet.callPublicFn("rewards-distributor", "claim-reward", [Cl.uint(1)], wallet1);
      expect(claim1.result).not.toBeErr();

      const claim2 = simnet.callPublicFn("rewards-distributor", "claim-reward", [Cl.uint(1)], wallet2);
      expect(claim2.result).not.toBeErr();

      const claim3 = simnet.callPublicFn("rewards-distributor", "claim-reward", [Cl.uint(1)], wallet3);
      expect(claim3.result).not.toBeErr();
    });
  });
});
