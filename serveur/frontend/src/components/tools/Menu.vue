<template>
  <nav class="nav">
    <p class="subtitle_1">{{ $auth.user().name }}</p>
    <span v-if="$auth.check()" @click.prevent.stop="$auth.logout()" class="logout icon-ios-log-out" title="logout"></span>
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
  .logout {
    position: relative;
    display: block;
    font-size: 24px;
    cursor: pointer;
  }
</style>