import { memo, useEffect, useState } from "react";

import Link from "next/link";

import { BiInfoCircle } from "react-icons/bi";

import { useAuth } from "@/components/app/auth/AuthProvider";
import { LabelButtonAdd } from "@/components/app/label/button/LabelButtonAdd";
import { LabelButtonCancel } from "@/components/app/label/button/LabelButtonCancel";
import { LabelProfileUpdateForm } from "@/components/app/label/update/LabelProfileUpdateForm";
import { LabelProfileCreateForm } from "@/components/app/label/create/LabelProfileCreateForm";
import { ListHeader } from "@/components/app/layout/ListHeader";
import { ListSeparator } from "@/components/app/layout/ListSeparator";
import { RowGrid } from "@/components/app/layout/RowGrid";
import { ErrorPropsObject } from "@/components/app/toast/ErrorToast";
import { InfoPropsObject } from "@/components/app/toast/InfoToast";
import { useToast } from "@/components/app/toast/ToastProvider";
import { Tooltip } from "@/components/app/tooltip/Tooltip";

import { LabelSearchResponse } from "@/modules/api/label/search/Response";
import { LabelSearch } from "@/modules/api/label/search/Search";
import { UserSearch } from "@/modules/api/user/search/Search";
import { UserSearchResponse } from "@/modules/api/user/search/Response";

interface Props {
  kind: string;
  name: string;
}

const LabelDetail = memo((props: Props) => {
  const { uuid } = useAuth();
  const { addErro, addInfo } = useToast();

  const [crea, setCrea] = useState<boolean>(false);
  const [labl, setLabl] = useState<LabelSearchResponse | null>(null);
  const [ownr, setOwnr] = useState<boolean>(false);
  const [user, setUser] = useState<UserSearchResponse | null>(null);

  useEffect(() => {
    const getData = async function (kin: string, nam: string): Promise<void> {
      try {
        const [res] = await LabelSearch([{ labl: "", user: "", kind: kin, name: nam }]);

        {
          setLabl(res);
        }

        if (res.user === uuid) {
          setOwnr(true);
        }
      } catch (err) {
        addErro(new ErrorPropsObject("Bookens will be written about this tragedy of a webapp, giggity!", err as Error));
      }
    };

    if (props.kind && props.name) {
      getData(props.kind, props.name);
    }
  }, [props.kind, props.name, uuid, addErro]);

  useEffect(() => {
    const getData = async function (use: string): Promise<void> {
      try {
        const [res] = await UserSearch([{ name: "", self: false, user: use }]);
        setUser(res);
      } catch (err) {
        addErro(new ErrorPropsObject("Bookens will be written about this tragedy of a webapp, giggity!", err as Error));
      }
    };

    if (labl && labl.user) {
      getData(labl.user);
    }
  }, [labl, addErro]);

  return (
    <>
      {labl && (
        <>
          <ListHeader
            titl="Name"
          />

          <RowGrid
            subj={
              <div>
                {labl.name}
              </div>
            }
          />

          <ListSeparator />
        </>
      )}

      {labl && (
        <>
          <ListHeader
            titl="Kind"
          />

          <RowGrid
            subj={
              <div>
                {labl.kind == "cate" && ("Category Label")}
                {labl.kind == "host" && ("Host Label")}
              </div>
            }
          />

          <ListSeparator />
        </>
      )}

      <ListHeader
        titl="Profiles"
        bttn={ownr ? (
          <>
            {!crea ? (
              <>
                <Tooltip
                  desc={
                    <div>
                      <div>use <b>add</b> to link an external</div>
                      <div>account to this label here</div>
                    </div>
                  }
                  side="left"
                >
                  <BiInfoCircle
                    className="w-5 h-5 text-gray-500 dark:text-gray-500"
                  />
                </Tooltip>

                <LabelButtonAdd
                  clck={() => {
                    setCrea(true);
                  }}
                />
              </>
            ) : (
              <LabelButtonCancel
                clck={() => {
                  setCrea(false);
                }}
              />
            )}
          </>
        ) : (
          undefined
        )}
      />

      <div>
        {labl && Object.entries(labl.prfl).map(([k, v]) => (
          <LabelProfileUpdateForm
            key={k}
            dltd={(key: string) => {
              delete labl.prfl[key];
              setLabl(labl);
            }}
            done={(val: string) => {
              if (val === v) {
                addInfo(new InfoPropsObject("Nothing to change here, don't worry mate. No biggie at all!"));
              } else {
                labl.prfl[k] = val;
                setLabl(labl);
              }
            }}
            labl={labl.labl}
            ownr={ownr}
            pkey={k}
            pval={v}
          />
        ))}

        {labl && crea && (
          <LabelProfileCreateForm
            cncl={() => {
              setCrea(false);
            }}
            done={(key: string, val: string) => {
              labl.prfl[key] = val;
              setLabl(labl);
              setCrea(false);
            }}
            labl={labl.labl}
          />
        )}
      </div >

      <ListSeparator />

      {user && (
        <>
          <ListHeader
            titl="Owner"
          />

          <RowGrid
            subj={
              <Link
                href={"/user/" + encodeURIComponent(user.name)}
                className={`
                  hover:underline hover:underline-offset-2
                `}
              >
                {user.name}
              </Link>
            }
          />

          <ListSeparator />
        </>
      )}

      {labl && (
        <>
          <ListHeader
            titl="ID"
          />

          <RowGrid
            subj={
              <div>
                {labl.labl}
              </div>
            }
          />
        </>
      )}
    </>
  );
});

LabelDetail.displayName = "LabelDetail";

export { LabelDetail };
