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

  // evnt returns the object ID of this event.
  evnt(): string {
    return this.res.evnt;
  }

  // user returns the object ID of the user that created this event.
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

  // dura returns the unix seconds of this event's end date time.
  dura(): number {
    return Number(this.res.time) + Number(this.res.dura);
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

  // time returns the unix seconds of this event's start date time.
  time(): number {
    return Number(this.res.time);
  }

  //
  // custom
  //

  // actv expresses whether this event is currently ongoing based on
  // this.res.time and this.res.dura.
  actv(): boolean {
    const now = Math.floor(Date.now() / 1000);
    return now >= this.time() && now <= this.dura();
  }
}
