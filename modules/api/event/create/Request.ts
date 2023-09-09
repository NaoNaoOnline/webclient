import spacetime from "spacetime";

export interface EventCreateRequest {
  // local
  atkn: string;
  // public
  cate: string;
  dura: string;
  host: string;
  link: string;
  time: string;
}

export function NewEventCreateRequest(frm: FormData, atk: string, cat: string[], hos: string[]): EventCreateRequest {
  const lin = frm.get("link-input")?.toString() || "";
  const dat = frm.get("date-input")?.toString() || "";
  const sta = frm.get("start-input")?.toString() || "";
  const end = frm.get("end-input")?.toString() || "";

  return {
    atkn: atk,
    cate: cat.join(','),
    dura: newDura(sta, end),
    host: hos.join(','),
    link: newLink(lin),
    time: newTime(dat, sta),
  };
}

// newDura takes the start time and the end time of an event as spacetime "iso"
// formatted strings according to the local Date time. The event duration is
// returned as string of seconds.
function newDura(sta: string, end: string): string {
  return spacetime(sta).diff(spacetime(end), "second").toString();
}

// newLink adds the https:// prefix to the user input for the event link, since
// we spare people typing the scheme every time, while the backend requires it.
function newLink(lin: string): string {
  return "https://" + lin;
}

// newTime takes the start date and the start time of an event as spacetime
// "iso" formatted strings according to the local Date time. The event duration
// is returned as string of unix seconds.
function newTime(dat: string, sta: string): string {
  return (spacetime(sta).epoch / 1000).toString();
}
