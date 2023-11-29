import { useEffect, useState } from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";

interface Props {
  actn: () => void;
  clse: () => void;
  desc: string;
  open: boolean;
  titl: string;
}

export const DeleteButton = (props: Props) => {
  const [open, setOpen] = useState<boolean>(false);

  const confrm = () => {
    setOpen(false);
    props.clse();
    props.actn();
  };

  const cancel = () => {
    props.clse();
    setOpen(false);
  };

  useEffect(() => {
    if (props.open) {
      setOpen(true);
    }
  }, [props.open]);

  return (
    <AlertDialog.Root
      open={open}
      onOpenChange={cancel}
    >
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed bg-gray-900/50 pt-10 inset-0">
          <AlertDialog.Content className="relative w-full max-w-xl bg-gray-50 dark:bg-gray-700 mt-7 mx-auto p-4 rounded-md justify-items-center shadow-gray-400 dark:shadow-black shadow-[0_0_2px] focus:outline-none">

            <AlertDialog.Title className="text-gray-900 dark:text-gray-50 text-md font-medium">
              {props.titl}
            </AlertDialog.Title>

            <AlertDialog.Description className="py-4 text-gray-900 dark:text-gray-50 text-sm">
              {props.desc}
            </AlertDialog.Description>

            <div className="flex justify-end gap-[25px]">
              <AlertDialog.Cancel
                onClick={cancel}
                asChild
              >
                <button
                  className="flex-1 w-full md:w-auto mr-1 px-5 py-2.5 text-gray-50 bg-gray-200 dark:bg-gray-800 enabled:bg-blue-700 enabled:dark:bg-blue-700 enabled:hover:bg-blue-800 enabled:dark:hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm text-center"
                >
                  Cancel
                </button>
              </AlertDialog.Cancel>
              <AlertDialog.Action
                onClick={confrm}
                asChild
              >
                <button
                  className="flex-1 w-full md:w-auto ml-1 px-5 py-2.5 text-gray-50 bg-gray-200 dark:bg-gray-800 enabled:bg-red-700 enabled:dark:bg-red-700 enabled:hover:bg-red-800 enabled:dark:hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm text-center"
                >
                  Delete
                </button>
              </AlertDialog.Action>
            </div>

          </AlertDialog.Content>
        </AlertDialog.Overlay>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
