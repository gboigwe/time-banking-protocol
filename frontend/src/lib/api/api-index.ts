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
