import API from '@/modules/api/user/API';
import { UserSearchRequest } from '@/modules/api/user/search/Request';
import { UserSearchResponse } from '@/modules/api/user/search/Response';

export async function UserSearch(req: UserSearchRequest[]): Promise<UserSearchResponse[]> {
  try {
    const call = await API.search(
      {
        object: req.map((x) => ({
          intern: {
            user: x.user,
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

    return call.response.object.map((x) => ({
      // intern
      crtd: x.intern?.crtd || "",
      user: x.intern?.user || "",
      // public
      imag: x.public?.imag || "",
      name: x.public?.name || "",
    }));
  } catch (err) {
    return Promise.reject(err);
  }
}
