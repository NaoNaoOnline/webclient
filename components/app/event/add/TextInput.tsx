interface Props {
  desc: string;
  maxl?: number;
  minl?: number;
  name: string;
  pldr: string;
  ptrn?: string;
  titl: string;
}

export default function TextInput(props: Props) {
  return (
    <div className="relative z-0 w-full mb-6">
      <label htmlFor={`${props.name}-input`} className="relative inline-block mb-2 text-sm underline decoration-dashed cursor-pointer font-medium text-gray-900 dark:text-gray-50 group">
        {ttlCas(props.name)}
        <div className="absolute top-[-85%] left-[105%] ml-4 z-10 w-[250px] invisible group-hover:visible px-3 py-2 text-sm font-medium rounded-lg bg-gray-800 dark:bg-gray-200 text-gray-50 dark:text-gray-900">
          {props.desc}
        </div>
      </label>
      <input
        type="text"
        id={`${props.name}-input`}
        name={`${props.name}-input`}
        minLength={props.minl}
        maxLength={props.maxl}
        pattern={props.ptrn}
        title={props.titl}
        className="block py-2 px-0 w-full text-sm text-gray-900 dark:text-gray-50 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
        placeholder={props.pldr}
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
