import API from "@/modules/api/list/API";
import { ListUpdateRequest } from "@/modules/api/list/update/Request";
import { ListUpdateResponse } from "@/modules/api/list/update/Response";

export async function ListUpdate(req: ListUpdateRequest[]): Promise<ListUpdateResponse[]> {
  try {
    const cal = await API.update(
      {
        object: req.map((x) => ({
          intern: {
            list: x.list,
          },
          update: (x.desc || x.feed ? [{ frm: "", ope: "replace", pat: newPat(x), val: newVal(x) }] : []),
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
      stts: x.intern?.stts || "",
    }));
  } catch (err) {
    return Promise.reject(err);
  }
}

const newPat = (req: ListUpdateRequest): string => {
  if (req.desc) return "/desc/data";
  if (req.feed) return "/feed/data";
  return "";
};

const newVal = (req: ListUpdateRequest): string => {
  if (req.desc) return req.desc;
  if (req.feed) return req.feed;
  return "";
};
