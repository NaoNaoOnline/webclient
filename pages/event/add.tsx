import { useState, FormEvent, KeyboardEvent } from 'react'
import { useUser } from '@auth0/nextjs-auth0/client';

import Header from '@/components/app/layout/Header'

import TextInput from '@/components/app/event/add/TextInput'
import LabelInput from '@/components/app/event/add/LabelInput'
import LinkInput from '@/components/app/event/add/LinkInput'
import TimeBar from '@/components/app/event/add/TimeBar'

import ErrorToast from '@/components/app/toast/ErrorToast'
import InfoToast from '@/components/app/toast/InfoToast'
import ProgressToast from '@/components/app/toast/ProgressToast'
import SuccessToast from '@/components/app/toast/SuccessToast'

import { EventCreate } from '@/modules/api/event/create/Create'
import { NewEventCreateRequest } from '@/modules/api/event/create/Request'
import { DescriptionCreate } from '@/modules/api/description/create/Create'
import { NewDescriptionCreateRequestFromFormData } from '@/modules/api/description/create/Request'
import { LabelCreate } from '@/modules/api/label/create/Create'
import { LabelCreateRequest } from '@/modules/api/label/create/Request'
import { LabelCreateResponse } from "@/modules/api/label/create/Response";
import { LabelSearchResponse } from "@/modules/api/label/search/Response";

import CacheApiLabel from '@/modules/cache/api/Label';
import CacheAuthToken from '@/modules/cache/auth/Token';

import Errors from '@/modules/errors/Errors';

