import { TwirpFetchTransport } from "@protobuf-ts/twirp-transport";
import { APIClient } from "@naonaoonline/apitscode/src/reaction/api.client";
import { RPCEndpoint, RPCSendJSON } from "@/modules/config/config";

const API = new APIClient(new TwirpFetchTransport({
  baseUrl: RPCEndpoint,
  sendJson: RPCSendJSON,
}));

export default API;
