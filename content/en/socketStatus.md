---
title: Socket Status
description: 'Socket.IO Status'
position: 5
category: Getting started
---

Sometimes, it may be desired to check the status of the socket IO connection. Fortunately, the Socket.IO client API emits events to help understand the status:

```
const clientEvts = [
  'connect_error', 
  'connect_timeout',
  'reconnect',
  'reconnect_attempt',
  'reconnecting',
  'reconnect_error',
  'reconnect_failed',
  'ping',
  'pong'
]
```

If it is desired to check the status, you can simply opt-in by defining the property `socketStatus` on the same component that instantiates nuxtSocket. The plugin will then automatically set that status (it will use the camel-cased versions of the event names as prop names). If it is desired to use a prop name other than `socketStatus`, simply specify the `statusProp` when specifying the `ioOpts`:

## Example

```
data() {
  return {
    socketStatus: {},
    badStatus: {}
  }
},
mounted() {
  this.goodSocket = this.$nuxtSocket({
    name: 'goodSocket',
    channel: '/index',
    reconnection: false
  })

  this.badSocket = this.$nuxtSocket({
    name: 'badSocket',
    channel: '/index',
    reconnection: true,
    statusProp: 'badStatus'
  })
}
```

## SocketStatus.vue component
As a convenience, a SocketStatus.vue component is now also packaged with nuxt-socket-io, which will help visualize the status:

```
<socket-status :status="socketStatus"></socket-status>
<socket-status :status="badStatus"></socket-status>
```

