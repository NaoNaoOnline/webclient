import * as Separator from "@radix-ui/react-separator";

export const ListSeparator = () => {
  return (
    <Separator.Root
      className={`
        bg-gray-300 dark:bg-gray-600 my-4
        data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full
        data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px
      `}
      orientation="horizontal"
      decorative={true}
    />
  );
};
