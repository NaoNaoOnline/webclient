import DateObject from "@/modules/date/Object";
import spacetime, { Spacetime } from "spacetime";

describe("DateObject", () => {
  describe("new", () => {
    describe("staying in same day", () => {
      describe("initializing constructor", () => {
        const obj: DateObject = new DateObject(spacetime("2023-09-08T12:28:00.000Z"));
        const sta: Spacetime[] = obj.lisSta();
        const end: Spacetime[] = obj.lisEnd();

        test("first item", () => {
          expect(obj.dspSta(sta[0])).toStrictEqual(["12:30", "(00:00)"]);
          expect(obj.dspEnd(end[0])).toStrictEqual(["12:45", "(00:15)"]);
        });

        test("last item", () => {
          expect(obj.dspSta(sta[sta.length - 1])).toStrictEqual(["23:45", "(11:15)"]);
          expect(obj.dspEnd(end[end.length - 1])).toStrictEqual(["16:30", "(04:00)"]);
        });

        test("getDay", () => {
          expect(obj.getDay().min.format("iso")).toBe("2023-09-08T12:30:00.000Z");
          expect(obj.getDay().tim.format("iso")).toBe("2023-09-08T12:30:00.000Z");
          expect(obj.getDay().max.format("iso")).toBe("2023-10-08T12:30:00.000Z");
        });

        test("getSta", () => {
          expect(obj.getSta().min.format("iso")).toBe("2023-09-08T12:30:00.000Z");
          expect(obj.getSta().tim.format("iso")).toBe("2023-09-08T12:30:00.000Z");
          expect(obj.getSta().max.format("iso")).toBe("2023-09-08T23:59:59.999Z");
        });

        test("getEnd", () => {
          expect(obj.getEnd().min.format("iso")).toBe("2023-09-08T12:45:00.000Z");
          expect(obj.getEnd().tim.format("iso")).toBe("2023-09-08T13:30:00.000Z");
          expect(obj.getEnd().max.format("iso")).toBe("2023-09-08T16:30:00.000Z");
        });
      });

      describe("updating at new interval", () => {
        let obj: DateObject = new DateObject(spacetime("2023-09-08T12:28:00.000Z"));

        obj.setTim(spacetime("2023-09-08T12:33:00.000Z")); // next interval 5m later

        const sta: Spacetime[] = obj.lisSta();
        const end: Spacetime[] = obj.lisEnd();

        test("first item", () => {
          expect(obj.dspSta(sta[0])).toStrictEqual(["12:45", "(00:00)"]);
          expect(obj.dspEnd(end[0])).toStrictEqual(["13:00", "(00:15)"]);
        });

        test("last item", () => {
          expect(obj.dspSta(sta[sta.length - 1])).toStrictEqual(["23:45", "(11:00)"]);
          expect(obj.dspEnd(end[end.length - 1])).toStrictEqual(["16:45", "(04:00)"]);
        });

        test("getDay", () => {
          expect(obj.getDay().min.format("iso")).toBe("2023-09-08T12:45:00.000Z");
          expect(obj.getDay().tim.format("iso")).toBe("2023-09-08T12:45:00.000Z");
          expect(obj.getDay().max.format("iso")).toBe("2023-10-08T12:45:00.000Z");
        });

        test("getSta", () => {
          expect(obj.getSta().min.format("iso")).toBe("2023-09-08T12:45:00.000Z");
          expect(obj.getSta().tim.format("iso")).toBe("2023-09-08T12:45:00.000Z");
          expect(obj.getSta().max.format("iso")).toBe("2023-09-08T23:59:59.999Z");
        });

        test("getEnd", () => {
          expect(obj.getEnd().min.format("iso")).toBe("2023-09-08T13:00:00.000Z");
          expect(obj.getEnd().tim.format("iso")).toBe("2023-09-08T13:45:00.000Z");
          expect(obj.getEnd().max.format("iso")).toBe("2023-09-08T16:45:00.000Z");
        });
      });
    });

    describe("start at interval minute", () => {
      describe("initializing constructor", () => {
        const obj: DateObject = new DateObject(spacetime("2023-09-08T12:30:00.000Z"));
        const sta: Spacetime[] = obj.lisSta();
        const end: Spacetime[] = obj.lisEnd();

        test("first item", () => {
          expect(obj.dspSta(sta[0])).toStrictEqual(["12:45", "(00:00)"]);
          expect(obj.dspEnd(end[0])).toStrictEqual(["13:00", "(00:15)"]);
        });

        test("last item", () => {
          expect(obj.dspSta(sta[sta.length - 1])).toStrictEqual(["23:45", "(11:00)"]);
          expect(obj.dspEnd(end[end.length - 1])).toStrictEqual(["16:45", "(04:00)"]);
        });

        test("getDay", () => {
          expect(obj.getDay().min.format("iso")).toBe("2023-09-08T12:45:00.000Z");
          expect(obj.getDay().tim.format("iso")).toBe("2023-09-08T12:45:00.000Z");
          expect(obj.getDay().max.format("iso")).toBe("2023-10-08T12:45:00.000Z");
        });

        test("getSta", () => {
          expect(obj.getSta().min.format("iso")).toBe("2023-09-08T12:45:00.000Z");
          expect(obj.getSta().tim.format("iso")).toBe("2023-09-08T12:45:00.000Z");
          expect(obj.getSta().max.format("iso")).toBe("2023-09-08T23:59:59.999Z");
        });

        test("getEnd", () => {
          expect(obj.getEnd().min.format("iso")).toBe("2023-09-08T13:00:00.000Z");
          expect(obj.getEnd().tim.format("iso")).toBe("2023-09-08T13:45:00.000Z");
          expect(obj.getEnd().max.format("iso")).toBe("2023-09-08T16:45:00.000Z");
        });
      });

      describe("updating at new interval", () => {
        let obj: DateObject = new DateObject(spacetime("2023-09-08T12:30:00.000Z"));

        obj.setTim(spacetime("2023-09-08T12:35:00.000Z")); // next interval 5m later

        const sta: Spacetime[] = obj.lisSta();
        const end: Spacetime[] = obj.lisEnd();

        test("first item", () => {
          expect(obj.dspSta(sta[0])).toStrictEqual(["12:45", "(00:00)"]);
          expect(obj.dspEnd(end[0])).toStrictEqual(["13:00", "(00:15)"]);
        });

        test("last item", () => {
          expect(obj.dspSta(sta[sta.length - 1])).toStrictEqual(["23:45", "(11:00)"]);
          expect(obj.dspEnd(end[end.length - 1])).toStrictEqual(["16:45", "(04:00)"]);
        });

        test("getDay", () => {
          expect(obj.getDay().min.format("iso")).toBe("2023-09-08T12:45:00.000Z");
          expect(obj.getDay().tim.format("iso")).toBe("2023-09-08T12:45:00.000Z");
          expect(obj.getDay().max.format("iso")).toBe("2023-10-08T12:45:00.000Z");
        });

        test("getSta", () => {
          expect(obj.getSta().min.format("iso")).toBe("2023-09-08T12:45:00.000Z");
          expect(obj.getSta().tim.format("iso")).toBe("2023-09-08T12:45:00.000Z");
          expect(obj.getSta().max.format("iso")).toBe("2023-09-08T23:59:59.999Z");
        });

        test("getEnd", () => {
          expect(obj.getEnd().min.format("iso")).toBe("2023-09-08T13:00:00.000Z");
          expect(obj.getEnd().tim.format("iso")).toBe("2023-09-08T13:45:00.000Z");
          expect(obj.getEnd().max.format("iso")).toBe("2023-09-08T16:45:00.000Z");
        });
      });
    });

    describe("end at interval minute", () => {
      describe("initializing constructor", () => {
        const obj: DateObject = new DateObject(spacetime("2023-09-08T12:40:00.000Z"));
        const sta: Spacetime[] = obj.lisSta();
        const end: Spacetime[] = obj.lisEnd();

        test("first item", () => {
          expect(obj.dspSta(sta[0])).toStrictEqual(["12:45", "(00:00)"]);
          expect(obj.dspEnd(end[0])).toStrictEqual(["13:00", "(00:15)"]);
        });

        test("last item", () => {
          expect(obj.dspSta(sta[sta.length - 1])).toStrictEqual(["23:45", "(11:00)"]);
          expect(obj.dspEnd(end[end.length - 1])).toStrictEqual(["16:45", "(04:00)"]);
        });

        test("getDay", () => {
          expect(obj.getDay().min.format("iso")).toBe("2023-09-08T12:45:00.000Z");
          expect(obj.getDay().tim.format("iso")).toBe("2023-09-08T12:45:00.000Z");
          expect(obj.getDay().max.format("iso")).toBe("2023-10-08T12:45:00.000Z");
        });

        test("getSta", () => {
          expect(obj.getSta().min.format("iso")).toBe("2023-09-08T12:45:00.000Z");
          expect(obj.getSta().tim.format("iso")).toBe("2023-09-08T12:45:00.000Z");
          expect(obj.getSta().max.format("iso")).toBe("2023-09-08T23:59:59.999Z");
        });

        test("getEnd", () => {
          expect(obj.getEnd().min.format("iso")).toBe("2023-09-08T13:00:00.000Z");
          expect(obj.getEnd().tim.format("iso")).toBe("2023-09-08T13:45:00.000Z");
          expect(obj.getEnd().max.format("iso")).toBe("2023-09-08T16:45:00.000Z");
        });
      });

      describe("updating at new interval", () => {
        let obj: DateObject = new DateObject(spacetime("2023-09-08T12:40:00.000Z"));

        obj.setTim(spacetime("2023-09-08T12:45:00.000Z")); // next interval 5m later

        const sta: Spacetime[] = obj.lisSta();
        const end: Spacetime[] = obj.lisEnd();

        test("first item", () => {
          expect(obj.dspSta(sta[0])).toStrictEqual(["13:00", "(00:00)"]);
          expect(obj.dspEnd(end[0])).toStrictEqual(["13:15", "(00:15)"]);
        });

        test("last item", () => {
          expect(obj.dspSta(sta[sta.length - 1])).toStrictEqual(["23:45", "(10:45)"]);
          expect(obj.dspEnd(end[end.length - 1])).toStrictEqual(["17:00", "(04:00)"]);
        });

        test("getDay", () => {
          expect(obj.getDay().min.format("iso")).toBe("2023-09-08T13:00:00.000Z");
          expect(obj.getDay().tim.format("iso")).toBe("2023-09-08T13:00:00.000Z");
          expect(obj.getDay().max.format("iso")).toBe("2023-10-08T13:00:00.000Z");
        });

        test("getSta", () => {
          expect(obj.getSta().min.format("iso")).toBe("2023-09-08T13:00:00.000Z");
          expect(obj.getSta().tim.format("iso")).toBe("2023-09-08T13:00:00.000Z");
          expect(obj.getSta().max.format("iso")).toBe("2023-09-08T23:59:59.999Z");
        });

        test("getEnd", () => {
          expect(obj.getEnd().min.format("iso")).toBe("2023-09-08T13:15:00.000Z");
          expect(obj.getEnd().tim.format("iso")).toBe("2023-09-08T14:00:00.000Z");
          expect(obj.getEnd().max.format("iso")).toBe("2023-09-08T17:00:00.000Z");
        });
      });
    });

    describe("end in next day", () => {
      describe("initializing constructor", () => {
        const obj: DateObject = new DateObject(spacetime("2023-09-08T21:43:00.000Z"));
        const sta: Spacetime[] = obj.lisSta();
        const end: Spacetime[] = obj.lisEnd();

        test("first item", () => {
          expect(obj.dspSta(sta[0])).toStrictEqual(["21:45", "(00:00)"]);
          expect(obj.dspEnd(end[0])).toStrictEqual(["22:00", "(00:15)"]);
        });

        test("last item", () => {
          expect(obj.dspSta(sta[sta.length - 1])).toStrictEqual(["23:45", "(02:00)"]);
          expect(obj.dspEnd(end[end.length - 1])).toStrictEqual(["01:45", "(04:00)"]);
        });

        test("getDay", () => {
          expect(obj.getDay().min.format("iso")).toBe("2023-09-08T21:45:00.000Z");
          expect(obj.getDay().tim.format("iso")).toBe("2023-09-08T21:45:00.000Z");
          expect(obj.getDay().max.format("iso")).toBe("2023-10-08T21:45:00.000Z");
        });

        test("getSta", () => {
          expect(obj.getSta().min.format("iso")).toBe("2023-09-08T21:45:00.000Z");
          expect(obj.getSta().tim.format("iso")).toBe("2023-09-08T21:45:00.000Z");
          expect(obj.getSta().max.format("iso")).toBe("2023-09-08T23:59:59.999Z");
        });

        test("getEnd", () => {
          expect(obj.getEnd().min.format("iso")).toBe("2023-09-08T22:00:00.000Z");
          expect(obj.getEnd().tim.format("iso")).toBe("2023-09-08T22:45:00.000Z");
          expect(obj.getEnd().max.format("iso")).toBe("2023-09-09T01:45:00.000Z");
        });
      });

      describe("updating at new interval", () => {
        let obj: DateObject = new DateObject(spacetime("2023-09-08T21:43:00.000Z"));

        obj.setTim(spacetime("2023-09-08T21:48:00.000Z")); // next interval 5m later

        const sta: Spacetime[] = obj.lisSta();
        const end: Spacetime[] = obj.lisEnd();

        test("first item", () => {
          expect(obj.dspSta(sta[0])).toStrictEqual(["22:00", "(00:00)"]);
          expect(obj.dspEnd(end[0])).toStrictEqual(["22:15", "(00:15)"]);
        });

        test("last item", () => {
          expect(obj.dspSta(sta[sta.length - 1])).toStrictEqual(["23:45", "(01:45)"]);
          expect(obj.dspEnd(end[end.length - 1])).toStrictEqual(["02:00", "(04:00)"]);
        });

        test("getDay", () => {
          expect(obj.getDay().min.format("iso")).toBe("2023-09-08T22:00:00.000Z");
          expect(obj.getDay().tim.format("iso")).toBe("2023-09-08T22:00:00.000Z");
          expect(obj.getDay().max.format("iso")).toBe("2023-10-08T22:00:00.000Z");
        });

        test("getSta", () => {
          expect(obj.getSta().min.format("iso")).toBe("2023-09-08T22:00:00.000Z");
          expect(obj.getSta().tim.format("iso")).toBe("2023-09-08T22:00:00.000Z");
          expect(obj.getSta().max.format("iso")).toBe("2023-09-08T23:59:59.999Z");
        });

        test("getEnd", () => {
          expect(obj.getEnd().min.format("iso")).toBe("2023-09-08T22:15:00.000Z");
          expect(obj.getEnd().tim.format("iso")).toBe("2023-09-08T23:00:00.000Z");
          expect(obj.getEnd().max.format("iso")).toBe("2023-09-09T02:00:00.000Z");
        });
      });
    });

    describe("start before next day", () => {
      describe("initializing constructor", () => {
        const obj: DateObject = new DateObject(spacetime("2023-09-08T23:43:00.000Z"));
        const sta: Spacetime[] = obj.lisSta();
        const end: Spacetime[] = obj.lisEnd();

        test("first item", () => {
          expect(obj.dspSta(sta[0])).toStrictEqual(["23:45", "(00:00)"]);
          expect(obj.dspEnd(end[0])).toStrictEqual(["00:00", "(00:15)"]);
        });

        test("last item", () => {
          expect(obj.dspSta(sta[sta.length - 1])).toStrictEqual(["23:45", "(00:00)"]);
          expect(obj.dspEnd(end[end.length - 1])).toStrictEqual(["03:45", "(04:00)"]);
        });

        test("getDay", () => {
          expect(obj.getDay().min.format("iso")).toBe("2023-09-08T23:45:00.000Z");
          expect(obj.getDay().tim.format("iso")).toBe("2023-09-08T23:45:00.000Z");
          expect(obj.getDay().max.format("iso")).toBe("2023-10-08T23:45:00.000Z");
        });

        test("getSta", () => {
          expect(obj.getSta().min.format("iso")).toBe("2023-09-08T23:45:00.000Z");
          expect(obj.getSta().tim.format("iso")).toBe("2023-09-08T23:45:00.000Z");
          expect(obj.getSta().max.format("iso")).toBe("2023-09-08T23:59:59.999Z");
        });

        test("getEnd", () => {
          expect(obj.getEnd().min.format("iso")).toBe("2023-09-09T00:00:00.000Z");
          expect(obj.getEnd().tim.format("iso")).toBe("2023-09-09T00:45:00.000Z");
          expect(obj.getEnd().max.format("iso")).toBe("2023-09-09T03:45:00.000Z");
        });
      });

      describe("updating at new interval", () => {
        let obj: DateObject = new DateObject(spacetime("2023-09-08T23:43:00.000Z"));

        obj.setTim(spacetime("2023-09-08T23:48:00.000Z")); // next interval 5m later

        const sta: Spacetime[] = obj.lisSta();
        const end: Spacetime[] = obj.lisEnd();

        test("first item", () => {
          expect(obj.dspSta(sta[0])).toStrictEqual(["00:00", "(00:00)"]);
          expect(obj.dspEnd(end[0])).toStrictEqual(["00:15", "(00:15)"]);
        });

        test("last item", () => {
          expect(obj.dspSta(sta[sta.length - 1])).toStrictEqual(["23:45", "(23:45)"]);
          expect(obj.dspEnd(end[end.length - 1])).toStrictEqual(["04:00", "(04:00)"]);
        });

        test("getDay", () => {
          expect(obj.getDay().min.format("iso")).toBe("2023-09-09T00:00:00.000Z");
          expect(obj.getDay().tim.format("iso")).toBe("2023-09-09T00:00:00.000Z");
          expect(obj.getDay().max.format("iso")).toBe("2023-10-09T00:00:00.000Z");
        });

        test("getSta", () => {
          expect(obj.getSta().min.format("iso")).toBe("2023-09-09T00:00:00.000Z");
          expect(obj.getSta().tim.format("iso")).toBe("2023-09-09T00:00:00.000Z");
          expect(obj.getSta().max.format("iso")).toBe("2023-09-09T23:59:59.999Z");
        });

        test("getEnd", () => {
          expect(obj.getEnd().min.format("iso")).toBe("2023-09-09T00:15:00.000Z");
          expect(obj.getEnd().tim.format("iso")).toBe("2023-09-09T01:00:00.000Z");
          expect(obj.getEnd().max.format("iso")).toBe("2023-09-09T04:00:00.000Z");
        });
      });
    });
  });

  describe("lisDay", () => {
    describe("start of day", () => {
      const obj: DateObject = new DateObject(spacetime("2023-09-08T00:00:00.000Z"));
      const day: Spacetime[] = obj.lisDay();

      test("length", () => {
        expect(day).toHaveLength(31);
      });

      const fir: Spacetime = day[0];

      test("first item", () => {
        expect(fir.format("iso")).toBe("2023-09-08T00:15:00.000Z");
      });

      const las: Spacetime = day[day.length - 1];

      test("last item", () => {
        expect(las.format("iso")).toBe("2023-10-08T00:15:00.000Z");
      });
    });

    describe("middle of day", () => {
      const obj: DateObject = new DateObject(spacetime("2023-09-08T12:28:00.000Z"));
      const day: Spacetime[] = obj.lisDay();

      test("length", () => {
        expect(day).toHaveLength(31);
      });

      const fir: Spacetime = day[0];

      test("first item", () => {
        expect(fir.format("iso")).toBe("2023-09-08T12:30:00.000Z");
      });

      const las: Spacetime = day[day.length - 1];

      test("last item", () => {
        expect(las.format("iso")).toBe("2023-10-08T12:30:00.000Z");
      });
    });

    describe("start before next day", () => {
      const obj: DateObject = new DateObject(spacetime("2023-09-08T23:43:00.000Z"));
      const day: Spacetime[] = obj.lisDay();

      test("length", () => {
        expect(day).toHaveLength(31);
      });

      const fir: Spacetime = day[0];

      test("first item", () => {
        expect(fir.format("iso")).toBe("2023-09-08T23:45:00.000Z");
      });

      const las: Spacetime = day[day.length - 1];

      test("last item", () => {
        expect(las.format("iso")).toBe("2023-10-08T23:45:00.000Z");
      });
    });

    describe("end of day", () => {
      const obj: DateObject = new DateObject(spacetime("2023-09-08T23:58:00.000Z"));
      const day: Spacetime[] = obj.lisDay();

      test("length", () => {
        expect(day).toHaveLength(31);
      });

      const fir: Spacetime = day[0];

      test("first item", () => {
        expect(fir.format("iso")).toBe("2023-09-09T00:00:00.000Z");
      });

      const las: Spacetime = day[day.length - 1];

      test("last item", () => {
        expect(las.format("iso")).toBe("2023-10-09T00:00:00.000Z");
      });
    });

    describe("setDay", () => {
      const obj: DateObject = new DateObject(spacetime("2023-09-08T12:28:00.000Z"));
      let day: Spacetime[] = obj.lisDay();

      obj.setDay(day[1]); // set next day

      day = obj.lisDay();

      test("length", () => {
        expect(day).toHaveLength(31);
      });

      const fir: Spacetime = day[0];

      test("first item", () => {
        expect(fir.format("iso")).toBe("2023-09-08T12:30:00.000Z");
      });

      const las: Spacetime = day[day.length - 1];

      test("last item", () => {
        expect(las.format("iso")).toBe("2023-10-08T12:30:00.000Z");
      });
    });
  });

  describe("lisSta / lisEnd", () => {
    describe("staying in same day", () => {
      describe("initializing constructor", () => {
        const obj: DateObject = new DateObject(spacetime("2023-09-08T12:28:00.000Z"));
        const sta: Spacetime[] = obj.lisSta();
        const end: Spacetime[] = obj.lisEnd();

        test("first items one interval apart", () => {
          expect(sta[0].format("iso")).toBe("2023-09-08T12:30:00.000Z");
          expect(end[0].format("iso")).toBe("2023-09-08T12:45:00.000Z");
        });

        test("last items cut on day end", () => {
          expect(sta[sta.length - 1].format("iso")).toBe("2023-09-08T23:45:00.000Z");
          expect(end[end.length - 1].format("iso")).toBe("2023-09-08T16:30:00.000Z");
        });
      });

      describe("updating at new interval", () => {
        let obj: DateObject = new DateObject(spacetime("2023-09-08T12:28:00.000Z"));

        obj.setTim(spacetime("2023-09-08T12:33:00.000Z")); // next interval 5m later

        const sta: Spacetime[] = obj.lisSta();
        const end: Spacetime[] = obj.lisEnd();

        test("first items one interval apart", () => {
          expect(sta[0].format("iso")).toBe("2023-09-08T12:45:00.000Z");
          expect(end[0].format("iso")).toBe("2023-09-08T13:00:00.000Z");
        });

        test("last items cut on day end", () => {
          expect(sta[sta.length - 1].format("iso")).toBe("2023-09-08T23:45:00.000Z");
          expect(end[end.length - 1].format("iso")).toBe("2023-09-08T16:45:00.000Z");
        });
      });
    });

    describe("end in next day", () => {
      describe("initializing constructor", () => {
        const obj: DateObject = new DateObject(spacetime("2023-09-08T21:43:00.000Z"));
        const sta: Spacetime[] = obj.lisSta();
        const end: Spacetime[] = obj.lisEnd();

        test("first items one interval apart", () => {
          expect(sta[0].format("iso")).toBe("2023-09-08T21:45:00.000Z");
          expect(end[0].format("iso")).toBe("2023-09-08T22:00:00.000Z");
        });

        test("last item", () => {
          expect(sta[sta.length - 1].format("iso")).toBe("2023-09-08T23:45:00.000Z");
          expect(end[end.length - 1].format("iso")).toBe("2023-09-09T01:45:00.000Z");
        });
      });

      describe("updating at new interval", () => {
        let obj: DateObject = new DateObject(spacetime("2023-09-08T21:43:00.000Z"));

        obj.setTim(spacetime("2023-09-08T21:48:00.000Z")); // next interval 5m later

        const sta: Spacetime[] = obj.lisSta();
        const end: Spacetime[] = obj.lisEnd();

        test("first item", () => {
          expect(sta[0].format("iso")).toBe("2023-09-08T22:00:00.000Z");
          expect(end[0].format("iso")).toBe("2023-09-08T22:15:00.000Z");
        });

        test("last item", () => {
          expect(sta[sta.length - 1].format("iso")).toBe("2023-09-08T23:45:00.000Z");
          expect(end[end.length - 1].format("iso")).toBe("2023-09-09T02:00:00.000Z");
        });
      });
    });

    describe("start before next day", () => {
      describe("initializing constructor", () => {
        const obj: DateObject = new DateObject(spacetime("2023-09-08T23:43:00.000Z"));
        const sta: Spacetime[] = obj.lisSta();
        const end: Spacetime[] = obj.lisEnd();

        test("first items one interval apart", () => {
          expect(sta[0].format("iso")).toBe("2023-09-08T23:45:00.000Z");
          expect(end[0].format("iso")).toBe("2023-09-09T00:00:00.000Z");
        });

        test("last item", () => {
          expect(sta[sta.length - 1].format("iso")).toBe("2023-09-08T23:45:00.000Z");
          expect(end[end.length - 1].format("iso")).toBe("2023-09-09T03:45:00.000Z");
        });
      });

      describe("updating at new interval", () => {
        let obj: DateObject = new DateObject(spacetime("2023-09-08T23:43:00.000Z"));

        obj.setTim(spacetime("2023-09-08T23:48:00.000Z")); // next interval 5m later

        const sta: Spacetime[] = obj.lisSta();
        const end: Spacetime[] = obj.lisEnd();

        test("first items one interval apart", () => {
          expect(sta[0].format("iso")).toBe("2023-09-09T00:00:00.000Z");
          expect(end[0].format("iso")).toBe("2023-09-09T00:15:00.000Z");
        });

        test("last items cut on day end", () => {
          expect(sta[sta.length - 1].format("iso")).toBe("2023-09-09T23:45:00.000Z");
          expect(end[end.length - 1].format("iso")).toBe("2023-09-09T04:00:00.000Z");
        });
      });
    });
  });

  describe("setDay", () => {
    describe("without setTim", () => {
      const obj: DateObject = new DateObject(spacetime("2023-09-08T12:28:00.000Z"));
      let day: Spacetime[] = obj.lisDay();

      obj.setDay(day[1]); // set next day

      const sta: Spacetime[] = obj.lisSta();
      const end: Spacetime[] = obj.lisEnd();

      test("first item", () => {
        expect(obj.dspSta(sta[0])).toStrictEqual(["00:00", ""]);
        expect(obj.dspEnd(end[0])).toStrictEqual(["12:45", "(00:15)"]); // this.sta.tim is 12:30
      });

      test("last item", () => {
        expect(obj.dspSta(sta[sta.length - 1])).toStrictEqual(["23:45", ""]);
        expect(obj.dspEnd(end[end.length - 1])).toStrictEqual(["16:30", "(04:00)"]);
      });

      test("getDay", () => {
        expect(obj.getDay().min.format("iso")).toBe("2023-09-08T12:30:00.000Z");
        expect(obj.getDay().tim.format("iso")).toBe("2023-09-09T12:30:00.000Z");
        expect(obj.getDay().max.format("iso")).toBe("2023-10-08T12:30:00.000Z");
      });

      test("getSta", () => {
        expect(obj.getSta().min.format("iso")).toBe("2023-09-09T00:00:00.000Z");
        expect(obj.getSta().tim.format("iso")).toBe("2023-09-09T12:30:00.000Z");
        expect(obj.getSta().max.format("iso")).toBe("2023-09-09T23:59:59.999Z");
      });

      test("getEnd", () => {
        expect(obj.getEnd().min.format("iso")).toBe("2023-09-09T12:45:00.000Z");
        expect(obj.getEnd().tim.format("iso")).toBe("2023-09-09T13:30:00.000Z");
        expect(obj.getEnd().max.format("iso")).toBe("2023-09-09T16:30:00.000Z");
      });
    });

    describe("with setTim", () => {
      const obj: DateObject = new DateObject(spacetime("2023-09-08T12:28:00.000Z"));
      let day: Spacetime[] = obj.lisDay();

      obj.setDay(day[1]); // set next day

      obj.setTim(spacetime("2023-09-08T12:28:30.000Z")); // 30 seconds later

      const sta: Spacetime[] = obj.lisSta();
      const end: Spacetime[] = obj.lisEnd();

      test("first item", () => {
        expect(obj.dspSta(sta[0])).toStrictEqual(["00:00", ""]);
        expect(obj.dspEnd(end[0])).toStrictEqual(["12:45", "(00:15)"]); // this.sta.tim is 12:30
      });

      test("last item", () => {
        expect(obj.dspSta(sta[sta.length - 1])).toStrictEqual(["23:45", ""]);
        expect(obj.dspEnd(end[end.length - 1])).toStrictEqual(["16:30", "(04:00)"]);
      });

      test("getDay", () => {
        expect(obj.getDay().min.format("iso")).toBe("2023-09-08T12:30:00.000Z");
        expect(obj.getDay().tim.format("iso")).toBe("2023-09-09T12:30:00.000Z");
        expect(obj.getDay().max.format("iso")).toBe("2023-10-08T12:30:00.000Z");
      });

      test("getSta", () => {
        expect(obj.getSta().min.format("iso")).toBe("2023-09-09T00:00:00.000Z");
        expect(obj.getSta().tim.format("iso")).toBe("2023-09-09T12:30:00.000Z");
        expect(obj.getSta().max.format("iso")).toBe("2023-09-09T23:59:59.999Z");
      });

      test("getEnd", () => {
        expect(obj.getEnd().min.format("iso")).toBe("2023-09-09T12:45:00.000Z");
        expect(obj.getEnd().tim.format("iso")).toBe("2023-09-09T13:30:00.000Z");
        expect(obj.getEnd().max.format("iso")).toBe("2023-09-09T16:30:00.000Z");
      });
    });
  });

  describe("setEnd", () => {
    let obj: DateObject = new DateObject(spacetime("2023-09-08T12:28:00.000Z"));

    const end: Spacetime[] = obj.lisEnd();

    obj.setEnd(end[7]); // add another hour

    test("getDay", () => {
      expect(obj.getDay().min.format("iso")).toBe("2023-09-08T12:30:00.000Z");
      expect(obj.getDay().tim.format("iso")).toBe("2023-09-08T12:30:00.000Z");
      expect(obj.getDay().max.format("iso")).toBe("2023-10-08T12:30:00.000Z");
    });

    test("getSta", () => {
      expect(obj.getSta().min.format("iso")).toBe("2023-09-08T12:30:00.000Z");
      expect(obj.getSta().tim.format("iso")).toBe("2023-09-08T12:30:00.000Z");
      expect(obj.getSta().max.format("iso")).toBe("2023-09-08T23:59:59.999Z");
    });

    test("getEnd", () => {
      expect(obj.getEnd().min.format("iso")).toBe("2023-09-08T12:45:00.000Z");
      expect(obj.getEnd().tim.format("iso")).toBe("2023-09-08T14:30:00.000Z");
      expect(obj.getEnd().max.format("iso")).toBe("2023-09-08T16:30:00.000Z");
    });
  });

  describe("setSta", () => {
    describe("staying in same day", () => {
      describe("initializing constructor", () => {
        const obj: DateObject = new DateObject(spacetime("2023-09-08T12:28:00.000Z"));

        let sta: Spacetime[] = obj.lisSta();
        obj.setSta(sta[10]); // set 15:00 today

        sta = obj.lisSta();
        const day: Spacetime[] = obj.lisDay();
        const end: Spacetime[] = obj.lisEnd();

        test("first item", () => {
          expect(obj.dspDay(day[0])).toStrictEqual(["Today", "(8th Sep)"]);
          expect(obj.dspSta(sta[0])).toStrictEqual(["12:30", "(00:00)"]);
          expect(obj.dspEnd(end[0])).toStrictEqual(["15:15", "(00:15)"]);
        });

        test("last item", () => {
          expect(obj.dspDay(day[day.length - 1])).toStrictEqual(["in 30 Days", "(8th Oct)"]);
          expect(obj.dspSta(sta[sta.length - 1])).toStrictEqual(["23:45", "(11:15)"]);
          expect(obj.dspEnd(end[end.length - 1])).toStrictEqual(["19:00", "(04:00)"]);
        });

        test("getDay", () => {
          expect(obj.getDay().min.format("iso")).toBe("2023-09-08T12:30:00.000Z");
          expect(obj.getDay().tim.format("iso")).toBe("2023-09-08T12:30:00.000Z");
          expect(obj.getDay().max.format("iso")).toBe("2023-10-08T12:30:00.000Z");
        });

        test("getSta", () => {
          expect(obj.getSta().min.format("iso")).toBe("2023-09-08T12:30:00.000Z");
          expect(obj.getSta().tim.format("iso")).toBe("2023-09-08T15:00:00.000Z");
          expect(obj.getSta().max.format("iso")).toBe("2023-09-08T23:59:59.999Z");
        });

        test("getEnd", () => {
          expect(obj.getEnd().min.format("iso")).toBe("2023-09-08T15:15:00.000Z");
          expect(obj.getEnd().tim.format("iso")).toBe("2023-09-08T16:00:00.000Z");
          expect(obj.getEnd().max.format("iso")).toBe("2023-09-08T19:00:00.000Z");
        });
      });

      describe("updating in current interval", () => {
        const obj: DateObject = new DateObject(spacetime("2023-09-08T12:28:00.000Z"));

        let sta: Spacetime[] = obj.lisSta();
        obj.setSta(sta[10]); // set 15:00 today

        obj.setTim(spacetime("2023-09-08T12:28:30.000Z")); // 30 seconds later

        sta = obj.lisSta();
        const day: Spacetime[] = obj.lisDay();
        const end: Spacetime[] = obj.lisEnd();

        test("first item", () => {
          expect(obj.dspDay(day[0])).toStrictEqual(["Today", "(8th Sep)"]);
          expect(obj.dspSta(sta[0])).toStrictEqual(["12:30", "(00:00)"]);
          expect(obj.dspEnd(end[0])).toStrictEqual(["15:15", "(00:15)"]);
        });

        test("last item", () => {
          expect(obj.dspDay(day[day.length - 1])).toStrictEqual(["in 30 Days", "(8th Oct)"]);
          expect(obj.dspSta(sta[sta.length - 1])).toStrictEqual(["23:45", "(11:15)"]);
          expect(obj.dspEnd(end[end.length - 1])).toStrictEqual(["19:00", "(04:00)"]);
        });

        test("getDay", () => {
          expect(obj.getDay().min.format("iso")).toBe("2023-09-08T12:30:00.000Z");
          expect(obj.getDay().tim.format("iso")).toBe("2023-09-08T12:30:00.000Z");
          expect(obj.getDay().max.format("iso")).toBe("2023-10-08T12:30:00.000Z");
        });

        test("getSta", () => {
          expect(obj.getSta().min.format("iso")).toBe("2023-09-08T12:30:00.000Z");
          expect(obj.getSta().tim.format("iso")).toBe("2023-09-08T15:00:00.000Z");
          expect(obj.getSta().max.format("iso")).toBe("2023-09-08T23:59:59.999Z");
        });

        test("getEnd", () => {
          expect(obj.getEnd().min.format("iso")).toBe("2023-09-08T15:15:00.000Z");
          expect(obj.getEnd().tim.format("iso")).toBe("2023-09-08T16:00:00.000Z");
          expect(obj.getEnd().max.format("iso")).toBe("2023-09-08T19:00:00.000Z");
        });
      });

      describe("updating at new interval", () => {
        const obj: DateObject = new DateObject(spacetime("2023-09-08T12:28:00.000Z"));

        let sta: Spacetime[] = obj.lisSta();
        obj.setSta(sta[10]); // set 15:00 today

        obj.setTim(spacetime("2023-09-08T12:33:00.000Z")); // 5 minutes later

        sta = obj.lisSta();
        const day: Spacetime[] = obj.lisDay();
        const end: Spacetime[] = obj.lisEnd();

        test("first item", () => {
          expect(obj.dspDay(day[0])).toStrictEqual(["Today", "(8th Sep)"]);
          expect(obj.dspSta(sta[0])).toStrictEqual(["12:45", "(00:00)"]);
          expect(obj.dspEnd(end[0])).toStrictEqual(["15:15", "(00:15)"]);
        });

        test("last item", () => {
          expect(obj.dspDay(day[day.length - 1])).toStrictEqual(["in 30 Days", "(8th Oct)"]);
          expect(obj.dspSta(sta[sta.length - 1])).toStrictEqual(["23:45", "(11:00)"]);
          expect(obj.dspEnd(end[end.length - 1])).toStrictEqual(["19:00", "(04:00)"]);
        });

        test("getDay", () => {
          expect(obj.getDay().min.format("iso")).toBe("2023-09-08T12:45:00.000Z");
          expect(obj.getDay().tim.format("iso")).toBe("2023-09-08T12:45:00.000Z");
          expect(obj.getDay().max.format("iso")).toBe("2023-10-08T12:45:00.000Z");
        });

        test("getSta", () => {
          expect(obj.getSta().min.format("iso")).toBe("2023-09-08T12:45:00.000Z");
          expect(obj.getSta().tim.format("iso")).toBe("2023-09-08T15:00:00.000Z");
          expect(obj.getSta().max.format("iso")).toBe("2023-09-08T23:59:59.999Z");
        });

        test("getEnd", () => {
          expect(obj.getEnd().min.format("iso")).toBe("2023-09-08T15:15:00.000Z");
          expect(obj.getEnd().tim.format("iso")).toBe("2023-09-08T16:00:00.000Z");
          expect(obj.getEnd().max.format("iso")).toBe("2023-09-08T19:00:00.000Z");
        });
      });
    });
  });

  describe("setDay / setSta", () => {
    describe("staying in same day", () => {
      describe("initializing constructor", () => {
        const obj: DateObject = new DateObject(spacetime("2023-09-08T12:28:00.000Z"));

        let day: Spacetime[] = obj.lisDay();
        obj.setDay(day[1]); // set next day

        let sta: Spacetime[] = obj.lisSta();
        obj.setSta(sta[60]); // set 15:00 next day

        day = obj.lisDay();
        sta = obj.lisSta();

        const end: Spacetime[] = obj.lisEnd();

        test("first item", () => {
          expect(obj.dspDay(day[0])).toStrictEqual(["Today", "(8th Sep)"]);
          expect(obj.dspSta(sta[0])).toStrictEqual(["00:00", ""]);
          expect(obj.dspEnd(end[0])).toStrictEqual(["15:15", "(00:15)"]);
        });

        test("last item", () => {
          expect(obj.dspDay(day[day.length - 1])).toStrictEqual(["in 30 Days", "(8th Oct)"]);
          expect(obj.dspSta(sta[sta.length - 1])).toStrictEqual(["23:45", ""]);
          expect(obj.dspEnd(end[end.length - 1])).toStrictEqual(["19:00", "(04:00)"]);
        });

        test("getDay", () => {
          expect(obj.getDay().min.format("iso")).toBe("2023-09-08T12:30:00.000Z");
          expect(obj.getDay().tim.format("iso")).toBe("2023-09-09T12:30:00.000Z");
          expect(obj.getDay().max.format("iso")).toBe("2023-10-08T12:30:00.000Z");
        });

        test("getSta", () => {
          expect(obj.getSta().min.format("iso")).toBe("2023-09-09T00:00:00.000Z");
          expect(obj.getSta().tim.format("iso")).toBe("2023-09-09T15:00:00.000Z");
          expect(obj.getSta().max.format("iso")).toBe("2023-09-09T23:59:59.999Z");
        });

        test("getEnd", () => {
          expect(obj.getEnd().min.format("iso")).toBe("2023-09-09T15:15:00.000Z");
          expect(obj.getEnd().tim.format("iso")).toBe("2023-09-09T16:00:00.000Z");
          expect(obj.getEnd().max.format("iso")).toBe("2023-09-09T19:00:00.000Z");
        });
      });

      describe("updating in current interval", () => {
        const obj: DateObject = new DateObject(spacetime("2023-09-08T12:28:00.000Z"));

        let day: Spacetime[] = obj.lisDay();
        obj.setDay(day[1]); // set next day

        let sta: Spacetime[] = obj.lisSta();
        obj.setSta(sta[60]); // set 15:00 next day

        obj.setTim(spacetime("2023-09-08T12:28:30.000Z")); // 30 seconds later

        day = obj.lisDay();
        sta = obj.lisSta();

        const end: Spacetime[] = obj.lisEnd();

        test("first item", () => {
          expect(obj.dspDay(day[0])).toStrictEqual(["Today", "(8th Sep)"]);
          expect(obj.dspSta(sta[0])).toStrictEqual(["00:00", ""]);
          expect(obj.dspEnd(end[0])).toStrictEqual(["15:15", "(00:15)"]);
        });

        test("last item", () => {
          expect(obj.dspDay(day[day.length - 1])).toStrictEqual(["in 30 Days", "(8th Oct)"]);
          expect(obj.dspSta(sta[sta.length - 1])).toStrictEqual(["23:45", ""]);
          expect(obj.dspEnd(end[end.length - 1])).toStrictEqual(["19:00", "(04:00)"]);
        });

        test("getDay", () => {
          expect(obj.getDay().min.format("iso")).toBe("2023-09-08T12:30:00.000Z");
          expect(obj.getDay().tim.format("iso")).toBe("2023-09-09T12:30:00.000Z");
          expect(obj.getDay().max.format("iso")).toBe("2023-10-08T12:30:00.000Z");
        });

        test("getSta", () => {
          expect(obj.getSta().min.format("iso")).toBe("2023-09-09T00:00:00.000Z");
          expect(obj.getSta().tim.format("iso")).toBe("2023-09-09T15:00:00.000Z");
          expect(obj.getSta().max.format("iso")).toBe("2023-09-09T23:59:59.999Z");
        });

        test("getEnd", () => {
          expect(obj.getEnd().min.format("iso")).toBe("2023-09-09T15:15:00.000Z");
          expect(obj.getEnd().tim.format("iso")).toBe("2023-09-09T16:00:00.000Z");
          expect(obj.getEnd().max.format("iso")).toBe("2023-09-09T19:00:00.000Z");
        });
      });

      describe("updating at new interval", () => {
        const obj: DateObject = new DateObject(spacetime("2023-09-08T12:28:00.000Z"));

        let day: Spacetime[] = obj.lisDay();
        obj.setDay(day[1]); // set next day

        let sta: Spacetime[] = obj.lisSta();
        obj.setSta(sta[60]); // set 15:00 next day

        obj.setTim(spacetime("2023-09-08T12:33:00.000Z")); // 5 minutes later

        day = obj.lisDay();
        sta = obj.lisSta();

        const end: Spacetime[] = obj.lisEnd();

        test("first item", () => {
          expect(obj.dspDay(day[0])).toStrictEqual(["Today", "(8th Sep)"]);
          expect(obj.dspSta(sta[0])).toStrictEqual(["00:00", ""]);
          expect(obj.dspEnd(end[0])).toStrictEqual(["15:15", "(00:15)"]);
        });

        test("last item", () => {
          expect(obj.dspDay(day[day.length - 1])).toStrictEqual(["in 30 Days", "(8th Oct)"]);
          expect(obj.dspSta(sta[sta.length - 1])).toStrictEqual(["23:45", ""]);
          expect(obj.dspEnd(end[end.length - 1])).toStrictEqual(["19:00", "(04:00)"]);
        });

        test("getDay", () => {
          expect(obj.getDay().min.format("iso")).toBe("2023-09-08T12:30:00.000Z");
          expect(obj.getDay().tim.format("iso")).toBe("2023-09-09T12:30:00.000Z");
          expect(obj.getDay().max.format("iso")).toBe("2023-10-08T12:30:00.000Z");
        });

        test("getSta", () => {
          expect(obj.getSta().min.format("iso")).toBe("2023-09-09T00:00:00.000Z");
          expect(obj.getSta().tim.format("iso")).toBe("2023-09-09T15:00:00.000Z");
          expect(obj.getSta().max.format("iso")).toBe("2023-09-09T23:59:59.999Z");
        });

        test("getEnd", () => {
          expect(obj.getEnd().min.format("iso")).toBe("2023-09-09T15:15:00.000Z");
          expect(obj.getEnd().tim.format("iso")).toBe("2023-09-09T16:00:00.000Z");
          expect(obj.getEnd().max.format("iso")).toBe("2023-09-09T19:00:00.000Z");
        });
      });
    });
  });

  describe("setSta / setDay", () => {
    describe("initializing constructor", () => {
      const obj: DateObject = new DateObject(spacetime("2023-09-08T12:28:00.000Z"));

      let sta: Spacetime[] = obj.lisSta();
      obj.setSta(sta[10]); // set 15:00 next day

      let day: Spacetime[] = obj.lisDay();
      obj.setDay(day[1]); // set next day

      sta = obj.lisSta();
      day = obj.lisDay();

      const end: Spacetime[] = obj.lisEnd();

      test("first item", () => {
        expect(obj.dspDay(day[0])).toStrictEqual(["Today", "(8th Sep)"]);
        expect(obj.dspSta(sta[0])).toStrictEqual(["00:00", ""]);
        expect(obj.dspEnd(end[0])).toStrictEqual(["15:15", "(00:15)"]);
      });

      test("last item", () => {
        expect(obj.dspDay(day[day.length - 1])).toStrictEqual(["in 30 Days", "(8th Oct)"]);
        expect(obj.dspSta(sta[sta.length - 1])).toStrictEqual(["23:45", ""]);
        expect(obj.dspEnd(end[end.length - 1])).toStrictEqual(["19:00", "(04:00)"]);
      });

      test("getDay", () => {
        expect(obj.getDay().min.format("iso")).toBe("2023-09-08T12:30:00.000Z");
        expect(obj.getDay().tim.format("iso")).toBe("2023-09-09T12:30:00.000Z");
        expect(obj.getDay().max.format("iso")).toBe("2023-10-08T12:30:00.000Z");
      });

      test("getSta", () => {
        expect(obj.getSta().min.format("iso")).toBe("2023-09-09T00:00:00.000Z");
        expect(obj.getSta().tim.format("iso")).toBe("2023-09-09T15:00:00.000Z");
        expect(obj.getSta().max.format("iso")).toBe("2023-09-09T23:59:59.999Z");
      });

      test("getEnd", () => {
        expect(obj.getEnd().min.format("iso")).toBe("2023-09-09T15:15:00.000Z");
        expect(obj.getEnd().tim.format("iso")).toBe("2023-09-09T16:00:00.000Z");
        expect(obj.getEnd().max.format("iso")).toBe("2023-09-09T19:00:00.000Z");
      });
    });

    describe("updating in current interval", () => {
      const obj: DateObject = new DateObject(spacetime("2023-09-08T12:28:00.000Z"));

      let sta: Spacetime[] = obj.lisSta();
      obj.setSta(sta[10]); // set 15:00 next day

      let day: Spacetime[] = obj.lisDay();
      obj.setDay(day[1]); // set next day

      obj.setTim(spacetime("2023-09-08T12:28:30.000Z")); // 30 seconds later

      sta = obj.lisSta();
      day = obj.lisDay();

      const end: Spacetime[] = obj.lisEnd();

      test("first item", () => {
        expect(obj.dspDay(day[0])).toStrictEqual(["Today", "(8th Sep)"]);
        expect(obj.dspSta(sta[0])).toStrictEqual(["00:00", ""]);
        expect(obj.dspEnd(end[0])).toStrictEqual(["15:15", "(00:15)"]);
      });

      test("last item", () => {
        expect(obj.dspDay(day[day.length - 1])).toStrictEqual(["in 30 Days", "(8th Oct)"]);
        expect(obj.dspSta(sta[sta.length - 1])).toStrictEqual(["23:45", ""]);
        expect(obj.dspEnd(end[end.length - 1])).toStrictEqual(["19:00", "(04:00)"]);
      });

      test("getDay", () => {
        expect(obj.getDay().min.format("iso")).toBe("2023-09-08T12:30:00.000Z");
        expect(obj.getDay().tim.format("iso")).toBe("2023-09-09T12:30:00.000Z");
        expect(obj.getDay().max.format("iso")).toBe("2023-10-08T12:30:00.000Z");
      });

      test("getSta", () => {
        expect(obj.getSta().min.format("iso")).toBe("2023-09-09T00:00:00.000Z");
        expect(obj.getSta().tim.format("iso")).toBe("2023-09-09T15:00:00.000Z");
        expect(obj.getSta().max.format("iso")).toBe("2023-09-09T23:59:59.999Z");
      });

      test("getEnd", () => {
        expect(obj.getEnd().min.format("iso")).toBe("2023-09-09T15:15:00.000Z");
        expect(obj.getEnd().tim.format("iso")).toBe("2023-09-09T16:00:00.000Z");
        expect(obj.getEnd().max.format("iso")).toBe("2023-09-09T19:00:00.000Z");
      });
    });

    describe("updating at new interval", () => {
      const obj: DateObject = new DateObject(spacetime("2023-09-08T12:28:00.000Z"));

      let sta: Spacetime[] = obj.lisSta();
      obj.setSta(sta[10]); // set 15:00 next day

      let day: Spacetime[] = obj.lisDay();
      obj.setDay(day[1]); // set next day

      obj.setTim(spacetime("2023-09-08T12:33:00.000Z")); // 5 minutes later

      sta = obj.lisSta();
      day = obj.lisDay();

      const end: Spacetime[] = obj.lisEnd();

      test("first item", () => {
        expect(obj.dspDay(day[0])).toStrictEqual(["Today", "(8th Sep)"]);
        expect(obj.dspSta(sta[0])).toStrictEqual(["00:00", ""]);
        expect(obj.dspEnd(end[0])).toStrictEqual(["15:15", "(00:15)"]);
      });

      test("last item", () => {
        expect(obj.dspDay(day[day.length - 1])).toStrictEqual(["in 30 Days", "(8th Oct)"]);
        expect(obj.dspSta(sta[sta.length - 1])).toStrictEqual(["23:45", ""]);
        expect(obj.dspEnd(end[end.length - 1])).toStrictEqual(["19:00", "(04:00)"]);
      });

      test("getDay", () => {
        expect(obj.getDay().min.format("iso")).toBe("2023-09-08T12:30:00.000Z");
        expect(obj.getDay().tim.format("iso")).toBe("2023-09-09T12:30:00.000Z");
        expect(obj.getDay().max.format("iso")).toBe("2023-10-08T12:30:00.000Z");
      });

      test("getSta", () => {
        expect(obj.getSta().min.format("iso")).toBe("2023-09-09T00:00:00.000Z");
        expect(obj.getSta().tim.format("iso")).toBe("2023-09-09T15:00:00.000Z");
        expect(obj.getSta().max.format("iso")).toBe("2023-09-09T23:59:59.999Z");
      });

      test("getEnd", () => {
        expect(obj.getEnd().min.format("iso")).toBe("2023-09-09T15:15:00.000Z");
        expect(obj.getEnd().tim.format("iso")).toBe("2023-09-09T16:00:00.000Z");
        expect(obj.getEnd().max.format("iso")).toBe("2023-09-09T19:00:00.000Z");
      });
    });
  });
});
