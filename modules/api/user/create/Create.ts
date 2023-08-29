import API from '@/modules/api/user/API';
import { UserCreateRequest } from '@/modules/api/user/create/Request';
import { UserCreateResponse } from '@/modules/api/user/create/Response';

export async function UserCreate(req: UserCreateRequest[]): Promise<UserCreateResponse[]> {
  try {
    const cal = await API.create(
      {
        object: req.map((x) => ({
          intern: {},
          public: {
            imag: x.imag,
            name: x.name,
          },
        })),
      },
      {
        meta: {
          authorization: "Bearer " + req[0].atkn,
        },
      },
    );

    return cal.response.object.map((x) => ({
      // intern
      crtd: x.intern?.crtd || "",
      user: x.intern?.user || "",
    }));
  } catch (err) {
    return Promise.reject(err);
  }
}
