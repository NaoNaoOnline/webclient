import { MouseEvent, ReactElement, cloneElement } from "react";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import { DotHalfFillIcon } from "@/components/app/icon/base/DotHalfFillIcon";

interface Props {
  actv?: boolean;
  blue?: boolean;
  clck?: (eve: MouseEvent<HTMLAnchorElement>) => void;
  feed?: boolean;
  href: string;
  icon: ReactElement;
  text: ReactElement;
  trgt?: string;
}

export function ActiveButton(props: Props) {
  const path = usePathname();
  const qury = useSearchParams().toString();

  const actv: boolean = (props.actv && path === "/") || (props.href == "/" && trmSLsh(path) == "/event/latest") || (props.href === cmbHref(path, qury));
  return (
    <>
      <div
        className="absolute h-full flex"
      >
        <DotHalfFillIcon
          className={`
            w-6 h-6 ml-[-12px] my-auto
            ${!props.feed ? "invisible" : ""}
            ${actv && props.feed ? "visible fill-gray-900 dark:fill-gray-50" : ""}
            ${!actv && props.feed ? "visible fill-gray-400 dark:fill-gray-600" : ""}
          `}
        />
      </div>
      <Link
        href={props.href}
        target={props.trgt}
        onClick={props.clck}
        className="flex w-full mx-4 items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 group"
      >
        {props.icon && cloneElement(props.icon, {
          className: `
            w-5 h-5 ${props.icon.props.className || ""}
            ${props.blue && !actv ? "text-sky-400 font-medium" : ""}
            ${!props.blue && !actv ? "text-gray-500 dark:text-gray-500" : ""}
            ${actv ? "text-gray-900 dark:text-gray-50 font-medium" : ""}
            group-hover:text-gray-900 dark:group-hover:text-gray-50
          `,
        })}
        <span
          className={`
            flex-1 ml-3 truncate max-w-[175px]
            ${props.blue && !actv ? "text-sky-400 font-medium" : ""}
            ${!props.blue && !actv ? "text-gray-500 dark:text-gray-500" : ""}
            ${actv ? "text-gray-900 dark:text-gray-50 font-medium" : ""}
            group-hover:text-gray-900 dark:group-hover:text-gray-50
          `}
        >
          {props.text}
        </span>
      </Link>
    </>
  );
};

const cmbHref = (pat: string, qry: string): string => {
  if (qry === "") return pat;

  return pat + "?" + qry;
}

const trmSLsh = (str: string): string => {
  if (str.endsWith('/')) {
    str = str.slice(0, -1);
  }

  return str;
};
