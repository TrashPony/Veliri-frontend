<template>
  <div class="place_dialog">
    <h3 class="head">Не все влезает:</h3>

    <div class="src_block">
      {{ warehouseTitle(inventory.placeDialog.source) }}
    </div>
    <div class="arrow"/>
    <div class="dst_block">
      {{ warehouseTitle(inventory.placeDialog.destination) }}
    </div>

    <div class="items">
      <div class="item" v-for="item in slots">

        <div class="iconItem"
             v-if="source && source.inventory[item.slot]">
          <app-background-item-cell
            v-bind:slotItem="source.inventory[item.slot]"/>
        </div>

        <div class="item_control">
          <div style="margin-top: 3px; width: calc(100% - 20px); margin-left: 10px;">
            <app-range v-bind:min="0"
                       @change="changeCount(item.slot, $event, true)"
                       v-bind:max="item.slot_quantity"
                       v-bind:possible-max="item.count_may_put"
                       v-bind:step="1"/>
          </div>
        </div>
      </div>
    </div>

    <div class="exit_block">
      <input type="button" value="Закрыть" @click="closeDialog">
      <input type="button" value="Перенести" @click="changeCount(0, $event, false)" style="float: right">
    </div>
  </div>
</template>

<script>

import Range from './Range'
import BackgroundItemCell from './BackgroundItemCell'

export default {
  name: "PlaceDialog",
  data() {
    return {
      changeItems: {}
    }
  },
  methods: {
    changeCount(slot, newCount, noPlace) {

      this.changeItems[slot] = newCount

      let slots = {}
      for (let item of this.inventory.placeDialog.place_items) {
        if (this.changeItems[item.slot]) {
          slots[item.slot] = Number(this.changeItems[item.slot])
        } else {
          if (noPlace) slots[item.slot] = 0
        }
      }

      this.$store.getters.getWSByService('inventory').socket.send(JSON.stringify({
        event: "itemsToDst",
        source: this.inventory.placeDialog.source,
        destination: this.inventory.placeDialog.destination,
        storage_slots: slots,
        no_place: noPlace,
      }));

      if (!noPlace) this.closeDialog();
    },
    closeDialog() {
      this.$store.commit({
        type: 'setPlaceDialog',
        data: null,
      });
    },
    warehouseTitle(title) {
      if (this.language === 'RU') {
        if (title === 'storage') return 'Склад';
        if (title.includes('box')) return 'Ящик';
        if (title === 'squadInventory') return 'Трюм';
      }
      return title
    }
  },
  computed: {
    language() {
      return this.$store.getters.getSettings.Language
    },
    handbook() {
      return this.$store.getters.getHandBook
    },
    inventory() {
      return this.$store.getters.getInventory
    },
    slots() {
      for (let item of this.inventory.placeDialog.place_items) {
        if (this.changeItems.hasOwnProperty(item.slot)) {
          if (this.changeItems[item.slot] > item.count_may_put) {
            this.changeItems[item.slot] = item.count_may_put
          }
        }
      }

      return this.inventory.placeDialog.place_items.sort(function (a, b) {
        if (a.slot > b.slot) return 1;
        if (b.slot > a.slot) return -1;
        return 0;
      });
    },
    objs() {
      return this.$store.getters.getOpenObjects
    },
    source() {
      if (this.inventory.warehouses[this.inventory.placeDialog.source]) {
        return this.inventory.warehouses[this.inventory.placeDialog.source]
      } else {

        let s = this.inventory.placeDialog.source.split(':')
        if (s.length > 1) {
          let boxID = Number(s[1])

          for (let i in this.objs) {
            if (this.objs.hasOwnProperty(i) && this.objs[i].box && this.objs[i].box.id === boxID) {
              return this.objs[i]
            }
          }
        }
      }
    }
  },
  components: {
    AppRange: Range,
    AppBackgroundItemCell: BackgroundItemCell,
  }
}
</script>

<style scoped>
.place_dialog {
  position: absolute;
  top: 5px;
  left: 5px;
  z-index: 11;
  width: calc(100% - 18px);
  height: calc(100% - 18px);
  border: 1px solid #25a0e1;
  background: rgb(8, 138, 210);
  padding: 3px 3px 3px 3px;
  border-radius: 4px;
  box-shadow: 0 0 2px black;
}

.head {
  margin: 0 0 7px;
  background: #dd7034;
  color: hsla(0, 0%, 100%, .8);
  border-radius: 4px;
  font-size: 13px;
  line-height: 19px;
  height: 17px;
  text-shadow: 1px 1px 1px #000;
  font-weight: 700;
  user-select: none;
  box-shadow: 0 0 2px #000;
  text-indent: 10px;
}

.exit_block input {
  display: block;
  float: left;
  width: 45%;
  margin: 2px auto 0;
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

.exit_block input:hover {
  background: rgba(255, 129, 0, 1);
}

.exit_block input:active {
  transform: scale(0.98);
}

.exit_block {
  width: calc(100% - 6px);
  position: absolute;
  bottom: 2px;
}

.items {
  background: #89969c;
  box-shadow: inset 0 0 2px black;
  width: 100%;
  height: calc(100% - 62px);
  overflow-x: hidden;
  overflow-y: scroll;
  padding: 2px 0 0 0;
}

.item {
  text-align: left;
  border: 1px solid rgba(0, 0, 0, 0.5);
  font-size: 12px;
  color: #9bc9f1;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
  height: 30px;
  line-height: 26px;
  transition: 0.1s;
  min-width: 168px;
  position: relative;
  white-space: nowrap;
  background: rgba(0, 0, 0, 0.2);
  margin: 1px 3px 0px 3px;
}

.iconItem {
  position: relative;
  border-radius: 2px;
  width: 26px;
  height: 26px;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  vertical-align: top;
  margin: 2px;
  box-shadow: 0 0 2px #000;
  float: left;
}

.item_control {
  width: calc(100% - 30px);
  height: 100%;
  float: left;
}

.src_block, .dst_block {
  float: left;
  width: 100px;
  height: 14px;
  line-height: 14px;
  margin-bottom: 2px;
  overflow: hidden;
  padding: 2px 0 0 0;
  background: #89969c;
  box-shadow: inset 0 0 2px black;
  text-align: center;
  border-radius: 2px;
  font-size: 10px;
  color: #e3881b;
  text-shadow: 0 1px 1px black, 1px 0 1px black, 1px 1px 1px black, 0 0 1px black, 0 -1px 1px black, -1px 0 1px black, -1px -1px 1px black;
}

.dst_block {
  float: right;
}

.arrow {
  background-image: url(https://img.icons8.com/plasticine/100/000000/arrow.png);
  height: 25px;
  width: 25px;
  background-size: contain;
  float: left;
  margin-left: calc(50% - 112px);
  margin-top: -7px;
  position: relative;
  top: 2px;
  filter: drop-shadow(0px 0px 0px black);
}
</style>
