import { UserProfile } from "@auth0/nextjs-auth0/dist/client";

import { EventSearchResponse } from "@/modules/api/event/search/Response";
import { LabelSearchResponse } from "@/modules/api/label/search/Response";

import spacetime, { Spacetime } from "spacetime";

export default class EventSearchObject {
  private res: EventSearchResponse;

  constructor(res: EventSearchResponse) {
    this.res = res;
  }

  //
  // intern
  //

  // crtd returns the spacetime of event creation in UTC.
  crtd(): Spacetime {
    return spacetime(Number(this.res.crtd) * 1000).goto("GMT");
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
    return lab.map(x => x.name).sort();
  }

  // dura returns the spacetime of this event's end time in UTC.
  dura(): Spacetime {
    return spacetime((Number(this.res.time) * 1000) + (Number(this.res.dura) * 1000)).goto("GMT");
  }

  // cate returns host label names based on this.res.host, which is a comma
  // separated string of label IDs, matching any of lsr.labl.
  host(lsr: LabelSearchResponse[]): string[] {
    const ids = this.res.host.split(',').map(item => item.trim());
    const lab = lsr.filter(x => ids.includes(x.labl));
    return lab.map(x => x.name).sort();
  }

  link(): string {
    return this.res.link;
  }

  // time returns the spacetime of this event's start time in UTC.
  time(): Spacetime {
    return spacetime(Number(this.res.time) * 1000).goto("GMT");
  }

  //
  // extern
  //

  linkAmnt(): number {
    for (let i = 0; i < this.res.extern.length; i++) {
      if (this.res.extern[i].kind == "link") {
        return Number(this.res.extern[i].amnt);
      }
    }

    return 0;
  }

  linkUser(): boolean {
    for (let i = 0; i < this.res.extern.length; i++) {
      if (this.res.extern[i].kind == "link") {
        return this.res.extern[i].user;
      }
    }

    return false;
  }

  //
  // ownership
  //

  // ownr expresses whether the given user is the owner of this event.
  ownr(use: UserProfile | undefined): boolean {
    return this.user() === use?.intern?.uuid;
  }


  //
  // time
  //

  // actv expresses whether this event is currently ongoing based on it's start
  // and end time.
  actv(now: Spacetime): boolean {
    return now.isBetween(this.time(), this.dura().subtract(1, "second"), true);
  }

  // hpnd expresses whether this event has already happened according to its end
  // time.
  hpnd(now: Spacetime): boolean {
    return !now.isBefore(this.dura());
  }

  // upcm expresses whether this event is coming up next within 1 hour of its
  // start time.
  upcm(now: Spacetime): boolean {
    return now.isBetween(this.time().subtract(1, "hour"), this.time().subtract(1, "second"), true);
  }

  // crtd returns the spacetime of event creation in UTC.
  unix(): string {
    return this.res.crtd;
  }

  //
  // display
  //

  dsplActv(now: Spacetime): string {
    return `${this.time().diff(now, "minute")}m ago - ${now.startOf("minute").diff(this.dura(), "minute")}m left`;
  }

  dsplLink(now: Spacetime): string {
    if (this.hpnd(now)) {
      return "already happened";
    }

    if (this.actv(now)) {
      return "join now now";
    }

    if (this.upcm(now)) {
      return "coming up next";
    }

    if (this.time().isBefore(now.next("day"))) {
      return "later today";
    }

    if (this.time().isBefore(now.add(1, "day").next("day"))) {
      return "tomorrow";
    }

    if (this.time().isBefore(now.add(6, "day").next("day"))) {
      return "in the next days";
    }

    return "in the future";
  }

  dsplUpcm(now: Spacetime): string {
    return `in ${now.startOf("minute").diff(this.time(), "minute")}m`;
  }
}
