export const AlchemyAPIKey: string = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || ""
export const BlockchainNetworks: string = process.env.NEXT_PUBLIC_BLOCKCHAIN_NETWORKS || "hardhat"
export const PolicyContract: string = process.env.NEXT_PUBLIC_POLICY_CONTRACT || ""
export const RPCEndpoint: string = process.env.NEXT_PUBLIC_WEBCLIENT_RPC_ENDPOINT || "http://127.0.0.1:7777"
export const RPCSendJSON: boolean = (String(process.env.NEXT_PUBLIC_WEBCLIENT_RPC_SENDJSON).toLowerCase() === "true") || true
export const SubscriptionContract: string = process.env.NEXT_PUBLIC_SUBSCRIPTION_CONTRACT || ""
export const WalletConnectProjectID: string = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || ""
