import API from '@/modules/api/vote/API';
import { VoteDeleteRequest } from '@/modules/api/vote/delete/Request';
import { VoteDeleteResponse } from '@/modules/api/vote/delete/Response';

export async function VoteDelete(req: VoteDeleteRequest[]): Promise<VoteDeleteResponse[]> {
  try {
    const call = API.delete(
      {
        object: req.map((x) => ({
          intern: {
            vote: x.vote || "",
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
      stts: x.intern?.stts || "",
    }));
  } catch (error) {
    throw error;
  }
}
