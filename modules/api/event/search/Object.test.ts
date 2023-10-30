import EventSearchObject from "@/modules/api/event/search/Object";
import spacetime, { Spacetime } from "spacetime";

describe("DateObject", () => {
  describe("display", () => {
    const obj: EventSearchObject = new EventSearchObject({
      // extern
      extern: [],
      // intern
      crtd: uni("2023-09-11T00:00:00.000Z"),
      evnt: "0",
      user: "0",
      // public
      cate: "0,1,2",
      dura: "3600",
      host: "0",
      link: "https://google.com",
      time: uni("2023-09-11T16:00:00.000Z"),
    })

    describe("one month before", () => {
      const now: Spacetime = spacetime("2023-08-16T08:00:00.000Z");

      test("dsplLink => in the future", () => {
        expect(obj.dsplLink(now)).toBe("in the future");
      });
    });

    describe("five days before", () => {
      const now: Spacetime = spacetime("2023-09-06T12:00:00.000Z");

      test("dsplLink => in the next days", () => {
        expect(obj.dsplLink(now)).toBe("in the next days");
      });
    });

    describe("two days before", () => {
      const now: Spacetime = spacetime("2023-09-09T17:00:00.000Z");

      test("dsplLink => in the next days", () => {
        expect(obj.dsplLink(now)).toBe("in the next days");
      });
    });

    describe("one day before", () => {
      const now: Spacetime = spacetime("2023-09-10T22:00:00.000Z");

      test("dsplLink => tomorrow", () => {
        expect(obj.dsplLink(now)).toBe("tomorrow");
      });
    });

    describe("ten hours before", () => {
      const now: Spacetime = spacetime("2023-09-11T06:00:00.000Z");

      test("dsplLink => later today", () => {
        expect(obj.dsplLink(now)).toBe("later today");
      });
    });

    describe("two hours before", () => {
      const now: Spacetime = spacetime("2023-09-11T14:00:00.000Z");

      test("dsplLink => later today", () => {
        expect(obj.dsplLink(now)).toBe("later today");
      });
    });

    describe("one hour before", () => {
      const now: Spacetime = spacetime("2023-09-11T15:00:00.000Z");

      test("dsplLink => coming up next", () => {
        expect(obj.dsplLink(now)).toBe("coming up next");
      });

      test("dsplUpcm => in 60m", () => {
        expect(obj.dsplUpcm(now)).toBe("in 60m");
      });
    });

    describe("half an hour before", () => {
      const now: Spacetime = spacetime("2023-09-11T15:30:00.000Z");

      test("dsplLink => coming up next", () => {
        expect(obj.dsplLink(now)).toBe("coming up next");
      });

      test("dsplUpcm => in 30m", () => {
        expect(obj.dsplUpcm(now)).toBe("in 30m");
      });
    });

    describe("105 seconds before", () => {
      const now: Spacetime = spacetime("2023-09-11T15:58:15.000Z");

      test("dsplLink => coming up next", () => {
        expect(obj.dsplLink(now)).toBe("coming up next");
      });

      test("dsplUpcm => in 2m", () => {
        expect(obj.dsplUpcm(now)).toBe("in 2m");
      });
    });

    describe("90 seconds before", () => {
      const now: Spacetime = spacetime("2023-09-11T15:58:30.000Z");

      test("dsplLink => coming up next", () => {
        expect(obj.dsplLink(now)).toBe("coming up next");
      });

      test("dsplUpcm => in 2m", () => {
        expect(obj.dsplUpcm(now)).toBe("in 2m");
      });
    });

    describe("75 seconds before", () => {
      const now: Spacetime = spacetime("2023-09-11T15:58:45.000Z");

      test("dsplLink => coming up next", () => {
        expect(obj.dsplLink(now)).toBe("coming up next");
      });

      test("dsplUpcm => in 2m", () => {
        expect(obj.dsplUpcm(now)).toBe("in 2m");
      });
    });

    describe("one second before", () => {
      const now: Spacetime = spacetime("2023-09-11T15:59:59.000Z");

      test("dsplLink => coming up next", () => {
        expect(obj.dsplLink(now)).toBe("coming up next");
      });

      test("dsplUpcm => in 1m", () => {
        expect(obj.dsplUpcm(now)).toBe("in 1m");
      });
    });

    describe("at event start time", () => {
      const now: Spacetime = spacetime("2023-09-11T16:00:00.000Z");

      test("dsplLink => join now now", () => {
        expect(obj.dsplLink(now)).toBe("join now now");
      });

      test("dsplActv => 0m ago - 60m left", () => {
        expect(obj.dsplActv(now)).toBe("0m ago - 60m left");
      });
    });

    describe("half way through", () => {
      const now: Spacetime = spacetime("2023-09-11T16:30:00.000Z");

      test("dsplLink => join now now", () => {
        expect(obj.dsplLink(now)).toBe("join now now");
      });

      test("dsplActv => 30m ago - 30m left", () => {
        expect(obj.dsplActv(now)).toBe("30m ago - 30m left");
      });
    });

    describe("105 seconds before the end", () => {
      const now: Spacetime = spacetime("2023-09-11T16:58:15.000Z");

      test("dsplLink => join now now", () => {
        expect(obj.dsplLink(now)).toBe("join now now");
      });

      test("dsplActv => 58m ago - 2m left", () => {
        expect(obj.dsplActv(now)).toBe("58m ago - 2m left");
      });
    });

    describe("90 seconds before the end", () => {
      const now: Spacetime = spacetime("2023-09-11T16:58:30.000Z");

      test("dsplLink => join now now", () => {
        expect(obj.dsplLink(now)).toBe("join now now");
      });

      test("dsplActv => 58m ago - 2m left", () => {
        expect(obj.dsplActv(now)).toBe("58m ago - 2m left");
      });
    });

    describe("75 seconds before the end", () => {
      const now: Spacetime = spacetime("2023-09-11T16:58:45.000Z");

      test("dsplLink => join now now", () => {
        expect(obj.dsplLink(now)).toBe("join now now");
      });

      test("dsplActv => 58m ago - 2m left", () => {
        expect(obj.dsplActv(now)).toBe("58m ago - 2m left");
      });
    });

    describe("right at the end", () => {
      const now: Spacetime = spacetime("2023-09-11T17:00:00.000Z");

      test("dsplLink => already happened", () => {
        expect(obj.dsplLink(now)).toBe("already happened");
      });
    });

    describe("an hour later", () => {
      const now: Spacetime = spacetime("2023-09-11T18:00:00.000Z");

      test("dsplLink => already happened", () => {
        expect(obj.dsplLink(now)).toBe("already happened");
      });
    });

    describe("an day later", () => {
      const now: Spacetime = spacetime("2023-09-12T11:00:00.000Z");

      test("dsplLink => already happened", () => {
        expect(obj.dsplLink(now)).toBe("already happened");
      });
    });
  });

  describe("time", () => {
    const obj: EventSearchObject = new EventSearchObject({
      // extern
      extern: [],
      // intern
      crtd: uni("2023-09-11T00:00:00.000Z"),
      evnt: "0",
      user: "0",
      // public
      cate: "0,1,2",
      dura: "3600",
      host: "0",
      link: "https://google.com",
      time: uni("2023-09-11T16:00:00.000Z"),
    })

    describe("two hours before", () => {
      const now: Spacetime = spacetime("2023-09-11T14:00:00.000Z");

      test("actv => false", () => {
        expect(obj.actv(now)).toBe(false);
      });

      test("hpnd => false", () => {
        expect(obj.hpnd(now)).toBe(false);
      });

      test("upcm => false", () => {
        expect(obj.upcm(now)).toBe(false);
      });
    });

    describe("one hour before", () => {
      const now: Spacetime = spacetime("2023-09-11T15:00:00.000Z");

      test("actv => false", () => {
        expect(obj.actv(now)).toBe(false);
      });

      test("hpnd => false", () => {
        expect(obj.hpnd(now)).toBe(false);
      });

      test("upcm => true", () => {
        expect(obj.upcm(now)).toBe(true);
      });
    });

    describe("one second before", () => {
      const now: Spacetime = spacetime("2023-09-11T15:59:59.000Z");

      test("actv => false", () => {
        expect(obj.actv(now)).toBe(false);
      });

      test("hpnd => false", () => {
        expect(obj.hpnd(now)).toBe(false);
      });

      test("upcm => true", () => {
        expect(obj.upcm(now)).toBe(true);
      });
    });

    describe("at event start time", () => {
      const now: Spacetime = spacetime("2023-09-11T16:00:00.000Z");

      test("actv => true", () => {
        expect(obj.actv(now)).toBe(true);
      });

      test("hpnd => false", () => {
        expect(obj.hpnd(now)).toBe(false);
      });

      test("upcm => false", () => {
        expect(obj.upcm(now)).toBe(false);
      });
    });

    describe("half way through", () => {
      const now: Spacetime = spacetime("2023-09-11T16:30:00.000Z");

      test("actv => true", () => {
        expect(obj.actv(now)).toBe(true);
      });

      test("hpnd => false", () => {
        expect(obj.hpnd(now)).toBe(false);
      });

      test("upcm => false", () => {
        expect(obj.upcm(now)).toBe(false);
      });
    });

    describe("right at the end", () => {
      const now: Spacetime = spacetime("2023-09-11T17:00:00.000Z");

      test("actv => false", () => {
        expect(obj.actv(now)).toBe(false);
      });

      test("hpnd => true", () => {
        expect(obj.hpnd(now)).toBe(true);
      });

      test("upcm => false", () => {
        expect(obj.upcm(now)).toBe(false);
      });
    });

    describe("an hour later", () => {
      const now: Spacetime = spacetime("2023-09-11T18:00:00.000Z");

      test("actv => false", () => {
        expect(obj.actv(now)).toBe(false);
      });

      test("hpnd => true", () => {
        expect(obj.hpnd(now)).toBe(true);
      });

      test("upcm => false", () => {
        expect(obj.upcm(now)).toBe(false);
      });
    });
  });
});

function uni(iso: string): string {
  return (spacetime(iso).epoch / 1000).toString();
}
