---
title: Basic Examples
description: 'Basic Examples'
category: Examples
position: 9
---

## Basic Emit and Response

The very first thing that needs to be done is configuring our sockets in Nuxt config. In this example, we'll use the socket IO server that is hosted on heroku:

```js{}[nuxt.config.js]
io: {
  sockets: [{
    url: 'https://nuxt-socket-io.herokuapp.com' // IO server lives here
  }]
}
```

The IO server on heroku has been configured to support connections to the "/index" namespace. At that namespace, one of the events it listens for is "getMessage". It will respond with the message. In addition to responding with the message, before the server fully responds, it will emit an event "chatMessages", which we could listen for. That will be shown in the next example. But first, the simple stuff...

In this example, when the component first mounts, we create a socket instance, and connect to '/index' namespace. Since we only have one entry in nuxt.config, that will be used. We define a method `getMessage` to emit the event, and define `messageRxd` to be used for saving the response. In the example below, the `getMessage` method has been promisified, but it would still work find without it.

### Try It!
<basic></basic>
```js{}
data () {
  return {
    messageRxd: ''
  }
},
mounted () {
  this.socket = this.$nuxtSocket({ channel: '/index', withCredentials: true })
},
methods: {
  getMessage () {
    return new Promise((resolve) => {
      this.socket.emit('getMessage', { id: 'abc123' }, (resp) => {
        this.messageRxd = resp
        resolve()
      })
    })
  }
}
```

#### CORS configuration
On the socket io server side (in this case, Heroku), the following configuration was provided:

```js
io: {
  server: {
    // @ts-ignore
    cors: {
      credentials: true, // "Configures the Access-Control-Allow-Credentials CORS header. Set to true to pass the header, otherwise it is omitted."
      origin: ['https://nuxt-socket-io.netlify.app'] // Array of whitelisted origin(s)
    }
  }
}
```

Since the server-side sets the Access-Control-Allow-Credentials CORS header, the client-side also needs to set `withCredentials` in it's request, and that's exactly what is happening in the mounted hook.