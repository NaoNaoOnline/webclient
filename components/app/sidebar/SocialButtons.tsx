import { DiscordLogoIcon } from "@radix-ui/react-icons";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { TwitterLogoIcon } from "@radix-ui/react-icons";

import { ActiveButton } from "@/components/app/sidebar/ActiveButton";

export function SocialButtons() {
  return (
    <ul className="pt-4 mt-4 border-t border-gray-300 dark:border-gray-700">

      <li>
        <ActiveButton
          href="https://discord.gg/J2MnbQvwqg"
          trgt="_blank"
          text="Discord"
          icon={<DiscordLogoIcon />}
        />
      </li>

      <li>
        <ActiveButton
          href="https://github.com/NaoNaoOnline"
          trgt="_blank"
          text="Github"
          icon={<GitHubLogoIcon />}
        />
      </li>

      <li>
        <ActiveButton
          href="https://twitter.com/NaoNao_Online"
          trgt="_blank"
          text="Twitter"
          icon={<TwitterLogoIcon />}
        />
      </li>

    </ul>
  );
};
