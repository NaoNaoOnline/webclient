import API from '@/modules/api/user/API';
import { UserCreateRequest } from '@/modules/api/user/create/Request';

interface Response {
  crtd: string;
  user: string;
}

export async function UserCreate(request: UserCreateRequest): Promise<Response> {
  try {
    const call = API.create(
      {
        object: [
          {
            intern: {},
            public: {
              imag: request.imag,
              name: request.name,
            },
          },
        ],
      },
      {
        meta: {
          // Creating a user is bound to the currently implemented OAuth login
          // flow. At the point of the internal user object creation the call
          // here is made from the NodeJs server within an Auth0 callback.
          // Therefore no react hook can be used and no session state is
          // available via the modules/auth/Token module. That is why the access
          // token must be given explicitly here with the UserCreateRequest.
          authorization: "Bearer " + request.atkn,
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
