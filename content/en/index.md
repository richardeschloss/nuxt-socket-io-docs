---
title: Introduction
description: 'Nuxt Socket.io -- socket.io client and server module for Nuxt!'
position: 1
category: Getting started
features:
  - Configuration of multiple IO sockets
  - Configuration of per-socket namespaces
  - Automatic IO Server Registration
  - Socket IO Status
  - Automatic Error Handling
  - Debug logging, enabled with localStorage item 'debug' set to 'nuxt-socket-io'
  - Automatic Teardown, enabled by default
  - $nuxtSocket vuex module and socket persistence in vuex
  - Support for dynamic APIs using the KISS API format
  - Support for the IO config in the new Nuxt runtime config (for Nuxt versions >= 2.13)
  - Automatic middleware registration
  - ES module
  - Promisified emit and once methods (socket.emitP and socket.onceP in 2.x+)
badges:
  - npm:version
  - npm:dt
  - github:pipeline
  - gitlab:coverage
  - npm:license
  
csb_link: https://codesandbox.io/s/nuxt-socket-io-pgpui?file=/nuxt.config.js
---

<badges :badges="badges" project="nuxt-socket-io" user="richardeschloss"></badges>

Nuxt Socket.io -- socket.io client and server module for Nuxt

## Features

<list :items="features"></list>

