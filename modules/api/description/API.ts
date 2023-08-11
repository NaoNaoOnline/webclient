import { TwirpFetchTransport } from "@protobuf-ts/twirp-transport";
import { APIClient } from '@naonaoonline/apitscode/src/description/api.client';
import { RPCEndpoint } from "@/modules/config/config";

const API = new APIClient(new TwirpFetchTransport({
  baseUrl: RPCEndpoint,
}));

export default API;
