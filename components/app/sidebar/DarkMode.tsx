import { MoonIcon } from '@heroicons/react/24/outline'
import { SunIcon } from '@heroicons/react/24/outline'

import { useTheme } from "@/components/app/theme/Theme";

export default function DarkMode() {
  const [them, setThem] = useTheme();

  return (
    <ul className="space-y-2">
      <li>
        <div onClick={setThem} className="flex items-center p-3 text-gray-900 rounded-lg dark:text-gray-50 hover:bg-gray-200 dark:hover:bg-gray-700 group cursor-pointer">
          {them == "dark" && (
            <>
              <SunIcon className="flex-shrink-0 w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-gray-50" />
              <span className="flex-1 ml-3 whitespace-nowrap dark:group-hover:text-gray-50">Light Mode</span>
            </>
          )}
          {them == "light" && (
            <>
              <MoonIcon className="flex-shrink-0 w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-gray-50" />
              <span className="flex-1 ml-3 whitespace-nowrap dark:group-hover:text-gray-50">Dark Mode</span>
            </>
          )}
        </div>
      </li>
    </ul>
  );
};
