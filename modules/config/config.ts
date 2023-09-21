export const RPCEndpoint: string = process.env.WEBCLIENT_RPC_ENDPOINT || "http://127.0.0.1:7777"
export const RPCSendJSON: boolean = (String(process.env.WEBCLIENT_RPC_SENDJSON).toLowerCase() === 'true') || true

export const AlchemyAPIKey: string = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || ""
export const WalletConnectProjectID: string = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || ""
