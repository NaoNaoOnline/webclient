import { DiscordLineIcon } from "@/components/app/icon/base/DiscordLineIcon";
import { GitBookIcon } from "@/components/app/icon/base/GitBookIcon";
import { GithubIcon } from "@/components/app/icon/base/GithubIcon";
import { TwitterLineIcon } from "@/components/app/icon/base/TwitterLineIcon";

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
          icon={<GitBookIcon />}
        />
      </li>

      <li
        className="relative flex"
      >
        <ActiveButton
          href="https://discord.gg/J2MnbQvwqg"
          trgt="_blank"
          text={<>Discord</>}
          icon={<DiscordLineIcon />}
        />
      </li>

      <li
        className="relative flex"
      >
        <ActiveButton
          href="https://github.com/NaoNaoOnline"
          trgt="_blank"
          text={<>Github</>}
          icon={<GithubIcon />}
        />
      </li>

      <li
        className="relative flex"
      >
        <ActiveButton
          href="https://twitter.com/NaoNao_Online"
          trgt="_blank"
          text={<>Twitter</>}
          icon={<TwitterLineIcon />}
        />
      </li>

    </ul>
  );
};
