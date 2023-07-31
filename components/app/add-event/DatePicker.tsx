import React, { useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Props {
  name: string;
  text: string;
  description: string;
}

export default function (props: Props) {
  const [startDate, setStartDate] = useState("");

  return (
    <div className="relative z-0 w-full mb-6 group">
      <div id={`${props.name}-tooltip`} role="tooltip" className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium transition-opacity duration-300 rounded-lg shadow-sm opacity-0 tooltip bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900">
        {props.description}
      </div>
      <label htmlFor={`${props.name}-input`} data-tooltip-target={`${props.name}-tooltip`} data-tooltip-placement="right" className="inline-block mb-2 text-sm underline decoration-dashed cursor-pointer font-medium text-gray-900 dark:text-white">{props.text}</label>
      <DatePicker
        autoComplete="off"
        name={`${props.name}-input`}
        id={`${props.name}-input`}
        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
        placeholderText={new Date().toLocaleDateString(undefined, { year: '2-digit', month: '2-digit', day: '2-digit' })}
        wrapperClassName="w-full"
        selected={startDate === "" ? null : new Date(startDate)}
        minDate={new Date()}
        onChange={(date: Date) => setStartDate(date == null ? "" : date.toString())}
        dateFormat="dd.MM.yy"
        required
      />
    </div >
  );
};
