import React from 'react';

import Token from '../../modules/auth/Token';

export default function Content() {
  const { token, isLoading, isError } = Token()

  // TODO use access token

  return (
    <>
      <div className="pl-4 pr-4 mt-4 md:ml-64">
        <div className="pl-4 pr-4 flex grid justify-items-center">
          <div className="rounded-lg h-36 w-full max-w-2xl bg-gray-200 dark:text-white dark:bg-gray-800">
          </div>
        </div>
      </div>

      <div className="pl-4 pr-4 mt-4 md:ml-64">
        <div className="pl-4 pr-4 flex grid justify-items-center">
          <div className="rounded-lg h-36 w-full max-w-2xl bg-gray-200 dark:text-white dark:bg-gray-800">
          </div>
        </div>
      </div>
    </>
  );
};
