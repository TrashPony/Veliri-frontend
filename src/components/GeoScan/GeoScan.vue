<template>
  <div id="anomalyScannerWrapper" ref="anomalyScannerWrapper" @mousedown="toUp">

    <app-control v-bind:head="language === 'RU' ? 'Сканер:' : 'Scanner:'"
                 v-bind:move="true"
                 v-bind:close="true"
                 v-bind:refWindow="'anomalyScannerWrapper'"/>

    <div id="anomalyScanner">
      <div id="anomalyDisplay">
        <div id="anomalyBody" ref="anomalyBody" :style="{background: getAnomalyBodyBackground}"></div>

        <div class="anomalyPing"
             v-for="anomaly in anomalies"
             :style="{left: anomaly.left, top: anomaly.top, transform: anomaly.transform, background: anomaly.background}">
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import Control from '../Window/Control';

export default {
  name: "GeoScan",
  methods: {
    toUp() {
      this.$store.commit({
        type: 'setWindowZIndex',
        id: this.$el.id,
      });
    },
  },
  computed: {
    language() {
      return this.$store.getters.getSettings.Language
    },
    unit() {
      return this.$store.getters.getUnit
    },
    anomalies() {
      let anomalies = this.$store.getters.getAnomalies;
      let anomaliesDisplay = [];

      if (!this.$refs['anomalyBody']) return anomaliesDisplay;

      for (let i = 0; i < anomalies.length; i++) {

        let display = {};

        anomalies[i].rotate -= 180;
        if (anomalies[i].rotate < 0) {
          anomalies[i].rotate += 360
        }

        if (anomalies[i].rotate > 360) {
          anomalies[i].rotate -= 360
        }

        let radRotate = (anomalies[i].rotate) * Math.PI / 180;

        let yAttach = this.$refs['anomalyBody'].offsetHeight / 2 * Math.cos(radRotate);
        let xAttach = this.$refs['anomalyBody'].offsetHeight / 2 * Math.sin(radRotate);

        xAttach += this.$refs['anomalyBody'].offsetHeight / 2 - 8; // 8 это радиус дива пинга
        yAttach += this.$refs['anomalyBody'].offsetHeight / 2 - 8;

        display.left = xAttach + "px";
        display.top = yAttach + "px";

        // мин 0.3 макс 3
        display.transform = "scale(" + Number(3 - (0.3 * anomalies[i].signal / 10)) + ")";

        if (anomalies[i].type_anomaly === 999) { // неопознаный тип
          display.background = "#15fff5";
        }

        if (anomalies[i].type_anomaly === 0 || anomalies[i].type_anomaly === 1 || anomalies[i].type_anomaly === 7 || anomalies[i].type_anomaly === 8) { // ящик
          display.background = "#fff604";
        }

        if (anomalies[i].type_anomaly === 2) { // руда
          display.background = "#13ff12";
        }

        if (anomalies[i].type_anomaly === 3 || anomalies[i].type_anomaly === 4) { // текс, артефакт
          display.background = "#0b0fff";
        }

        anomaliesDisplay.push(display);
      }

      return anomaliesDisplay
    },
    getAnomalyBodyBackground() {
      let unit = this.unit;
      if (!unit) return;

      return "url(" + require('../../assets/units/body/' + unit.body.name + '/skins/' + unit.body.name + '_skin_1.png') + ") center center / 50px no-repeat, " +
        "url(" + require('../../assets/units/body/' + unit.body.name + '/' + unit.body.name + '_bottom.png') + ") center center / 50px no-repeat";
    },
  },
  components: {
    AppControl: Control,
  }
}
</script>

<style scoped>
#anomalyScannerWrapper {
  position: absolute;
  border-radius: 5px;
  background: rgb(8, 138, 210);
  border: 1px solid #25a0e1;
  padding: 18px 3px 0;
  left: 290px;
  top: 15px;
}

#anomalyScanner {
  width: 100px;
  height: 100px;
  border-radius: 5px;
  box-shadow: inset 0 0 2px 0 black;
  float: left;
  background: #6c8998;
  margin: 2px 2px 2px 1px;
}

#anomalyDisplay {
  width: 100px;
  height: 100px;
  background-size: 10px 2px;
  background: linear-gradient(1deg, rgba(4, 13, 19, 0.6), rgba(2, 3, 6, 0.6) 6px);
  border-radius: 50%;
  box-shadow: inset 0 0 20px black;
  position: relative;
  overflow: hidden;
  z-index: 1;
}

#anomalyBody {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  transform: rotate(270deg);
  opacity: 0.5;
}

.anomalyPing {
  width: 16px;
  height: 16px;
  position: absolute;
  top: 5px; /* */
  right: 5px; /* */
  background: #15fff5;
  border-radius: 50%;
  filter: blur(3px);
  transform: scale(1); /* изменяется скриптом */
}
</style>
