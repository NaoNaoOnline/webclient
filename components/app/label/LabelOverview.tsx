import { MutableRefObject, useEffect, useRef, useState } from "react";

import Link from "next/link";

import { MdLabelOutline } from "react-icons/md";

import { ListHeader } from "@/components/app/layout/ListHeader";
import { ListSeparator } from "@/components/app/layout/ListSeparator";
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

  const [cate, setCate] = useState<LabelSearchResponse[] | null>(null);
  const [host, setHost] = useState<LabelSearchResponse[] | null>(null);
  const [ldng, setLdng] = useState<boolean>(true);

  const clld: MutableRefObject<boolean> = useRef(false);

  const gridRow = (x: LabelSearchResponse, i: number) => {
    return (
      <RowGrid
        key={i}
        list={true}
        subj={
          <Link
            href={"/event/label/" + x.kind + "/" + encodeURIComponent(x.name)}
            className={`
              text-sm
              hover:underline hover:underline-offset-2
            `}
          >
            {x.name}
          </Link>
        }
        midl={
          <Link
            href={"/label/" + x.kind + "/" + encodeURIComponent(x.name)}
            className={`
              text-sm font-mono
              invisible group-hover/RowGrid:visible
              hover:underline hover:underline-offset-2
            `}
          >
            View Label
          </Link>
        }
      />
    );
  }

  useEffect(() => {
    const getData = async function (): Promise<void> {
      try {
        const [use] = await UserSearch([{ user: "", name: props.user, self: false }]);
        const lab = await LabelSearch([{ labl: "", user: use.user, kind: "", name: "" }]);

        if (lab.length === 0) {
          setLdng(false);
          return;
        }

        setCate(filCate(lab));
        setHost(filHost(lab));
        setLdng(false);
      } catch (err) {
        addErro(new ErrorPropsObject("Haha, and you thought this would be easy!?", err as Error));
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
      {(!cate || cate.length === 0) && (!host || host.length === 0) && (
        <>
          <ListHeader
            icon={<MdLabelOutline />}
            titl={<>Labels</>}
          />

          <ListSeparator />

          <div className="m-8">
            <div className="flex mb-4 text-4xl justify-center">
              <span>🤨</span>
            </div>
            <div className="flex text-2xl justify-center">
              <span className="text-gray-500 dark:text-gray-500">There are no labels. Beavers ate them all!</span>
            </div>
          </div>
        </>
      )}

      {(cate && cate.length !== 0) && (
        <>
          <ListHeader
            icon={<MdLabelOutline />}
            titl={<>Category Labels</>}
          />

          <ListSeparator />

          {/*
          We keep the outer div to make the nth-child background colouring of
          the list content work properly to start at the first child. When we
          remove the outer div the ListHeader above becomes the first child and
          the alternating background colour change effectively flips.
          */}
          <div>
            {cate.map((x, i) => {
              return gridRow(x, i);
            })}
          </div>
        </>
      )}

      {(cate && cate.length !== 0) && (host && host.length !== 0) && (
        <ListSeparator />
      )}

      {(host && host.length !== 0) && (
        <>
          <ListHeader
            icon={<MdLabelOutline />}
            titl={<>Host Labels</>}
          />

          <ListSeparator />

          {/*
          We keep the outer div to make the nth-child background colouring of
          the list content work properly to start at the first child. When we
          remove the outer div the ListHeader above becomes the first child and
          the alternating background colour change effectively flips.
          */}
          <div>
            {host.map((x, i) => {
              return gridRow(x, i);
            })}
          </div>
        </>
      )}
    </>
  );
};

const filCate = (lis: LabelSearchResponse[]): LabelSearchResponse[] => {
  return srtLabl(lis.filter((x: LabelSearchResponse) => x.kind === "cate"));
};

const filHost = (lis: LabelSearchResponse[]): LabelSearchResponse[] => {
  return srtLabl(lis.filter((x: LabelSearchResponse) => x.kind === "host"));
};

const srtLabl = (lis: LabelSearchResponse[]): LabelSearchResponse[] => {
  lis.sort((x: LabelSearchResponse, y: LabelSearchResponse) => {
    if (x.name < y.name) return -1;
    if (x.name > y.name) return +1;
    return 0;
  });

  return lis;
};
