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

### Vuex Options per Socket

As socket.IO events are received, they can either committed or dispatched to the Vuex mutations and store, respectively. Also, if properties change in Vuex, those changes can be emitted back to the IO server. Those changes that are emitted back are called "emitBacks".

The options are: 
* `mutations`: [Array] - an array of event-to-mutation entries. 
* `actions`: [Array] - an array of event-to-action entries.
* `emitBacks`: [Array] - an array of state-to-event entries.

The format of each entry in mutations or actions can be:
* A single name string - the event name acts as the mutation/action
* A string with a double-dashed arrow - the left side of the arrow is the event name, the right side is the mutation/action

The format of each entry in emitbacks is the nearly the same, except if uusing the arrow format, it's flipped, and the left side of the arrow will be the event to emit back, the right side will be the state.

So, in the above example, here's how we could configure vuex options for the first socket:

```js{}[nuxt.config.js]
io: {
  sockets: [
    {
      name: 'home',
      url: 'http://localhost:3000',
      default: true,
      vuex: {
        mutations: [{ 
          // When "progress" is received, 
          // commit mutation "examples/SET_PROGRESS
          progress: 'examples/SET_PROGRESS' 
        },
          // Alternatively, use arrow syntax 
          'progress --> examples/SET_PROGRESS' // S/A 
        ],
        actions: [
          // When "chatMessage" is received,
          // dispatch action "FORMAT_MESSAGE"
          'chatMessage --> FORMAT_MESSAGE',

          // When "SOMETHING_ELSE" is received,
          // dispatch action "SOMETHING_ELSE"
          'SOMETHING_ELSE' 
        ],

        emitBacks: [
          // When "examples/sample" state changes,
          // emit back the event "examples/sample"
          'examples/sample', 

          // When "examples/sample2" state changes,
          // emit back the event "sample2"
          'sample2 <-- examples/sample2'
        ]
      }
    }
  ]
}
```

** Overrides **

If switching back and forth between components and nuxt.config is not a workflow you like, it is also possible to specify the vuex options when you instantiate the $nuxtSocket, using the "vuex" property:

```
mounted() {
  this.socket = this.$nuxtSocket({
    name: 'home',
    vuex: { // overrides the vuex opts in the nuxt.config above.
      mutations: ['examples/SET_PROGRESS'],
      actions: ['FORMAT_MESSAGE'],
      emitBacks: ['examples/sample']
    }
  })
}
```

You may prefer to maintain the vuex options like this instead of in the nuxt.config. The vuex options defined in the instance will be merged the vuex options in the config for a given socket, with preference given to config in the component. Best practice is to keep things clean and avoid duplicating entries.

### Namespace Configuration

It is also possible to configure [namespaces](https://socket.io/docs/rooms-and-namespaces/) in `nuxt.config`. Each socket set can have its own configuration of namespaces and each namespace can now have emitters, listeners, and emitbacks. The configuration supports an arrow syntax in each entry to help describe the flow (with pre/post hook designation support too).

The syntax is as follows:
* **Emitters**:
> preEmit hook] componentMethod + msg --> componentProp [postRx hook

→ The `preEmit` and `postRx` hooks are optional, but if using them, the "]" and "[" characters are needed so the plugin can parse them. As of v1.0.20, if the preEmit hook returns `false`, it will be treated as a *validation failure* and the emit event will not get sent. Also, the preEmit hook will get the same "msg" data that will get sent with the emit event, in case it needs to be modified.

→ The `msg` is optional, but if using, must use the '+' character

→ The `componentMethod` is auto-created by the plugin and sends the event with the same name. If the `componentMethod` is named "getMessage" it sends the event "getMessage"

→ The `componentProp` is optional, but if entered, will be the property that will get set with the response, if a response comes back. This is optional too, and needs to be initially defined on the component, otherwise it won't get set. Vuejs will also complain if you try to render undefined props. If `componentProp` is omitted from the entry, the arrow "-->" can also be omitted.

Note: as of v1.0.12, it is now also possible to call the emitter with an argument. So, if `getMessage` is called with args as `getMessage({ id: 123 })`, the args will be the message that gets sent. Args that are passed in takes priority over the referenced `msg`.

* **Listeners**:
> 'preHook] listenEvent --> componentProp [postRx hook'

→ Both `preHook` and `postRx` hooks are optional. Here, `preHook` is called when data is received, but *before* setting componentProp. `postRx` hook is called

→ If using the arrow syntax, when `listenEvent` is received, `componentProp` will get set with that event's data. If only the `listenEvent` is entered, then the plugin will try to set a property on the component of the same name. I.e., if `listenEvent` is "progressRxd", then the plugin will try to set `this.progressRxd` on the component.

→ Important NOTE: This syntax can now also work on the Vuex options for mutations and actions, which are also set up as listeners.

* **Emitbacks**:
> 'preEmitHook] emitEvt <-- watchProp [postAck hook'

→ `preEmitHook` and `postAck` hooks are optional. `preEmitHook` runs before emitting the event, `postAck` hook runs after receiving the acknolwedgement, if any. As of v1.0.21, if the preEmit hook returns `false`, it will be treated as a *validation failure* and the emit event will not get sent. Also, the preEmit hook will get the same "msg" data that will get sent with the emit event, in case it needs to be modified.

→ `watchProp` is the property on the component to watch using "myObj.child.grandchild" syntax. Just like you would on the component.

→ `emitEvt` is the event name to emit back to the server when the `watchProp` changes. If `watchProp` and the arrow "<--" are omitted, then `emitEvt` will double as the `watchProp`.

→ Important NOTE: this syntax can also work in the Vuex options, with ONE important difference. In Vuex (and Nuxt, specifically), the watch property path may require forward slashes "/". For example, if your stores folder has an "examples.js" file in it, with state properties "sample" and "sample2", watchProp would have to be specified as "examples/sample" and "examples/sample2". The exception to the rule is "index.js" which is treated as the stores root. I.e., "sample" in index.js would be referred to simply as "sample" and not "index/sample") 

