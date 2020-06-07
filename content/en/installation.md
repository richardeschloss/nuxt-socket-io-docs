---
title: Installation
description: 'Install nuxt-socket-io in only two steps in your Nuxt project.'
category: Getting started
position: 2
---

Add `nuxt-socket-io` dependency to your project:

<code-group>
  <code-block label="Yarn" active>

  ```bash
  yarn add nuxt-socket-io
  ```

  </code-block>
  <code-block label="NPM">

  ```bash
  npm install nuxt-socket-io
  ```

  </code-block>
</code-group>

Then, add `nuxt-socket-io` to the `modules` section of `nuxt.config.js`:

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

Finally, since the module requires Vuex to operate correctly, please at the minimum make sure you have a Vuex state defined:

```js{}[store/index.js]
export const state = () => ({})

```

The module needs this so it can register its own Vuex module