import React from 'react';

import Token from '../../modules/auth/Token';

import { TwirpFetchTransport } from "@protobuf-ts/twirp-transport";
import { APIClient } from '@naonaoonline/apitscode/src/label/api.client';

const transport = new TwirpFetchTransport({
  baseUrl: "http://127.0.0.1:7777",
});

async function searchLabel(token: string) {
  const cli = new APIClient(transport);

  const call = cli.search(
    {
      object: [
        {
          intern: {},
          public: {},
        },
      ],
    },
    {
      meta: {
        authorization: "Bearer " + token,
      },
    },
  );

  const res = await call.response;
  const sta = await call.status;
  console.log(res)
  console.log(sta)
}

export default function Content() {
  const { token, isLoading, isError } = Token()

  if (token) {
    searchLabel(token)
  }

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
