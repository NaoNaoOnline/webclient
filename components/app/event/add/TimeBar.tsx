import { useEffect, useState } from "react";
import { Cron } from "croner";
import spacetime, { Spacetime } from "spacetime";

import TimeSelect from "@/components/app/event/add/TimeSelect";
import ZoneInput from "@/components/app/event/add/ZoneInput";

import DateObject from "@/modules/date/Object";
import { List, Locl, Zone } from "@/modules/date/TimeZone";

const dfltDate: DateObject = new DateObject(spacetime.now());

export default function TimeBar() {
  const [date,] = useState<DateObject>(dfltDate);
  const [, setRndr] = useState<boolean>(true);
  const [zone, setZone] = useState<Zone>(Locl);

  // Setup a periodic state change for updating the time based information in
  // the user interface on every 15 minute interval change. Every time the cron
  // callback is executed the whole component re-renders using the updated clock
  // time.
  useEffect(() => {
    Cron("0,15,30,45 * * * *", () => {
      setRndr((old: boolean) => !old);
    });
  }, []);

  {
    date.setTim(spacetime.now());
  }

  return (
    <div className="grid gap-x-4 grid-cols-10">
      <TimeSelect
        chng={(dat: Spacetime) => {
          date.setDay(dat)
          setRndr((old: boolean) => !old);
        }}
        desc="the day this event is expected to happen"
        dspl={(dat: Spacetime): string[] => {
          return date.dspDay(dat);
        }}
        list={date.lisDay()}
        name="date"
        slct={date.getDay().tim}
        span="col-span-5"
        zind="z-40"
        zone={zone}
      />
      <ZoneInput
        chng={setZone}
        desc="the timezone to base start and end time on"
        name="zone"
        span="col-span-5"
        zind="z-30"
        zone={List}
      />
      <TimeSelect
        chng={(dat: Spacetime) => {
          date.setSta(dat)
          setRndr((old: boolean) => !old);
        }}
        desc="the time this event is expected to start"
        dspl={(dat: Spacetime): string[] => date.dspSta(dat)}
        list={date.lisSta()}
        name="start"
        slct={date.getSta().tim}
        span="col-span-5"
        zind="z-20"
        zone={zone}
      />
      <TimeSelect
        chng={(dat: Spacetime) => {
          date.setEnd(dat)
          setRndr((old: boolean) => !old);
        }}
        desc="the time this event is expected to end"
        dspl={(dat: Spacetime): string[] => date.dspEnd(dat)}
        list={date.lisEnd()}
        name="end"
        slct={date.getEnd().tim}
        span="col-span-5"
        zind="z-10"
        zone={zone}
      />
    </div>
  );
}
