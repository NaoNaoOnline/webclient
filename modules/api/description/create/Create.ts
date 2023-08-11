import API from '@/modules/api/description/API';
import { DescriptionCreateRequest } from '@/modules/api/description/create/Request';

interface Response {
  crtd: string;
  desc: string;
}

export async function DescriptionCreate(req: DescriptionCreateRequest): Promise<Response> {
  try {
    const call = API.create(
      {
        object: [
          {
            intern: {},
            public: {
              evnt: req.evnt,
              text: req.text,
              vote: "",
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
      desc: res.object[0].intern?.desc || "",
    };
  } catch (error) {
    throw error;
  }
}
