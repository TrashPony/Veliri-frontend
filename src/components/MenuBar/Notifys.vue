<template>
  <div id="notifyBlock">
    <template v-for="notify in notifys">

      <div @click="deleteNotify(notify)"
           @mouseover="showNotify = notify.uuid"
           @blur="showNotify = notify.uuid"
           @focus="showNotify = notify.uuid"
           @mouseenter="showNotify = notify.uuid"
           @mousemove="showNotify = notify.uuid"
           @mouseout="showNotify = ''"
           :style="{backgroundColor: getNotifyColor(notify)}">

        <app-notify v-if="notify.uuid === showNotify"
                    v-bind:notify="notify"/>

      </div>
    </template>
  </div>
</template>

<script>
import BackgroundItemCell from '../Inventory/BackgroundItemCell';
import Notify from '../News/Notify';

export default {
  name: "Notifys",
  data() {
    return {
      showNotify: "",
    }
  },
  methods: {
    deleteNotify(notify) {
      this.$store.getters.getWSByService('chat').socket.send(JSON.stringify({
        event: "DeleteNotify",
        uuid: notify.uuid,
      }));
    },
    getNotifyColor(notify) {
      if (notify.name === 'craft') return '#4ab7b7';
      if (notify.name === 'sell' || notify.name === 'buy') return "#c765db";
      if (notify.name === 'skill_up') return '#ff9700';

      if (notify.event === 'lose_base' || notify.event === 'capture_base_other' && notify.data.lose === '')
        return '#ea743e';

      if ((notify.event === 'capture_base' && notify.data.lose !== '') ||
        notify.event === 'capture_base' && notify.data.lose === '') return "#587adb";

      if (notify.event === 'new_expedition' || notify.event === 'place_expedition' ||
        notify.event === 'destroy_expedition' || notify.event === 'expedition_trader') return '#b3ff00';

      if (notify.event === 'meteorite_rain') {
        return "#d0d02a"
      }

      return "#f3eeee"
    }
  },
  computed: {
    notifys() {

      let notifysArray = [];

      for (let i in this.$store.getters.getChatState.notifys) {
        let notify = this.$store.getters.getChatState.notifys[i];

        let notifyTime = new Date(notify.time / 1000000)
        let currentTime = new Date()

        let diffTime = new Date(currentTime.getTime() - notifyTime.getTime())
        if (diffTime.getMinutes() > 10) {
          this.deleteNotify(notify)
        } else {
          notifysArray.push(notify)
        }
      }

      return notifysArray.sort(function (a, b) {
        return new Date(a.time / 1000000) - new Date(b.time / 1000000);
      });
    },
  },
  components: {
    AppBackgroundItemCell: BackgroundItemCell,
    AppNotify: Notify,
  }
}
</script>

<style scoped>
#notifyBlock {
  position: absolute;
  background-color: rgb(33, 176, 255);
  border: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: 0 5px 0 0;
  min-width: 5px;
  height: 11px;
  left: 0;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
  padding-left: 3px;
  padding-right: 2px;
  padding-top: 1px;
  bottom: -1px;
  z-index: 999;
  pointer-events: auto;
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none;
}

#notifyBlock > div {
  position: relative;
  height: 9px;
  width: 9px;
  border-radius: 50%;
  background: rgb(255, 240, 0);
  box-shadow: inset 0 0 1px 1px rgba(0, 0, 0, 0.5), 0 0 1px 1px rgba(0, 0, 0, 0.25);
  border: 1px solid;
  float: left;
  margin-left: 3px;
  transition: 0.1s;
}

#notifyBlock > div:hover {
  transform: scale(1.15);
}

#notifyBlock > div:active {
  transform: scale(0.90);
}

</style>
