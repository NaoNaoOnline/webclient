import API from '@/modules/api/reaction/API';
import { ReactionSearchRequest } from '@/modules/api/reaction/search/Request';
import { ReactionSearchResponse } from '@/modules/api/reaction/search/Response';

export async function ReactionSearch(req: ReactionSearchRequest[]): Promise<ReactionSearchResponse[]> {
  try {
    const cal = await API.search(
      {
        object: [],
      },
    );

    return cal.response.object.map((x) => ({
      // local
      amnt: 0,
      clck: false,
      // intern
      rctn: x.intern?.rctn || "",
      // public
      html: x.public?.html || "",
      name: x.public?.name || "",
    }));
  } catch (err) {
    return Promise.reject(err);
  }
}
