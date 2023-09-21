import Image from "next/image";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";

import { ConnectKitButton } from "connectkit";

import { UserIcon } from "@heroicons/react/24/outline";

import { FaEthereum } from "react-icons/fa";

import Header from "@/components/app/layout/Header";

import InfoToast from "@/components/app/toast/InfoToast";

export default function Page() {
  const { user, isLoading } = useUser();

  const name = user?.nickname || user?.name;

  return (
    <>
      <Header titl="Settings" />

      <div className="pl-4 pr-4 mt-4 md:ml-64">
        <div className="pl-4 pr-4 flex grid justify-items-center">
          <div className="w-full max-w-xl dark:text-gray-50">
            {isLoading && (
              <></>
            )}
            {!isLoading && user && (
              <>
                <ul className="space-y-2">
                  <li className="flex items-center p-3 text-gray-900 rounded-lg dark:text-gray-50">
                    {user.picture && (
                      <div className="flex-shrink-0">
                        <Image
                          alt="profile picture"
                          className="w-5 h-5 rounded-full"
                          height={20}
                          width={20}
                          src={user.picture}
                        />
                      </div>
                    )}
                    {!user.picture && (
                      <UserIcon className="flex-shrink-0 w-5 h-5 text-gray-400 dark:text-gray-500" />
                    )}
                    {name && (
                      <span className="flex-1 ml-3 whitespace-nowrap">{name}</span>
                    )}
                    {!name && (
                      <span className="flex-1 ml-3 whitespace-nowrap">Profile</span>
                    )}
                  </li>
                </ul>

                <ul className="flex flex-row relative w-full pt-4 mt-4 border-t border-gray-300 dark:border-gray-800">
                  <li className="flex items-center p-3 text-gray-900 rounded-lg dark:text-gray-50">
                    <FaEthereum className="flex-shrink-0 w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <span className="flex-1 ml-3 whitespace-nowrap">My Wallets</span>
                  </li>

                  <ConnectKitButton.Custom>
                    {({ isConnected, show, ensName, truncatedAddress }) => {
                      return (
                        <button onClick={show} className="flex absolute right-0 items-center ">
                          <li className="p-3 text-gray-900 rounded-lg dark:text-gray-50 hover:bg-gray-200 dark:hover:bg-gray-800 group">
                            {isConnected ? ensName ?? truncatedAddress : "Connect Wallet"}
                          </li>
                        </button>
                      );
                    }}
                  </ConnectKitButton.Custom>
                </ul>
              </>
            )}
            {!isLoading && !user && (
              <InfoToast
                desc="Join the beavers and login for accessing your settings. Or else!"
              />
            )}
          </div>
        </div>
      </div >
    </>
  )
}
