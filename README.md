# webclient

This is the official webclient for the NaoNao platform. Run it locally together
with the [apiserver] and you are good to go.

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
