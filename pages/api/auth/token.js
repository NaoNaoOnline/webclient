import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';

// This is a NextJs server endpoint for /api/auth/token extracting a user's
// session based short lived OAuth access token. The Token Module
// modules/auth/Token provides the access token for gRPC calls. Only
// authenticated users can extract their own access tokens. 
//
//     $ curl http://localhost:3000/api/auth/token
//     {"error":"not_authenticated","description":"The user does not have an active session or is not authenticated"}
//
export default withApiAuthRequired(async function token(req, res) {
  const { accessToken } = await getAccessToken(req, res);
  res.status(200).json(accessToken);
});
