---
title: Contributing
description: 'Contributing'
category: Developers
position: 10
---

For contributing, first please refer to the project's [CONTRIBUTING GUIDE](https://github.com/richardeschloss/nuxt-socket-io/blob/master/CONTRIBUTING.md) on Github.

## Build Setup

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev:server

Note: `yarn dev` will just run nuxt (client), it will be much more helpful to run both client and server. You may be interested in the design pattern being used on the socket.io server. As long as you have `.js` files in your `server/channels` directory and make sure to export a function named `Svc`, the `server.js` will automatically register it. This is somewhat analagous to the automatic routing of pages that you place in your `pages` folder.

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

For detailed explanation on how things work, check out:
- [Nuxt.js docs](https://nuxtjs.org).
- [Socket.io docs](http://socket.io/docs)
- [Vuex docs](https://vuex.vuejs.org/guide)

## Testing

### Full-mock approach

Testing your apps that use nuxt-socket-io with a full mock approach.

The easiest way to test your components is to do so in isolation, using [vue-test-utils](https://vue-test-utils.vuejs.org/). If you treat your component as being completely separated from a backend, you can still test that works correctly by injecting the data it needs and observing the output. Fortunately, with vue-test-utils, it is extremely straightforward to mock methods and properties: just specifiy the mocks in the `mocks` property.

So, for example, suppose you have the following code in your component: (this is taken directly from my chat rooms example)

```js
mounted() {  // Mounted
  this.socket = this.$nuxtSocket({ channel: '/rooms' })
  this.getRooms()
}
```

We want to test this block of code. Normally, the plugin would return a socket.io-client instance, and also define the `getRooms` method if it were configured as an emitter in `nuxt.config`. The `getRooms` method would be expected to emit an event "getRooms". Our test should be written to verify this: (the example below shows ava-style assertions)

```js
import Rooms from '@/pages/rooms'

...

let actualRooms
const expectedRooms = [{ name: 'general' }]
const localVue = createLocalVue()
const called = { emit: {}, on: {} } // Create an object to register called methods
function SocketIOClient(channel) {  // Dummy client
  return {
    channel,
    emit(evt, msg, cb){
      if (!called.emit[evt]) {
        called.emit[evt] = []
      }
      called.emit[evt].push({ msg })   
      cb()
    },
    on(evt, cb) {
      if (!called.on[evt]) {
        called.on[evt] = []
      }
      called.on[evt].push({ msg })   
      cb()
    }
  }
}
const client = new SocketIOClient(channel)
const wrapper = mount(Rooms, { 
  localVue,
    mocks: {
      $nuxtSocket({ channel }) {
        return client
      },
      getRooms() {
        client.emit('getRooms', {}, () => {
          actualRooms = expectedRooms
        })
      }
    }
})
// Check if this.socket is a SocketIOClient()
// We do this accessing the wrapper's properties on the view model (`wrapper.vm`)
const { socket } = wrapper.vm
t.is(socket.constructor.name, 'SocketIOClient')
t.is(socket.channel, '/rooms')
t.is(called.emit['getRooms'].length, 1)

// Check if actualRooms === expectedRooms after mounting component
expectedRooms.forEach(({ name, idx }) => {
  t.is(name, actualRooms[idx].name)
})

```

Running the test in isolation like this has its benefits. It doesn't require an external sources to verify that it works. When the page is mounted, the methods we expected to be called get called. This allows this test to run very quickly, as we don't need to wait for servers to start up. If running the tests in watch-mode, this can greatly accelerate development (if using a test-driven approach).

However, testing like this can also have a downside of requiring the developer to "mock the planet" just to test one component. It's not that obvious from the above example, but if the component were to contain many more emitters or listeners, this much mocking can turn out to be a drag. The next section describes an alternative approach. The trade-off is: while the developer will have a test that runs more slowly (due to setup times), it may end up being much less test code that runs.


### Partial Mock Approach

Testing your apps that use nuxt-socket-io by compiling and injecting the real plugin.

It may be likely that you want to actually inject the NuxtSocket plugin and re-use IO configs in your tests, perhaps using a socket that consumes data from a test provider. If so, you will need to first compile the plugin and then import it. Currently, this repo has a compile method in "test/utils.js" (which I will try to properly deploy in the next release (and someday in [nuxt-test-utils](https://github.com/richardeschloss/nuxt-test-utils)), but if you need it asap please download [here](https://github.com/richardeschloss/nuxt-socket-io/blob/master/test/utils.js), patience requested :) ):

The plugin can be compiled like this:

```js
import { compilePlugin, injectPlugin } from 'nuxt-socket-io/test/utils' // or @/test/utils, if using local copy
// import { compilePlugin, injectPlugin } from 'nuxt-test-utils' // <-- someday, it will be this instead... hopefully... :)

import config from '@/nuxt.config' // Read in nuxt config so we can pass the io opts to the plugin

const { io } = config

compilePlugin({
  src: pResolve('./node_modules/nuxt-socket-io/io/plugin.js'), 
  tmpFile: pResolve('/tmp/plugin.compiled.js'),
  options: io,
  overwrite: true // If you change the options, you'll have to overwrite the compiled plugin
})
```

If Vuex options were also specified in the nuxt config, you may also want to use the configured store which is easy to import:

```js
import { state as indexState, mutations, actions } from '@/store/index'
import {
  state as examplesState,
  mutations as examplesMutations
} from '@/store/examples'

const vuexModules = { // Only needed if using nested stores (i.e., "vuex modules")
  examples: {
    namespaced: true,
    state: examplesState(),
    mutations: examplesMutations
  }
}
```

The store can then be defined:
```js
let store = new Vuex.Store({
  state,
  mutations,
  actions,
  modules: vuexModules
})
```

...And then the store and compiled plugin can be injected into the component that would need it:
```js
const wrapper = shallowMount(YourComponent, {
  store, // Vuex store
  localVue,
  stubs: {
    'nuxt-child': true // needed if you have DOM elements that need to be stubbed
  },
  mocks: {
    // ...mocks here...
    // inject the plugin so that this.$nuxtSocket will be defined:
    $nuxtSocket: await injectPlugin({}, Plugin)
  }
})
```

Now, you're test will have an actual nuxtSocket instance defined that you can use with a real IO server dedicated for testing purposes.

Again, you may have noticed a bit of extra work here, and the abuse of the term "mock" here, since a real compiled plugin is being used. While this makes the component less isolated from external factors, it can help cover more ground when testing, in a single test, so it's up to the developer to decide what trade-offs are worth making.


### Running tests

When in doubt, always look at the ".gitlab-ci.yml" file in the nuxt-socket-io github repo, which will always contain the latest commands for driving the tests. This repository uses the Ava test framework because it's awesome and fast. "npm test" will first run the "specs" tests and then the "e2e" tests, both for coverage. 

* **"specs" testing**

Tests the module and the plugin, and is configured by "specs.config.js" and will first run the specs.setup.js. The setup first compiles the plugin, and then initializes an IO server, which comes in handy for testing real IO events sent by the client. The "specs.config" file also specifies the files to run for tests. When trying to troubleshoot a single test, it's useful to run "yarn test:specs:watch" will simply run tests on file changes. Since recompiling the plugin will always change the file tree, it may be desirable to compile the plugin to a folder outside the workspace (i.e., "/tmp") or to disable the overwriting of the compiled plugin (overwrite: false). 

* **"e2e" testing**

Tests the components and pages, but the only test that gets run by the CI/CD system is for the IOStatus.vue component, since that gets packaged with the distribution. Like the specs testing, the e2e config compiles the plugin, only if the compiled plugin doesn't already exist (because the specs tests may have compiled it already). The e2e.setup.js starts IO server(s) and creates a browser environment with JSDOM support, so that we can work with a DOM (when components get mounted, they get mounted to the DOM, and we need a means for querying DOM attributes on elements). "vue" extensions are registered so that ".vue" makes sense to babel, which transpiles our tests.

If changes are to be made to either "specs.config" or "e2e.config" to isolate a given file for testing, the developer needs to remember to revert the changes back so all files get tested again by the CI system. 