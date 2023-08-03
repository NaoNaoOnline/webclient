import API from '@/modules/api/user/API';
import Token from '@/modules/auth/Token';

interface Response {
  crtd: string;
  user: string;
}

export async function UserSearch(): Promise<Response> {
  try {
    const call = API.search(
      {
        object: [
          {
            intern: {
              user: "", // search for the current user with empty ID
            },
            public: {},
          },
        ],
      },
      {
        meta: {
          authorization: "Bearer " + Token(),
        },
      },
    );

    const sta = await call.status;

    if (sta.code !== "OK") throw "call status was not ok";

    const res = await call.response;

    return {
      crtd: res.object[0].intern?.crtd || "",
      user: res.object[0].intern?.user || "",
    };
  } catch (error) {
    throw error;
  }
}
