import API from '@/modules/api/vote/API';
import { VoteSearchRequest } from '@/modules/api/vote/search/Request';
import { VoteSearchResponse } from '@/modules/api/vote/search/Response';

export async function VoteSearch(req: VoteSearchRequest[]): Promise<VoteSearchResponse[]> {
  try {
    const cal = await API.search(
      {
        object: req.map((x) => {
          if (x.desc) return { public: { desc: x.desc, } }
          return {};
        }),
      },
    );

    return cal.response.object.map((x) => ({
      // intern
      crtd: x.intern?.crtd || "",
      user: x.intern?.user || "",
      vote: x.intern?.vote || "",
      // public
      desc: x.public?.desc || "",
      rctn: x.public?.rctn || "",
    }));
  } catch (err) {
    return Promise.reject(err);
  }
}
