import Image from "next/image";

import { useAuth } from "@/components/app/auth/AuthProvider";
import { PremiumButton } from "@/components/app/button/PremiumButton";
import { useCache } from "@/components/app/cache/CacheProvider";
import { ListHeader } from "@/components/app/layout/ListHeader";

export const UserSection = () => {
  const { imag, uuid } = useAuth();
  const { user } = useCache();

  return (
    <ListHeader
      link={
        <Image
          alt="profile picture"
          className="w-5 h-5 rounded-full"
          height={20}
          width={20}
          src={imag}
        />
      }
      titl={
        <PremiumButton
          name={user.name}
          prem={user.prem}
        />
      }
      bttn={
        <span className="text-sm font-mono whitespace-nowrap text-gray-500 dark:text-gray-500">
          {uuid}
        </span>
      }
    />
  );
};
