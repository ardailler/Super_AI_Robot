<template>
  <nav class="nav">
    <p class="subtitle_1">{{ $auth.user().name }}</p>
    <div class="icons">
      <span :class="['socket', haveSocket]" :title="haveSocketText"></span>
      <span v-if="$auth.check()" @click.prevent.stop="$auth.logout()" class="logout icon-ios-power" title="logout"></span>
    </div>
  </nav>
</template>
<script>
export default {
  name: "Menu",
  data() {
    return {
    }
  },
  methods: {
  },
  computed: {
    haveSocket () {
      return this.$socket && this.$socket.connected ? 'icon-ios-wifi': 'icon-ios-airplane'
    },
    haveSocketText () {
      return this.$socket && this.$socket.connected ? 'connecté': 'non connecté'
    }
  }
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
  .icons {
    display: flex;
  }
  .socket,
  .logout {
    position: relative;
    display: block;
    font-size: 24px;
    cursor: pointer;
  }
</style>