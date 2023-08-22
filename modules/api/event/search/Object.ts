import { EventSearchResponse } from "@/modules/api/event/search/Response";
import { LabelSearchResponse } from "@/modules/api/label/search/Response";

export class EventSearchObject {
  private res: EventSearchResponse;

  constructor(res: EventSearchResponse) {
    this.res = res;
  }

  //
  // intern
  //

  // crtd returns the time of event creation based on tis.res.crtd, which is a
  // string of unix seconds.
  crtd(): Date {
    return new Date(Number(this.res.crtd) * 1000);
  }

  evnt(): string {
    return this.res.evnt;
  }

  // TODO resolve user name.
  user(): string {
    return this.res.user;
  }

  //
  // public
  //

  // cate returns category label names based on this.res.cate, which is a comma
  // separated string of label IDs, matching any of lsr.labl.
  cate(lsr: LabelSearchResponse[]): string[] {
    const ids = this.res.cate.split(',').map(item => item.trim());
    const lab = lsr.filter(x => ids.includes(x.labl));
    return lab.map(x => x.name);
  }

  // dura returns the end date time between this.res.time and this.res.dura,
  // which are strings of the number of unix seconds respectively.
  dura(): Date {
    return new Date(Number(this.res.time) + Number(this.res.dura) * 1000);
  }

  // cate returns host label names based on this.res.host, which is a comma
  // separated string of label IDs, matching any of lsr.labl.
  host(lsr: LabelSearchResponse[]): string[] {
    const ids = this.res.host.split(',').map(item => item.trim());
    const lab = lsr.filter(x => ids.includes(x.labl));
    return lab.map(x => x.name);
  }

  link(): string {
    return this.res.link;
  }

  // time returns the start date of this.res.time, which is a string of unix
  // seconds.
  time(): Date {
    return new Date(Number(this.res.time) * 1000);
  }
}
