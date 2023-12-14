import { SubscriptionSearchResponse } from "@/modules/api/subscription/search/Response";
import { ExistsSubs } from "@/modules/subscription/ExistsSubs";

describe("Modules/subscription/ExistsSubs", () => {
  const testData: {
    sub: SubscriptionSearchResponse[],
    sta: string;
    uni?: number;
    exi: boolean;
  }[] = [
      {
        sub: [
          tesSub("success", 100),
        ],
        sta: "success",
        exi: true,
      },
      {
        sub: [
          tesSub("success", 100),
        ],
        sta: "success",
        uni: 100,
        exi: true,
      },
      {
        sub: [
          tesSub("success", 100),
          tesSub("success", 200),
          tesSub("success", 300),
        ],
        sta: "success",
        exi: true,
      },
      {
        sub: [
          tesSub("success", 100),
          tesSub("success", 200),
          tesSub("success", 300),
        ],
        sta: "success",
        uni: 200,
        exi: true,
      },
      {
        sub: [
          tesSub("created", 100),
        ],
        sta: "success",
        exi: false,
      },
      {
        sub: [
          tesSub("created", 100),
        ],
        sta: "success",
        uni: 100,
        exi: false,
      },
      {
        sub: [
          tesSub("created", 100),
        ],
        sta: "created",
        uni: 200,
        exi: false,
      },
      {
        sub: [
          tesSub("success", 100),
        ],
        sta: "created",
        uni: 200,
        exi: false,
      },
      {
        sub: [
          tesSub("success", 100),
          tesSub("success", 200),
          tesSub("success", 300),
        ],
        sta: "created",
        exi: false,
      },
      {
        sub: [
          tesSub("success", 100),
          tesSub("success", 200),
          tesSub("success", 300),
        ],
        sta: "created",
        uni: 400,
        exi: false,
      },
    ];

  for (let i = 0; i < testData.length; i++) {
    it(`${i}`, () => {
      const c = testData[i];
      expect(ExistsSubs(c.sub, c.sta, c.uni)).toBe(c.exi);
    });
  }
});

function tesSub(sta: string, uni: number): SubscriptionSearchResponse {
  return {
    // intern
    crtd: "",
    fail: "",
    stts: sta,
    subs: "",
    user: "",
    // public
    crtr: "",
    payr: "",
    rcvr: "",
    unix: String(uni),
  };
};
