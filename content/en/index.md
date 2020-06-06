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
badges:
  - npm:version
  - npm:dt
  - gitlab:pipeline
  - gitlab:coverage
  - npm:license
  
csb_link: https://codesandbox.io/s/nuxt-socket-io-pgpui?file=/nuxt.config.js
---

<badges :badges="badges" project="nuxt-socket-io" user="richardeschloss"></badges>

Nuxt Socket.io -- socket.io client and server module for Nuxt

## Features

<base-list :items="features"></base-list>

<p class="flex items-center">Enjoy light and dark mode: <color-switcher class="p-2"></color-switcher></p>

## Demo
Heroku hosts the IO Server, netlify hosts the IO Client (Nuxt app). See it in action [here](https://nuxt-socket-io.netlify.com/)

My plan to is include those demos here, possibly. Perhaps have the examples in their own dedicated section.

## Online playground

Play with the [code sandbox](https://codesandbox.io/s/nuxt-socket-io-pgpui?file=/nuxt.config.js) as you read the docs.
