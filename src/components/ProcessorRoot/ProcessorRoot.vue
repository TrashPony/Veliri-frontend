<template>
  <div id="processorRoot" ref="processorRoot" @mousedown="toUp">
    <app-control v-bind:head="language === 'RU' ? 'Переработчик:' : 'Processor:'"
                 v-bind:move="true"
                 v-bind:close="true"
                 v-bind:refWindow="'processorRoot'"
                 v-bind:resizeFunc="resize"
                 v-bind:minSize="{height: 128, width: 461}"/>


    <app-items-drop-zone/>

    <div class="itemsPools" id="previewPool">
      <div class="pollHead">
        <h3>Output results</h3>
      </div>

      <div class="RecycleSection" v-for="(items, section) in outputItems">

        <div class="nameSection">{{ section }}
          <div class="hideArrowSection"></div>
        </div>

        <app-item-cell v-for="item in items"
                       v-bind:itemSlot="item"
                       v-bind:size="50"/>

      </div>
    </div>

    <input type="button" class="lobbyButton inventoryTip" @click="clearProcessor"
           :value="language === 'RU' ? 'Очистить' : 'Clear'"
           style="pointer-events: auto;">
    <input type="button" class="lobbyButton inventoryTip" @click="recycle"
           :value="language === 'RU' ? 'Переработать' : 'Recycle'"
           style="pointer-events: auto;">

  </div>
</template>

<script>
import Control from '../Window/Control';
import ItemsDropZone from './ItemsDropZone';
import ItemCell from '../Inventory/ItemCell';

export default {
  name: "ProcessorRoot",
  created() {
    this.clearProcessor();
  },
  methods: {
    clearProcessor() {
      this.$store.getters.getWSByService('lobby').socket.send(JSON.stringify({
        event: "ClearProcessor",
      }));
    },
    recycle() {
      this.$store.getters.getWSByService('lobby').socket.send(JSON.stringify({
        event: "recycle",
      }));
    },
    resize(event, ui, el) {
      el.find('.itemsPools').css("width", el.width() / 2 - 14);
      el.find('.itemsPools').css("height", el.height() - 60);
      el.find('.pollHead').css("width", el.width() / 2 - 18);
    },
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
    recycler() {
      return this.$store.getters.getRecyclerState
    },
    outputItems() {
      let sections = {};

      let need_items_slots = this.$store.getters.getRecyclerState.preview_recycle_slots;
      for (let i in need_items_slots) {

        let slot = need_items_slots[i];
        if (!sections.hasOwnProperty(slot.type)) {
          sections[slot.type] = [];
        }
        sections[slot.type].push(slot);
      }

      return sections;
    },
  },
  components: {
    AppControl: Control,
    AppItemsDropZone: ItemsDropZone,
    AppItemCell: ItemCell,
  }
}
</script>

<style>
#processorRoot {
  padding-top: 3px;
  width: 560px;
  height: 300px;
  position: absolute;
  display: block;
  border-radius: 5px;
  top: 50px;
  left: calc(50% - 400px);
  z-index: 11;
  border: 1px solid #25a0e1;
  background: rgb(8, 138, 210);
  box-shadow: 0 0 2px black;
}

#processorRoot .itemsPools {
  overflow-y: auto;
  border-radius: 5px;
  width: 266px;
  height: 240px;
  float: left;
  box-shadow: inset 0 0 5px black;
  background: #89969c;
  margin: 20px 7px 0 7px;
  text-align: left;
  overflow-x: hidden;
}

#processorRoot .itemsPools .pollHead {
  text-align: left;
  height: 17px;
  border-radius: 5px 0 0 0;
  border: 1px solid #25a0e1;
  z-index: 999;
  background-size: 10px 2px;
  background-image: linear-gradient(1deg, rgba(33, 176, 255, 0.6), rgba(37, 160, 225, 0.6) 6px);
  line-height: 19px;
  margin: 1px 0 0 1px;
  width: 262px;
  box-shadow: 0 0 2px black;
  color: #ff7800;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
}

#processorRoot .itemsPools .pollHead h3 {
  margin: 0;
  padding: 0 4px;
  display: block;
  width: 90px;
  height: 14px;
  float: left;
  font-size: 11px;
  font-weight: 100;
}

#RecyclePercent {
  height: 17px;
  width: 90px;
  float: right;
  background: rgba(0, 0, 0, 0.5);
  text-align: center;
  font-size: 10px;
  line-height: 17px;
  position: relative;
  z-index: 1;
}

#fillBackPercent {
  background-size: 10px 2px;
  background-image: linear-gradient(1deg, rgb(251, 93, 0), rgba(225, 37, 46, 0.6) 6px);
  width: 50%;
  height: 100%;
  position: absolute;
  z-index: -1;
}

#processorRoot .itemsPools .pollHead .util {
  height: 18px;
  width: 18px;
  background: url(../../assets/indexImg/util.png) center center / cover no-repeat;
  float: right;
  margin-right: 5px;
}

#processorRoot .lobbyButton {
  outline: none;
  border: 1px solid #25a0e1;
  background-color: rgba(26, 169, 218, 0.5);
  border-radius: 10px;
  padding: 2px 10px 2px;
  z-index: 11;
  margin: 10px;
  position: static;
  width: 105px;
  color: #ff7800;
  transition: 0.2s;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
}

.nameSection {
  clear: both;
  width: 100%;
  height: 14px;
  font-size: 12px;
  margin: 2px 0 1px 1px;
  padding-left: 11px;
  border: 1px solid #793f1f;
  background-size: 10px 2px;
  background-image: linear-gradient(1deg, rgba(251, 93, 0, 0.55), rgba(225, 37, 46, 0.6) 6px);
  color: #ff7800;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
}

.RecycleSection {
  margin-top: 5px;
  float: left;
  width: 100%;
}

#processorRoot .lobbyButton:active {
  transform: scale(0.95);
}

#processorRoot .lobbyButton:hover {
  background-color: rgb(26, 204, 255);
}
</style>
