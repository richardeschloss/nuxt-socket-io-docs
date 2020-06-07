---
title: Configuration
description: 'Configuring nuxt-socket-io'
category: Getting started
position: 3
---

## Configuring Sockets

The module supports the configuration of multiple IO sockets so that you can easily reference them by name or by default. The module options can be specifed in two ways: 

```js[nuxt.config.js]
{
  modules: [
    'nuxt-socket-io'
  ],
  io: {
    // Options
  }
}
```

or

```js[nuxt.config.js]
{
  modules: [
    ['nuxt-socket-io', options: { /* options here */ }]
  ]
}
```

I personally think the former is the easier and cleaner way, because then the io config can live in a separate file and be completely framework agnostic:

```js[nuxt.config.js]
import io from 'io.config' // import IO options

export default {
  // ...
  modules: [
    'nuxt-socket-io'
  ],
  io
  // ...
}
```

In order to use the module, at least one socket has to be defined: 

```js[nuxt.config.js]
{
  io: {
    sockets: [ // Required
      { // At least one entry is required
        name: 'home',
        url: 'http://localhost:3000',
        default: true,
        vuex: { /* see section below */ },
        namespaces: { /* see section below */ }
      }, 
      { name: 'work', url: 'http://somedomain1:3000' },
      { name: 'car', url: 'http://somedomain2:3000' },
      { name: 'tv', url: 'http://somedomain3:3000' },
      { name: 'test', url: 'http://localhost:4000' }
    ]
  }
}
```

### Basic Options per Socket

* `name`: [String] - identifier for the socket. Required for any socket that isn't treated as the default
* `url`: [String] - URL for the socket IO server. Required usually. If it is omitted, `window.location` will be used as the fallback.
* `default`: [Boolean] - specifies the socket to use by default.

In a given configuration, if the `name` is not specified, the socket specified as `default` will be used. Furthermore, if `default` is not specified, the first entry will be treated as the default socket. So, in the above configuration, we could omit `name` and `default` and that first entry would still be treated as default. Also, if both the Nuxt app and IO server are running together and listening at the specified url above (localhost on port 3000), omitting the URL above would still work, because the plugin will try to connect to the IO server at `window.location`. Still though, the author advises to at least keep a name in there as it makes things clean.

Usage will be explained in [usage](/usage)