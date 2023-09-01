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

  // console.log("dat", dat) // 05.08.23
  // console.log("sta", sta) // 18:00
  // console.log("end", end) // 19:00

  return {
    atkn: atk,
    cate: cat.join(','),
    dura: newDura(sta, end),
    host: hos.join(','),
    link: newLink(lin),
    time: newTime(dat, sta),
  };
}

// newDura takes the start and end time of an event in 24 hour format like shown
// below and returns the amount of seconds the new event is expected to last.
// The returned duration might be negative, causing the RPC API to return an
// error response.
//
//     @inp[0] the event start time, e.g. 15:00
//     @inp[1] the event end time, e.g. 16:00
//
function newDura(sta: string, end: string): string {
  const [sth, stm] = sta.split(':').map(Number);
  const [enh, enm] = end.split(':').map(Number);

  const sts = sth * 3600 + stm * 60;
  const ens = enh * 3600 + enm * 60;

  return (ens - sts).toString();
}

function newLink(lin: string): string {
  return lin;
}

function newTime(dat: string, sta: string): string {
  const [day, mon, yea] = dat.split('.').map(Number);
  const [hou, min] = sta.split(':').map(Number);

  const bas = new Date(yea + 2000, mon - 1, day, hou, min);

  bas.setMinutes(bas.getMinutes() - bas.getTimezoneOffset());

  const utc = new Date(bas.getUTCFullYear(), bas.getUTCMonth(), bas.getUTCDate(), bas.getUTCHours(), bas.getUTCMinutes());

  return Math.floor(utc.getTime() / 1000).toString();
}

