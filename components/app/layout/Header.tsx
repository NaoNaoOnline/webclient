import "flowbite";

import { Bars3BottomLeftIcon } from '@heroicons/react/24/outline'

interface Props {
  titl: string;
}

export default function Header(props: Props) {
  return (
    <div className="pl-4 pr-4 mt-4 md:ml-64">
      <div className="pl-4 pr-4 flex grid justify-items-center">
        <div className="rounded-lg w-full max-w-xl">

          <ul className="flex flex-row w-full">
            <li className="flex items-center md:hidden mr-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 group">
              <button
                className="p-2"
                data-drawer-target="default-sidebar"
                data-drawer-toggle="default-sidebar"
                aria-controls="default-sidebar"
                type="button"
              >
                <Bars3BottomLeftIcon className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-gray-50" />
              </button>
            </li>
            <li className="w-full">
              <h3 className="text-3xl text-gray-400 dark:text-gray-500">
                {props.titl}
              </h3>
            </li>
          </ul>

        </div>
      </div>
    </div>
  );
};
