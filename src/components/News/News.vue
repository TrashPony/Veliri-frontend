<template>
  <div id="News" ref="News">
    <app-control v-bind:head="language === 'RU' ? 'Новости:' : 'News:'"
                 v-bind:move="true"
                 v-bind:close="true"
                 v-bind:refWindow="'News'"
                 v-bind:resizeFunc="resize"
                 v-bind:minSize="{height: 100, width: 290}"/>

    <div class="tabs">
      <div v-bind:class="{active: menu==='main'}" @click="menu = 'main'">Все</div>
      <div v-bind:class="{active: menu==='fraction_war'}" @click="menu = 'fraction_war'">Военные сводки</div>
      <div v-bind:class="{active: menu==='expedition'}" @click="menu = 'expedition'">Экспедиция</div>
      <div v-bind:class="{active: menu==='production'}" @click="menu = 'production'">Производство</div>
    </div>

    <div class="wrap">
      <app-notify v-for="notify in notifys" v-bind:notify="notify"/>
      <div style="height: 0; width: 100%; float: left;"></div>
    </div>
  </div>
</template>

<script>
import Control from '../Window/Control';
import Notify from '../News/Notify';

export default {
  name: "News",
  data() {
    return {
      menu: "main",
      updater: null,
    }
  },
  destroyed() {
    clearInterval(this.updater);
  },
  mounted() {
    let app = this;

    app.$store.getters.getWSByService('chat').socket.send(JSON.stringify({
      event: "GetFractionNews",
    }));

    app.updater = setInterval(function () {
      app.$store.getters.getWSByService('chat').socket.send(JSON.stringify({
        event: "GetFractionNews",
      }));
    }, 3000)
  },
  methods: {
    resize() {
    },
  },
  computed: {
    language() {
      return this.$store.getters.getSettings.Language
    },
    notifys() {

      let notifysArray = [];

      for (let i in this.$store.getters.getFractionNews) {

        let notify = this.$store.getters.getFractionNews[i];
        if (this.menu === 'main') {
          notifysArray.push(notify)
        }

        if (this.menu === 'expedition' && (notify.event === 'new_expedition' || notify.event === 'place_expedition' ||
          notify.event === 'destroy_expedition' || notify.event === 'expedition_trader')) {
          notifysArray.push(notify)
        }

        if (this.menu === 'fraction_war' && (notify.event === 'capture_base' || notify.event === 'capture_base_other' ||
          notify.event === 'lose_base')) {
          notifysArray.push(notify)
        }

        if (this.menu === 'production' && (notify.event === 'meteorite_rain' || notify.event === 'base_max_efficiency' ||
          notify.event === 'base_min_tax')) {
          notifysArray.push(notify)
        }
      }

      return notifysArray.sort(function (a, b) {
        return new Date(b.time / 1000000) - new Date(a.time / 1000000);
      });
    },
  },
  components: {
    AppControl: Control,
    AppNotify: Notify,
  }
}
</script>

<style scoped>
#News {
  position: absolute;
  display: block;
  border-radius: 5px;
  z-index: 11;
  width: 290px;
  height: 150px;
  top: 50px;
  left: calc(50% - 200px);
  padding: 20px 3px 3px;
  color: #0cc2fb;
  border: 1px solid #25a0e1;
  background: rgb(8, 138, 210);
}


.tabs {
  height: 15px;
  width: calc(100% - 5px);
  background: rgba(0, 0, 0, 0.2);
  margin: 0 0 0 5px;
  border-radius: 3px 3px 0 0;
  overflow: hidden;
}

.tabs div {
  height: 15px;
  float: left;
  font-size: 10px;
  font-weight: 900;
  line-height: 15px;
  border-right: 1px solid rgba(191, 191, 191, 0.43);
  padding: 0 3px;
  color: #bfbfbf;
  text-shadow: 1px 1px black;
  cursor: pointer;
  transition: 200ms;
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none;
}

.tabs div:last-child {
  border-left: 0;
}

.tabs .active {
  color: #fff200 !important;
  background: rgb(187, 93, 42);
}

.tabs div:hover {
  background: rgb(235, 98, 44);
}

.tabs div:active {
  transform: scale(0.98);
}

.wrap {
  width: calc(100% - 14px);
  background: #89969c;
  float: left;
  box-shadow: inset 0 0 2px black;
  overflow-y: scroll;
  overflow-x: hidden;
  border-radius: 5px;
  font-size: 12px;
  padding: 0 7px 7px 7px;
  height: calc(100% - 22px);
}
</style>
<style>
#News .wrap .missionNotify {
  position: relative;
  float: left;
  bottom: unset;
  width: calc(100% - 8px);
  margin-top: 8px;
  background-color: rgba(7, 41, 60, 0.4);
}
</style>
