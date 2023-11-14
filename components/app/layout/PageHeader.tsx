interface Props {
  titl: string;
}

export function PageHeader(props: Props) {
  return (
    <h3 className="mb-4 text-right text-3xl text-gray-500 dark:text-gray-500">
      {props.titl}
    </h3>
  );
};
