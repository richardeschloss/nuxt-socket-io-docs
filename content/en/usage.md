---
title: Usage
description: 'Using nuxt-socket-io in your components'
position: 4
category: Getting started
---

This module globally injects `$nuxtSocket` instance, meaning that you can access it anywhere using `this.$nuxtSocket`. For plugins, asyncData, fetch, nuxtServerInit and Middleware,  you can access it from `context.$nuxtSocket`.

In order to use nuxtSocket in your components or pages, it's a matter of instantiating it:

```js
this.socket = this.$nuxtSocket({
  // options
})
```

## Instance Options

The options that the plugin will use are:

* `name`: [String] - name of the socket. If omitted, the default socket will be used
* `channel`: [String] - the channel (a.k.a namespace) to connect to. Defaults to ''.
* `teardown`: [Boolean] - specifies whether to enable or disable the "auto-teardown" feature (see section below). Defaults to true.
* `persist`: [Boolean] = specifies whether to save this socket in vuex (see [vuexModule](/vuexModule))
* `statusProp`: [String] - specifies the property in [this] component that will be used to contain the socket status. Defaults to 'socketStatus' (referring to an object).
* `emitTimeout`: [Number] - specifies the timeout in milliseconds for an emit event, after which waiting for the emit response will be canceled. Defaults to undefined.
* `emitErrorsProp`: [String] - specifies the property in [this] component that will be used to contain emit errors (see section below). Defaults to 'emitErrors' (referring to this.emitErrors, an object of arrays)
* **[All other options]**  - all other options that are supported by socket.io-client will be passed down to socket.io client and respected. Please read their [docs](https://socket.io/docs/client-api/). But please note, if you specify *url* here, it won't be used because you already specified the IO server url in nuxt.config. The idea is, abstract out the actual url from the code. Just connect to "yourSocket" and use it. Helps make the code much easier to read and maintain. If you have an API that lives at a specific path, you can use the "path" option for this purpose (please also refer to [issue 73](https://github.com/richardeschloss/nuxt-socket-io/issues/73) to learn more).

The return value is an actual socket.io-client instance that can be used just like any socket.io-client. So, `this.socket.emit` and `this.socket.on` will be defined just as you would expect.

## Example

```js
mounted() {
  this.socket = this.$nuxtSocket({
    // nuxt-socket-io opts: 
    name: 'home', // Use socket "home"
    channel: '/index', // connect to '/index'

    // socket.io-client opts:
    reconnection: false
  })
},
methods: {
  getMessage() {
    this.socket.emit('getMessage', { id: 'abc123' }, (resp) => {
      this.messageRxd = resp
    })
  } 
}
```

## Auto Teardown

The plugin, by default, has auto-teardown enabled. As you leave a component that has instantiated nuxtSocket, the plugin will first removeAllListeners (so that duplicates don't get re-registered), then it will close the connection, and then call your component's destroy lifecycle method. Also, while you are on the component, a listener will also be registered for the 'disconnect' event from the server so that it can close it's end of the connection.

If you do not wish to have this behavior, you can disable it by setting `teardown` to false when you instantiate the nuxtSocket:

```
const socket = this.nuxtSocket({ channel: '/index', teardown: false })
```

You may want to disable the auto-teardown if you are planning on re-using the socket. However, it should be noted that socket.io-client under the hood will *already* try to re-use a single connection when using different namespaces for the same socket. I personally think it is easier to manage code for the different namespaces and to configure namespaces as described above; i.e., each component gets its own set of "mouths and ears". If your coding style is different and you would still insist on disabling the auto-teardown, then just rememeber it becomes your responsibility to properly removeListeners and perform cleanup.

