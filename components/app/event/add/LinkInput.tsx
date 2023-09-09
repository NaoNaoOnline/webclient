import { useState, ChangeEvent } from "react";

interface Props {
  desc: string;
  maxl?: number;
  minl?: number;
  name: string;
  pldr: string;
  ptrn?: string;
  text: string;
  titl: string;
  type: string;
}

export default function LinkInput(props: Props) {
  const [text, setText] = useState<string>("");
  const [stld, setStld] = useState<boolean>(false);
  const [fcsd, setFcsd] = useState<boolean>(false);

  const chng = (event: ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value.replace(/^(http:\/\/|https:\/\/)/, '');
    setStld(text !== "");
    setText(text);
  };

  return (
    <div className="relative z-0 w-full mb-6">
      <label htmlFor={`${props.name}-input`} className="relative inline-block mb-2 text-sm underline decoration-dashed cursor-pointer font-medium text-gray-900 dark:text-gray-50 group">
        {props.text}
        <div className="absolute top-[-85%] left-[105%] ml-4 z-10 w-[250px] invisible group-hover:visible px-3 py-2 text-sm font-medium rounded-lg bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900">
          {props.desc}
        </div>
      </label>
      <div className="relative">
        <div className={`absolute py-2 px-0 text-sm bg-transparent appearance-none ${fcsd || stld ? "text-gray-900 dark:text-gray-50 " : "text-gray-500 "}`}>
          https://
        </div>
        <input
          type={props.type}
          id={`${props.name}-input`}
          name={`${props.name}-input`}
          minLength={props.minl}
          maxLength={props.maxl}
          pattern={props.ptrn}
          title={props.titl}
          className="block py-2 pl-12 pr-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder={props.pldr}
          value={text}
          onChange={chng}
          onFocus={() => setFcsd(true)}
          onBlur={() => setFcsd(false)}
          required
        />
      </div>
    </div>
  );
};
