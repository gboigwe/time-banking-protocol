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

  describe("Bulk Transfer Operations", () => {
    beforeEach(() => {
      // Register users
      simnet.callPublicFn("time-bank-core", "register-user", [], wallet1);
      simnet.callPublicFn("time-bank-core", "register-user", [], wallet2);
      simnet.callPublicFn("time-bank-core", "register-user", [], wallet3);

      // Give wallet1 more credits for bulk transfers
      simnet.callPublicFn("time-bank-core", "mint-credits", [Cl.principal(wallet1), Cl.uint(100)], deployer);
    });

    it("bulk transfers credits to multiple recipients", () => {
      const transfers = [
        { to: wallet2, amount: 10 },
        { to: wallet3, amount: 15 }
      ];

      const { result } = simnet.callPublicFn(
        "time-bank-core",
        "bulk-transfer-credits",
        [Cl.list(transfers.map(t => Cl.tuple({
          'to': Cl.principal(t.to),
          'amount': Cl.uint(t.amount)
        })))],
        wallet1
      );

      expect(result).toBeOk(Cl.tuple({
        "total-transfers": Cl.uint(2),
        "total-amount": Cl.uint(25),
        results: Cl.list([
          Cl.tuple({
            recipient: Cl.principal(wallet2),
            amount: Cl.uint(10),
            timestamp: Cl.uint(simnet.blockHeight)
          }),
          Cl.tuple({
            recipient: Cl.principal(wallet3),
            amount: Cl.uint(15),
            timestamp: Cl.uint(simnet.blockHeight)
          })
        ])
      }));
    });

    it("bulk transfer updates all balances correctly", () => {
      const transfers = [
        { to: wallet2, amount: 20 },
        { to: wallet3, amount: 30 }
      ];

      simnet.callPublicFn(
        "time-bank-core",
        "bulk-transfer-credits",
        [Cl.list(transfers.map(t => Cl.tuple({
          'to': Cl.principal(t.to),
          'amount': Cl.uint(t.amount)
        })))],
        wallet1
      );

      // Check sender balance: 10 (initial) + 100 (minted) - 50 (transferred) = 60
      const senderBalance = simnet.callReadOnlyFn(
        "time-bank-core",
        "get-user-balance",
        [Cl.principal(wallet1)],
        wallet1
      );
      expect(senderBalance.result).toBeOk(Cl.uint(60));

      // Check receiver balances
      const receiver1Balance = simnet.callReadOnlyFn(
        "time-bank-core",
        "get-user-balance",
        [Cl.principal(wallet2)],
        wallet1
      );
      expect(receiver1Balance.result).toBeOk(Cl.uint(30)); // 10 + 20

      const receiver2Balance = simnet.callReadOnlyFn(
        "time-bank-core",
        "get-user-balance",
        [Cl.principal(wallet3)],
        wallet1
      );
      expect(receiver2Balance.result).toBeOk(Cl.uint(40)); // 10 + 30
    });

    it("bulk transfer fails with insufficient balance", () => {
      // Try to transfer more than available (110 > 60)
      const transfers = [
        { to: wallet2, amount: 50 },
        { to: wallet3, amount: 60 }
      ];

      const { result } = simnet.callPublicFn(
        "time-bank-core",
        "bulk-transfer-credits",
        [Cl.list(transfers.map(t => Cl.tuple({
          'to': Cl.principal(t.to),
          'amount': Cl.uint(t.amount)
        })))],
        wallet1
      );

      expect(result).toBeErr(Cl.uint(1003)); // ERR_INSUFFICIENT_BALANCE
    });

    it("bulk transfer rejects empty transfer list", () => {
      const { result } = simnet.callPublicFn(
        "time-bank-core",
        "bulk-transfer-credits",
        [Cl.list([])],
        wallet1
      );

      expect(result).toBeErr(Cl.uint(1005)); // ERR_INVALID_PARAMS
    });

    it("bulk transfer validates each recipient individually", () => {
      // Include invalid recipient (not registered)
      const transfers = [
        { to: wallet2, amount: 10 },
        { to: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM", amount: 10 } // Invalid recipient
      ];

      const { result } = simnet.callPublicFn(
        "time-bank-core",
        "bulk-transfer-credits",
        [Cl.list(transfers.map(t => Cl.tuple({
          'to': Cl.principal(t.to),
          'amount': Cl.uint(t.amount)
        })))],
        wallet1
      );

      expect(result).toBeErr(Cl.uint(1007)); // ERR_NOT_FOUND for invalid recipient
    });

    it("bulk transfer prevents self-transfers", () => {
      const transfers = [
        { to: wallet1, amount: 10 } // Self-transfer
      ];

      const { result } = simnet.callPublicFn(
        "time-bank-core",
        "bulk-transfer-credits",
        [Cl.list(transfers.map(t => Cl.tuple({
          'to': Cl.principal(t.to),
          'amount': Cl.uint(t.amount)
        })))],
        wallet1
      );

      expect(result).toBeErr(Cl.uint(1011)); // ERR_SELF_TRANSFER
    });

    it("bulk transfer enforces minimum transfer amount", () => {
      const transfers = [
        { to: wallet2, amount: 0 } // Below minimum
      ];

      const { result } = simnet.callPublicFn(
        "time-bank-core",
        "bulk-transfer-credits",
        [Cl.list(transfers.map(t => Cl.tuple({
          'to': Cl.principal(t.to),
          'amount': Cl.uint(t.amount)
        })))],
        wallet1
      );

      expect(result).toBeErr(Cl.uint(1005)); // ERR_INVALID_PARAMS
    });

    it("bulk transfer handles maximum 10 transfers", () => {
      const transfers = Array.from({length: 10}, (_, i) => ({
        to: [wallet2, wallet3][i % 2], // Alternate between wallet2 and wallet3
        amount: 5
      }));

      const { result } = simnet.callPublicFn(
        "time-bank-core",
        "bulk-transfer-credits",
        [Cl.list(transfers.map(t => Cl.tuple({
          'to': Cl.principal(t.to),
          'amount': Cl.uint(t.amount)
        })))],
        wallet1
      );

      expect(result).toBeOk(Cl.tuple({
        "total-transfers": Cl.uint(10),
        "total-amount": Cl.uint(50),
        results: Cl.list(transfers.map(t => Cl.tuple({
          recipient: Cl.principal(t.to),
          amount: Cl.uint(t.amount),
          timestamp: Cl.uint(simnet.blockHeight)
        })))
      }));
    });

    it("bulk transfer fails when protocol is paused", () => {
      // Pause protocol
      simnet.callPublicFn("time-bank-core", "toggle-protocol-pause", [], deployer);

      const transfers = [{ to: wallet2, amount: 10 }];

      const { result } = simnet.callPublicFn(
        "time-bank-core",
        "bulk-transfer-credits",
        [Cl.list(transfers.map(t => Cl.tuple({
          'to': Cl.principal(t.to),
          'amount': Cl.uint(t.amount)
        })))],
        wallet1
      );

      expect(result).toBeErr(Cl.uint(1001)); // ERR_UNAUTHORIZED (paused)
    });

    it("bulk transfer fails for inactive users", () => {
      // Deactivate wallet1
      simnet.callPublicFn("time-bank-core", "deactivate-user", [], wallet1);

      const transfers = [{ to: wallet2, amount: 10 }];

      const { result } = simnet.callPublicFn(
        "time-bank-core",
        "bulk-transfer-credits",
        [Cl.list(transfers.map(t => Cl.tuple({
          'to': Cl.principal(t.to),
          'amount': Cl.uint(t.amount)
        })))],
        wallet1
      );

      expect(result).toBeErr(Cl.uint(1012)); // ERR_USER_INACTIVE
    });
  });

  describe("Bulk Distribution Operations", () => {
    beforeEach(() => {
      // Register users for distribution
      simnet.callPublicFn("time-bank-core", "register-user", [], wallet1);
      simnet.callPublicFn("time-bank-core", "register-user", [], wallet2);
      simnet.callPublicFn("time-bank-core", "register-user", [], wallet3);
    });

    it("admin can bulk distribute credits", () => {
      const distributions = [
        { recipient: wallet1, amount: 50 },
        { recipient: wallet2, amount: 75 },
        { recipient: wallet3, amount: 25 }
      ];

      const { result } = simnet.callPublicFn(
        "time-bank-core",
        "bulk-distribute-credits",
        [Cl.list(distributions.map(d => Cl.tuple({
          'recipient': Cl.principal(d.recipient),
          'amount': Cl.uint(d.amount)
        })))],
        deployer
      );

      expect(result).toBeOk(Cl.list([
        Cl.tuple({
          recipient: Cl.principal(wallet1),
          amount: Cl.uint(50),
          timestamp: Cl.uint(simnet.blockHeight)
        }),
        Cl.tuple({
          recipient: Cl.principal(wallet2),
          amount: Cl.uint(75),
          timestamp: Cl.uint(simnet.blockHeight)
        }),
        Cl.tuple({
          recipient: Cl.principal(wallet3),
          amount: Cl.uint(25),
          timestamp: Cl.uint(simnet.blockHeight)
        })
      ]));
    });

    it("bulk distribution updates balances correctly", () => {
      const distributions = [
        { recipient: wallet1, amount: 100 },
        { recipient: wallet2, amount: 200 }
      ];

      simnet.callPublicFn(
        "time-bank-core",
        "bulk-distribute-credits",
        [Cl.list(distributions.map(d => Cl.tuple({
          'recipient': Cl.principal(d.recipient),
          'amount': Cl.uint(d.amount)
        })))],
        deployer
      );

      // Check balances: initial 10 + distributed amount
      const balance1 = simnet.callReadOnlyFn(
        "time-bank-core",
        "get-user-balance",
        [Cl.principal(wallet1)],
        wallet1
      );
      expect(balance1.result).toBeOk(Cl.uint(110));

      const balance2 = simnet.callReadOnlyFn(
        "time-bank-core",
        "get-user-balance",
        [Cl.principal(wallet2)],
        wallet1
      );
      expect(balance2.result).toBeOk(Cl.uint(210));
    });

    it("bulk distribution enforces max amount per distribution", () => {
      const distributions = [
        { recipient: wallet1, amount: 1500 } // Over MAX_MINT_AMOUNT (1000)
      ];

      const { result } = simnet.callPublicFn(
        "time-bank-core",
        "bulk-distribute-credits",
        [Cl.list(distributions.map(d => Cl.tuple({
          'recipient': Cl.principal(d.recipient),
          'amount': Cl.uint(d.amount)
        })))],
        deployer
      );

      expect(result).toBeErr(Cl.uint(1005)); // ERR_INVALID_PARAMS
    });

    it("bulk distribution rejects non-admin callers", () => {
      const distributions = [{ recipient: wallet1, amount: 50 }];

      const { result } = simnet.callPublicFn(
        "time-bank-core",
        "bulk-distribute-credits",
        [Cl.list(distributions.map(d => Cl.tuple({
          'recipient': Cl.principal(d.recipient),
          'amount': Cl.uint(d.amount)
        })))],
        wallet1
      );

      expect(result).toBeErr(Cl.uint(1001)); // ERR_UNAUTHORIZED
    });

    it("bulk distribution handles maximum 20 distributions", () => {
      const distributions = Array.from({length: 20}, (_, i) => ({
        recipient: [wallet1, wallet2, wallet3][i % 3],
        amount: 10
      }));

      const { result } = simnet.callPublicFn(
        "time-bank-core",
        "bulk-distribute-credits",
        [Cl.list(distributions.map(d => Cl.tuple({
          'recipient': Cl.principal(d.recipient),
          'amount': Cl.uint(d.amount)
        })))],
        deployer
      );

      expect(result).toBeOk(Cl.list(distributions.map(d => Cl.tuple({
        recipient: Cl.principal(d.recipient),
        amount: Cl.uint(d.amount),
        timestamp: Cl.uint(simnet.blockHeight)
      }))));
    });

    it("bulk distribution fails when protocol is paused", () => {
      simnet.callPublicFn("time-bank-core", "toggle-protocol-pause", [], deployer);

      const distributions = [{ recipient: wallet1, amount: 50 }];

      const { result } = simnet.callPublicFn(
        "time-bank-core",
        "bulk-distribute-credits",
        [Cl.list(distributions.map(d => Cl.tuple({
          'recipient': Cl.principal(d.recipient),
          'amount': Cl.uint(d.amount)
        })))],
        deployer
      );

      expect(result).toBeErr(Cl.uint(1001)); // ERR_UNAUTHORIZED (paused)
    });
  });

  describe("Bulk Operations Integration", () => {
    it("combines bulk transfers with existing functionality", () => {
      // Setup users
      simnet.callPublicFn("time-bank-core", "register-user", [], wallet1);
      simnet.callPublicFn("time-bank-core", "register-user", [], wallet2);
      simnet.callPublicFn("time-bank-core", "register-user", [], wallet3);

      // Give wallet1 more credits
      simnet.callPublicFn("time-bank-core", "mint-credits", [Cl.principal(wallet1), Cl.uint(200)], deployer);

      // Single transfer
      simnet.callPublicFn("time-bank-core", "transfer-credits", [Cl.principal(wallet2), Cl.uint(10)], wallet1);

      // Bulk transfer
      const transfers = [
        { to: wallet2, amount: 20 },
        { to: wallet3, amount: 30 }
      ];
      simnet.callPublicFn(
        "time-bank-core",
        "bulk-transfer-credits",
        [Cl.list(transfers.map(t => Cl.tuple({
          'to': Cl.principal(t.to),
          'amount': Cl.uint(t.amount)
        })))],
        wallet1
      );

      // Admin distribution
      simnet.callPublicFn(
        "time-bank-core",
        "bulk-distribute-credits",
        [Cl.list([{ recipient: wallet3, amount: 100 }].map(d => Cl.tuple({
          'recipient': Cl.principal(d.recipient),
          'amount': Cl.uint(d.amount)
        })))],
        deployer
      );

      // Final balance checks
      const balance1 = simnet.callReadOnlyFn("time-bank-core", "get-user-balance", [Cl.principal(wallet1)], wallet1);
      expect(balance1.result).toBeOk(Cl.uint(150)); // 10 + 200 - 10 - 20 - 30 = 150

      const balance2 = simnet.callReadOnlyFn("time-bank-core", "get-user-balance", [Cl.principal(wallet2)], wallet1);
      expect(balance2.result).toBeOk(Cl.uint(40)); // 10 + 10 + 20 = 40

      const balance3 = simnet.callReadOnlyFn("time-bank-core", "get-user-balance", [Cl.principal(wallet3)], wallet1);
      expect(balance3.result).toBeOk(Cl.uint(140)); // 10 + 30 + 100 = 140
    });

    it("bulk operations update protocol statistics", () => {
      // Register users
      simnet.callPublicFn("time-bank-core", "register-user", [], wallet1);
      simnet.callPublicFn("time-bank-core", "register-user", [], wallet2);
      simnet.callPublicFn("time-bank-core", "register-user", [], wallet3);

      // Initial stats
      const initialStats = simnet.callReadOnlyFn("time-bank-core", "get-protocol-stats", [], wallet1);
      expect(initialStats.result).toBeOk(Cl.tuple({
        "total-users": Cl.uint(3),
        "total-credits-circulating": Cl.uint(30), // 3 users * 10 credits
        "initial-credits-per-user": Cl.uint(10),
        "min-transfer-amount": Cl.uint(1),
        "protocol-paused": Cl.bool(false)
      }));

      // Bulk transfer
      simnet.callPublicFn(
        "time-bank-core",
        "bulk-transfer-credits",
        [Cl.list([
          Cl.tuple({'to': Cl.principal(wallet2), 'amount': Cl.uint(5)}),
          Cl.tuple({'to': Cl.principal(wallet3), 'amount': Cl.uint(5)})
        ])],
        wallet1
      );

      // Bulk distribution
      simnet.callPublicFn(
        "time-bank-core",
        "bulk-distribute-credits",
        [Cl.list([
          Cl.tuple({'recipient': Cl.principal(wallet2), 'amount': Cl.uint(50)})
        ])],
        deployer
      );

      // Final stats
      const finalStats = simnet.callReadOnlyFn("time-bank-core", "get-protocol-stats", [], wallet1);
      expect(finalStats.result).toBeOk(Cl.tuple({
        "total-users": Cl.uint(3),
        "total-credits-circulating": Cl.uint(80), // 30 + 50 (distribution) = 80
        "initial-credits-per-user": Cl.uint(10),
        "min-transfer-amount": Cl.uint(1),
        "protocol-paused": Cl.bool(false)
      }));
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
