import { useEffect, useRef, useState } from "react"
import { MultiSelect, SelectItem } from "@mantine/core"

interface Props {
  blck: string[];
  crtd: (val: string) => void;
  desc: string;
  labl: string[];
  name: string;
  pldr: string;
  titl: string;
}

const expr = /^[A-Za-z0-9\s]{3,18}$/;

export default function LabelInput(props: Props) {
  const [data, setData] = useState<{ value: string; label: string; }[]>(props.labl.map((x) => ({ value: x, label: x })));
  const [fcsd, setFcsd] = useState<boolean>(false);

  const inpt = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inpt.current) {
      inpt.current.required = true;
    }
  }, []);

  return (
    <div className="relative w-full mb-6">
      <label htmlFor={`${props.name}-input`} className="relative inline-block mb-2 text-sm underline decoration-dashed cursor-pointer font-medium text-gray-900 dark:text-gray-50 group">
        {ttlCas(props.name)}
        <div className="absolute top-[-85%] left-[105%] ml-4 z-10 w-[250px] invisible group-hover:visible p-2 text-sm font-medium rounded-lg bg-gray-800 dark:bg-gray-200 text-gray-50 dark:text-gray-900">
          {props.desc}
        </div>
      </label>
      <MultiSelect
        type="text"
        id={`${props.name}-input`}
        name={`${props.name}-input`}
        className={`border-b-2 ${fcsd ? "border-blue-600 dark:border-blue-500" : "border-gray-300 dark:border-gray-600"}`}
        title={props.titl}
        placeholder={props.pldr}

        data={data}
        getCreateLabel={(val) => `Create "${val.trim()}"`}
        onChange={(lis: string[]) => {
          if (inpt.current) {
            if (lis.length === 0) {
              inpt.current.required = true;
            } else {
              inpt.current.required = false;
            }
          }
        }}
        onCreate={(val: string) => {
          const item = { value: val.trim(), label: val.trim() };
          setData((current) => [...current, item]);
          props.crtd(val);
          return item;
        }}
        // shouldCreate is called every time the search query changes in the
        // input field. If shouldCreate returns true the Create "label" action
        // item is shown.
        shouldCreate={(val: string, data: SelectItem[]): boolean => {
          val = val.trim();
          if (val === "") return false;
          if (!expr.test(val)) return false;
          if (props.blck.map((x: string) => x.toLocaleLowerCase()).includes(val.toLocaleLowerCase())) return false;
          if (props.labl.map((x: string) => x.toLocaleLowerCase()).includes(val.toLocaleLowerCase())) return false;
          return true;
        }}
        classNames={{
          defaultValue: "h-[28px] mx-0 pl-0 pr-3 text-gray-900 dark:text-gray-50 bg-white dark:bg-gray-700",
          defaultValueLabel: "text-sm font-normal",
          defaultValueRemove: "w-5 h-5 min-w-0 min-h-0 mx-0.5 border-0 text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-50",
          dropdown: "bg-gray-50 dark:bg-gray-700 border-0 shadow-gray-400 dark:shadow-black shadow-[0_0_2px]",
          rightSection: "invisible",
          item: "text-gray-900 dark:text-gray-50 data-[hovered]:bg-gray-200 data-[hovered]:text-gray-900 dark:data-[hovered]:bg-gray-800 dark:data-[hovered]:text-gray-50",
          input: `min-h-0 pl-0 py-[1px] rounded-none bg-white dark:bg-gray-700 border-0 text-gray-900 dark:text-gray-50 bg-transparent cursor-text`,
          searchInput: "ml-0 min-w-fit bg-white dark:bg-gray-700 p-0 text-sm placeholder-gray-400 dark:placeholder-gray-500",
          values: "ml-0",
          wrapper: "bg-white dark:bg-gray-700",
        }}
        maxSelectedValues={5}
        onFocus={() => setFcsd(true)}
        onBlur={() => setFcsd(false)}
        limit={20}
        ref={inpt}
        nothingFound="no labels"
        creatable
        hoverOnSearchChange
        searchable
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
