export const RPCEndpoint: string = process.env.WEBCLIENT_RPC_ENDPOINT || "http://127.0.0.1:7777"
export const RPCSendJSON: boolean = (String(process.env.WEBCLIENT_RPC_SENDJSON).toLowerCase() === 'true') || true
