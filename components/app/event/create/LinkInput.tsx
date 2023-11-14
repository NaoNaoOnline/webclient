import { ChangeEvent, ReactNode, useRef, useState } from "react";

import { Tooltip } from "@/components/app/tooltip/Tooltip";

interface Props {
  desc: ReactNode;
  name: string;
  pldr: string;
  titl: string;
}

const expr = /^(www\.)?[\w]+\.[a-z]{2,}(\.[a-z]{2,})*[\w\-._~:/?#\[\]@!$&'()*\+,;=.]*$/;

export default function LinkInput(props: Props) {
  const [text, setText] = useState<string>("");
  const [stld, setStld] = useState<boolean>(false);
  const [fcsd, setFcsd] = useState<boolean>(false);

  const inpt = useRef<HTMLInputElement>(null);

  const chng = (evn: ChangeEvent<HTMLInputElement>) => {
    {
      const text = evn.target.value.replace(/^(http:\/\/|https:\/\/)/, '');
      setStld(text !== "");
      setText(text);
    }

    if (inpt.current) {
      if (expr.test(evn.target.value)) {
        inpt.current.setCustomValidity('');
      } else {
        inpt.current.setCustomValidity(props.titl);
      }
    }
  };

  return (
    <div className="relative z-0 w-full mb-6">

      <div className="relative z-10">
        <Tooltip
          desc={props.desc}
          side="right"
        >
          <label
            htmlFor={`${props.name}-input`}
            className="mb-2 text-sm underline decoration-dashed cursor-pointer font-medium text-gray-900 dark:text-gray-50 group"
          >
            {ttlCas(props.name)}
          </label>
        </Tooltip>
      </div>

      <div className="relative">
        <div className={`absolute py-2 px-0 z-0 text-sm bg-transparent appearance-none ${fcsd || stld ? "text-gray-900 dark:text-gray-50 " : "text-gray-500 dark:text-gray-500"}`}>
          https://
        </div>
        <input
          type="text"
          id={`${props.name}-input`}
          name={`${props.name}-input`}
          title={props.titl}
          className="relative block z-10 py-2 pl-12 pr-0 w-full text-sm text-gray-900 dark:text-gray-50 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder={props.pldr}
          value={text}
          ref={inpt}
          onChange={chng}
          onFocus={() => setFcsd(true)}
          onBlur={() => setFcsd(false)}
          required
        />
      </div>
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
