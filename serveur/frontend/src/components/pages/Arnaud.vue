<template>
  <div class="arnaud-container">
    <p class="subtitle_1">Avancer</p>
    <button @click.prevent.stop="moveForwardStart">Avancer start</button>
    <button @click.prevent.stop="moveForwardStop">Avancer stop</button>
    <p class="subtitle_1">Reculer</p>
    <button @click.prevent.stop="moveBackwardStart">Reculer start</button>
    <button @click.prevent.stop="moveBackwardStop">Reculer stop</button>
    <p class="subtitle_1">Tourner à gauche</p>
    <button @click.prevent.stop="turnLeftStart">Gauche start</button>
    <button @click.prevent.stop="turnLeftStop">Gauche stop</button>
    <p class="subtitle_1">Tourner à gauche</p>
    <button @click.prevent.stop="turnRightStart">Droite start</button>
    <button @click.prevent.stop="turnRightStop">Droite stop</button>
    <p class="subtitle_1">Radar</p>
    <button @click.prevent.stop="getInfos">Récupérer avancement + distance mur</button>

  </div>
</template>

<script>

  export default {
    data() {
      return {
      }
    },
    components: {
    },
    mounted () {
    },
    methods: {
      moveForwardStart () {
        alert('Avancer Start')
      },
      moveForwardStop () {
        alert('Avancer stop')
      },
      moveBackwardStart () {
        alert('Reculer Start')
      },
      moveBackwardStop () {
        alert('Reculer stop')
      },
      turnLeftStart () {
        alert('Gauche Start')
      },
      turnLeftStop () {
        alert('Gauche stop')
      },
      turnRightStart () {
        alert('Droite Start')
      },
      turnRightStop () {
        alert('Droite stop')
      },
      getInfos () {
        alert('Avancement + distance mur')
      }
    }
  }
</script>

<style scoped>
</style>