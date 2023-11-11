import { ReactNode } from "react";

import { Tooltip } from "@/components/app/tooltip/Tooltip";

interface Props {
  desc: ReactNode;
  maxl?: number;
  minl?: number;
  mono?: string;
  name: string;
  pldr: string;
  ptrn?: string;
  span?: string;
  titl: string;
  type?: string;
}

export const TextInput = (props: Props) => {
  return (
    <div className={`relative z-0 w-full ${props.span}`}>

      <div className="relative z-10">
        <Tooltip
          desc={props.desc}
          side="right"
        >
          <label htmlFor={`${props.name}-input`} className="mb-2 text-sm underline decoration-dashed cursor-pointer font-medium text-gray-900 dark:text-gray-50">
            {ttlCas(props.name)}
          </label>
        </Tooltip>
      </div>

      <input
        type={props.type ? props.type : "text"}
        id={`${props.name}-input`}
        name={`${props.name}-input`}
        min={0}
        minLength={props.minl}
        maxLength={props.maxl}
        pattern={props.ptrn}
        title={props.titl}
        className={`block py-2 px-0 w-full text-sm ${props.mono} text-gray-900 dark:text-gray-50 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
        placeholder={props.pldr}
        autoComplete="new-password"
        required
      />
    </div>
  );
};

// ttlCas returns the title case of the input string.
function ttlCas(str: string): string {
  if (str.length === 0) {
    return str;
  }

  return str[0].toUpperCase() + str.slice(1).toLowerCase();
}
