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
Several demos can be found [here](https://nuxt-socket-io.herokuapp.com/)

These docs will attempt to explain and be in sync with the examples shown there. 

## Online playground

Play with the [code sandbox](https://codesandbox.io/s/nuxt-socket-io-pgpui?file=/nuxt.config.js) as you read the docs.