export default function Page() {
  const { user, isLoading } = useUser();

  const [blck, setBlck] = useState<string[]>([]);
  const [cmpl, setCmpl] = useState<number>(0);
  const [cncl, setCncl] = useState<boolean>(false);
  const [evnt, setEvnt] = useState<string>("");
  const [erro, setErro] = useState<Errors[]>([]);
  const [sbmt, setSbmt] = useState<boolean[]>([]);

  const cat: string = CacheAuthToken(user ? true : false);
  const cal: LabelSearchResponse[] = CacheApiLabel();

  const bltn: string[] = [...cal.filter((x: LabelSearchResponse) => x.kind === "bltn").map((y) => y.name), ...blck]
  const cate: string[] = [...cal.filter((x: LabelSearchResponse) => x.kind === "cate").map((y) => y.name)]
  const host: string[] = [...cal.filter((x: LabelSearchResponse) => x.kind === "host").map((y) => y.name)]

  const handleSubmit = async (evn: FormEvent) => {
    evn.preventDefault();
    setCmpl(10);
    setCncl(false);
    setSbmt((old: boolean[]) => [...old, true]);

    const frm = new FormData(evn.target as HTMLFormElement);

    try {
      // Get clean string lists for the user category input and user host input.
      const uci = (frm.get("category-input")?.toString() || "").split(",").map(x => trmLab(x));
      const uhi = (frm.get("host-input")?.toString() || "").split(",").map(x => trmLab(x));

      // Get the list of desired category names and desired host names that
      // still have to be created.
      const dcn = unqLab(uci, cal);
      const dhn = unqLab(uhi, cal);

      // Create the category labels in the backend, if any.
      let nci: string[] = [];
      if (dcn.length > 0) {
        const res = await LabelCreate(LabelCreateRequest(cat, "cate", dcn));
        nci = res.map((x: LabelCreateResponse) => x.labl);

        // Add the created category labels to the local copy of cashed API
        // labels, so in case of an error during event creation, any label that
        // got created before the event creation failed is not causing problems
        // if the user submits the form again.
        for (let i = 0; i < res.length; i++) {
          cal.push({ labl: nci[i], kind: "cate", name: dcn[i] });
        }

        setCmpl(25);
        await new Promise(r => setTimeout(r, 200));
      }

      // Create the host labels in the backend, if any.
      let nhi: string[] = [];
      if (dhn.length > 0) {
        const res = await LabelCreate(LabelCreateRequest(cat, "host", dhn));
        nhi = res.map((x: LabelCreateResponse) => x.labl);

        // Add the created host labels to the local copy of cashed API
        // labels, so in case of an error during event creation, any label that
        // got created before the event creation failed is not causing problems
        // if the user submits the form again.
        for (let i = 0; i < res.length; i++) {
          cal.push({ labl: nhi[i], kind: "host", name: dhn[i] });
        }

        setCmpl(50);
        await new Promise(r => setTimeout(r, 200));
      }

      // Get the cached category label IDs and cached host label IDs for the
      // user input that did already exist in the backend, if any. Note that we
      // need to differentiate explicitely between label kinds, since there
      // might be category and host labels indexed with the same label names. It
      // is considered a feature that a host name cannot steal category name and
      // vice versa. In any case, this does not imply that category labels
      // having the same name as host labels makes any straight forward sense.
      // We just do not want to stand in the way of any use case that we might
      // not be able to see right now.
      const cci = cal.filter(x => x.kind === "cate" && uci.map(y => y.toLocaleLowerCase()).includes(x.name.toLocaleLowerCase())).map(z => z.labl);
      const chi = cal.filter(x => x.kind === "host" && uhi.map(y => y.toLocaleLowerCase()).includes(x.name.toLocaleLowerCase())).map(z => z.labl);

      // Create the event resource in the backend, now that we ensured our label
      // ids.
      const [evn] = await EventCreate([NewEventCreateRequest(frm, cat, cci, chi)]);
      setEvnt(evn.evnt);
      setCmpl(75);

      await new Promise(r => setTimeout(r, 400));

      const des = await DescriptionCreate(NewDescriptionCreateRequestFromFormData(frm, cat, evn.evnt));
      setCmpl(100);

      await new Promise(r => setTimeout(r, 200));
    } catch (err) {
      setCmpl(0);
      setCncl(true);
      setErro((old: Errors[]) => [...old, new Errors("Oh snap, the beavers don't want you to tell the world right now!", err as Error)]);
    }
  };

  return (
    <>
      <Header titl="Add Event" />

      <div className="px-2 mt-4 md:ml-64">
        <div className="px-2 flex grid justify-items-center">
          <div className="w-full max-w-xl dark:text-gray-50">
            {isLoading && (
              <></>
            )}
            {!isLoading && user && (
              <form onSubmit={handleSubmit}>
                <div className="grid">
                  <TimeBar />

                  <LabelInput
                    blck={bltn}
                    crtd={(val: string) => setBlck((old: string[]) => [...old, val])}
                    desc="the host labels for who is organizing this event"
                    labl={host}
                    name="host"
                    pldr="Flashbots"
                    titl="allowed are up to 5 comma separated host labels, each 3-18 characters long, without special characters"
                  />

                  <LabelInput
                    blck={bltn}
                    crtd={(val: string) => setBlck((old: string[]) => [...old, val])}
                    desc="the category labels for topics this event is about"
                    labl={cate}
                    name="category"
                    pldr="Crypto, DeFi, MEV"
                    titl="allowed are up to 5 comma separated category labels, each 3-18 characters long, without special characters"
                  />

                  <TextInput
                    desc="the short one-liner for what this event is about"
                    maxl={120}
                    minl={20}
                    name="description"
                    pldr="dicussing how EIP-4844 will change L2 economics forever"
                    ptrn={`^([A-Za-z0-9\\s,.\\:\\-'"!$%&#]+(?:\s*,\s*[A-Za-z0-9\\s,.\\:\\-'"!$%&#]+)*)$`}
                    titl={`allowed are words, numbers and: , . : - ' " ! $ % & #`}
                  />

                  <LinkInput
                    desc="the online location at which this event takes place"
                    name="link"
                    pldr="discord.gg/Flashbots"
                    titl="allowed is one valid https URL (we cover the scheme for you)"
                  />
                </div>

                <button
                  type="submit"
                  disabled={cmpl !== 0}
                  className="text-sm mb-6 font-medium rounded-lg w-full md:w-auto px-5 py-2.5 text-center disabled:text-gray-50 disabled:dark:text-gray-700 disabled:bg-gray-200 disabled:dark:bg-gray-800 enabled:text-gray-50 enabled:dark:text-gray-50 enabled:bg-blue-600 enabled:dark:bg-blue-700 enabled:hover:bg-blue-800 enabled:dark:hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-500"
                  onKeyDownCapture={(e: KeyboardEvent<HTMLButtonElement>) => e.stopPropagation()} // prevent LastPass bullshit
                >
                  Submit
                </button>

                {sbmt.map((x, i) => (
                  <ProgressToast
                    key={i}
                    cmpl={cmpl}
                    cncl={cncl}
                    desc="Adding New Event"
                    done={() => {
                      window.location.href = "/event/" + evnt;
                    }}
                  />
                ))}

                {erro.map((x, i) => (
                  <ErrorToast
                    key={i}
                    erro={x}
                  />
                ))}

                {cmpl >= 100 && (
                  <SuccessToast
                    desc="Hooray, event addedd milady!"
                  />
                )}
              </form>
            )}
            {!isLoading && !user && (
              <InfoToast
                desc="Join the beavers and login for adding a new event. Or else!"
              />
            )}
          </div>
        </div>
      </div >
    </>
  )
}

// trmLab cleans strings for their use as label names. For instance, we use
// trmLab for label names and want to ensure that no erroneous spaces become
// part of the labels.
function trmLab(str: string): string {
  // Replace multiple spaces with a single one.
  str = str.replace(/\s+/g, ' ');
  // Remove leading and trailing spaces.
  str = str.trim();

  return str;
}

// unqLab returns the list of label names that do not already exist according to
// the given LabelSearchResponse.
function unqLab(des: string[], cur: LabelSearchResponse[]): string[] {
  // Extract the current labels from the cur array.
  const lis = cur.map(x => x.name.toLocaleLowerCase());

  // Filter out labels that already exist.
  const unq = des.filter(x => !lis.includes(x.toLocaleLowerCase()));

  return unq;
}