---

Consider the following configuration as an example:
In `nuxt.config.js`:
```
namespaces: {
  '/index': {
    emitters: ['getMessage2 + testMsg --> message2Rxd'],
    listeners: ['chatMessage2', 'chatMessage3 --> message3Rxd']
  },
  '/examples': {
    emitBacks: ['sample3', 'sample4 <-- myObj.sample4'],
    emitters: [
      'reset] getProgress + refreshInfo --> progress [handleDone'
    ],
    listeners: ['progress']
  }
}
```

1. First, let's analyze the `/index` config. 
* Emitters:

When `getMessage()` is called, the event "getMessage" will be sent with component's data `this.testMsg`. `this.testMsg` should be defined on the component, but if it isn't no message will get sent (the plugin will warn when the component data is not defined). When a response is received, `this.messageRxd` on the component will get set to that response.

* Listeners:

When `chatMessage2` is received, `this.chatMessage2` on the component will be set. When `chatMessage3` is received, the mapped property `this.message3Rxd` will be set.

2. Let's analyze the `/examples` config.
* Emitbacks:

When `this.sample3` changes in the component, the event `sample3` will be emitted back to the server. When `this.myObj.sample4` changes in the component, the mapped event `sample4` will be emitted back.

* Emitters:

When `this.getProgress()` is called, *first* `this.reset()` will be called (if it's defined) and *then* the event "getProgress" will be emitted with the message `this.refreshInfo`. When the response is received, this.progress will get set to the response, and then `this.handleDone()` will be called (if it's defined)

* Listeners:

When event "progress" is received, `this.progress` will get set to that data.

** Overrides **

It may turn out that you would prefer to define the namespace config when you instantiate the $nuxtSocket instead of in your `nuxt.config`. As of v1.0.23, this is now possible with the "namespaceCfg" prop:

```
mounted(){
  this.socket = this.$nuxtSocket({
    name: 'home',
    channel: '/examples',
    namespaceCfg: { // overrides the namespace config of "examples" above
      emitters: [],
      listeners: [],
      emitBacks: []
    }
  })
}
```

As of 2.x, if you also had the namespace config defined in nuxt.config (module options), the configs will be merged, giving preference to `namespaceCfg` in the component.

### Runtime configuration

