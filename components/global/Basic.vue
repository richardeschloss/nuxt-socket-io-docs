<template>
  <div>
    <label>If you can see text appear in the box, it worked!</label>
    <button class="btn btn-blue" @click="getMessage()">Get Message</button>
    <div class="socket-io-response">
      <transition name="fade">
        <span v-show="show">{{ messageRxd }}</span>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      messageRxd: 'Waiting for you to click the "Get Message" button',
      show: true
    }
  },
  mounted () {
    this.socket = this.$nuxtSocket({ channel: '/index' })
  },
  methods: {
    async getMessage () {
      this.show = false
      this.messageRxd = await this.socket.emitP('getMessage', { id: 'abc123' })
      this.show = true
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
