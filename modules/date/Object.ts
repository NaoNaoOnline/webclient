import spacetime, { Spacetime } from "spacetime"

interface Range {
  min: Spacetime;
  tim: Spacetime;
  max: Spacetime;
}

export default class DateObject {
  private day: Range;
  private end: Range;
  private sta: Range;

  constructor(tim: Spacetime) {
    this.day = {
      min: spacetime(0),
      tim: spacetime(0),
      max: spacetime(0),
    };

    this.sta = {
      min: spacetime(0),
      tim: spacetime(0),
      max: spacetime(0),
    };

    this.end = {
      min: spacetime(0),
      tim: spacetime(0),
      max: spacetime(0),
    };

    {
      this.setTim(tim);
    }
  }

  private addHou(day: Spacetime, hou: number): Spacetime {
    return day.add(hou, "hour");
  }

  private addMin(day: Spacetime, min: number): Spacetime {
    return day.add(min, "minute");
  }

  private difDay(sta: Spacetime, end: Spacetime): number {
    return sta.startOf("day").diff(end.startOf("day"), "day");
  }

  private maxDat(fir: Spacetime, sec: Spacetime): Spacetime {
    if (fir.isAfter(sec)) {
      return fir;
    }

    return sec;
  }

  private mrgDat(day: Spacetime, tim: Spacetime): Spacetime {
    return day.time(tim.time());
  }

  private nxtDat(dat: Spacetime): Spacetime {
    return dat.next("quarterHours");
  }

  private setEod(dat: Spacetime): Spacetime {
    return dat.endOf("day");
  }

  private setSod(dat: Spacetime): Spacetime {
    return dat.startOf("day");
  }

  dspDay(day: Spacetime): string[] {
    const dif = this.difDay(this.day.min, day);
    const fmt = day.format('{date-ordinal} {month-short}');

    if (dif === 0) {
      return ["Today", `(${fmt})`];
    } else if (dif === 1) {
      return ["Tomorrow", `(${fmt})`];
    } else {
      return [`in ${dif} Days`, `(${fmt})`];
    }
  }

  dspEnd(day: Spacetime): string[] {
    const frm = this.sta.tim.clone();
    const sec = frm.diff(day, "second");

    const hou = Math.floor(sec / (60 * 60));
    const min = Math.floor((sec % (60 * 60)) / 60);

    const abs = day.format('{hour-24-pad}:{minute-pad}');
    const rel = `(${String(hou).padStart(2, '0')}:${String(min).padStart(2, '0')})`;

    if (day.isBefore(frm)) {
      return [abs, ""];
    }

    return [abs, rel];
  }

  dspSta(day: Spacetime): string[] {
    const frm = this.day.tim.clone();
    const sec = frm.diff(day, "second");

    const hou = Math.floor(sec / (60 * 60));
    const min = Math.floor((sec % (60 * 60)) / 60);

    const abs = day.format('{hour-24-pad}:{minute-pad}');
    const rel = `(${String(hou).padStart(2, '0')}:${String(min).padStart(2, '0')})`;

    if (this.day.min.date() !== this.day.tim.date()) {
      return [abs, ""];
    }

    return [abs, rel];
  }

  getDay(): Range {
    return this.day;
  }

  getEnd(): Range {
    return this.end;
  }

  getSta(): Range {
    return this.sta;
  }

  lisDay(): Spacetime[] {
    const lis: Spacetime[] = [];

    let cur: Spacetime = this.day.min.clone();
    let end: Spacetime = this.day.max.clone();

    while (!cur.isAfter(end)) {
      lis.push(cur.clone());
      cur = cur.add(1, "day");
    }

    return lis;
  }

  lisEnd(): Spacetime[] {
    const lis: Spacetime[] = [];
    const bnd: Spacetime = this.sta.tim.add(4, "hour");

    let cur: Spacetime = this.end.min.clone();
    let end: Spacetime = this.end.max.clone();

    if (bnd.isAfter(end)) {
      end = bnd;
    }

    while (!cur.isAfter(end)) {
      lis.push(cur.clone());
      cur = cur.add(15, "minute");
    }

    return lis;
  }

  lisSta(): Spacetime[] {
    const lis: Spacetime[] = [];

    let cur: Spacetime = this.sta.min.clone();
    let end: Spacetime = this.sta.max.clone();

    while (!cur.isAfter(end)) {
      lis.push(cur.clone());
      cur = cur.add(15, "minute");
    }

    return lis;
  }

  setDay(day: Spacetime) {
    if (day.date() === this.day.tim.date()) {
      this.day.tim = day.clone();

      this.sta.min = this.day.tim.clone();
      this.sta.tim = this.day.tim.clone();
      this.sta.max = this.setEod(this.day.tim);

      this.end.min = this.addMin(this.sta.tim, 15);
      this.end.tim = this.addHou(this.sta.tim, 1);
      this.end.max = this.addHou(this.sta.tim, 4);
    } else {
      this.day.tim = day.clone();

      if (this.sta.min.isEqual(this.sta.tim)) {
        this.sta.min = this.setSod(this.day.tim);
        this.sta.tim = this.day.tim.clone();
        this.sta.max = this.setEod(this.day.tim);
      } else {
        this.sta.min = this.setSod(this.day.tim);
        this.sta.tim = this.mrgDat(this.day.tim, this.sta.tim);
        this.sta.max = this.setEod(this.day.tim);
      }

      this.end.min = this.addMin(this.sta.tim, 15);
      this.end.tim = this.addHou(this.sta.tim, 1);
      this.end.max = this.addHou(this.sta.tim, 4);
    }
  }

  setEnd(dat: Spacetime) {
    this.end.tim = dat;
  }

  setSta(dat: Spacetime) {
    this.sta.tim = dat.clone();

    this.end.min = this.addMin(this.sta.tim, 15);
    this.end.tim = this.addHou(this.sta.tim, 1);
    this.end.max = this.addHou(this.sta.tim, 4);
  }

  setTim(tim: Spacetime) {
    if (this.day.min.date() !== this.day.tim.date()) {
      // If the user selected any other day than "today", setTim has no function
      // at all. In that case the user wants to configure the date and time for
      // an event in the future, and all setTim is supposed to do is to bump up
      // the minimum time values if the clock time moves us into the new time
      // interval. 
      return
    }

    // Move up dat if necessary. 
    this.day.min = this.maxDat(this.day.min, this.nxtDat(tim));
    this.day.tim = this.maxDat(this.day.tim, this.nxtDat(tim));
    this.day.max = this.maxDat(this.day.max, this.day.min.add(30, "day"));

    // Move up sta if necessary. 
    this.sta.min = this.maxDat(this.sta.min, this.day.tim.clone());
    this.sta.tim = this.maxDat(this.sta.tim, this.day.tim.clone());
    this.sta.max = this.maxDat(this.sta.max, this.setEod(this.day.tim));

    // Move up end if necessary. 
    this.end.min = this.maxDat(this.end.min, this.addMin(this.sta.tim, 15));
    this.end.tim = this.maxDat(this.end.tim, this.addHou(this.sta.tim, 1));
    this.end.max = this.maxDat(this.end.max, this.addHou(this.sta.tim, 4));
  }
}
