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

The communication between `webclient` and [apiserver] is managed using the auto
generated [apitscode] library.

```
npm install https://github.com/NaoNaoOnline/apitscode.git#v0.6.0
```



[apiserver]: https://github.com/NaoNaoOnline/apiserver
[apitscode]: https://github.com/NaoNaoOnline/apitscode
