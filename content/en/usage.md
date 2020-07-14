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


## Socket Persistence 

As of v1.1.5, there is now a means to persist instantiated sockets, as was mentionned in the previous section, using the "persist" option. The "persist" option can be either a boolean or a string, where if it is a string, that string will be used as the label for that socket. Every other part of your app would reference that label to reuse the socket.

If the value provided is a boolean and set to `true`, then the plugin will automatically create the label "[socketname][namespace]" for you. Below are examples, assuming the following nuxt config:

nuxt.config:

```
io: {
  sockets: [{
    url: 'http://localhost:3000' // This is the default socket with name "dflt" because it's the first entry
  }, {
    name: 'home',
    url: 'http://localhost:4000'
  }]
}
```

* If persist is set to `true`:

```
this.socket1 = this.$nuxtSocket({
  persist: true // This will be persisted with label "dflt" (no name or channel specified)
})

this.socket2 = this.$nuxtSocket({
  channel: '/examples'
  persist: true // This will be persisted with label "dflt/examples" (no name specified)
})

this.socket3 = this.$nuxtSocket({
  name: 'home',
  channel: '/examples'
  persist: true // This will be persisted with label "home/examples" (both name and channel specified)
})
```

* If persist is set to a *string*:

```
this.mySocket = this.$nuxtSocket({
  persist: 'mySocket' // This will be persisted with label "mySocket". It will use the default socket
})
```

Then, at any time to re-use those sockets, you access the using the corresponding labels:

```
var reusedSocket = this.$nuxtSocket({
  persist: 'mySocket' // Re-use "mySocket"
})
```

It should be noted that by *enabling* persistence, the *teardown* feature will be disabled because it is assumed you want to re-use the socket. You will be responsible for the teardown steps where you feel it's appropriate. If you still desire the auto teardown feature, you can pass true to the "teardown" option and it will be respected.

Examples:

```
this.socket1 = this.$nuxtSocket({
  persist: true // Socket will be persisted, teardown disabled
})

this.socket2 = this.$nuxtSocket({
  persist: true, // Socket will be persisted...but...
  teardown: true // ...explicitly setting teardown will override the default behavior
})
```

NOTE: To address [issue #118](https://github.com/richardeschloss/nuxt-socket-io/issues/118), socket instances are no longer stored in Vuex, but rather internally in the plugin. This could break code that depended on accessing the socket instance directly in Vuex state. However, the solution now is much easier to use, just using the socket label to retrieve the persisted socket.

Yet an alternative way to persist the socket is to attach the instance to `$root`:
```
this.$root.mySocket = this.$nuxtSocket({ // Here, even though persist is not set, this will be persisted.
  channel: '/'
})
```
