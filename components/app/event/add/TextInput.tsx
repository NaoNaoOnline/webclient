import React from 'react';

interface Props {
  name: string;
  text: string;
  type: string;
  description: string;
  placeholder: string;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
}

export default function (props: Props) {
  return (
    <div className="relative z-0 w-full mb-6">
      <label htmlFor={`${props.name}-input`} className="relative inline-block mb-2 text-sm underline decoration-dashed cursor-pointer font-medium text-gray-900 dark:text-white group">
        {props.text}
        <div className="absolute top-[-85%] left-[105%] ml-4 z-10 w-[250px] invisible group-hover:visible px-3 py-2 text-sm font-medium rounded-lg bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900">
          {props.description}
        </div>
      </label>
      <input
        type={props.type}
        id={`${props.name}-input`}
        name={`${props.name}-input`}
        minLength={props.minLength}
        maxLength={props.maxLength}
        pattern={props.pattern}
        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
        placeholder={props.placeholder}
        required
      />
    </div>
  );
};
