import API from '@/modules/api/vote/API';
import { VoteCreateRequest } from '@/modules/api/vote/create/Request';
import { VoteCreateResponse } from '@/modules/api/vote/create/Response';

export async function VoteCreate(req: VoteCreateRequest[]): Promise<VoteCreateResponse[]> {
  try {
    const cal = await API.create(
      {
        object: req.map((x) => ({
          intern: {},
          public: {
            desc: x.desc,
            rctn: x.rctn,
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
      vote: x.intern?.vote || "",
    }));
  } catch (err) {
    return Promise.reject(err);
  }
}
