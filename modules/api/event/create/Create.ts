import API from '@/modules/api/event/API';
import { EventCreateRequest } from '@/modules/api/event/create/Request';
import Token from '@/modules/auth/Token';

interface Response {
  crtd: string;
  evnt: string;
}

export async function EventCreate(request: EventCreateRequest): Promise<Response> {
  try {
    const call = API.create(
      {
        object: [
          {
            intern: {},
            public: {
              dura: request.dura,
              host: request.host,
              labl: request.labl,
              link: request.link,
              time: request.time,
              user: request.user,
            },
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
      evnt: res.object[0].intern?.evnt || "",
    };
  } catch (error) {
    throw error;
  }
}
