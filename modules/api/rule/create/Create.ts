import API from "@/modules/api/rule/API";
import { RuleCreateRequest } from "@/modules/api/rule/create/Request";
import { RuleCreateResponse } from "@/modules/api/rule/create/Response";

export async function RuleCreate(req: RuleCreateRequest[]): Promise<RuleCreateResponse[]> {
  try {
    const cal = await API.create(
      {
        object: req.map((x) => ({
          intern: {},
          public: {
            excl: x.excl,
            incl: x.incl,
            kind: x.kind,
            list: x.list,
          },
        })),
      },
      {
        meta: {
          authorization: req[0].atkn ? "Bearer " + req[0].atkn : "",
        },
      },
    );

    return cal.response.object.map((x) => ({
      // intern
      crtd: x.intern?.crtd || "",
      rule: x.intern?.rule || "",
    }));
  } catch (err) {
    return Promise.reject(err);
  }
}
