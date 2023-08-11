import API from '@/modules/api/event/API';
import { EventCreateRequest } from '@/modules/api/event/create/Request';

interface Response {
  crtd: string;
  evnt: string;
}

export async function EventCreate(req: EventCreateRequest): Promise<Response> {
  try {
    const call = API.create(
      {
        object: [
          {
            intern: {},
            public: {
              cate: req.cate,
              dura: req.dura,
              host: req.host,
              link: req.link,
              time: req.time,
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
      crtd: res.object[0].intern?.crtd || "",
      evnt: res.object[0].intern?.evnt || "",
    };
  } catch (error) {
    throw error;
  }
}
