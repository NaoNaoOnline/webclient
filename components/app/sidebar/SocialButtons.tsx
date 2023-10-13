import { DiscordLogoIcon } from "@radix-ui/react-icons";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { TwitterLogoIcon } from "@radix-ui/react-icons";

export default function SocialButton() {
  return (
    <ul className="pt-4 mt-4 space-y-2 border-t border-gray-300 dark:border-gray-700">
      <li>
        <a href="https://discord.gg/J2MnbQvwqg" target="_blank" className="flex items-center p-3 text-gray-900 rounded-lg dark:text-gray-50 hover:bg-gray-200 dark:hover:bg-gray-700 group">
          <DiscordLogoIcon className="flex-shrink-0 w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-gray-50" />
          <span className="flex-1 ml-3 whitespace-nowrap dark:group-hover:text-gray-50">Discord</span>
        </a>
        <a href="https://github.com/NaoNaoOnline" target="_blank" className="flex items-center p-3 text-gray-900 rounded-lg dark:text-gray-50 hover:bg-gray-200 dark:hover:bg-gray-700 group">
          <GitHubLogoIcon className="flex-shrink-0 w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-gray-50" />
          <span className="flex-1 ml-3 whitespace-nowrap dark:group-hover:text-gray-50">Github</span>
        </a>
        <a href="https://twitter.com/NaoNao_Online" target="_blank" className="flex items-center p-3 text-gray-900 rounded-lg dark:text-gray-50 hover:bg-gray-200 dark:hover:bg-gray-700 group">
          <TwitterLogoIcon className="flex-shrink-0 w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-gray-50" />
          <span className="flex-1 ml-3 whitespace-nowrap dark:group-hover:text-gray-50">Twitter</span>
        </a>
      </li>
    </ul>
  );
};
