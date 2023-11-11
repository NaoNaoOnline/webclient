import { memo } from "react";

import { ConnectKitButton } from "connectkit";

interface Props {
  dsbl: boolean;
}

const WalletButtonConnect = memo((props: Props) => {
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, ensName, show, truncatedAddress }) => {
        return (
          <button
            className={`
              ml-3 px-5 py-2.5 text-sm font-medium text-center rounded-lg outline-none
              disabled:text-gray-50 disabled:dark:text-gray-700 disabled:bg-gray-200 disabled:dark:bg-gray-800
              enabled:text-gray-50 enabled:dark:text-gray-50 enabled:bg-blue-600 enabled:dark:bg-blue-700
              enabled:hover:bg-blue-800 enabled:dark:hover:bg-blue-800
            `}
            disabled={props.dsbl}
            onClick={show}
          >
            {isConnected ? ensName ?? truncatedAddress : "Connect Wallet"}
          </button>
        );
      }}
    </ConnectKitButton.Custom>
  );
});

WalletButtonConnect.displayName = "WalletButtonConnect";

export { WalletButtonConnect };
