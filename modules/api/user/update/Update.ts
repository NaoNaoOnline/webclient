import API from "@/modules/api/user/API";
import { UserUpdateRequest } from "@/modules/api/user/update/Request";
import { UserUpdateResponse } from "@/modules/api/user/update/Response";

export async function UserUpdate(req: UserUpdateRequest[]): Promise<UserUpdateResponse[]> {
  try {
    const cal = await API.update(
      {
        object: req.map((x) => ({
          intern: {
            user: x.user,
          },
          update: (x.home || x.name ? [{ ope: "replace", pat: newPat(x), val: newVal(x) }] : []),
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

const newPat = (req: UserUpdateRequest): string => {
  if (req.home) return "/home";
  if (req.name) return "/name";
  return "";
};

const newVal = (req: UserUpdateRequest): string => {
  if (req.home) return req.home;
  if (req.name) return req.name;
  return "";
};
