export interface SavedWallet {
  id: string;
  name: string;
  privateKey: string;
  address: string;
  addedAt: number;
}

export interface EthereumTransaction {
  hash: string;
  from: string;
  to: string;
  value: string; // in ETH
  timestamp?: number;
  blockNumber?: number;
  isError?: boolean;
}

export interface TokenBalance {
  symbol: string;
  name: string;
  balance: string;
  contractAddress?: string;
  decimals: number;
}

export interface NetworkConfig {
  id: string;
  name: string;
  rpcUrl: string;
  chainId: number;
  explorerUrl: string;
  currencySymbol: string;
}

export const NETWORKS: NetworkConfig[] = [
  {
    id: "mainnet",
    name: "Ethereum Mainnet",
    rpcUrl: "https://eth.llamarpc.com",
    chainId: 1,
    explorerUrl: "https://etherscan.io",
    currencySymbol: "ETH",
  },
  {
    id: "sepolia",
    name: "Sepolia Testnet",
    rpcUrl: "https://rpc.sepolia.org",
    chainId: 11155111,
    explorerUrl: "https://sepolia.etherscan.io",
    currencySymbol: "ETH",
  },
  {
    id: "arbitrum",
    name: "Arbitrum One",
    rpcUrl: "https://arb1.arbitrum.io/rpc",
    chainId: 42161,
    explorerUrl: "https://arbiscan.io",
    currencySymbol: "ETH",
  },
  {
    id: "polygon",
    name: "Polygon PoS",
    rpcUrl: "https://polygon-rpc.com",
    chainId: 137,
    explorerUrl: "https://polygonscan.com",
    currencySymbol: "POL",
  },
];
