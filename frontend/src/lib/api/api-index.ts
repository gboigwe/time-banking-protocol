// api-index.ts — HiroAPI facade combining all clients
import { HttpClient } from './http-client';
import { AccountsClient } from './accounts-client';
import { TransactionsClient } from './transactions-client';
import { ContractsClient } from './contracts-client';
import { BlocksClient } from './blocks-client';
import { TokensClient } from './tokens-client';

/** Mainnet Hiro API base URL */
export const HIRO_MAINNET_URL = 'https://api.hiro.so';

/** Testnet Hiro API base URL */
export const HIRO_TESTNET_URL = 'https://api.testnet.hiro.so';

/** HiroAPI facade with all clients */
export class HiroAPI {
  public readonly accounts: AccountsClient;
  public readonly transactions: TransactionsClient;
  public readonly contracts: ContractsClient;
  public readonly blocks: BlocksClient;
  public readonly tokens: TokensClient;

  constructor(network: 'mainnet' | 'testnet' = 'mainnet') {
    const baseUrl = network === 'mainnet' ? HIRO_MAINNET_URL : HIRO_TESTNET_URL;
    const http = new HttpClient(baseUrl);
    this.accounts = new AccountsClient(http);
    this.transactions = new TransactionsClient(http);
    this.contracts = new ContractsClient(http);
    this.blocks = new BlocksClient(http);
    this.tokens = new TokensClient(http);
  }
}
