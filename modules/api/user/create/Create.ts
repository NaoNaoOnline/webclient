import API from '@/modules/api/user/API';
import { UserCreateRequest } from '@/modules/api/user/create/Request';
import { UserCreateResponse } from '@/modules/api/user/create/Response';

export async function UserCreate(req: UserCreateRequest): Promise<UserCreateResponse> {
  try {
    const call = API.create(
      {
        object: [
          {
            intern: {},
            public: {
              imag: req.imag,
              name: req.name,
            },
          },
        ],
      },
      {
        meta: {
          authorization: "Bearer " + req.atkn,
        },
      },
    );

    const sta = await call.status;

    if (sta.code !== "OK") throw "call status was not ok";

    const res = await call.response;

    return {
      // intern
      crtd: res.object[0].intern?.crtd || "",
      user: res.object[0].intern?.user || "",
    };
  } catch (error) {
    throw error;
  }
}
