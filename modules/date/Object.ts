interface Props {
  min: Date;
  tim: Date;
  max: Date;
}

export default class DateObject {
  private dat: Date;
  private end: Props;
  private now: Date;
  private sta: Props;

  constructor(dat?: Date | undefined, end?: Props | undefined, now?: Date | undefined, sta?: Props | undefined) {
    if (now) {
      this.now = now;
    } else {
      this.now = this.rndDat(new Date());
    }

    if (dat) {
      this.dat = dat;
    } else {
      this.dat = this.setSod(new Date());
    }

    if (sta) {
      this.sta = sta;
    } else {
      this.sta = {
        min: new Date(this.now),
        tim: new Date(this.now),
        max: this.setEod(new Date()),
      };
    }

    if (end) {
      this.end = end;
    } else {
      this.end = {
        min: this.addMin(this.sta.tim, 15),
        tim: this.addHou(this.sta.tim, 1),
        max: this.addHou(this.sta.tim, 4),
      };
    }

    if (this.end.max > this.setEod(new Date())) {
      // this.end.max = this.setEod(new Date());
    }
  }

  private addHou(dat: Date, hou: number): Date {
    const add = new Date(dat);

    add.setHours(add.getHours() + hou);

    return add;
  }

  private addMin(dat: Date, min: number): Date {
    const add = new Date(dat);

    add.setMinutes(add.getMinutes() + min);

    return add;
  }

  private difHou(sta: Date, end: Date): number {
    return end.getTime() - sta.getTime() / (1000 * 60 * 60);
  }

  private mrgDat(day: Date, hou: Date): Date {
    const add = new Date(day);

    add.setHours(hou.getHours(), hou.getMinutes(), 0, 0);

    return add;
  }

  private rndDat(dat: Date): Date {
    const rnd: number = 1000 * 60 * 15; // 15 minutes in milliseconds
    return new Date(Math.ceil(dat.getTime() / rnd) * rnd);
  }

  private setEod(dat: Date): Date {
    const add = new Date(dat);

    add.setHours(23, 59, 59, 999);

    return add;
  }

  private setSod(dat: Date): Date {
    const add = new Date(dat);

    add.setHours(0, 0, 0, 0);

    return add;
  }

  copy(): DateObject {
    return new DateObject(this.dat, this.end, this.now, this.sta);
  }

  getHou(): Date[] {
    const lis: Date[] = [];

    const cur: Date = this.setSod(this.dat);
    const bnd: Date = this.addHou(this.sta.tim, 4);

    let end: Date = this.setEod(this.dat);
    if (bnd.getTime() > end.getTime()) {
      end = bnd;
    }

    while (cur <= end) {
      lis.push(new Date(cur));
      cur.setMinutes(cur.getMinutes() + 15);
    }

    return lis;
  }

  getDat(): Date {
    return this.dat;
  }

  getDay(): Date[] {
    const lis: Date[] = [];

    const cur: Date = this.setSod(this.now);
    const end: Date = this.addHou(this.now, 24 * 30);

    while (cur <= end) {
      lis.push(new Date(cur));
      cur.setHours(cur.getHours() + 24);
    }

    return lis;
  }

  getEnd(): Props {
    return this.end;
  }

  getNow(): Date {
    return this.now;
  }

  getSta(): Props {
    return this.sta;
  }

  setDat(dat: Date) {
    this.dat = this.setSod(dat);

    if (dat.getDate() === this.now.getDate()) {
      if (this.mrgDat(this.now, this.sta.tim).getTime() < this.now.getTime()) {
        this.sta.tim = this.now;
        this.end.tim = this.addHou(this.now, 1);
      }

      this.sta.min = this.rndDat(this.now);
      this.sta.tim = this.mrgDat(this.now, this.sta.tim);
      this.sta.max = this.setEod(this.now);

      this.end.min = this.addMin(this.sta.min, 15)
      this.end.tim = this.mrgDat(this.sta.tim, this.end.tim);
      this.end.max = this.addHou(this.sta.tim, 4);
    } else {
      this.sta.min = this.setSod(dat);
      this.sta.tim = this.mrgDat(dat, this.sta.tim);
      this.sta.max = this.setEod(dat);

      this.end.min = this.setSod(dat);
      this.end.tim = this.mrgDat(dat, this.end.tim);
      this.end.max = this.addHou(this.sta.tim, 4);
    }
  }

  setSta(dat: Date) {
    this.sta.min = this.rndDat(this.now);
    this.sta.tim = this.rndDat(dat);
    this.sta.max = this.setEod(dat);

    const isd: boolean = dat.getDate() === this.now.getDate(); // is start day
    const dec: boolean = this.end.tim.getTime() === this.addHou(this.now, 1).getTime(); // default end did not change
    const sae: boolean = this.sta.tim.getTime() >= this.end.tim.getTime(); // start after end
    const ofh: boolean = this.difHou(this.sta.tim, this.end.tim) > 4; // over four hours

    if ((isd && dec) || sae || ofh) {
      this.end.tim = this.addHou(this.sta.tim, 1);
    }

    this.end.min = this.addMin(this.sta.min, 15)
    this.end.max = this.addHou(this.sta.tim, 4);
  }

  setEnd(dat: Date) {
    this.end.tim = dat;

    if (dat.getTime() <= this.sta.tim.getTime()) {
      this.sta.tim = this.addHou(dat, -1);

      if (this.sta.tim < this.sta.min) {
        this.sta.tim = this.sta.min;
      }
    }
  }
}
