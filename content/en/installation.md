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

In Nuxt3, Vuex is no longer shipped with it. You can consider using my [nuxt3-vuex](https://www.npmjs.com/package/nuxt3-vuex) module to plug it in. If you wish to still use Vuex in Nuxt3 (not recommended), then you will also need at the minimum a Vuex state defined:

```js{}[store/index.js]
export const state = () => ({})

```

The module needs this so it can register its own Vuex module.

(NOTE: a new `iox` option is meant to sort of be a drop-in replacement)

