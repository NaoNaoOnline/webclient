import { DiscordLogoIcon } from "@radix-ui/react-icons";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { SiGitbook } from "react-icons/si";
import { TwitterLogoIcon } from "@radix-ui/react-icons";

import { ActiveButton } from "@/components/app/sidebar/ActiveButton";

export function SocialButtons() {
  return (
    <ul className="pt-4 mt-4 border-t border-gray-50 dark:border-gray-700">

      <li
        className="relative flex"
      >
        <ActiveButton
          href="https://docs.naonao.online"
          trgt="_blank"
          text={<>Documentation</>}
          icon={<SiGitbook />}
        />
      </li>

      <li
        className="relative flex"
      >
        <ActiveButton
          href="https://discord.gg/J2MnbQvwqg"
          trgt="_blank"
          text={<>Discord</>}
          icon={<DiscordLogoIcon />}
        />
      </li>

      <li
        className="relative flex"
      >
        <ActiveButton
          href="https://github.com/NaoNaoOnline"
          trgt="_blank"
          text={<>Github</>}
          icon={<GitHubLogoIcon />}
        />
      </li>

      <li
        className="relative flex"
      >
        <ActiveButton
          href="https://twitter.com/NaoNao_Online"
          trgt="_blank"
          text={<>Twitter</>}
          icon={<TwitterLogoIcon />}
        />
      </li>

    </ul>
  );
};
