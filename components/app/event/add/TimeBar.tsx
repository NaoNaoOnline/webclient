import { useEffect, useState } from 'react'
import { Cron } from "croner"

import TimeSelect from '@/components/app/event/add/TimeSelect'

import DateObject from '@/modules/date/Object';
import spacetime, { Spacetime } from 'spacetime';

const dfltDate: DateObject = new DateObject(spacetime.now());

export default function TimeBar() {
  const [date,] = useState<DateObject>(dfltDate);
  const [, setRndr] = useState(true);

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
    <>
      <TimeSelect
        chng={(dat: Spacetime) => {
          date.setDay(dat)
          setRndr((old: boolean) => !old);
        }}
        desc="the day at which this event is expected to happen"
        dspl={(dat: Spacetime): string[] => {
          return date.dspDay(dat);
        }}
        list={date.lisDay()}
        name="date"
        pstn="right"
        slct={date.getDay().tim}
      />
      <TimeSelect
        chng={(dat: Spacetime) => {
          date.setSta(dat)
          setRndr((old: boolean) => !old);
        }}
        desc="the time at which this event is expected to start"
        dspl={(dat: Spacetime): string[] => date.dspSta(dat)}
        list={date.lisSta()}
        name="start"
        pstn="right"
        slct={date.getSta().tim}
      />
      <TimeSelect
        chng={(dat: Spacetime) => {
          date.setEnd(dat)
          setRndr((old: boolean) => !old);
        }}
        desc="the time at which this event is expected to end"
        dspl={(dat: Spacetime): string[] => date.dspEnd(dat)}
        list={date.lisEnd()}
        name="end"
        pstn="left"
        slct={date.getEnd().tim}
      />
    </>
  );
}
