import Link from "next/link";

interface Props {
  href: string;
  text: string;
}

export const UserProfileButton = (props: Props) => {
  return (
    <Link
      href={props.href}
      className={`
        p-3
        text-gray-900 dark:text-gray-50 font-medium text-lg
        rounded-md text-center
        bg-gray-50 dark:bg-gray-700
        shadow-gray-400 dark:shadow-black shadow-[0_0_2px]
        hover:bg-gray-200 hover:dark:bg-gray-800 hover:underline
      `}
    >
      {props.text}
    </Link>
  );
};
