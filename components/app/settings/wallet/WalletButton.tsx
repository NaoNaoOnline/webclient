import { ConnectKitButton } from "connectkit";

interface Props {
  titl: string;
}

export default function WalletButton(props: Props) {
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show, ensName, truncatedAddress }) => {
        return (
          <button onClick={show} className="p-3 text-gray-900 rounded-lg dark:text-gray-50 hover:bg-gray-200 dark:hover:bg-gray-800">
            {isConnected ? ensName ?? truncatedAddress : props.titl}
          </button>
        );
      }}
    </ConnectKitButton.Custom>
  );
};
