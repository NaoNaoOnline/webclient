import API from "@/modules/api/user/API";
import { UserSearchRequest } from "@/modules/api/user/search/Request";
import { UserSearchResponse } from "@/modules/api/user/search/Response";

export async function UserSearch(req: UserSearchRequest[]): Promise<UserSearchResponse[]> {
  try {
    const cal = await API.search(
      {
        object: req.map((x) => {
          if (x.user) return { intern: { user: x.user } }
          if (x.name) return { public: { name: x.name } }
          if (x.self) return { symbol: { user: "self" } }
          return {};
        }),
      },
    );

    return cal.response.object.map((x) => ({
      // intern
      crtd: x.intern?.crtd || "",
      prem: x.intern?.prem || "",
      user: x.intern?.user || "",
      // public
      home: x.public?.home || "",
      imag: x.public?.imag || "",
      name: x.public?.name || "",
    }));
  } catch (err) {
    return Promise.reject(err);
  }
}
