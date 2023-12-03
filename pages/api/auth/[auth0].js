import { handleAuth, handleLogin, handleCallback } from "@auth0/nextjs-auth0";
import { UserCreate } from "@/modules/api/user/create/Create";

const getLoginState = (req, loginOptions) => {
  return {
    returnTo: req.headers.referer
  };
};

const afterCallback = async (req, res, session, state) => {
  const atkn = session.accessToken;
  const imag = session.user.picture;
  const name = session.user.nickname || session.user.given_name || session.user.name;

  try {
    const [uob] = await UserCreate([{ atkn: atkn, imag: imag, name: name }])

    session.user.intern = {
      uuid: uob.user,
    }

    session.user.public = {
      name: name,
    }

    return session;
  } catch (err) {
    res.status(err.status || 500).end(err.message);
  }
};

export default handleAuth({
  async login(req, res) {
    try {
      await handleLogin(req, res, { getLoginState });
    } catch (err) {
      res.status(err.status || 500).end(err.message);
    }
  },
  async callback(req, res) {
    try {
      await handleCallback(req, res, { afterCallback });
    } catch (err) {
      res.status(err.status || 500).end(err.message);
    }
  },
});
