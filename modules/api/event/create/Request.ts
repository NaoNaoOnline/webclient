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

  let d = newDura(sta, end)
  let t = newTime(dat, sta)

  return {
    atkn: atk,
    cate: cat.join(','),
    dura: d,
    host: hos.join(','),
    link: newLink(lin),
    time: t,
  };
}

// newDura takes the start time and the end time of an event as string of
// milliseconds according to the local Date time. The event duration is returned
// as string of seconds.
function newDura(sta: string, end: string): string {
  const mil = new Date(parseInt(end, 10)).getTime() - new Date(parseInt(sta, 10)).getTime();
  return (mil / 1000).toString();
}

function newLink(lin: string): string {
  return lin;
}

// newTime takes date and start time as string of milliseconds according to the
// local Date time. The date parameter accounts for the day, month and year of
// the event time. The start time parameter accounts for the hours and minutes
// of the event taking place. Both parameters are merged and a string of unix
// seconds of the merged Date instances is returned.
function newTime(dat: string, sta: string): string {
  const mrg = mrgDat(new Date(parseInt(dat, 10)), new Date(parseInt(sta, 10)));
  mrg.setHours(mrg.getHours(), mrg.getMinutes(), 0, 0);
  return (mrg.getTime() / 1000).toString();
}

function mrgDat(day: Date, hou: Date): Date {
  const add = new Date(day);

  add.setHours(hou.getHours(), hou.getMinutes(), 0, 0);

  return add;
}
