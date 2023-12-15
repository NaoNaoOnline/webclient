# webclient

This is the official webclient for the NaoNao platform.

```
ROUTE                        |    DESCRIPTION
-----                        |    -----------
                             |
/event/latest                |    events happening right now
/event/label/category/EVM    |    events with the category label EVM
/event/label/host/Kain       |    events with the host label Kain
/event/user/xh3b4sd          |    events created by the user xh3b4sd
/event/like/xh3b4sd          |    events liked by the user xh3b4sd
/event/list/1234             |    events in the list 1234
                             |
/event/1234                  |    specific event
/label/cate/EVM              |    specific category label
/label/host/Kain             |    specific host label
/list/1234                   |    specific list
                             |
/label/user/xh3b4sd          |    labels created by the user xh3b4sd
/list/user/xh3b4sd           |    lists created by the user xh3b4sd
                             |
/user/xh3b4sd                |    user profile
```

Run it locally together with the [apiserver] and you are good to go.

```
npm run dev
```



```
AUTH0_SECRET="[REDACTED]"
AUTH0_BASE_URL="http://localhost:3000"
AUTH0_ISSUER_BASE_URL="https://[REDACTED].auth0.com"
AUTH0_CLIENT_ID="[REDACTED]"
AUTH0_CLIENT_SECRET="[REDACTED]"
AUTH0_AUDIENCE="https://apiserver"
AUTH0_SCOPE="openid profile offline_access read:shows"

NEXT_PUBLIC_ALCHEMY_API_KEY="[REDACTED]"
NEXT_PUBLIC_BLOCKCHAIN_NETWORKS="arbitrum,base,hardhat,optimism"
NEXT_PUBLIC_POLICY_CONTRACT="0x5FbDB2315678afecb367f032d93F642f64180aa3"
NEXT_PUBLIC_SUBSCRIPTION_CONTRACT="0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID="[REDACTED]"
```



The communication between `webclient` and [apiserver] is managed using the auto
generated [apitscode] library.

```
npm install https://github.com/NaoNaoOnline/apitscode.git#v0.6.0
```



[apiserver]: https://github.com/NaoNaoOnline/apiserver
[apitscode]: https://github.com/NaoNaoOnline/apitscode
