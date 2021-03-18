<template>
  <div id="processorRoot" ref="processorRoot" @mousedown="toUp">
    <app-control v-bind:head="language === 'RU' ? 'Переработчик:' : 'Processor:'"
                 v-bind:move="true"
                 v-bind:close="true"
                 v-bind:refWindow="'processorRoot'"
                 v-bind:resizeFunc="resize"
                 v-bind:minSize="{height: 128, width: 445}"/>


    <app-items-drop-zone/>

    <div class="itemsPools">
      <div class="pollHead" style="background: #a59a9a;">
        <div>
          <div id="RecyclePercent">
            <div id="fillBackPercent" :style="{width: recycler.user_recycle_skill + '%'}"></div>
            <span id="UserRecyclePercent">
              <span id="losesText">{{ language === 'RU' ? 'Потери:' : 'Losses:' }}</span> {{ recycler.user_recycle_skill }} %
          </span>
          </div>
          <div class="util"></div>
        </div>
      </div>

      <div class="RecycleSection" v-for="(items, section) in lostItems">

        <div class="nameSection">{{ handbook['categories'][language][section].name }}
          <div class="hideArrowSection"></div>
        </div>

        <app-item-cell v-for="item in items"
                       v-if="item.quantity > 0"
                       v-bind:itemSlot="item"
                       v-bind:size="cellSize"/>

      </div>
    </div>

    <div class="itemsPools">
      <div class="pollHead" style="background: #a59a9a;">
        <h3>{{ language === 'RU' ? 'Налог:' : 'Tax:' }}</h3>
      </div>

      <div class="RecycleSection" v-for="(items, section) in taxItems">

        <div class="nameSection">{{ handbook['categories'][language][section].name }}
          <div class="hideArrowSection"></div>
        </div>

        <app-item-cell v-for="item in items"
                       v-bind:itemSlot="item"
                       v-bind:size="cellSize"/>

      </div>
    </div>

    <div class="itemsPools" id="previewPool">
      <div class="pollHead">
        <h3>{{ language === 'RU' ? 'Результат:' : 'Result:' }}</h3>
      </div>

      <div class="RecycleSection" v-for="(items, section) in outputItems">

        <div class="nameSection">{{ handbook['categories'][language][section].name }}
          <div class="hideArrowSection"></div>
        </div>

        <app-item-cell v-for="item in items"
                       v-bind:itemSlot="item"
                       v-bind:size="cellSize"/>

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
  data() {
    return {
      cellSize: 38,
    }
  },
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
      el.find('.itemsPools').css("width", el.width() / 4 - 4);
      el.find('.itemsPools').css("height", el.height() - 38);

      if (el.width() < 460) {
        el.find('#losesText').css('display', 'none')
      } else {
        el.find('#losesText').css('display', 'unset')
      }

      el.find('#RecyclePercent').css("width", el.width() / 4 - 45);
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
    handbook() {
      return this.$store.getters.getHandBook
    },
    recycler() {
      return this.$store.getters.getRecyclerState
    },
    outputItems() {
      // todo повторящийся код
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
    lostItems() {
      // todo повторящийся код
      let sections = {};

      let need_items_slots = this.$store.getters.getRecyclerState.lost_recycle_slots;
      for (let i in need_items_slots) {

        let slot = need_items_slots[i];
        if (!sections.hasOwnProperty(slot.type)) {
          sections[slot.type] = [];
        }
        sections[slot.type].push(slot);
      }

      return sections;
    },
    taxItems() {
      // todo повторящийся код
      let sections = {};

      let need_items_slots = this.$store.getters.getRecyclerState.tax_recycle_slots;
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
  border-radius: 2px;
  width: 266px;
  height: 240px;
  float: left;
  box-shadow: inset 0 0 2px black;
  background: #89969c;
  margin: 17px 2px 0 2px;
  text-align: left;
  overflow-x: hidden;
  overflow-y: scroll;
}

#processorRoot .itemsPools .pollHead {
  margin: 4px;
  background: #dd7034;
  color: hsla(0, 0%, 100%, .8);
  border-radius: 4px;
  font-size: 13px;
  line-height: 17px;
  height: 17px;
  user-select: none;
  text-shadow: 1px 1px 1px #000;
  font-weight: 700;
  box-shadow: 0 0 2px #000;
  width: calc(100% - 8px);
}

#processorRoot .itemsPools .pollHead h3 {
  margin: 0;
  padding: 0 4px;
  display: block;
  width: calc(100% - 4px);
  height: 14px;
  float: left;
  font-size: 11px;
  font-weight: 100;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

#RecyclePercent {
  height: 15px;
  width: 90px;
  float: right;
  background: rgba(0, 0, 0, 0.5);
  text-align: center;
  font-size: 10px;
  line-height: 17px;
  position: relative;
  z-index: 1;
  border-radius: 4px;
  box-shadow: inset 0 0 2px black;
  overflow: hidden;
  margin: 1px;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
}

#fillBackPercent {
  background-size: 10px 2px;
  background-image: linear-gradient(1deg, rgb(255 118 0), rgb(0 0 0) 6px);
  width: 50%;
  height: 100%;
  position: absolute;
  z-index: -1;
  box-shadow: inset 0 0 2px black;
}

#processorRoot .itemsPools .pollHead .util {
  height: 15px;
  width: 15px;
  background: url(https://img.icons8.com/flat_round/64/000000/recycle-sign--v1.png) center center / cover no-repeat;
  float: right;
  margin-right: 1px;
  margin-top: 1px;
}

#processorRoot .lobbyButton {
  display: block;
  width: 40%;
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
  float: left;
  margin: 3px 5%;
}

.nameSection {
  clear: both;
  width: calc(100% - 14px);
  height: 14px;
  font-size: 12px;
  margin: 2px 0 1px 1px;
  padding-left: 11px;
  border: 1px solid #793f1f;
  background-size: 10px 2px;
  background-image: linear-gradient(1deg, rgba(251, 93, 0, 0.55), rgba(225, 37, 46, 0.6) 6px);
  color: #ff7800;
  line-height: 14px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
}

.RecycleSection {
  float: left;
  width: 100%;
}

#processorRoot .lobbyButton:active {
  transform: scale(0.98);
}

#processorRoot .lobbyButton:hover {
  background: rgba(255, 129, 0, 1);
}
</style>
