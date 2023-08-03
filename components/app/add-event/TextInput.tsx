import React, { useState } from 'react';

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
    <div className="relative z-0 w-full mb-6 group">
      <div
        id={`${props.name}-tooltip`}
        role="tooltip"
        className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium transition-opacity duration-300 rounded-lg shadow-sm opacity-0 tooltip bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900"
      >
        {props.description}
      </div>
      <label
        htmlFor={`${props.name}-input`}
        data-tooltip-target={`${props.name}-tooltip`}
        data-tooltip-placement="right"
        className="inline-block mb-2 text-sm underline decoration-dashed cursor-pointer font-medium text-gray-900 dark:text-white"
      >
        {props.text}
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
