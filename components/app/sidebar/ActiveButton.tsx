import { MouseEvent, ReactElement, cloneElement } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  clck?: (eve: MouseEvent<HTMLAnchorElement>) => void;
  href: string;
  icon: ReactElement;
  text: string;
  trgt?: string;
}

export function ActiveButton(props: Props) {
  const patnam = usePathname();

  return (
    <Link
      href={props.href}
      target={props.trgt}
      onClick={props.clck}
      className="flex items-center p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 group"
    >
      {props.icon && cloneElement(props.icon, {
        className: `
          flex-shrink-0 w-5 h-5
          ${props.href === patnam ? "text-gray-900 dark:text-gray-50" : "text-gray-400 dark:text-gray-500"}
          group-hover:text-gray-900 dark:group-hover:text-gray-50
        `,
      })}
      <span
        className={`
          flex-1 ml-3 whitespace-nowrap
          ${props.href === patnam ? "text-gray-900 dark:text-gray-50 font-medium" : "text-gray-400 dark:text-gray-500"}
          group-hover:text-gray-900 dark:group-hover:text-gray-50
        `}
      >
        {props.text}
      </span>
    </Link>
  );
};
