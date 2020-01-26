<template>
  <router-link :to="{ name : 'editSalle', params: {id: id} }" alt="editSalle" title="editSalle" :class="['salle-content', colorClass]">
    <p class="subtitle_2 title">{{name}}</p>
    <p class="body_2 time">{{timeFormated}}</p>
    <p class="icon-ios-home icon"></p>
    <p class="icon-ios-trash icon-remove" title="remove" @click.stop.prevent="remove"></p>
  </router-link>
</template>
<script>

export default {
  name: "Menu",
  props: {
    id: {
      type: String,
      default: ''
    },
    index: {
      type: Number,
      default: -1
    },
    name: {
      type: String,
      default: 'name'
    },
    time: {
      type: String,
      default: 'time'
    }
  },
  data() {
    return {
      colorClass: '',
      months: ['Janvier', 'Frevrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Decembre']
    }
  },
  mounted () {
      let rand = Math.floor(Math.random() * 7) + 1
      this.colorClass =  'color'+rand
  },
  computed: {
    timeFormated () {
      let date = new Date(this.time)
      return date.getDate() + ' ' + this.months[date.getMonth()] + ' ' + date.getFullYear()
    }
  },
  methods: {
    remove () {
      this.$emit('remove', this.id, this.index)
    }
  }
}
</script>
<style scoped>
  .salle-content {
    text-decoration: none;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 128px;
    padding: 10px;
    background-color: transparent;
    border: 2px solid var(--color-primary-40);
    color: var(--color-primary-40);
    -webkit-border-radius: 10px;
    -moz-border-radius: 10px;
    border-radius: 10px;
    cursor: pointer;
    overflow: hidden;

    -webkit-transition: 0.25s ease;
    -moz-transition: 0.25s ease;
    -ms-transition: 0.25s ease;
    -o-transition: 0.25s ease;
    transition: 0.25s ease;


    -webkit-box-shadow:  inset 9px 9px 16px rgba(163,177,198, 1), inset -9px -9px 16px rgba(255,255,255, 1);
    -moz-box-shadow:  inset 9px 9px 16px rgba(163,177,198, 1), inset -9px -9px 16px rgba(255,255,255, 1);
    box-shadow:  inset 9px 9px 16px rgba(163,177,198, 1), inset -9px -9px 16px rgba(255,255,255, 1);
  }
   .salle-content p:nth-child(2) {
    text-align: right;
    z-index: 2;
  }
   .salle-content .icon-remove {
     position: absolute;
     top: 10px;
     right: 0px;
     font-size: 24px;
     z-index: 2;
   }
   .salle-content .icon {
    position: absolute;
    bottom: -64px;
    right: -128px;
    font-size: 256px;
    z-index: 1;
    opacity: .5;
  }
   .salle-content:hover {
    background-color: var(--color-primary-40);
    border: 2px solid var(--color-primary-40);
    color: white;
     border: 2px solid white !important;
     -webkit-box-shadow:  9px 9px 16px rgba(163,177,198, 1), -9px -9px 16px rgba(255,255,255, 1);
     -moz-box-shadow:  9px 9px 16px rgba(163,177,198, 1), -9px -9px 16px rgba(255,255,255, 1);
     box-shadow:  9px 9px 16px rgba(163,177,198, 1), -9px -9px 16px rgba(255,255,255, 1);
  }

  .salle-content.color1 {
    border: 2px solid var(--color-primary-40);
    color: var(--color-primary-40);
  }
  .salle-content.color1:hover {
    background-color: var(--color-primary-40);
    border: 2px solid var(--color-primary-40);
    color: white;
  }

  .salle-content.color2 {
    border: 2px solid var(--color-primary-20);
    color: var(--color-primary-20);
  }
  .salle-content.color2:hover {
    background-color: var(--color-primary-20);
    border: 2px solid var(--color-primary-20);
    color: white;
  }

  .salle-content.color3 {
    border: 2px solid var(--color-primary-30);
    color: var(--color-primary-30);
  }
  .salle-content.color3:hover {
    background-color: var(--color-primary-30);
    border: 2px solid var(--color-primary-30);
    color: white;
  }

  .salle-content.color4 {
    border: 2px solid var(--color-secondary-10);
    color: var(--color-secondary-10);
  }
  .salle-content.color4:hover {
    background-color: var(--color-secondary-10);
    border: 2px solid var(--color-secondary-10);
    color: white;
  }

  .salle-content.color5 {
    border: 2px solid var(--color-secondary-20);
    color: var(--color-secondary-20);
  }
  .salle-content.color5:hover {
    background-color: var(--color-secondary-20);
    border: 2px solid var(--color-secondary-20);
    color: white;
  }

  .salle-content.color6 {
    border: 2px solid var(--color-secondary-30);
    color: var(--color-secondary-30);
  }
  .salle-content.color6:hover {
    background-color: var(--color-secondary-30);
    border: 2px solid var(--color-secondary-30);
    color: white;
  }

  .salle-content.color7 {
    border: 2px solid var(--color-secondary-40);
    color: var(--color-secondary-40);
  }
  .salle-content.color7:hover {
    background-color: var(--color-secondary-40);
    border: 2px solid var(--color-secondary-40);
    color: white;
  }
</style>