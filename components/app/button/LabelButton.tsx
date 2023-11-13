interface Props {
  blue?: boolean;
  rose?: boolean;
  text: string;
}

export const LabelButton = (props: Props) => {
  return (
    <div
      className={`
        my-auto px-1 rounded
        text-xs font-medium border
        ${props.blue ? "bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-400 border-sky-500" : ""}
        ${props.rose ? "bg-rose-100 dark:bg-rose-900 text-rose-600 dark:text-rose-400 border-rose-500" : ""}
      `}
    >
      {props.text}
    </div>
  );
};
