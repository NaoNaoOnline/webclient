import { UserProfile } from "@auth0/nextjs-auth0/dist/client";

import { EventSearchResponse } from "@/modules/api/event/search/Response";
import { LabelSearchResponse } from "@/modules/api/label/search/Response";

import spacetime, { Spacetime } from "spacetime";
import { ReactNode } from "react";

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

  // cate returns the category labels for this event, mapping abstract label IDs
  // to canonical object representations.
  cate(all: LabelSearchResponse[]): LabelSearchResponse[] {
    const ids: string[] = this.res.cate.split(',').map(item => item.trim());

    const lab: LabelSearchResponse[] = all.filter((x: LabelSearchResponse) => ids.includes(x.labl));

    lab.sort((x: LabelSearchResponse, y: LabelSearchResponse) => {
      if (x.name < y.name) return -1;
      if (x.name > y.name) return +1;
      return 0;
    });

    return lab;
  }

  // dura returns the spacetime of this event's end time in UTC.
  dura(): Spacetime {
    return spacetime((Number(this.res.time) * 1000) + (Number(this.res.dura) * 1000)).goto("GMT");
  }

  // host returns the host labels for this event, mapping abstract label IDs to
  // canonical object representations.
  host(all: LabelSearchResponse[]): LabelSearchResponse[] {
    const ids: string[] = this.res.host.split(',').map(item => item.trim());

    const lab: LabelSearchResponse[] = all.filter((x: LabelSearchResponse) => ids.includes(x.labl));

    lab.sort((x: LabelSearchResponse, y: LabelSearchResponse) => {
      if (x.name < y.name) return -1;
      if (x.name > y.name) return +1;
      return 0;
    });

    return lab;
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
  ownr(uid: string): boolean {
    return this.user() === uid;
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
}
