/**
 * RPC Method Handler for Stacks AppKit Adapter
 */

import { fetchCallReadOnlyFunction } from '@stacks/transactions';
import type {
  StacksRPCRequest,
  StacksRPCResponse,
  StacksAccount,
} from '../types';

export class StacksRPCHandler {
  constructor(
    private account: StacksAccount | null,
    private network: 'mainnet' | 'testnet'
  ) {}

  async handle(request: StacksRPCRequest): Promise<StacksRPCResponse> {
    try {
      switch (request.method) {
        case 'stx_getAccounts':
          return this.getAccounts();

        case 'stx_getAddresses':
          return this.getAddresses();

        case 'stx_getBalance':
          return this.getBalance(request.params?.[0]);

        case 'stx_getNetwork':
          return this.getNetwork();

        default:
          return {
            error: {
              code: -32601,
              message: `Method ${request.method} not found`,
            },
          };
      }
    } catch (error) {
      return {
        error: {
          code: -32603,
          message: error instanceof Error ? error.message : 'Internal error',
        },
      };
    }
  }

  private getAccounts(): StacksRPCResponse {
    if (!this.account) {
      return {
        error: {
          code: 4100,
          message: 'Wallet not connected',
        },
      };
    }

    return {
      result: [this.account.address],
    };
  }

  private getAddresses(): StacksRPCResponse {
    if (!this.account) {
      return {
        error: {
          code: 4100,
          message: 'Wallet not connected',
        },
      };
    }

    return {
      result: {
        address: this.account.address,
        publicKey: this.account.publicKey,
      },
    };
  }

  private async getBalance(address?: string): Promise<StacksRPCResponse> {
    const targetAddress = address || this.account?.address;

    if (!targetAddress) {
      return {
        error: {
          code: -32602,
          message: 'Address required',
        },
      };
    }

    try {
      const apiUrl = this.network === 'mainnet'
        ? 'https://api.mainnet.hiro.so'
        : 'https://api.testnet.hiro.so';

      const response = await fetch(
        `${apiUrl}/extended/v1/address/${targetAddress}/balances`
      );

      const data = await response.json();

      return {
        result: {
          stx: {
            balance: data.stx.balance,
            locked: data.stx.locked,
            total: data.stx.total_sent,
          },
        },
      };
    } catch (error) {
      return {
        error: {
          code: -32603,
          message: 'Failed to fetch balance',
        },
      };
    }
  }

  private getNetwork(): StacksRPCResponse {
    return {
      result: {
        network: this.network,
        chainId: this.network === 'mainnet' ? 'stacks:1' : 'stacks:2147483648',
      },
    };
  }

  updateAccount(account: StacksAccount | null): void {
    this.account = account;
  }

  updateNetwork(network: 'mainnet' | 'testnet'): void {
    this.network = network;
  }
}

export default StacksRPCHandler;
