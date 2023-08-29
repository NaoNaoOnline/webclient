import API from '@/modules/api/vote/API';
import { VoteDeleteRequest } from '@/modules/api/vote/delete/Request';
import { VoteDeleteResponse } from '@/modules/api/vote/delete/Response';

export async function VoteDelete(req: VoteDeleteRequest[]): Promise<VoteDeleteResponse[]> {
  try {
    const cal = await API.delete(
      {
        object: req.map((x) => ({
          intern: {
            vote: x.vote,
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

    return cal.response.object.map((x) => ({
      // intern
      stts: x.intern?.stts || "",
    }));
  } catch (err) {
    return Promise.reject(err);
  }
}
