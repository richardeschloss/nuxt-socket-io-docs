---
title: Vuex Module (no longer recommended)
description: 'The $nuxtSocket VuexModule'
position: 5
category: Getting started
---

As of v1.0.22, the plugin will now register a namespaced Vuex module "$nuxtSocket" if it does not already exist. If planning to use the module, the name "$nuxtSocket" should be considered reserved. Disabling this is discouraged. 

The module will build out the following states which can then be accessed by `$store.state.$nuxtSocket[prop]`, where prop is one of:

1. `clientApis`: contains the client apis for each component See the section on client APIs for more details.
2. `ioApis`: contains the server apis for each IO server. See the section on server APIs for more details
3. `emitErrors`: contains emit errors that have occurred, organized by the socket label, and then by the emit event.
4. `emitTimeouts`: contains emit timeouts that have occurred, organized by the socket label and then by the emit event.

The mutations are used internally by the plugin and it is advised to avoid committing these mutations yourself. 

The actions registered by the plugin are:

1. `emit`: emits the specified event with a supplied message for a specified socket. This can be useful when you want to re-use the persisted socket throughout the app without having to re-instantiate nuxtSocket. You simply dispatch the "emit" action. 

For example, in one component, you may initialize the nuxtSocket instance:

comp1.vue:
```
mounted() {
  this.socket = this.$nuxtSocket({
    channel: '/myRoom',
    persist: 'mySocket', // Persist the socket with label "mySocket"
  })
}
```

Inside that same component, you can dispatch the emit action like:
```
methods: {
  async doStuff() {
    await this.$store.dispatch(
      '$nuxtSocket/emit', // Remember, "emit" is namespaced to "$nuxtSocket"
      {
        socket: this.socket, // action requires either the socket instance *or* the label
        // label: 'mySocket', // Use persisted socket "mySocket"
        evt: 'getStuff',
        msg: { items: ['Milk', 'Sugar'] }
      }
    )
  }
}
```

Alternatively, in another component, you may wish to re-use that socket, and emit events on that connection. To do so, you would simply dispatch the emit event: (and you wouldn't need the socket instance, just the label identifier)

comp2.vue: 
```
methods: {
  async someFunc() {
    await this.$store.dispatch(
      '$nuxtSocket/emit', // Remember, "emit" is namespaced to "$nuxtSocket"
      {
        label: 'mySocket', // Use persisted socket "mySocket"
        evt: 'getStuff',
        msg: { items: ['Milk', 'Sugar'] }
      }
    )
  }
}
```

The advantages of doing it this way are: you don't have to re-instantiate the socket, you just use it. Also, the action is promisified, so you can async/await with the action (whereas the `socket.emit` method uses callbacks). And, built-into the "emit" vuex action is error handling for timeouts and other errors, in manner very similar to that described in the "Error Handling" section above.

To handle emit errors, you can specify an `emitTimeout` in the `$nuxtSocket` instance options *or* in the object that gets sent to vuex action:

```
methods: {
  async someFunc() {
    await this.$store.dispatch(
      '$nuxtSocket/emit', // Remember, "emit" is namespaced to "$nuxtSocket"
      {
        label: 'mySocket', // Use persisted socket "mySocket"
        evt: 'getStuff',
        msg: { items: ['Milk', 'Sugar'] },
        emitTimeout: 1000 // Timeout after 1000 ms
      }
    )
  }
}
```

Then, when errors occur, one of the following outcomes will occur. If you provided a *label*, the error will simply get logged to either "emitTimeouts" or "emitErrors", depending on whether or not the error was timeout or non-timeout related. If you only provided a socket instance but no label, the action's promise will reject with the error, and it will be up to you to catch and handle. At any time you need to inspect the errors, the easiest way is to use Vue dev tools, and inspect vuex (and inspect the $nuxtSocket module)