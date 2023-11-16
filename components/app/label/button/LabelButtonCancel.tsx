interface Props {
  clck: () => void;
  dsbl?: boolean;
}

export const LabelButtonCancel = (props: Props) => {
  return (
    <button
      className={`
        ml-3 px-5 py-2.5 text-sm font-medium text-center rounded-lg outline-none
        disabled:text-gray-50 disabled:dark:text-gray-700 disabled:bg-gray-200 disabled:dark:bg-gray-800
        enabled:text-gray-50 enabled:dark:text-gray-50 enabled:bg-red-600 enabled:dark:bg-red-700
        enabled:hover:bg-red-800 enabled:dark:hover:bg-red-800
      `}
      disabled={props.dsbl}
      onClick={props.clck}
    >
      Cancel
    </button>
  );
};
