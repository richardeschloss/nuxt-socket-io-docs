---
title: Introduction
description: 'Nuxt Socket.io module -- easily configure and use your socket.io clients!'
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

csb_link: https://codesandbox.io/embed/nuxt-content-l164h?hidenavigation=1&theme=dark
---

Nuxt Socket.io module -- easily configure and use your socket.io clients!

## Features

<base-list :items="features"></base-list>

<p class="flex items-center">Enjoy light and dark mode: <color-switcher class="p-2"></color-switcher></p>

## Demo
Heroku hosts the IO Server, netlify hosts the IO Client (Nuxt app). See it in action [here](https://nuxt-socket-io.netlify.com/)

My plan to is include those demos here, possibly. Perhaps have the examples in their own dedicated section.

## Videos

Demonstration of using `$content` and `<nuxt-content>` to display Markdown pages:

<video poster="https://res.cloudinary.com/nuxt/video/upload/v1588091670/nuxt-content_wxnjje.jpg" loop playsinline controls>
  <source src="https://res.cloudinary.com/nuxt/video/upload/v1588091670/nuxt-content_wxnjje.webm" type="video/webm" />
  <source src="https://res.cloudinary.com/nuxt/video/upload/v1588091670/nuxt-content_wxnjje.mp4" type="video/mp4" />
  <source src="https://res.cloudinary.com/nuxt/video/upload/v1588091670/nuxt-content_wxnjje.ogv" type="video/ogg" />
</video>

<br>

Using `$content()` on a directory to list, filter and search content:

<video poster="https://res.cloudinary.com/nuxt/video/upload/v1588095794/nuxt-content-movies_c0cq9p.jpg" loop playsinline controls>
  <source src="https://res.cloudinary.com/nuxt/video/upload/v1588095794/nuxt-content-movies_c0cq9p.webm" type="video/webm" />
  <source src="https://res.cloudinary.com/nuxt/video/upload/v1588095794/nuxt-content-movies_c0cq9p.mp4" type="video/mp4" />
  <source src="https://res.cloudinary.com/nuxt/video/upload/v1588095794/nuxt-content-movies_c0cq9p.ogv" type="video/ogg" />
</video>

## Online playground

<code-sandbox :src="csb_link"></code-sandbox>
