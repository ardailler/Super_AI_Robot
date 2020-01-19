<template>
  <div class="container">
      <router-view></router-view>
  </div>
</template>

<script>

import '@/assets/css/animate.css'
import '@/assets/css/main.css'

export default {
  name: "app",
  components: {
  }
};
</script>

<style scoped>
  .container {
      position: relative;
      display: block;
      width: 100%;
      min-height: 100%;
  }
</style>