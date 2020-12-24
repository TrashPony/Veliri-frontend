<template>
  <div id="SquadBar" ref="SquadBar" @mousedown="toUp" v-if="inventory.equipPanel">
    <app-control v-bind:head="'Снаражение: '"
                 v-bind:move="true"
                 v-bind:close="false"
                 v-bind:noWidth="true"
                 v-bind:noHeight="true"
                 v-bind:refWindow="'SquadBar'"/>

    <div class="SquadBarEquipCell EmptySlot"
         v-bind:class="[{'mouse_select': !inventory.selectEquip || inventory.selectEquip.type === ''}]"
         @click="selectEquip(null, 'empty')">

    </div>

    <app-equip-bar/>

  </div>
</template>

<script>
import Control from '../Window/Control';
import EquipBar from './EquipBar';

export default {
  name: "EquipBarWrapper",
  data() {
    return {
      subAmmoOpen: false,
    }
  },
  methods: {
    toUp() {
      this.$store.commit({
        type: 'setWindowZIndex',
        id: this.$el.id,
      });
    },
    selectEquip(slot, key) {
      if (key === "empty") {
        this.$store.getters.getWSByService('global').socket.send(JSON.stringify({
          event: "SelectEmpty",
        }));
      }
    },
  },
  computed: {
    inventory() {
      return this.$store.getters.getInventory
    },
  },
  components: {
    AppControl: Control,
    AppEquipBar: EquipBar,
  }
}
</script>

<style scoped>
#SquadBar {
  position: absolute;
  border-radius: 5px;
  bottom: 15px;
  right: calc(50% - 462px);
  background: rgb(8, 138, 210);
  border: 1px solid #25a0e1;
  height: 50px;
  width: 702px;
  padding: 18px 4px 4px 4px;
}

#SquadBar .SquadBarEquipCell {
  float: left;
  height: 46px;
  width: 46px;
  background-color: #585858;
  border-radius: 5px;
  box-shadow: inset 0 0 2px, 0 0 2px;
  margin: 2px;
  position: relative;
  border: 2px solid rgba(0, 0, 0, 0.4);
}

#SquadBar .SquadBarEquipCell.weapon {
  background: #852700;
}

#SquadBar .SquadBarEquipCell.distEquip {
  background: #0d8511;
}

#SquadBar .SquadBarEquipCell.activeEquip {
  background: #006485;
}

#SquadBar .SquadBarEquipCell.passiveEquip {
  background: #687585;
}

#SquadBar .SquadBarEquipCell.item {
  background: #bcbbbd;
}

#SquadBar .SquadBarEquipCell.active {
  box-shadow: inset 0 0 2px yellow, 0 0 2px yellow;
  animation: 2s linear 0s infinite alternate active;
}

.mode.active {
  box-shadow: inset 0 0 2px yellow, 0 0 2px yellow;
  border: 1px solid yellow;
}

#SquadBar .SquadBarEquipCell:hover {
  border: 2px solid rgb(255, 183, 6);
}

#SquadBar .reloadEquip {
  height: 100%;
  width: 100%;
  position: absolute;
  background: rgba(0, 0, 0, 0.6);
  border-top: 1px solid grey;
  bottom: 0;
  transition: 200ms;
  z-index: 2;
}

#SquadBar .ammoEquip {
  height: 50%;
  width: 50%;
  position: absolute;
  z-index: 1;
  background: rgba(0, 0, 0, 0.6);
  bottom: 0;
  border: 1px solid grey;
}

@keyframes active {
  0% {
    border-left: 2px solid rgb(174, 255, 3);
    border-right: 2px solid rgb(253, 255, 0);
    border-top: 2px solid rgb(255, 212, 5);
    border-bottom: 2px solid rgb(255, 91, 0);
  }
  25% {
    border-left: 2px solid rgb(255, 91, 0);
    border-right: 2px solid rgb(174, 255, 3);
    border-top: 2px solid rgb(253, 255, 0);
    border-bottom: 2px solid rgb(255, 212, 5);
  }

  50% {
    border-left: 2px solid rgb(255, 212, 5);
    border-right: 2px solid rgb(255, 91, 0);
    border-top: 2px solid rgb(174, 255, 3);
    border-bottom: 2px solid rgb(253, 255, 0);
  }
  75% {
    border-left: 2px solid rgb(253, 255, 0);
    border-right: 2px solid rgb(255, 212, 5);
    border-top: 2px solid rgb(255, 91, 0);
    border-bottom: 2px solid rgb(174, 255, 3);
  }
}

.user_avatar {
  float: left;
  height: 50px;
  width: 50px;
  margin: 5px;
  border-radius: 2px;
  background: grey;
  box-shadow: 0 0 2px black;
  z-index: 1;
  position: relative;
  background-size: cover;
}

.user_name {
  color: white;
  float: left;
  padding: 0;
  margin: 6px 2px 2px -10px;
  box-shadow: 0 0 2px black;
  width: 146px;
  background: rgb(119, 119, 119);
}

.bars {
  float: left;
  width: 100%;
  margin-top: 3px;
}

#hp_bar {
  overflow: visible;
  background: rgba(72, 255, 40, 0.7);
  height: 100%;
}

.hp_bar_wrapper {
  width: calc(100% - 25px);
  height: 10px;
  border: 1px solid #4c4c4c;
  text-align: left;
  display: block;
  box-shadow: inset 0 0 2px black, 0 0 2px black;
  border-radius: 10px;
  background-size: 12%;
  overflow: hidden;
  background-color: #959595;
  margin: 0 auto 0;
}

.hp_bar_wrapper span {
  display: block;
  font-size: 10px;
  line-height: 11px;
  width: 100%;
  text-align: center;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 1);
  font-weight: bold;
  margin: auto;
  float: left;
  color: white;
}

#SquadBar .mouse_select {
  box-shadow: inset 0 0 7px 2px white, 0 0 2px white;
  border: 2px solid rgba(255, 255, 255, 0.8);
}

.QuantityItems {
  z-index: 1;
  position: absolute;
  bottom: 2px;
  left: 2px;
  font-size: 9px;
  color: #fff16f;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
  pointer-events: none;
}

.mode {
  border: 1px solid #2e2e2e;
  position: absolute;
  height: 26px;
  width: 26px;
  border-radius: 2px;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
  background-color: rgba(127, 127, 127, 0.8);
  top: -53px;
  background-size: cover;
}

.mode .title {
  position: absolute;
  bottom: calc(100% + 2px);
  display: none;
  color: white;
  font-size: 12px;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
}

.mode:hover .title {
  display: block;
}

.EmptySlot {
  background-image: url("https://img.icons8.com/plasticine/100/000000/robot.png");
  background-size: contain;
}
</style>
