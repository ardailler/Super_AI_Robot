<template>
  <div class="container">
      <transition name="menu-anim" enter-active-class="animated fadeInDown" leave-active-class="animated fadeOutUp">
          <Menu v-if="$auth.check()"></Menu>
      </transition>
      <router-view></router-view>
  </div>
</template>

<script>

import Menu from '@/components/tools/Menu.vue'
import '@/assets/css/animate.css'
import '@/assets/css/main.css'
import '@/assets/css/laravlock-icons.css';
import '@/assets/css/laravlock-icons-ie7.css';

export default {
    name: "app",
    data() {
        return {}
    },
    components: {
        Menu
    },
    mounted () {
    }
}
</script>

<style scoped>
    .container {
        position: relative;
        display: block;
        width: 100%;
        min-height: 100%;
    }
</style>