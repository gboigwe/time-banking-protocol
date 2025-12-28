import {
  AnchorMode,
  PostConditionMode,
  standardPrincipalCV,
  uintCV,
  stringAsciiCV,
  contractPrincipalCV,
  fetchCallReadOnlyFunction,
  broadcastTransaction,
  makeContractCall,
  ClarityValue,
  cvToValue,
  hexToCV,
} from '@stacks/transactions';
import { StacksMainnet, StacksTestnet, StacksNetwork } from '@stacks/network';
import { showConnect, connect as stacksConnect, disconnect as stacksDisconnect } from '@stacks/connect';
import { AppConfig, UserSession } from '@stacks/auth';
import { Storage } from '@stacks/storage';
import { ContractCallOptions, User, TimeExchange, UserSkill, Skill } from '@/types';
import { createTransactionBuilder } from './transaction-builder';
import { ErrorParser, withRetry } from './error-handling';

// BigInt JSON serialization support
if (typeof BigInt.prototype.toJSON === 'undefined') {
  (BigInt.prototype as any).toJSON = function () {
    return this.toString();
  };
}

// Configuration
const appConfig = new AppConfig(['store_write', 'publish_data']);
export const userSession = new UserSession({ appConfig });
export const storage = new Storage({ userSession });

// Network configuration (v8 API)
export const getNetwork = (): StacksNetwork => {
  const networkType = process.env.NEXT_PUBLIC_STACKS_NETWORK;
  return networkType === 'mainnet' ? new StacksMainnet() : new StacksTestnet();
};

export const getNetworkType = (): 'mainnet' | 'testnet' => {
  const networkType = process.env.NEXT_PUBLIC_STACKS_NETWORK;
  return networkType === 'mainnet' ? 'mainnet' : 'testnet';
};

// Contract configuration
export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;
export const CONTRACT_NAME = process.env.NEXT_PUBLIC_CONTRACT_NAME!;

// Reown (WalletConnect) configuration
export const REOWN_PROJECT_ID = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID;

// Wallet Connection Options
interface ConnectOptions {
  walletConnectProjectId?: string;
  forceWalletSelect?: boolean;
  persistWalletSelect?: boolean;
  onFinish?: () => void;
  onCancel?: () => void;
}

// App configuration for wallet connection
const getAppDetails = () => ({
  name: process.env.NEXT_PUBLIC_APP_NAME || 'TimeBank',
  icon: typeof window !== 'undefined' ? `${window.location.origin}/icon.svg` : '/icon.svg',
});

/**
 * Connect wallet using @stacks/connect
 * Supports both browser extension wallets (Hiro, Xverse, Leather) and WalletConnect
 *
 * @param options - Optional configuration for wallet connection
 */
export const connectWallet = (options?: ConnectOptions) => {
  const connectOptions: any = {
    appDetails: getAppDetails(),
    redirectTo: '/',
    onFinish: () => {
      console.log('✅ Wallet connected successfully');
      if (options?.onFinish) {
        options.onFinish();
      } else {
        window.location.reload();
      }
    },
    onCancel: () => {
      console.log('❌ User cancelled wallet connection');
      if (options?.onCancel) {
        options.onCancel();
      }
    },
    userSession,
  };

  // Add Reown (WalletConnect) support if Project ID is configured
  if (REOWN_PROJECT_ID || options?.walletConnectProjectId) {
    connectOptions.walletConnectProjectId = options?.walletConnectProjectId || REOWN_PROJECT_ID;
    console.log('🔗 WalletConnect enabled with Project ID:', connectOptions.walletConnectProjectId.substring(0, 8) + '...');
  }

  // Add additional options
  if (options?.forceWalletSelect !== undefined) {
    connectOptions.forceWalletSelect = options.forceWalletSelect;
  }
  if (options?.persistWalletSelect !== undefined) {
    connectOptions.persistWalletSelect = options.persistWalletSelect;
  }

  try {
    // Using showConnect for backwards compatibility (still recommended by @stacks/connect v8.x)
    showConnect(connectOptions);
  } catch (error) {
    console.error('Failed to show wallet connect modal:', error);
    throw new Error('Failed to initialize wallet connection. Please ensure you have a Stacks wallet installed.');
  }
};

/**
 * Connect with WalletConnect (Reown) explicitly
 * This shows the WalletConnect QR code for mobile wallets
 *
 * Supported wallets:
 * - Xverse Mobile
 * - Leather Mobile
 * - Any WalletConnect-compatible Stacks wallet
 */
