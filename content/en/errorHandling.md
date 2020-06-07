---
title: Error Handling
description: 'Error Handling'
position: 7
category: Getting started
---

Sometimes, errors will occur. Two main categories of errors can be thought of as: 
1. timeouts
2. non-timeout related errors. 

The plugin allows the user to take advantage of new built-in error handling features.

## Handling timeout errors

The user opts-in to let the plugin handle timeout errors by specifying an `emitTimeout (ms)` in the IO options when instantiating the nuxtSocket:

```
this.socket = this.$nuxtSocket({ channel: '/examples', emitTimeout: 1000 }) // 1000 ms
```

Then, if an emitTimeout occurs, there are two possible outcomes. One is, the plugin's method will reject with an 'emitTimeout' error, and it will be up to the user to catch the error downstream:

```
this.someEmitMethod()
.catch((err) => { // If method times out, catch the err
  /* Handle err */
})
```

Alternatively, another outcome can occur if the user defines a property `emitErrors` on the component *and* the server responds with an error (see below), in which case the plugin won't throw an error, but will in stead *set* that property (`emitErrors`). This may result in much cleaner code, and may make it easy to work with component computed properties that change when `emitErrors` property changes:

```
data() {
  emitErrors: { // Emit errors will get collected here now, if resp.emitError is defined
  }
}
...
this.someEmitMethod() // Now, when this times out, emitErrors will get updated (i.e., an error won't be thrown)
```

Important NOTE: in order for `this.emitErrors` to get updated, the server must send it's error response back as an *object*, and set a property `emitError` with the details.

## Handling non-timeout errors

These erros include bad requests or anything specific to your application's backend. Again, like before, if `emitErrors` is defined, that will get set, otherwise, the emitError will get thrown.

If the user would prefer to use a different name for the emitErrors prop, he can do so by specifying `emitErrorsProp` in the ioOptions:

```
data() {
  myEmitErrors: { // Emit errors will get collected here now
  }
}

mounted() {
  this.socket = this.$nuxtSocket({ emitErrorsProp: 'myEmitErrors' })
}
```