As of v1.1.6 of nuxt-socket-io, if you are using Nuxt v2.13+, you can now take advantage of the new [runtime config](https://nuxtjs.org/guide/runtime-config/). Your IO config can now also be configured like this:

`nuxt.config`:
```js
publicRuntimeConfig: { 
    io: {  // will be available in this.$config.io (client-side)
      sockets: [
        {
          name: 'publicSocket',
          url: 'url1'
        }
      ]
    }
  },
  privateRuntimeConfig: {
    io: { // will be available in this.$config.io (server-side)
      sockets: [
        {
          name: 'privateSocket',
          url: 'url2'
        }
      ]
    }
  }
}
```

Those IO config will be *merged* into the existing IO config that you previously had, with the runtime config taking priority. Also, to prevent duplicates from being merged in, it's imperative *here* that each socket has the "name" property defined, since the plugin looks for that before merging in.


## Automatic IO Server Registration

As of v1.0.25, it is now possible to automatically start an IO server simply based on the existence of an IO server file and folder. Inspired by the way Nuxt creates routes based on your "pages" directory, server-side IO services will be automatically registered if your "server" directory contains a file "io.js" and folder "io":

```
[appRoot]/
- server/
  - io/
    - namespace1.js
    - namespace2.js
  - io.js
```

Then, `io.js` will be registered as the IO service for IO clients that connect to '' or '/' (root), while the namespace .js files in `server/io/*.js` will be registered as the IO services for IO clients that connect to those namespaces. So, in the example above, `namespace1.js` would handle IO clients that connect to namespace `/namespace1`, while `namespace2.js` would handle IO clients that connect to namespace `/namespace2`.

### IO Service Format: (important)

Each IO service file must export a default service function to be used by the module and it should have the following format:

```
// Inside each ".js" file above, the module expects this at a bare-minimum
export default function(socket, io) { 
  return Object.freeze({})
}
```

In the above snippet, the *module* will give you the socket and io instances in case you need them. There is no need to start the IO server yourself, since the module is simply piggy-backing off the Nuxt server once that server starts listening. All you need to do is build out the service.

Ideally you would build out your service like this:

```
// An example svc:
export default function(socket, io) { 
  return Object.freeze({
    /* Just define the methods here */
    fn1(msg) { 
      return { status: 'ok' }
    },
    async fn2(msg) { 
      const users = await getUsers(msg)
      return users
    },
    fn3(msg) {
      return new Promise((resolve, reject) => {
        someTimeConsumingFunction(msg, (err, progress) => {
          if (err) {
            reject(err)
          } else {
            socket.emit('progress', progress)
            if (progress === 1) {
              resolve(progress)
            }
          }
        })
      })
    }
  })
}
```

In the above example, the code is really easy to read and write. The function names here are mapped to the socket IO *event* names that are received. So, when an IO client emits an event "fn1" with data "msg", the "fn1" will be called with "msg". Likewise, when "fn2" is emitted, "fn2" will be run. Also, your functions can be promisified or not, the module will wait for promises to resolve, if there are any. It will also *catch* any error you throw, sending back a JSON object as response, with the `resp.emitError` set to your `err.message`. So, when "fn3" is emitted, it will be called with "msg" and it will take some time to run. As that function provides it's notification back in the form of "err" and "progress", we can "socket.emit" that progress back to the IO client as we wait for the function to complete. If for any reason that fn3 fails, the module will catch the error and respond with that "emitError".

** A Helpful Tip **: Running just "nuxt" won't watch for changes on the server. If you wish to keep having the server restart when you make server-side changes you'll want to run "npm run dev:server" which I have defined as:

```
// package.json
"scripts": {
  "dev:server": "cross-env NODE_ENV=development nodemon server/index.js --watch server"
}
```

(See my [server/index.js](https://github.com/richardeschloss/nuxt-socket-io/blob/master/server/index.js) to see how I start Nuxt using their API)


### IO Server Overrides

The default behavior above can be simply overridden in nuxt.config with one prop "server":

```
io: {
  server: [your overrides here],
  sockets: []
}
```

* Setting `io.server` to `false` completely disables the feature.
* Setting `io.server` to `{ ioSvc: '/my/io/svc' }` will cause the module to instead look for file `/my/io/svc.js` and folder `/my/io/svc` for your IO services (instead of `/server/io.js` and `/server/io`)

If you wish to still start the IO server on your own, the module exports a `register.server` function which you can use: 

```
import http from 'http'
import { register } from 'nuxt-socket-io'

// Options can be host, port, ioSvc, nspDir:
const myIOServer = register.server({ port: 3001 }) // your IO server, to start http server, listening on 3001

// YOu can also provide your own server instance if you want:
const httpServer = http.createServer()
const myIOServer2 = register.server({ port: 3002 }, httpServer) // use your server instead
```

Both IO servers would still register your ioSvc file and folder so you can continue using those even when Nuxt isn't running. In fact, this is exactly what some of my automated tests rely on.

As of v1.1.18, All other options in `io.server` will be passed down to the socket.io server [instance](https://socket.io/docs/v4/server-api/#new-Server-httpServer-options). So, for example, `cors` options can be specifed here.



### IO Middleware registration:

As of v1.1.15, IO middleware registration occurs as long as an exported `middlewares` is defined in the root io service, and follows the following format:

```js[server/io.js]
// Define middlewares, sequence matters
// These functions get called in sequence
// (executed once per connection)
export const middlewares = {
  m1(socket, next) {
    // called first
    // Must call next:
    next()
  },
  m2(socket, next) {
    // then this gets called
    // Must call next:
    next()
  }
}

export default function Svc(socket, io) {
  // ... 
}
```

The same format will be respected for the namespaces too.

### IO Instance registration:

If the io instance is needed before clients connect, it can be accessed by exporting a `setIO` function in the root io service:

```js[server/io.js]
export function setIO(io) { 
  /* work with io instance here before clients connect, if you must */
}

export default function Svc(socket, io) {
  // work with socket instance (i.e., after client connects)
  // ... 
}
```


## Console Warnings

To prevent developers from shooting themselves in the foot, console warnings are enabled by default when not in production mode. They can be muted in a variety of ways.

1. The best way to stop seeing the warnings is to resolve the issue that is being complained about. 

The plugin was configured a certain way in `nuxt.config` and the plugin will complain when props are not defined but should be.

2. Most browsers allow the filtering of logs by log level. 

To hide warnings, you can uncheck the "warnings" under "log level":
![Screenshot from 2020-02-06 12-52-14](https://user-images.githubusercontent.com/5906351/73973433-c77d3580-48df-11ea-809b-6746a93eca2b.png)

3. While the previous method will be the fastest way to show/hide warnings, that approach will also show/hide *all* console warnings, which may not be desired.
 
If it is only desired to hide this plugin's console warnings, you can do so with the `warnings: false` option. (This defaults to true):

```js{}[nuxt.config.js]
io: {
  warnings: false, // disables console warnings
  sockets: [...]
}
```
