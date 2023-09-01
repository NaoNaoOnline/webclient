import API from '@/modules/api/label/API';
import { LabelSearchRequest } from '@/modules/api/label/search/Request';
import { LabelSearchResponse } from '@/modules/api/label/search/Response';

export async function LabelSearch(req: LabelSearchRequest[]): Promise<LabelSearchResponse[]> {
  try {
    const call = await API.search(
      {
        object: req.map((x) => ({
          intern: {
            labl: x.labl,
          },
          public: {
            kind: x.kind,
          },
        })),
      },
    );

    return call.response.object.map((x) => ({
      // intern
      labl: x.intern?.labl || "",
      // public
      name: x.public?.name || "",
    }));
  } catch (err) {
    return Promise.reject(err);
  }
}
