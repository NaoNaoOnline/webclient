interface Props {
  blue?: boolean;
  className?: string;
  clck?: () => void;
  gray?: boolean;
  rose?: boolean;
  text: string;
}

export const LabelButton = (props: Props) => {
  return (
    <div
      onClick={props.clck}
      className={`
        w-fit my-auto px-1 rounded
        text-xs font-mono font-medium border
        ${props.blue ? "bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-400 border-sky-500" : ""}
        ${props.gray ? "text-gray-400 dark:text-gray-500 border-gray-400 dark:border-gray-500" : ""}
        ${props.rose ? "bg-rose-100 dark:bg-rose-900 text-rose-600 dark:text-rose-400 border-rose-500" : ""}
        ${props.className}
      `}
    >
      {props.text}
    </div>
  );
};
