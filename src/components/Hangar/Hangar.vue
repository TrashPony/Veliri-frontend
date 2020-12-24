<template>
  <div id="inventoryBox"
       ref="inventoryBox"
       @mousedown="toUp">

    <app-control v-bind:head="language === 'RU' ? 'Конструктор снаряжения' : 'Equipment designer'"
                 v-bind:move="true"
                 v-bind:close="true"
                 v-bind:no-height="true"
                 v-bind:no-width="true"
                 v-bind:refWindow="'inventoryBox'"/>

    <app-hangar-head/>
    <app-m-s-params/>
    <app-constructor/>

    <div class="equipBarOutWrapper">
      <div class="equipBarWrapper">
        <app-equip-bar/>
      </div>
    </div>

  </div>
</template>

<script>
import Control from '../Window/Control';
import MSParams from './MSParams';
import HangarHead from './HangarHead';
import Constructor from './Constructor';
import EquipBar from '../EquipBar/EquipBar';

export default {
  name: "Hangar",
  data() {
    return {}
  },
  created() {
    this.$store.getters.getWSByService('inventory').socket.send(JSON.stringify({
      event: "openInventory"
    }));
  },
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
    inventory() {
      return this.$store.getters.getInventory
    },
  },
  components: {
    AppControl: Control,
    AppMSParams: MSParams,
    AppHangarHead: HangarHead,
    AppConstructor: Constructor,
    AppEquipBar: EquipBar,
  },
}
</script>

<style scoped>
#inventoryBox {
  position: absolute;
  top: 15%;
  width: 630px;
  left: calc(315px + 10%);;
  border-radius: 5px;
  z-index: 11;
  padding: 20px 3px 3px 3px;
  height: 359px;
  border: 1px solid #25a0e1;
  background: rgb(8, 138, 210);
  box-shadow: 0 0 2px black;
}

.equipBarOutWrapper {
  border: 1px solid #25a0e1;
  border-top: 0;
  background: rgb(8, 138, 210);
  border-radius: 0 0 5px 5px;
  float: right;
  padding: 2px;
  margin-top: 3px;
}

.equipBarWrapper {
  padding: 2px;
  float: right;
  border-radius: 5px;
  background: #89969c;
  box-shadow: inset 0 0 3px black;
}
</style>

<style>
#inventoryBox .SquadBarEquipCell {
  height: 27px;
  width: 27px;
}
</style>