export const connectViaReown = (options?: Omit<ConnectOptions, 'walletConnectProjectId'>) => {
  if (!REOWN_PROJECT_ID) {
    throw new Error(
      'Reown Project ID is not configured.\n' +
      'Please add NEXT_PUBLIC_REOWN_PROJECT_ID to your .env file.\n' +
      'Get your Project ID from: https://cloud.reown.com/'
    );
  }

  console.log('🔗 Connecting via Reown (WalletConnect)...');

  connectWallet({
    ...options,
    walletConnectProjectId: REOWN_PROJECT_ID,
    forceWalletSelect: true, // Always show wallet selection for WalletConnect
  });
};

export const disconnectWallet = async () => {
  if (userSession.isUserSignedIn()) {
    userSession.signUserOut();
  }
  window.location.reload();
};

export const isWalletConnected = (): boolean => {
  return userSession.isUserSignedIn();
};

export const getUserAddress = (): string | null => {
  if (!userSession.isUserSignedIn()) return null;
  const networkType = getNetworkType();
  const userData = userSession.loadUserData();
  return networkType === 'mainnet'
    ? userData.profile.stxAddress.mainnet
    : userData.profile.stxAddress.testnet;
};

// Contract Call Helper (v8 API with TransactionBuilder)
export const makeContractCallWithOptions = async (
  functionName: string,
  functionArgs: ClarityValue[],
  postConditions: any[] = []
) => {
  const network = getNetwork();
  const senderAddress = getUserAddress();

  if (!senderAddress) {
    throw new Error('Wallet not connected');
  }

  const userData = userSession.loadUserData();
  if (!userData.appPrivateKey) {
    throw new Error('Private key not available');
  }

  // Use TransactionBuilder for modern v8 API
  const builder = createTransactionBuilder();
  builder.setNetwork(network);
  builder.setAnchorMode(AnchorMode.Any);

  if (postConditions.length > 0) {
    builder.setPostConditions(postConditions);
  }

  try {
    return await withRetry(async () => {
      return builder.executeContractCall({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName,
        functionArgs,
        senderKey: userData.appPrivateKey,
      });
    });
  } catch (error) {
    const parsedError = ErrorParser.parseError(error);
    throw parsedError;
  }
};

// Read-only function calls
export const callReadOnlyContract = async (
  functionName: string,
  functionArgs: ClarityValue[] = []
): Promise<any> => {
  const network = getNetwork();
  const senderAddress = getUserAddress() || CONTRACT_ADDRESS;

  try {
    const result = await fetchCallReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName,
      functionArgs,
      senderAddress,
      network,
    });

    return cvToValue(result);
  } catch (error) {
    console.error(`Error calling ${functionName}:`, error);
    throw error;
  }
};

// User Management Functions
export const registerUser = async () => {
  return makeContractCallWithOptions('register-user', []);
};

export const getUserInfo = async (userAddress: string): Promise<User | null> => {
  try {
    const result = await callReadOnlyContract('get-user-info', [
      standardPrincipalCV(userAddress),
    ]);

    if (!result || !result.value) return null;

    return {
      principal: userAddress,
      joinedAt: Number(result.value['joined-at'].value),
      totalHoursGiven: Number(result.value['total-hours-given'].value),
      totalHoursReceived: Number(result.value['total-hours-received'].value),
      reputationScore: Number(result.value['reputation-score'].value),
      isActive: result.value['is-active'].value,
      timeBalance: 0, // Will be fetched separately
    };
  } catch (error) {
    console.error('Error fetching user info:', error);
    return null;
  }
};

export const getUserBalance = async (userAddress: string): Promise<number> => {
  try {
    const result = await callReadOnlyContract('get-user-balance', [
      standardPrincipalCV(userAddress),
    ]);
    return result.value ? Number(result.value) : 0;
  } catch (error) {
    console.error('Error fetching user balance:', error);
    return 0;
  }
};

// Skill Management Functions
export const registerSkill = async (skillName: string, category: string) => {
  return makeContractCallWithOptions('register-skill', [
    stringAsciiCV(skillName),
    stringAsciiCV(category),
  ]);
};

export const verifyUserSkill = async (userAddress: string, skillName: string) => {
  return makeContractCallWithOptions('verify-user-skill', [
    standardPrincipalCV(userAddress),
    stringAsciiCV(skillName),
  ]);
};

export const getSkillInfo = async (skillName: string): Promise<Skill | null> => {
  try {
    const result = await callReadOnlyContract('get-skill-info', [
      stringAsciiCV(skillName),
    ]);

    if (!result || !result.value) return null;

    return {
      name: skillName,
      category: result.value.category.value,
      minReputation: Number(result.value['min-reputation'].value),
      verificationRequired: result.value['verification-required'].value,
    };
  } catch (error) {
    console.error('Error fetching skill info:', error);
    return null;
  }
};

