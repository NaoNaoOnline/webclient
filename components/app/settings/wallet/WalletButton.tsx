import { ConnectKitButton } from "connectkit";

interface Props {
  dsbl: boolean;
  titl: string;
}

export default function WalletButton(props: Props) {
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show, ensName, truncatedAddress }) => {
        return (
          <button
            className="p-3 rounded-lg text-gray-900 dark:text-gray-50 hover:bg-gray-200 dark:hover:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-400 disabled:pointer-events-none"
            disabled={props.dsbl}
            onClick={show}
          >
            {isConnected ? ensName ?? truncatedAddress : props.titl}
          </button>
        );
      }}
    </ConnectKitButton.Custom>
  );
};
