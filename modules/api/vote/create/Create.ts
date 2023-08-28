import API from '@/modules/api/vote/API';
import { VoteCreateRequest } from '@/modules/api/vote/create/Request';
import { VoteCreateResponse } from '@/modules/api/vote/create/Response';

export async function VoteCreate(req: VoteCreateRequest[]): Promise<VoteCreateResponse[]> {
  try {
    const call = API.create(
      {
        object: req.map((r) => ({
          intern: {},
          public: {
            desc: r.desc || "",
            rctn: r.rctn || "",
          },
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
      vote: x.intern?.vote || "",
    }));
  } catch (error) {
    throw error;
  }
}
