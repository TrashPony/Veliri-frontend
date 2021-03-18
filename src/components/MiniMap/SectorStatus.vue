<template>
  <div id="attackBlockWrapper" ref="attackBlockWrapper" v-if="gameUser && gameUser.game_mod === 'open_world'"
       @mousedown="toUp">
    <div id="pointsWrapper">
      <div id="pointsLoader"
           :style="{background: sectorTextAndColor.color, width: sectorTextAndColor.fill + '%'}">
      </div>
      <span id="pointsCount" v-html="sectorTextAndColor.text"/>
    </div>
  </div>
</template>

<script>
import Control from '../Window/Control';

export default {
  name: "SectorStatus",
  methods: {
    toUp() {
      this.$store.commit({
        type: 'setWindowZIndex',
        id: this.$el.id,
      });
    },
  },
  components: {
    AppControl: Control,
  },
  computed: {
    state() {
      return this.$store.getters.getSectorState
    },
    sectorTextAndColor() {
      if (!this.state || !this.state.base) return {color: null, text: null, fill: null};

      let percentFill = 100 / (this.state.base.need_capture_points / this.state.base.capture_points.points);

      let color;
      if (this.state.base.capture_points.fraction === "Replics") color = "#c31d1d";
      if (this.state.base.capture_points.fraction === "Explores") color = "#00C32B";
      if (this.state.base.capture_points.fraction === "Reverses") color = "#0086C3";
      if (this.state.base.capture_points.fraction === "APD") color = "#fff16f";

      let text = '';
      if (this.state.base.capital) {
        text = 'Столица ' + this.state.base.fraction;
      } else if (this.state.base.fraction !== '') {
        text = 'Захвачено ' + this.state.base.fraction;
      } else {
        text = this.state.base.capture_points.points + '/' + this.state.base.need_capture_points;
      }

      if (this.state.base.fraction === '') {
        if (this.state.detail) {

          if (this.state.detail.b) {
            text += " <span class='mini'>(маяк недостроен)</span>"
          } else {
            if (this.state.detail.rs === "request_send" && this.state.detail.em === "") {
              text += " <span class='mini'>(запрос отправлен)</span>"
            }

            if (this.state.detail.rs === "request_send" && this.state.detail.em !== "") {
              text += " <span class='mini'>(строитель в пути)</span>"
            }
          }
        }
      }

      return {color: color, text: text, fill: percentFill}
    },
    gameUser() {
      return this.$store.getters.getGamePlayer
    },
  }
}
</script>

<style scoped>
#attackBlockWrapper {
  height: 15px;
  width: calc(100% - 4px);
  margin-top: 5px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, .2);
  border: 1px solid rgba(37, 160, 225, 0.3);
  background: rgba(8, 138, 210, 0.3);
  padding: 2px;
  border-radius: 5px;
}

#attackBlock {
  background: #89969c;
  height: 100%;
  width: 100%;
  border-radius: 5px;
  box-shadow: inset 0 0 3px black;
  overflow: hidden;
}

#pointsWrapper {
  height: 100%;
  width: 100%;
  position: relative;
  text-align: center;
  box-shadow: 0 0 2px black;
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

#pointsLoader {
  background: rgb(195, 29, 29);
  width: calc(100% - 6px);
  line-height: 14px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  padding: 0 3px;
  height: 100%;
  z-index: 0;
  position: absolute;
  top: 0;
  opacity: .7;
}

#pointsCount {
  display: block;
  line-height: 17px;
  z-index: 1;
  position: relative;
  color: #fffc00;
  font-size: 10px;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
}

</style>
<style>
#attackBlockWrapper .mini {
  color: white;
  font-size: 8px;
}
</style>
