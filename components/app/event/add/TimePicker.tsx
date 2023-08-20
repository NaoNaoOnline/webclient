import React, { useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Props {
  name: string;
  text: string;
  offset: number;
  description: string;
  position: string;
}

function roundToNearestHourDate(dat: Date, off: number): Date {
  const min = 60;
  const mil = 1000 * 60 * min;

  return new Date(Math.ceil((dat.getTime() + off) / mil) * mil);
}

function roundToNearestHourString(dat: Date, off: number): string {
  return roundToNearestHourDate(dat, off).toLocaleTimeString("de-DE", { hour: '2-digit', minute: '2-digit' });
}

export default function (props: Props) {
  const [startDate, setStartDate] = useState(roundToNearestHourDate(new Date(), props.offset));

  let position = "left-[-285px]"
  if (props.position === "right") {
    position = "left-[105%]"
  }

  return (
    <div className="relative z-0 w-full mb-6">
      <label htmlFor={`${props.name}-input`} className="group relative inline-block mb-2 text-sm underline decoration-dashed cursor-pointer font-medium text-gray-900 dark:text-white">
        {props.text}
        <div className={`absolute top-[-85%] ${position} ml-4 z-10 w-[250px] invisible group-hover:visible px-3 py-2 text-sm font-medium rounded-lg bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900`}>
          {props.description}
        </div>
      </label>
      <DatePicker
        autoComplete="off"
        name={`${props.name}-input`}
        id={`${props.name}-input`}
        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
        placeholderText={roundToNearestHourString(new Date(), props.offset)}
        wrapperClassName="w-full"
        selected={startDate}
        onChange={(dat: Date) => setStartDate(dat)}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={15}
        timeCaption="Time"
        timeFormat="HH:mm"
        dateFormat="HH:mm"
        required
      />
    </div >
  );
};