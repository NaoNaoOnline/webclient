import { DescriptionSearchResponse } from "@/modules/api/description/search/Response";
import { UserProfile } from "@auth0/nextjs-auth0/dist/client";
import spacetime, { Spacetime } from "spacetime";

export default class EventSearchObject {
  private res: DescriptionSearchResponse;

  constructor(res: DescriptionSearchResponse) {
    this.res = res;
  }

  //
  // local
  //

  // imag returns the locally augmented user profile image of this description's
  // owner.
  imag(): string {
    return this.res.imag;
  }

  // name returns the locally augmented user profile name of this description's
  // owner.
  name(): string {
    return this.res.name;
  }

  //
  // intern
  //

  // crtd returns the spacetime of description creation in UTC.
  crtd(): Spacetime {
    return spacetime(Number(this.res.crtd) * 1000).goto("GMT");
  }

  // desc returns the object ID of this description.
  desc(): string {
    return this.res.desc;
  }

  // user returns the object ID of the user that created this description.
  user(): string {
    return this.res.user;
  }

  //
  // extern
  //

  likeAmnt(): number {
    for (let i = 0; i < this.res.extern.length; i++) {
      if (this.res.extern[i].kind == "like") {
        return Number(this.res.extern[i].amnt);
      }
    }

    return 0;
  }

  likeUser(): boolean {
    for (let i = 0; i < this.res.extern.length; i++) {
      if (this.res.extern[i].kind == "like") {
        return this.res.extern[i].user;
      }
    }

    return false;
  }

  //
  // public
  //

  // evnt returns the event ID of this description.
  evnt(): string {
    return this.res.evnt;
  }

  // text returns the description text.
  text(): string {
    return this.res.text;
  }

  //
  // ownership
  //

  // ownr expresses whether the given user is the owner of this description.
  ownr(use: UserProfile | undefined): boolean {
    return this.user() === use?.intern?.uuid;
  }

  //
  // time
  //

  // cupd expresses whether this description can still be updated. The threshold
  // here is until 5 minutes after creation.
  cupd(now: Spacetime): boolean {
    return !now.isBefore(this.crtd().add(5, "minute"));
  }

  // crtd returns the spacetime of description creation in UTC.
  unix(): string {
    return this.res.crtd;
  }
}
