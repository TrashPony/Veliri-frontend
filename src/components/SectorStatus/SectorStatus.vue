<template>
  <div id="attackBlockWrapper" ref="attackBlockWrapper" v-if="gameUser && gameUser.game_mod === 'open_world'" @mousedown="toUp">

    <app-control v-bind:head="'Состояние сектора'"
                 v-bind:move="true"
                 v-bind:refWindow="'attackBlockWrapper'"/>

    <div id="pointsWrapper">
      <div id="pointsLoader"
           :style="{background: sectorTextAndColor.color, width: sectorTextAndColor.fill + '%'}"></div>
      <span id="pointsCount">{{sectorTextAndColor.text}}</span>
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
    height: 30px;
    width: 200px;
    position: absolute;
    right: 250px;
    top: 15px;
    padding: 20px 3px 3px 3px;
    border: 1px solid #25a0e1;
    background: rgb(8, 138, 210);
    border-radius: 5px;
    z-index: 10;
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
  }

  #pointsLoader {
    height: 100%;
    box-shadow: inset 0 0 6px, 0 0 3px;
    position: absolute;
    top: 0;
    left: 0;
  }

  #pointsCount {
    z-index: 1;
    position: relative;
    top: 7px;
    color: #fffc00;
    text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
  }
</style>
