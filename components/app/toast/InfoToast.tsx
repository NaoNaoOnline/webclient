import * as Toast from "@radix-ui/react-toast";

import { XMarkIcon } from "@heroicons/react/24/outline";

export interface InfoProps {
  desc: string;
}

export class InfoPropsObject {
  private props: InfoProps;

  constructor(desc: string) {
    this.props = {
      desc: desc,
    };
  }

  //
  // getter
  //

  getDesc(): string {
    return this.props.desc;
  }
}

export const InfoToast = (props: { obj: InfoPropsObject }) => {
  return (
    <>
      <Toast.Root
        className="bg-yellow-300 rounded-md shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] p-4 grid [grid-template-areas:_'title_title_action'_'description_description_description'] grid-cols-[auto_auto_24px] grid-rows-[24px_auto] gap-y-2 items-center data-[state=open]:animate-slideIn data-[state=closed]:animate-hide data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-[transform_200ms_ease-out] data-[swipe=end]:animate-swipeOut"
        duration={10 * 1000} // 10 seconds
      >
        <Toast.Title className="[grid-area:_title] text-gray-900">
          <span className="text-base font-medium text-gray-900">
            Info
          </span>
        </Toast.Title>

        <Toast.Close className="[grid-area:_action]" aria-label="Close">
          <span className="m-2 text-gray-500 hover:text-gray-900">
            <XMarkIcon className="w-6 h-6" />
          </span>
        </Toast.Close>

        <Toast.Description className="[grid-area:_description]">
          <span className="text-sm text-gray-900">
            {props.obj.getDesc()}
          </span>
        </Toast.Description>

      </Toast.Root>
      <Toast.Viewport className="[--viewport-padding:_25px] fixed top-0 right-0 flex flex-col p-[var(--viewport-padding)] gap-[10px] w-[390px] max-w-[100vw] m-0 list-none z-[2147483647] outline-none" />
    </>
  );
};
