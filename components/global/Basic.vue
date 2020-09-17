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
    getMessage () {
      return new Promise((resolve) => {
        this.show = false
        this.socket.emit('getMessage', { id: 'abc123' }, (resp) => {
          this.show = true
          this.messageRxd = resp
          resolve()
        })
      })
    }
  }
}
</script>

<style scoped>
</style>
