import { MutableRefObject, useEffect, useRef, useState } from "react";

import Link from "next/link";

import { PageHeader } from "@/components/app/layout/PageHeader";
import { RowGrid } from "@/components/app/layout/RowGrid";
import { ErrorPropsObject } from "@/components/app/toast/ErrorToast";
import { useToast } from "@/components/app/toast/ToastProvider";

import { LabelSearchResponse } from "@/modules/api/label/search/Response";
import { LabelSearch } from "@/modules/api/label/search/Search";
import { UserSearch } from "@/modules/api/user/search/Search";

interface Props {
  user: string;
}

export const LabelOverview = (props: Props) => {
  const { addErro } = useToast();

  const [labl, setLabl] = useState<LabelSearchResponse[] | null>(null);
  const [ldng, setLdng] = useState<boolean>(true);

  const clld: MutableRefObject<boolean> = useRef(false);

  useEffect(() => {
    const getData = async function (): Promise<void> {
      try {
        const [use] = await UserSearch([{ user: "", name: props.user, self: false }]);
        const lab = await LabelSearch([{ labl: "", user: use.user, kind: "" }]);

        if (lab.length === 0) {
          setLabl([]);
          setLdng(false);
          return;
        }

        setLabl(lab);
        setLdng(false);
      } catch (err) {
        addErro(new ErrorPropsObject("Gotta say it how it is comrade, the end is near", err as Error));
        setLdng(false);
      }
    };

    if (!clld.current) {
      clld.current = true;
      getData();
    }
  }, [props, addErro]);

  if (ldng === true) return <></>;

  return (
    <>
      {!labl || labl.length === 0 && (
        <div className="m-8">
          <div className="flex mb-4 text-4xl justify-center">
            <span>🤨</span>
          </div>
          <div className="flex text-2xl justify-center">
            <span className="text-gray-400 dark:text-gray-500">There are no labels. Beavers ate them all!</span>
          </div>
        </div>
      )}

      {/*
      We keep the outer div to make the nth-child background colouring of the
      list content work properly to start at the first child. When we remove the
      outer div the ListHeader above becomes the first child and the alternating
      background colour change effectively flips.
       */}
      <div>
        {labl && srtLabl(labl).map((x, i) => (
          <RowGrid
            key={i}
            list={true}
            subj={
              <Link
                href={"/label/" + x.kind + "/" + x.name}
                className="text-sm hover:underline"
              >
                {x.name}
              </Link>
            }
          />
        ))}
      </div>
    </>
  );
};

const srtLabl = (lis: LabelSearchResponse[]): LabelSearchResponse[] => {
  lis.sort((x: LabelSearchResponse, y: LabelSearchResponse) => {
    if (x.name < y.name) return -1;
    if (x.name > y.name) return +1;
    return 0;
  });

  return lis;
};
