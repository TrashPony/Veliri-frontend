<template>
  <div id="HeadGlobal">
    <div id="statusBar">

      <div id="reactorStatus" v-if="false">
        <div id="countPower">{{ (unit.power / 100).toFixed(0) }} / {{ (state.max_power / 100).toFixed(0) }}</div>
        <div id="recoverPower">
          +{{ countRecovery }} <span>ед/сек.</span>
        </div>
      </div>

      <div id="Thorium">

        <template v-for="n in 3">
          <div class="Thorium noActive" v-if="!(slots && slots[n])"/>
          <div class="Thorium" :ref="'Thorium' + n" v-else @click="removeThorium(n)"
               :style="{
              backgroundImage: 'url('+ require('../../assets/resource/enriched_thorium.png') + ')',
              opacity: slots[n].count === 0 ? '0.5' : '1',
              animation: slots[n].count / slots[n].max_count < 0.2 && slots[n].count !== 0 ? 'alertPulse 2s infinite ease-in-out' : ''}">


            <span class="ThoriumCount">{{ slots[n].count + "/" + slots[n].max_count }}</span>

            <div style="position: absolute; bottom: 0; width: 100%;">
              <div v-if="slots[n].count > 0" class="wrapper" style="margin-bottom: 2px;">
                <div class="WorkOutBar" :style="{width: 100 / (100 / (100 - slots[n].worked_out)) + '%'}"/>
              </div>

              <div v-if="slots[n].count > 0" class="wrapper">
                <div class="WorkOutBar"
                     :style="{width: (100 / (slots[n].max_count / slots[n].count)) + '%', backgroundColor: colorDamage((100 / (slots[n].max_count / slots[n].count)))}"/>
              </div>
            </div>
          </div>
        </template>
      </div>

      <div style="float: left; margin: 4px 0 0;" v-if="state && false">
        <div id="speedBarEfficiency" :style="{color: getSpeedColor}">{{ Math.round(currentSpeed) }}</div>
        <div id="thoriumBarEfficiency">{{ Math.round(state.efficiency_reactor) * 100 }}%</div>
      </div>

      <div id="backAfterburner" v-if="false">
        <div id="Afterburner" @click="afterburnerToggle()"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ReactorStatus",
  mounted() {
    let app = this;
    let waitCells = setInterval(function () {
      if (app.slots) {
        for (let i in app.slots) {
          app.initDropSlot(app.slots[i], app.slots[i].number_slot)
        }
        clearInterval(waitCells);
      }
    }, 100)
  },
  methods: {
    colorDamage(percent) {
      return this.$store.getters.GetColorDamage(percent)
    },
    removeThorium(i) {
      this.$store.getters.getWSByService('global').socket.send(JSON.stringify({
        event: "removeThorium",
        thorium_slot: Number(i)
      }))
    },
    afterburnerToggle() {
      alert('nope')
    },
    initDropSlot(slot, number) {
      let app = this;
      let waitCell = setInterval(function () {
        if (app.$refs['Thorium' + number]) {
          let slot = app.$refs['Thorium' + number][0];

          $(slot).droppable({
            tolerance: "pointer",
            drop: function (event, ui) {
              $('.ui-selected').removeClass('ui-selected');

              let draggable = ui.draggable;
              let slotData = draggable.data("slotData");

              if (slotData.data.type === "recycle" && slotData.data.item.name === "enriched_thorium") {
                app.$store.getters.getWSByService('inventory').socket.send(JSON.stringify({
                  event: "SetThorium",
                  inventory_slot: Number(slotData.number),
                  thorium_slot: Number(number),
                  source: slotData.parent,
                }));
              }
            }
          });
          clearInterval(waitCell);
        }
      }, 100)
    },
  },
  computed: {
    unit() {
      return this.$store.getters.getUnit
    },
    state() {
      return this.$store.getters.getUnitState
    },
    slots() {

      if (!this.$store.getters.getThoriumSlots) return null;

      let slots = {};

      for (let i in this.$store.getters.getThoriumSlots) {
        slots[this.$store.getters.getThoriumSlots[i].number_slot] = this.$store.getters.getThoriumSlots[i]
      }

      return slots
    },
    getSpeedColor() {
      if (this.state.efficiency_reactor <= 0.33) {
        return "#FF0000";
      } else if (this.state.efficiency_reactor <= 0.66) {
        return "#FFF000";
      } else if (this.state.efficiency_reactor <= 1) {
        return "#00FF00";
      }
    },
    currentSpeed() {
      return this.$store.getters.getUnitSpeed
    },
    countRecovery() {
      let countRecovery = 0;

      for (let i in this.unit.thorium_slots) {
        let slot = this.unit.thorium_slots[i];
        if (slot.count > 0) {
          countRecovery += slot.processing_thorium
        }
      }

      return countRecovery
    },
  }
}
</script>

