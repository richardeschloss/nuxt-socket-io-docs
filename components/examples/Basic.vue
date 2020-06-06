<template>
  <div>
    <label>If you can see text appear in the box, it worked!</label>
    <button class="btn btn-blue" @click="getMessage()">Get Message</button>
    <p class="bg-white rounded-t-lg overflow-hidden border-t border-l border-r border-gray-400 p-4 p-8 bg-white"> Message Rxd: {{ messageRxd }} </p>
  </div>
</template>

<script>
export default {
  data () {
    return {
      messageRxd: ''
    }
  },
  mounted () {
    this.socket = this.$nuxtSocket({ channel: '/index' })
  },
  methods: {
    getMessage () {
      return new Promise((resolve) => {
        this.socket.emit('getMessage', { id: 'abc123' }, (resp) => {
          this.messageRxd = resp
          resolve()
        })
      })
    }
  }
}
</script>

<style scoped>
.btn {
  @apply font-bold py-2 px-4 rounded;
}
.btn-blue {
  @apply bg-blue-500 text-white;
}
.btn-blue:hover {
  @apply bg-blue-700;
}
</style>
