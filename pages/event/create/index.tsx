import { useState, FormEvent, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";

import { useCache } from "@/components/app/cache/CacheProvider";

import { TextInput } from "@/components/app/event/create/TextInput";
import LabelInput from "@/components/app/event/create/LabelInput";
import { LinkInput } from "@/components/app/event/create/LinkInput";
import TimeBar from "@/components/app/event/create/TimeBar";

import { PageHeader } from "@/components/app/layout/PageHeader";

import { ErrorPropsObject } from "@/components/app/toast/ErrorToast";
import { ProgressPropsObject } from "@/components/app/toast/ProgressToast";
import { SuccessPropsObject } from "@/components/app/toast/SuccessToast";
import { useToast } from "@/components/app/toast/ToastProvider";

import { useAuth } from "@/components/app/auth/AuthProvider";

import { EventCreate } from "@/modules/api/event/create/Create";
import { NewEventCreateRequest } from "@/modules/api/event/create/Request";
import { DescriptionCreate } from "@/modules/api/description/create/Create";
import { NewDescriptionCreateRequestFromFormData } from "@/modules/api/description/create/Request";
import { LabelCreate } from "@/modules/api/label/create/Create";
import { LabelCreateRequest } from "@/modules/api/label/create/Request";
import { LabelCreateResponse } from "@/modules/api/label/create/Response";
import { LabelSearchResponse } from "@/modules/api/label/search/Response";

export default function Page() {
  const { atkn, auth, uuid } = useAuth();
  const { labl } = useCache();
  const { addErro, addPgrs, addScss } = useToast();
  const nxtrtr = useRouter();

  const [blck, setBlck] = useState<string[]>([]);

  const bltn: string[] = [...labl.filter((x: LabelSearchResponse) => x.kind === "bltn").map((y) => y.name), ...blck]
  const cate: string[] = [...labl.filter((x: LabelSearchResponse) => x.kind === "cate").map((y) => y.name)]
  const host: string[] = [...labl.filter((x: LabelSearchResponse) => x.kind === "host").map((y) => y.name)]

  const pgrs: ProgressPropsObject = new ProgressPropsObject("Adding New Event");
  const scss: SuccessPropsObject = new SuccessPropsObject("Hooray, event addedd milady!");

  const handleSubmit = async (evn: FormEvent<HTMLFormElement>) => {
    evn.preventDefault();

    addPgrs(pgrs);

    const frm = new FormData(evn.target as HTMLFormElement);

    try {
      // Get clean string lists for the user category input and user host input.
      const uci = (frm.get("category-input")?.toString() || "").split(",").map(x => trmLab(x));
      const uhi = (frm.get("host-input")?.toString() || "").split(",").map(x => trmLab(x));

      // Get the list of desired category names and desired host names that
      // still have to be created.
      const dcn = unqLab(uci, labl);
      const dhn = unqLab(uhi, labl);

      // Create the category labels in the backend, if any.
      let nci: string[] = [];
      if (dcn.length > 0) {
        const res = await LabelCreate(LabelCreateRequest(atkn, "cate", dcn));
        nci = res.map((x: LabelCreateResponse) => x.labl);

        // Add the created category labels to the local copy of cashed API
        // labels, so in case of an error during event creation, any label that
        // got created before the event creation failed is not causing problems
        // if the user submits the form again.
        for (let i = 0; i < res.length; i++) {
          labl.push({ crtd: res[i].crtd, labl: nci[i], user: uuid, kind: "cate", name: dcn[i], prfl: {} });
        }

        pgrs.setCmpl(25);
        await new Promise(r => setTimeout(r, 200));
      }

      // Create the host labels in the backend, if any.
      let nhi: string[] = [];
      if (dhn.length > 0) {
        const res = await LabelCreate(LabelCreateRequest(atkn, "host", dhn));
        nhi = res.map((x: LabelCreateResponse) => x.labl);

        // Add the created host labels to the local copy of cashed API
        // labels, so in case of an error during event creation, any label that
        // got created before the event creation failed is not causing problems
        // if the user submits the form again.
        for (let i = 0; i < res.length; i++) {
          labl.push({ crtd: res[i].crtd, labl: nhi[i], user: uuid, kind: "host", name: dhn[i], prfl: {} });
        }

        pgrs.setCmpl(50);
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
      const cci = labl.filter(x => x.kind === "cate" && uci.map(y => y.toLocaleLowerCase()).includes(x.name.toLocaleLowerCase())).map(z => z.labl);
      const chi = labl.filter(x => x.kind === "host" && uhi.map(y => y.toLocaleLowerCase()).includes(x.name.toLocaleLowerCase())).map(z => z.labl);

      // Create the event resource in the backend, now that we ensured our label
      // ids.
      const [evn] = await EventCreate([NewEventCreateRequest(frm, atkn, cci, chi)]);

      pgrs.setCmpl(75);
      await new Promise(r => setTimeout(r, 400));

      const [des] = await DescriptionCreate(NewDescriptionCreateRequestFromFormData(frm, atkn, evn.evnt));

      pgrs.setDone(() => {
        nxtrtr.push("/event/" + evn.evnt);
      });

      addScss(scss);
      await new Promise(r => setTimeout(r, 200));

    } catch (err) {
      addErro(new ErrorPropsObject("Oh snap, the beavers don't want you to tell the world right now!", err as Error));
    }
  };

  // In case unauthenticated users try to access a page that is meant to only
  // render content for authenticated users, we redirect to the generic login
  // page. We do not use info toasts since this would cause duplicated or
  // infinite re-renders based on how the webapp works right now.
  if (!auth) {
    return nxtrtr.push("/login");
  }

  return (
    <>
      <PageHeader titl="Add Event" />

      <form onSubmit={handleSubmit}>
        <div className="grid">
          <TimeBar />

          <LabelInput
            blck={bltn}
            crtd={(val: string) => setBlck((old: string[]) => [...old, val])}
            desc={
              <div>
                <div>the host labels for who</div>
                <div>is organizing this event</div>
              </div>
            }
            labl={host}
            name="host"
            pldr="Flashbots"
            titl="allowed are up to 5 comma separated host labels, each between 2 and 25 characters long, without special characters"
          />

          <LabelInput
            blck={bltn}
            crtd={(val: string) => setBlck((old: string[]) => [...old, val])}
            desc={
              <div>
                <div>the category labels for</div>
                <div>what this event is about</div>
              </div>
            }
            labl={cate}
            name="category"
            pldr="Crypto, DeFi, MEV"
            titl="allowed are up to 5 comma separated category labels, each between 2 and 25 characters long, without special characters"
          />

          <TextInput
            desc={
              <div>
                <div>the short one-liner for</div>
                <div>what this event is about</div>
              </div>
            }
            maxl={120}
            minl={20}
            name="description"
            pldr="dicussing how EIP-4844 will change L2 economics forever"
            ptrn={`^([A-Za-z0-9\\s,.\\:\\-'"!$%&#]+(?:\s*,\s*[A-Za-z0-9\\s,.\\:\\-'"!$%&#]+)*)$`}
            span="mb-6"
            titl={`allowed are words, numbers and: , . : - ' " ! $ % & #`}
          />

          <LinkInput
            desc={
              <div>
                <div>the online location where</div>
                <div>this event is happening</div>
              </div>
            }
            name="link"
            pldr="discord.gg/Flashbots"
            titl="allowed is one valid https URL (we cover the scheme for you)"
          />
        </div>

        <button
          type="submit"
          disabled={pgrs.getCmpl() !== 0}
          className="text-sm mb-6 font-medium rounded-lg w-full md:w-auto px-5 py-2.5 text-center disabled:text-gray-50 disabled:dark:text-gray-700 disabled:bg-gray-200 disabled:dark:bg-gray-800 enabled:text-gray-50 enabled:dark:text-gray-50 enabled:bg-blue-600 enabled:dark:bg-blue-700 enabled:hover:bg-blue-800 enabled:dark:hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-500"
          onKeyDownCapture={(e: KeyboardEvent<HTMLButtonElement>) => e.stopPropagation()} // prevent LastPass bullshit
        >
          Submit
        </button>
      </form>
    </>
  )
}

// trmLab cleans strings for their use as label names. For instance, we use
// trmLab for label names and want to ensure that no erroneous spaces become
// part of the labels.
function trmLab(str: string): string {
  // Replace multiple spaces with a single one.
  str = str.replace(/\s+/g, " ");
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
