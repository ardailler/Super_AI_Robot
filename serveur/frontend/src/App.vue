<template>
  <div class="container">
      <transition name="menu-anim" enter-active-class="animated fadeInDown faster delay-1s" leave-active-class="animated fadeOutUp faster">
          <Menu v-if="_check"></Menu>
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
    computed: {
        _check() {
            return this.$auth.check();
        }
    },
    mounted () {
        // this.$socket.emit('new-web-client', 'PING!')
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
    /*.menu-anim-enter-to {
        -webkit-animation-delay: 1s;
        -moz-animation-delay: 1s;
        -o-animation-delay: 1s;
        animation-delay: 1s;
    }*/

    .menu-anim-leave-to {
        -webkit-animation-delay: .25s;
        -moz-animation-delay: .25s;
        -o-animation-delay: .25s;
        animation-delay: .25s;
    }
</style>