<style scoped>
#HeadGlobal {

}

#statusBar {

}

#reactorStatus {
  background: url(https://img.icons8.com/plasticine/100/000000/charge-battery.png) center -4px / 77% no-repeat, rgba(0, 0, 0, 0.21);
  width: 70px;
  height: 44px;
  float: left;
  margin: 3px 3px;
  border-radius: 5px;
}

#countPower, #recoverPower {
  font-size: 10px;
  text-align: center;
  color: #00e1ff;
  margin-top: 4px;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
}

#recoverPower {
  color: #83ff00;
  margin-top: 14px;
}

#statusBar #Thorium .Thorium {
  position: relative;
  width: 25px;
  height: 12px;
  float: left;
  border-radius: 2px;
  background-size: cover;
  margin: 0 2px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 1);
  background: #066ea8;
}

#statusBar #Thorium .Thorium.noActive {
  background: -webkit-gradient(linear, left top, right top, color-stop(0%, #4c4c4c), color-stop(20%, #1AA9DA), color-stop(0%, #1AA9DA), color-stop(100%, #4c4c4c));
}

#statusBar #Thorium {

}

#backAfterburner {
  height: 40px;
  width: 40px;
  float: left;
  background: #4c4c4c;
  margin: 5px 2px;
  border-radius: 5px;
}

#speedBarEfficiency, #thoriumBarEfficiency {
  height: 18px;
  width: 50px;
  line-height: 19px;
  user-select: none;
  text-align: right;
  padding-right: 4px;
  background: url(https://img.icons8.com/color/52/000000/speedometer.png) -1px center / 50% no-repeat, rgba(0, 0, 0, 0.21);
  border-radius: 5px;
  border: 1px solid #959595;
  margin: 1px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 1);
  font-size: 9px;
  color: #00FFFD;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
}

#thoriumBarEfficiency {
  top: 24px;
  left: 128px;
  background: url(https://img.icons8.com/color/52/000000/gas-station.png) 3px center / 40% no-repeat, rgba(0, 0, 0, 0.21);
}

#Afterburner {
  height: 100%;
  width: 100%;
  background: url(https://img.icons8.com/ultraviolet/64/000000/biohazard.png) center center / 100% no-repeat;
}

.wrapper {
  width: calc(100% - 2px);
  box-shadow: 0 0 2px black;
  background: grey;
  border-radius: 2px;
  overflow: hidden;
  height: 4px;
  margin: 0 auto 1px;
}

.WorkOutBar {
  width: 100%;
  height: 100%;
  overflow: visible;
  background: rgb(3, 245, 255);
  box-shadow: inset 0 0 2px black;
}

.ThoriumCount {
  display: none;
  position: absolute;
  bottom: calc(100% + 3px);
  font-size: 11px;
  color: yellow;
  padding: 2px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  text-align: center;
  border: 1px solid rgba(37, 160, 225, 0.5);
  background: rgba(8, 138, 210, 0.5);
  border-radius: 3px;
  box-shadow: 0 0 2px black;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
}

.Thorium:hover .ThoriumCount {
  display: block;
}
</style>
