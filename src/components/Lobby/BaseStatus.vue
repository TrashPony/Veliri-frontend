<template>
  <div id="BaseStatus">
    <div id="logoWrapper">
      <div id="BaseLogo"
           v-if="baseStatus.fraction !== ''"
           :style="{backgroundImage: 'url(' + require('../../assets/' + getLogo(baseStatus.fraction))+')',
           animation: getAnimate(baseStatus.fraction)}"></div>
    </div>

    <div id="baseEfficiency" onclick="CreateDetailMarket()">
      <div>
        Эффективность:
        <span id="efficiencyPercent">{{ 100 - baseStatus.state.efficiency }}</span>
        <div id="detailStatusBase">

          <div class="baseDetailStatusRow" v-for="resource in baseStatus.resources">
            <div class="baseDetailStatusIcon">
              <app-background-item-cell v-bind:slotItem="resource"/>
            </div>
            <div class="baseDetailStatusWrapperCount">
              <span class="currentCount"> {{ resource.quantity }}</span>
              <span class="currentTax"> налог: {{ resource.tax }} %</span>
              <div class="progressBar">
                <div
                  :style="{width: (resource.quantity * 100 / baseStatus.state.boundary_amount_of_resources) + '%'}"></div>
              </div>
            </div>
          </div>

          <input type="button" value="Продать сырье">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BackgroundItemCell from '../Inventory/BackgroundItemCell'

export default {
  name: "BaseStatus",
  methods: {
    getLogo(fraction) {
      return `logo/${fraction}.png`
    },
    getAnimate(fraction) {
      let logoStyle = 'baseLogoReplics 5s infinite ease-in-out';

      if (fraction === 'Explores') {
        logoStyle = 'baseLogoExplores 5s infinite ease-in-out';
      } else if (fraction === 'Reverses') {
        logoStyle = 'baseLogoReverses 5s infinite ease-in-out';
      }

      return logoStyle
    }
  },
  computed: {
    baseStatus() {
      return this.$store.getters.getBaseStatus
    }
  },
  components: {
    AppBackgroundItemCell: BackgroundItemCell,
  }
}
</script>

<style>
#BaseStatus {
  height: 150px;
  width: 150px;
  position: absolute;
  right: 15px;
  top: 15px;
  border-radius: 5px;
  padding: 5px;
  border: 1px solid #25a0e1;
  background: rgb(8, 138, 210);
}

#logoWrapper {
  height: 150px;
  width: 150px;
  background: rgba(0, 0, 0, 0.5);
  box-shadow: inset 0 0 40px 5px black, 0 0 3px 1px black;
}

#BaseLogo {
  background-size: contain;
  height: 100%;
  filter: drop-shadow(0px -1px 5px red);
  width: 100%;
  animation: baseLogo 5s infinite ease-in-out;
}

#baseEfficiency {
  position: relative;
  visibility: visible;
  width: 140px;
  border: 1px solid #25a0e1;
  background-size: 10px 2px;
  background-image: linear-gradient(0deg, rgba(33, 176, 255, 0.8), rgba(37, 160, 225, 0.8));
  border-radius: 0 0 5px 5px;
  margin: 5px auto;
  padding: 0 1px 1px;
  transition: 0.2s;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
}

#baseEfficiency > div {
  color: white;
  box-shadow: inset 0 0 5px black;
  background: linear-gradient(0deg, transparent 60%, rgba(0, 0, 0, 0.1) 21%), #adc6cd;
  background-size: 10px 3px;
  border-radius: 0 0 5px 5px;
  font-weight: 100;
  font-size: 10px;
}

@keyframes baseLogoReplics {
  0% {
    filter: drop-shadow(0px -1px 5px red);
  }
  50% {
    filter: drop-shadow(0px -1px 10px red);
  }
  100% {
    filter: drop-shadow(0px -1px 5px red);
  }
}

@keyframes baseLogoExplores {
  0% {
    filter: drop-shadow(0px -1px 5px green);
  }
  50% {
    filter: drop-shadow(0px -1px 10px green);
  }
  100% {
    filter: drop-shadow(0px -1px 5px green);
  }
}

@keyframes baseLogoReverses {
  0% {
    filter: drop-shadow(0px -1px 5px blue);
  }
  50% {
    filter: drop-shadow(0px -1px 10px blue);
  }
  100% {
    filter: drop-shadow(0px -1px 5px blue);
  }
}

#detailStatusBase {
  background-size: 10px 4px;
  background-image: linear-gradient(0deg, rgba(7, 41, 60, 0.6) 87%, rgba(0, 62, 95, 0.5) 30%);
  border: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: 5px;
  height: 184px;
  width: 130px;
  position: absolute;
  top: 17px;
  right: 0;
  padding: 1px 5px 5px;
  visibility: hidden;
}

#detailStatusBase .progressBar {
  position: absolute;
  width: 100px;
}

#detailStatusBase input {
  display: block;
  margin: 7px auto 0;
  width: 100%;
  pointer-events: auto;
  font-size: 9px;
  text-align: center;
  transition: 100ms;
  background: rgba(255, 129, 0, 0.6);
  height: 16px;
  border-radius: 5px;
  color: #fff;
  line-height: 15px;
  box-shadow: 0 0 2px #000;
}

#detailStatusBase input:hover {
  background: rgba(255, 129, 0, 1);
}

#detailStatusBase input:active {
  transform: scale(0.98);
}

#baseEfficiency:hover #detailStatusBase {
  visibility: visible;
}

.baseDetailStatusRow {
  clear: both;
  height: 25px;
  width: 100%;
  margin-top: 2px;
}

#detailMarket .baseDetailStatusRow {
  margin-top: 5px;
  height: 50px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
  padding-bottom: 4px;
}

.baseDetailStatusIcon {
  float: left;
  height: 23px;
  width: 23px;
  background-color: rgba(128, 128, 128, 0.5);
  border-radius: 5px;
  border: 1px solid rgba(255, 253, 248, 0.5);
  position: relative;
}

#detailMarket .baseDetailStatusIcon {
  height: 44px;
  width: 44px;
  border: 1px solid rgba(0, 0, 0, 0.3);
  margin: 4px 0 0 0;
}

.baseDetailStatusWrapperCount {
  position: relative;
  width: 100px;
  height: 10px;
  float: right;
  margin-top: 13px;
  background-color: rgba(128, 128, 128, 0.7);
  border-radius: 3px;
  box-shadow: inset 0 0 2px black;
}

.baseDetailStatusWrapperCount span {
  margin-top: -13px;
}

#detailMarket .baseDetailStatusWrapperCount {
  float: left;
  margin-left: 4px;
  width: 160px;
  margin-top: 37px;
}

#detailMarket .baseDetailStatusWrapperCount > span {
  width: 155px;
  margin-top: -16px;
  text-align: left;
  display: block;
}

#detailMarket .baseDetailStatusWrapperCount span span {
  margin-top: 0;
  float: right;
}

.currentCount {
  margin-left: 5px;
  float: left;
}

.currentTax {
  float: right;
}

.progressBar {
  height: 100%;
  box-shadow: inset 0 0 4px black;
  border-radius: 3px;
  overflow: hidden;
}

.progressBar div {
  height: 100%;
  background-color: rgba(202, 255, 0, 0.75);
  box-shadow: inset 0 0 4px black;
}
</style>
