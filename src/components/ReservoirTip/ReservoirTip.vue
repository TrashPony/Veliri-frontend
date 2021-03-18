<template>
  <div :id="windowID" :ref="windowID" class="reservoirTip" :style="{left: meta.pos.left, top: meta.pos.top}">

    <app-control v-bind:head="itemName" v-bind:move="false" v-bind:close="false" v-bind:refWindow="windowID"
                 v-bind:noHeight="true" v-bind:noWidth="true" v-bind:noPos="true"/>

    <div class="Description" v-if="!meta.item && meta.description && meta.description !== ''"
         v-html="meta.description"></div>

    <div class="reservoirInfo" v-if="meta.item && meta.count">
      <div class="iconOreTip">
        <app-background-item-cell v-if="meta.item" v-bind:slotItem="meta.item" v-bind:noShowName="false"/>
      </div>
      <div class="nameOre">{{ itemName }}</div>
      <div class="countOre" id="countOre${reservoir.x}${reservoir.y}">{{ meta.count }}</div>
    </div>

  </div>
</template>

<script>
import Control from '../Window/Control';
import BackgroundItemCell from '../Inventory/BackgroundItemCell';

/**
 meta{
      name: '',
      description: '',
      count: '',
      item: {
        type:
        item: {
          name: ''
        }
      }
  }
 **/

export default {
  name: "ReservoirTip",
  props: ['meta', 'windowID'],
  computed: {
    itemName() {
      if (!this.$props.meta.item) {
        return this.$props.meta.name
      }

      let item = this.$props.meta.item

      if (item.type === "blueprints") {
        if (item.item.in_map) {
          return this.handbook['structure'][this.language][item.item.name.split('_bp')[0]].name
        } else {
          return this.handbook[item.item.item_type][this.language][item.item.item_name].name
        }
      }

      return this.handbook[item.type][this.language][item.item.name].name
    },
    language() {
      return this.$store.getters.getSettings.Language
    },
    handbook() {
      return this.$store.getters.getHandBook
    }
  },
  components: {
    AppControl: Control,
    AppBackgroundItemCell: BackgroundItemCell,
  }
}
</script>

<style scoped>
.reservoirTip {
  min-height: 0;
  min-width: 70px;
  max-width: 260px;
  vertical-align: top;
  position: absolute;
  left: 1002px;
  top: 641px;
  border-radius: 5px;
  box-shadow: inset 0 0 2px black;
  border: 1px solid #2284b7;
  background: rgb(8, 138, 210);
  padding: 19px 2px 2px 2px;
  opacity: 0.85;
  pointer-events: none;
}

.reservoirTip .reservoirInfo {
  box-shadow: inset 0 0 2px black;
  background: rgb(132, 132, 132);
  margin: 3px 0 0;
  border-radius: 5px;
  height: 20px;
  padding: 2px 5px;
  font-size: 10px;
  line-height: 20px;
}

.reservoirTip h3 {
  display: block;
  width: 100%;
  margin: -7px 0 4px -1px;
  border: 1px solid black;
  border-radius: 5px 5px 0 0;
  box-shadow: 0 0 10px rgba(0, 0, 0, 1);
  line-height: 23px;
  background: rgba(101, 165, 195, 0.6);
  height: 21px;
  color: white;
}

.reservoirTip .iconOreTip {
  height: 20px;
  width: 20px;
  float: left;
  border-radius: 2px;
  position: relative;
}

.reservoirTip .nameOre {
  margin-left: 5px;
  float: left;
  color: #ff7800;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
}

.reservoirTip .countOre {
  margin-left: 3px;
  float: right;
  color: #eeff03;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
}

.reservoirTip .Description {
  border-radius: 5px;
  width: calc(100% - 14px);
  padding: 7px;
  box-shadow: inset 0 0 3px black;
  background: linear-gradient(0deg, transparent 0%, rgba(0, 0, 0, 0.1) 20%), #adc6cd;
  background-size: 100% 3px;
  font-size: 10px;
  font-weight: 900;
}
</style>
