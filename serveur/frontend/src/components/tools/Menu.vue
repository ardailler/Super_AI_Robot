<template>
  <nav class="nav">
    <div class="leftSide">
      <p class="go-back icon-ios-arrow-back" @click.prevent.stop="$router.go(-1)" title="back"></p>
      <p class="subtitle_1">{{ $auth.user().name }}</p>
    </div>
    <div class="icons">
      <span :class="['socket', haveSocket]" :title="haveSocketText"></span>
      <span v-if="_check" @click.prevent.stop="$auth.logout()" class="logout icon-ios-power" title="logout"></span>
    </div>
  </nav>
</template>
<script>
export default {
  name: "Menu",
  data() {
    return {
      connected: false
    }
  },
  mounted () {
    if (this.$auth.check()) {
      this.$socket.emit('new-web-client', this.$auth.user()._id)
    }
  },
  computed: {
    haveSocket () {
      return this.connected ? 'icon-ios-wifi': 'icon-ios-airplane'
    },
    haveSocketText () {
      return this.connected ? 'connecté': 'non connecté'
    },
    _check() {
      return this.$auth.check()
    }
  },
  watch: {
    _check() {
      if (this.$auth.check()) {
        this.$socket.emit('new-web-client', this.$auth.user()._id)
      }
    }
  },
  sockets: {
    connected () {
      this.connected = true
    },
    disconnected () {
      this.connected = false
    },
    webRUAlive () {
        this.$socket.emit('webIsAlive', this.$auth.user()._id)
    }
  },
  methods: {
  },
}
</script>
<style scoped>
  .nav {
    position: fixed;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    width: 100%;
    height: 64px;
    background-color: var(--color-primary);
    z-index: 99999;
    text-transform: uppercase;
    color: var(--color-primary-10);
  }
  .leftSide,
  .icons {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .leftSide > *{
    margin-right: 10px;
  }
  .go-back,
  .socket,
  .logout {
    position: relative;
    display: block;
    font-size: 24px;
    cursor: pointer;
  }
</style>