export const getUserSkillVerification = async (
  userAddress: string,
  skillName: string
): Promise<UserSkill | null> => {
  try {
    const result = await callReadOnlyContract('get-user-skill-verification', [
      standardPrincipalCV(userAddress),
      stringAsciiCV(skillName),
    ]);

    if (!result || !result.value) return null;

    return {
      skill: skillName,
      verified: result.value.verified.value,
      verifiedBy: result.value['verified-by'].value
        ? result.value['verified-by'].value.value
        : undefined,
      verifiedAt: result.value['verified-at'].value
        ? Number(result.value['verified-at'].value.value)
        : undefined,
      rating: Number(result.value.rating.value),
    };
  } catch (error) {
    console.error('Error fetching user skill verification:', error);
    return null;
  }
};

// Exchange Management Functions
export const createExchange = async (
  skill: string,
  hours: number,
  receiver: string
) => {
  return makeContractCallWithOptions('create-exchange', [
    stringAsciiCV(skill),
    uintCV(hours),
    standardPrincipalCV(receiver),
  ]);
};

export const acceptExchange = async (exchangeId: number) => {
  return makeContractCallWithOptions('accept-exchange', [uintCV(exchangeId)]);
};

export const completeExchange = async (exchangeId: number) => {
  return makeContractCallWithOptions('complete-exchange', [uintCV(exchangeId)]);
};

export const cancelExchange = async (exchangeId: number) => {
  return makeContractCallWithOptions('cancel-exchange', [uintCV(exchangeId)]);
};

export const getExchange = async (exchangeId: number): Promise<TimeExchange | null> => {
  try {
    const result = await callReadOnlyContract('get-exchange', [uintCV(exchangeId)]);

    if (!result || !result.value) return null;

    return {
      id: exchangeId,
      provider: result.value.provider.value,
      receiver: result.value.receiver.value,
      skill: result.value.skill.value,
      hours: Number(result.value.hours.value),
      status: result.value.status.value as 'pending' | 'active' | 'completed' | 'cancelled',
      createdAt: Number(result.value['created-at'].value),
      completedAt: result.value['completed-at'].value
        ? Number(result.value['completed-at'].value.value)
        : undefined,
    };
  } catch (error) {
    console.error('Error fetching exchange:', error);
    return null;
  }
};

// Utility Functions
export const canAffordService = async (
  userAddress: string,
  hours: number
): Promise<boolean> => {
  try {
    const result = await callReadOnlyContract('can-afford-service', [
      standardPrincipalCV(userAddress),
      uintCV(hours),
    ]);
    return result.value || false;
  } catch (error) {
    console.error('Error checking if user can afford service:', error);
    return false;
  }
};

export const getExchangeLimits = async () => {
  try {
    const result = await callReadOnlyContract('get-exchange-limits');
    return {
      minHours: Number(result.value['min-hours'].value),
      maxHours: Number(result.value['max-hours'].value),
      initialCredits: Number(result.value['initial-credits'].value),
    };
  } catch (error) {
    console.error('Error fetching exchange limits:', error);
    return {
      minHours: 1,
      maxHours: 8,
      initialCredits: 10,
    };
  }
};

// Transaction Status Helper (v8 API)
export const waitForTransaction = async (txId: string): Promise<boolean> => {
  const network = getNetwork();
  const apiUrl = network.coreApiUrl.replace('/v2', '');

  let attempts = 0;
  const maxAttempts = 20;

  while (attempts < maxAttempts) {
    try {
      const response = await fetch(`${apiUrl}/extended/v1/tx/${txId}`);
      const tx = await response.json();

      if (tx.tx_status === 'success') {
        return true;
      } else if (tx.tx_status === 'abort_by_post_condition' || tx.tx_status === 'abort_by_response') {
        return false;
      }

      await new Promise(resolve => setTimeout(resolve, 3000));
      attempts++;
    } catch (error) {
      console.error('Error checking transaction status:', error);
      attempts++;
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }

  return false;
};

// Format utilities
export const formatPrincipal = (principal: string): string => {
  if (!principal) return '';
  return `${principal.slice(0, 6)}...${principal.slice(-4)}`;
};

export const formatTimestamp = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleDateString();
};

export const formatHours = (hours: number): string => {
  if (hours === 1) return '1 hour';
  return `${hours} hours`;
};
