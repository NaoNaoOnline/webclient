import { RiTimeLine } from "react-icons/ri";

import { ActiveButton } from "@/components/app/sidebar/ActiveButton";

export function GlobalButtons() {
  return (
    <ul className="pt-4 mt-4 border-t border-gray-50 dark:border-gray-700">

      <li>
        <ActiveButton
          href="/latest"
          text="Latest Events"
          icon={<RiTimeLine />}
        />
      </li>

    </ul>
  );
};
