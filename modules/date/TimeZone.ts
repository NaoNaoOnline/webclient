import spacetime, { Spacetime } from "spacetime";
import soft, { DisplayFormat } from "timezone-soft";



const locl: Zone = zone(spacetime.now());

const list: Zone[] = [];

list.push(locl);
list.push({ iana: "Etc/GMT", lowr: { name: "(gmt / utc)", shrt: "utc" }, user: { name: "(GMT / UTC)", shrt: "UTC" } });

Object.keys(spacetime.timezones()).forEach((x: string) => {
  if (x.includes("etc")) return;
  if (x.includes("gmt")) return;
  if (x.includes("greenwich")) return;
  if (x.includes("uct")) return;
  if (x.includes("universal")) return;
  if (x.includes("utc")) return;
  if (x.includes("zulu")) return;

  soft(x).forEach((y: DisplayFormat) => {
    if (!y) return;

    uniq(zone(spacetime().goto(y.iana)));
  });
});

list.sort((x: Zone, y: Zone) => {
  if (x.lowr.shrt < y.lowr.shrt) return -1;
  if (x.lowr.shrt > y.lowr.shrt) return 1;
  return 0;
});



function frmt(x: string): string {
  const spl = x.replace(/_/g, " ").split("/");

  if (spl.length === 2) {
    return `(${spl[0]} / ${spl[1]})`;
  }

  if (spl.length === 3) {
    return `(${spl[0]} / ${spl[2]})`;
  }

  return `(${x})`;
};

function uniq(zon: Zone) {
  if (!list.some((x) => x.lowr.name === zon.lowr.name && x.lowr.shrt === zon.lowr.shrt) && !zon.lowr.name.includes("Etc")) {
    list.push(zon);
  }
}

function zone(tim: Spacetime): Zone {
  const curr: DisplayFormat = soft(tim.timezone().name)[0];
  const name: string = frmt(tim.timezone().name);
  const lowr: string = name.toLocaleLowerCase();

  if (tim.hasDST() && tim.isDST() && curr?.daylight?.abbr) {
    return {
      iana: curr.iana,
      lowr: {
        name: lowr,
        shrt: curr.daylight.abbr.toLocaleLowerCase(),
      },
      user: {
        name: name,
        shrt: curr.daylight.abbr,
      },
    };
  }

  return {
    iana: curr.iana,
    lowr: {
      name: lowr,
      shrt: curr.standard.abbr.toLocaleLowerCase(),
    },
    user: {
      name: name,
      shrt: curr.standard.abbr,
    },
  };
}



export interface Info {
  name: string;
  shrt: string;
}

export interface Zone {
  iana: string;
  lowr: Info;
  user: Info;
}

export const List = list;
export const Locl = locl;
