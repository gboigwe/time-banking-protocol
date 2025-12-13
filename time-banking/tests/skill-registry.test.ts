import { describe, expect, it, beforeEach } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;
const wallet3 = accounts.get("wallet_3")!;

describe("Skill Registry - Clarity 4 Tests", () => {

  describe("Skill Registration with stacks-block-time", () => {
    it("registers a new skill successfully", () => {
      const { result } = simnet.callPublicFn(
        "skill-registry",
        "register-skill",
        [
          Cl.stringAscii("Web Development"),
          Cl.stringAscii("technical"),
          Cl.stringAscii("Full stack web development services"),
          Cl.uint(50)
        ],
        wallet1
      );

      expect(result).toBeOk(Cl.uint(1));
    });

    it("stores skill with stacks-block-time timestamp", () => {
      simnet.callPublicFn(
        "skill-registry",
        "register-skill",
        [
          Cl.stringAscii("Design"),
          Cl.stringAscii("creative"),
          Cl.stringAscii("UI/UX design"),
          Cl.uint(40)
        ],
        wallet1
      );

      const { result } = simnet.callReadOnlyFn(
        "skill-registry",
        "get-skill-info",
        [Cl.principal(wallet1), Cl.uint(1)],
        wallet1
      );

      expect(result).not.toBeNone();
    });

    it("fails with invalid category", () => {
      const { result } = simnet.callPublicFn(
        "skill-registry",
        "register-skill",
        [
          Cl.stringAscii("Test"),
          Cl.stringAscii("invalid"),
          Cl.stringAscii("Test desc"),
          Cl.uint(50)
        ],
        wallet1
      );

      expect(result).toBeErr(Cl.uint(2004)); // ERR_INVALID_PARAMS
    });

    it("increments skill ID correctly", () => {
      const result1 = simnet.callPublicFn(
        "skill-registry",
        "register-skill",
        [Cl.stringAscii("Skill 1"), Cl.stringAscii("technical"), Cl.stringAscii("Desc 1"), Cl.uint(50)],
        wallet1
      );

      const result2 = simnet.callPublicFn(
        "skill-registry",
        "register-skill",
        [Cl.stringAscii("Skill 2"), Cl.stringAscii("creative"), Cl.stringAscii("Desc 2"), Cl.uint(40)],
        wallet1
      );

      expect(result1.result).toBeOk(Cl.uint(1));
      expect(result2.result).toBeOk(Cl.uint(2));
    });
  });

  describe("Template Verification with contract-hash?", () => {
    it("owner can approve skill template", () => {
      const treasuryPrincipal = `${deployer}.skill-registry`;

      const { result } = simnet.callPublicFn(
        "skill-registry",
        "approve-skill-template",
        [Cl.stringAscii("StandardSkill"), Cl.principal(treasuryPrincipal)],
        deployer
      );

      expect(result).not.toBeErr();
    });

    it("non-owner cannot approve templates", () => {
      const treasuryPrincipal = `${deployer}.skill-registry`;

      const { result } = simnet.callPublicFn(
        "skill-registry",
        "approve-skill-template",
        [Cl.stringAscii("StandardSkill"), Cl.principal(treasuryPrincipal)],
        wallet1
      );

      expect(result).toBeErr(Cl.uint(2001)); // ERR_UNAUTHORIZED
    });
  });

  describe("Skill Verification", () => {
    beforeEach(() => {
      simnet.callPublicFn(
        "skill-registry",
        "register-skill",
        [Cl.stringAscii("Coding"), Cl.stringAscii("technical"), Cl.stringAscii("Programming"), Cl.uint(60)],
        wallet1
      );
    });

    it("prevents self-verification", () => {
      const { result } = simnet.callPublicFn(
        "skill-registry",
        "verify-skill",
        [
          Cl.principal(wallet1),
          Cl.uint(1),
          Cl.stringAscii("Great work"),
          Cl.contractPrincipal(deployer, "time-bank-core")
        ],
        wallet1
      );

      expect(result).toBeErr(Cl.uint(2007)); // ERR_SELF_VERIFY
    });
  });

  describe("Read-Only Functions", () => {
    it("returns none for non-existent skill", () => {
      const { result } = simnet.callReadOnlyFn(
        "skill-registry",
        "get-skill-info",
        [Cl.principal(wallet3), Cl.uint(999)],
        wallet1
      );

      expect(result).toBeNone();
    });

    it("returns registry stats", () => {
      simnet.callPublicFn(
        "skill-registry",
        "register-skill",
        [Cl.stringAscii("Test"), Cl.stringAscii("technical"), Cl.stringAscii("Desc"), Cl.uint(50)],
        wallet1
      );

      const { result } = simnet.callReadOnlyFn(
        "skill-registry",
        "get-registry-stats",
        [],
        wallet1
      );

      expect(result).not.toBeErr();
    });

    it("checks if skill is verified", () => {
      simnet.callPublicFn(
        "skill-registry",
        "register-skill",
        [Cl.stringAscii("Test"), Cl.stringAscii("technical"), Cl.stringAscii("Desc"), Cl.uint(50)],
        wallet1
      );

      const { result } = simnet.callReadOnlyFn(
        "skill-registry",
        "is-skill-verified",
        [Cl.principal(wallet1), Cl.uint(1)],
        wallet1
      );

      expect(result).toBeOk(Cl.bool(false));
    });
  });

  describe("Integration Tests", () => {
    it("complete skill lifecycle", () => {
      const register = simnet.callPublicFn(
        "skill-registry",
        "register-skill",
        [Cl.stringAscii("Teaching"), Cl.stringAscii("educational"), Cl.stringAscii("Online tutoring"), Cl.uint(45)],
        wallet1
      );
      expect(register.result).toBeOk(Cl.uint(1));

      const skillInfo = simnet.callReadOnlyFn(
        "skill-registry",
        "get-skill-info",
        [Cl.principal(wallet1), Cl.uint(1)],
        wallet1
      );
      expect(skillInfo.result).not.toBeNone();

      const userSkillCount = simnet.callReadOnlyFn(
        "skill-registry",
        "get-user-skill-count",
        [Cl.principal(wallet1)],
        wallet1
      );
      expect(userSkillCount.result).toBeOk(Cl.uint(1));
    });
  });
});
