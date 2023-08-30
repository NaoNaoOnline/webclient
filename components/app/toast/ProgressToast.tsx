import * as React from 'react';
import * as Toast from '@radix-ui/react-toast';

import { XMarkIcon } from '@heroicons/react/24/outline'

interface Props {
  cmpl: number;
  cncl: boolean;
  done: () => void;
  titl: string;
}

export default function ProgressToast(props: Props) {
  const [open, setOpen] = React.useState<boolean>(true);
  // We render potentially multiple progress toasts if the action which requires
  // progress bars fails. Each of the rendered progress toasts may call the done
  // callback, potentially affecting the timing of the others. For an orderly
  // finalization only the non-terminated progress toast is allowed to trigger
  // the done callback, preventing the progress toasts of failed actions to rug
  // the progress toast instance that is supposed to finalize the action that
  // eventually succeeded.
  const [term, setTerm] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (props.cmpl >= 100) {
      setTimeout(() => {
        setOpen(false);
      }, 3000); // 3 seconds
    }
  }, [props.cmpl]);

  React.useEffect(() => {
    if (props.cncl && open) {
      setTimeout(() => {
        setOpen(false);
        setTerm(true);
      }, 3000); // 3 seconds
    }
  }, [props.cncl, open]);

  React.useEffect(() => {
    if (props.cmpl >= 100 && !open && !term) {
      props.done();
      setTerm(true);
    }
  }, [props.cmpl, open, term]);

  return (
    <>
      <Toast.Root
        className="bg-white rounded-md shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] p-4 grid [grid-template-areas:_'title_action'_'description_action'] grid-cols-[auto_max-content] gap-x-[15px] items-center data-[state=open]:animate-slideIn data-[state=closed]:animate-hide data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-[transform_200ms_ease-out] data-[swipe=end]:animate-swipeOut"
        open={open}
        onOpenChange={setOpen}
      >
        <Toast.Title className="[grid-area:_title] dark:text-black">
          {props.titl}
        </Toast.Title>
        <Toast.Description className="[grid-area:_description]">
          <div className="mt-4 w-full rounded-full h-2 bg-gray-200">
            <div style={{ width: `${props.cmpl}%` }} className={`bg-blue-600 h-2 rounded-full transition-width duration-1000 ease-in-out`}></div>
          </div>
        </Toast.Description>
        <Toast.Close className="[grid-area:_action] text-gray-500 hover:text-gray-900" aria-label="Close">
          <span aria-hidden>
            <XMarkIcon className="m-2 w-6 h-6 dark:text-black" />
          </span>
        </Toast.Close>
      </Toast.Root>
      <Toast.Viewport className="[--viewport-padding:_25px] fixed top-0 right-0 flex flex-col p-[var(--viewport-padding)] gap-[10px] w-[390px] max-w-[100vw] m-0 list-none z-[2147483647] outline-none" />
    </>
  );
};
