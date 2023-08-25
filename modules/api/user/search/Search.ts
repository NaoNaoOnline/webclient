import API from '@/modules/api/user/API';
import { UserSearchRequest } from '@/modules/api/user/search/Request';
import { UserSearchResponse } from '@/modules/api/user/search/Response';

export async function UserSearch(req: UserSearchRequest[]): Promise<UserSearchResponse[]> {
  try {
    const call = API.search(
      {
        object: req.map((r) => ({
          intern: {
            user: r.user,
          },
          public: {},
        })),
      },
      {
        meta: {
          authorization: "Bearer " + req[0].atkn,
        },
      },
    );

    const sta = await call.status;

    if (sta.code !== "OK") throw "call status was not ok";

    const res = await call.response;

    return res.object.map((x) => ({
      // intern
      crtd: x.intern?.crtd || "",
      user: x.intern?.user || "",
      // public
      imag: x.public?.imag || "",
      name: x.public?.name || "",
    }));
  } catch (error) {
    throw error;
  }
}
