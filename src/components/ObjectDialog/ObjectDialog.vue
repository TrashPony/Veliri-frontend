<template>
  <div class="objectDialogWrapper" :id="windowID" :ref="windowID" @mousedown="toUp" v-if="obj">
    <app-control v-bind:head="'Обьект: ' + obj.dynamic_object.name"
                 v-bind:move="true" v-bind:close="true"
                 v-bind:refWindow="windowID"/>

    <div class="objectDialog">

      <div class="objectHeader">

        <div class="objOwner" v-if="obj.other_user">
          <span style="float: left;">Владелец: </span>
          <span style="float: right;">{{ obj.other_user.user_name }}</span>
        </div>

        <div class="objIcon"
             :style="{background: 'url(' + require('../../assets/map/structures/icon/'+obj.dynamic_object.texture+'.png') + ') center center / contain no-repeat'}"></div>

        <div class="objState">
          <div class="objStateLabel">
            <span style="float: left;">HP: </span>
            <span style="float: right;" v-if="obj.dynamic_object.hp >= 0">{{ obj.dynamic_object.hp + " / " + obj.dynamic_object.max_hp }}</span>
          </div>
          <div class="objHP">
            <div class="objHPBar" :style="{width:100 / (obj.dynamic_object.max_hp / obj.dynamic_object.hp) + 'px'}"/>
          </div>

          <div class="objStateLabel" v-if="obj.dynamic_object.energy_cell">
            <span style="float: left;">Energy: </span>
            <span
              style="float: right;">{{
                obj.dynamic_object.current_energy + " / " + obj.dynamic_object.max_energy
              }}</span>
          </div>
          <div class="objEnergy" v-if="obj.dynamic_object.energy_cell">
            <div class="objEnergyBar"
                 :style="{width:100 / (obj.dynamic_object.max_energy / obj.dynamic_object.current_energy) + 'px'}"></div>
          </div>
        </div>

      </div>

      <div class="objBody">

        <div class="objSpecialCells">
          <div ref="energy" v-bind:class="{objSpecialCellDisable: !obj.dynamic_object.energy_cell}">

            <app-background-item-cell v-bind:slotItem="{type: 'recycle', item: {name: 'enriched_thorium'}}"/>

            <span class="objEnergyCellCount" v-if="obj.dynamic_object.energy_cell">
              {{ obj.dynamic_object.energy_cell.count }} / {{ obj.dynamic_object.energy_cell.max_count }}
            </span>

            <div class="objWorkOutSlot" v-if="obj.dynamic_object.energy_cell">
              <div
                :style="{width: obj.dynamic_object.energy_cell.count >0 ? 100 / (100 / (100 - obj.dynamic_object.energy_cell.worked_out)) + '%' : '0'}"/>
            </div>

          </div>
          <div ref="ammo" v-bind:class="{objSpecialCellDisable: !obj.dynamic_object.ammo_cell}"></div>
          <div ref="special" id="special"
               v-bind:class="{objSpecialCellDisable: !obj.dynamic_object.special_cell}"></div>
        </div>

        <div class="objInventory" ref="objStorage" :class="{disable : !obj.dynamic_object.inventory}">

          <app-size v-if="obj.dynamic_object.inventory && obj.box && obj.box.capacity_size"
                    v-bind:capacity="obj.box.capacity_size"
                    v-bind:size="obj.size"/>

          <app-size v-if="!obj.dynamic_object.inventory"
                    v-bind:capacity="0"
                    v-bind:size="0"/>

          <div>
            <app-item-cell v-for="slot in obj.inventory"
                           v-if="slot && slot.item && slot.quantity > 0 && (slot.access_user_id === 0 || slot.access_user_id === currentUser.user_id)"
                           @click.native="getItem(slot.number)"
                           v-bind:itemSlot="slot"
                           v-bind:size="34"
                           v-bind:parent="'box:' + obj.box.id"
                           v-bind:drag="true"/>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script>
import Control from '../Window/Control';
import Size from '../Inventory/Size';
import BackgroundItemCell from '../Inventory/BackgroundItemCell';
import ItemCell from '../Inventory/ItemCell';
import {gameStore} from "../../game/store";

export default {
  name: "ObjectDialog",
  props: ['meta', 'windowID'],
  data() {
    return {
      updater: null,
    }
  },
  created() {
    let app = this;
    app.updater = setInterval(function () {
      app.$store.getters.getWSByService('global').socket.send(JSON.stringify({
        event: "openObject",
        id: app.$props.meta.id,
        open: false,
      }));
    }, 200)
  },
  destroyed() {
    clearInterval(this.updater);
    $('.nameItemInCell').remove();
  },
  mounted() {
    if (this.obj.dynamic_object.energy_cell) {
      this.initDropCells('energy');
    }

    if (this.obj.dynamic_object.special_cell) {
      this.initDropCells('special');
    }

    if (this.obj.dynamic_object.inventory) {
      this.initDropCells('objStorage');
    }
  },
  methods: {
    getItem(number) {
      this.$store.getters.getWSByService('inventory').socket.send(JSON.stringify({
        event: "itemsToDst",
        source: "box:" + this.obj.box.id,
        destination: "squadInventory",
        storage_slots: {[number]: 0}
      }));
      $('.nameItemInCell').remove();
    },
    initDropCells(ref) {
      let app = this;

      let wait = setInterval(function () {
        if (app.$refs[ref]) {
          clearInterval(wait);

          if (ref === 'objStorage') {
            $(app.$refs[ref]).selectable({
              filter: '.InventoryCell',
              start: function () {
                $('.ui-selected').removeClass('ui-selected');
              }
            });

            $(app.$refs[ref]).droppable({
              tolerance: "pointer",
              drop: function (event, ui) {

                $('.ui-selected').removeClass('ui-selected');

                let draggable = ui.draggable;
                if (!draggable.data("selectedItems")) return;

                let slots = {}
                for (let slotNumber of draggable.data("selectedItems").slotsNumbers) {
                  slots[slotNumber] = 0
                }

                app.$store.getters.getWSByService('inventory').socket.send(JSON.stringify({
                  event: "itemsToDst",
                  source: draggable.data("slotData").parent,
                  destination: "box:" + app.obj.box.id,
                  storage_slots: slots
                }));
              }
            });
          }

          if (ref === 'energy') {
            $(app.$refs[ref]).droppable({
              tolerance: "pointer",
              drop: function (event, ui) {
                $('.ui-selected').removeClass('ui-selected');

                let boxID = 0;
                let draggable = ui.draggable;

                if (draggable.data("slotData").parent !== "squadInventory") {
                  if (draggable.data("slotData").parent.split(':')[0] === "box") {
                    boxID = draggable.data("slotData").parent.split(':')[1];
                  }
                }

                if (draggable.data("selectedItems") && draggable.data("selectedItems").slotsNumbers.length === 1) {
                  app.$store.getters.getWSByService('global').socket.send(JSON.stringify({
                    event: "placeThoriumToObj",
                    id: Number(app.$props.meta.id),
                    slot: Number(draggable.data("slotData").number),
                    box_id: Number(boxID),
                  }));
                }
              }
            });

            app.$refs[ref].onclick = function () {
              app.$store.getters.getWSByService('global').socket.send(JSON.stringify({
                event: "getThoriumFromObj",
                id: Number(app.$props.meta.id),
              }));
            }
          }

          if (ref === 'special') {
            $(app.$refs[ref]).droppable({
              tolerance: "pointer",
              drop: function (event, ui) {
                $('.ui-selected').removeClass('ui-selected');
                let draggable = ui.draggable;
                if (!draggable.data("selectedItems")) return;

                app.$store.getters.getWSByService('global').socket.send(JSON.stringify({
                  event: "dropItemToSpecialSlot",
                  source: draggable.data("slotData").parent,
                  ID: Number(app.$props.meta.id),
                  Slots: draggable.data("selectedItems").slotsNumbers
                }));
              },
            })
          }
        }
      })
    },
    toUp() {
      this.$store.commit({
        type: 'setWindowZIndex',
        id: this.$el.id,
      });
    },
  },
  computed: {
    obj() {
      return this.$store.getters.getOpenObjects[this.$props.meta.id]
    },
    currentUser() {
      return this.$store.getters.getUser
    },
  },
  components: {
    AppBackgroundItemCell: BackgroundItemCell,
    AppControl: Control,
    AppSize: Size,
    AppItemCell: ItemCell,
  }
}
</script>

<style scoped>
.objectDialogWrapper {
  height: 230px;
  width: 200px;
  position: absolute;
  left: calc(50% - 100px);
  top: 20%;
  padding: 17px 3px 3px 3px;
  border: 1px solid #25a0e1;
  background: rgb(8, 138, 210);
  border-radius: 5px;
  z-index: 10;
}

#special {
  background-image: url(https://img.icons8.com/color/50/000000/software-installer.png);
  background-size: contain;
}

.objectDialog {
  background: #89969c;
  height: calc(100% - 10px);
  width: calc(100% - 10px);
  border-radius: 5px;
  box-shadow: inset 0 0 3px black;
  overflow-x: hidden;
  overflow-y: scroll;
  padding: 5px;
}

.objectHeader {
  width: 100%;
  height: 80px;
}

.objBody {
  width: 100%;
  height: 140px;
  box-shadow: inset 0 0 3px black;
  background: #6d787d;
  border-radius: 5px;
}

.objIcon {
  box-shadow: 0 0 2px black;
  height: 60px;
  width: 60px;
  float: left;
  border-radius: 5px;
  background: grey;
  margin-left: 5px;
  margin-top: 5px;
}

.objSpecialCells {
  height: 100%;
  width: 47px;
  float: left;
  box-shadow: inset 0 0 3px black;
  border-radius: 5px 0 0 5px;
}

.objInventory {
  float: right;
  height: 100%;
  width: 128px;
  box-shadow: inset 0 0 3px black;
  border-radius: 0 0 5px 0;
  overflow-x: hidden;
}

.objInventory.disable {
  opacity: 0.2;
  box-shadow: inset 0 0 0px black;
  background: aliceblue;
}

.objInventory .sizeInventoryInfo {
  margin: 0;
  border-radius: 0;
  width: 126px;
  box-shadow: 0 0 3px black;
}

.objInventory .sizeInventoryInfo span {
  width: 127px;
  color: wheat;
  float: left;
}

.objState {
  float: right;
  width: 105px;
}

.objOwner {
  font-size: 8px;
  float: left;
  width: 100%;
}

.objHP, .objEnergy, .objShield {
  border: 1px solid rgba(0, 0, 0, 0.25);
  height: 4px;
  float: left;
  width: 100px;
  border-radius: 3px;
}

.objHPBar, .objEnergyBar, .objShieldBar {
  width: 50%;
  background: lime;
  height: 100%;
  box-shadow: inset 0 0 2px black;
}

.objEnergyBar {
  background: #00fffd;
}

.objShieldBar {
  background: #0018ff;
}

.objStateLabel {
  float: left;
  font-size: 8px;
  width: 100px;
  margin: 5px 0 1px;
}

.objSpecialCells > div {
  height: 40px;
  width: 40px;
  float: left;
  background: #888787;
  border-radius: 5px;
  box-shadow: inset 0 0 3px black;
  margin: 5px 4px 0;
  font-size: 8px;
  position: relative;
  background-position: center;
  background-size: contain;
}

.objSpecialCells > div .objEnergyCellCount {
  font-family: 'Comfortaa', cursive;
  font-size: 8px;
  color: #1be8e6;
  user-select: none;
  text-align: center;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
  position: absolute;
  left: 0;
  top: 4px;
  display: block;
  width: 100%;
  pointer-events: none;
}

.objSpecialCells > div .objWorkOutSlot {
  width: 26px;
  position: absolute;
  left: calc(50% - 13px);
  bottom: 3px;
}

.objSpecialCells > div .objWorkOutSlot div {
  height: 4px;
  overflow: visible;
  background: rgb(255, 130, 14);
  border-radius: 2px;
  box-shadow: inset 0 0 2px black;
  width: 0;
}

.objSpecialCells .objSpecialCellDisable {
  background: #4a4a4a;
  opacity: 0.2;
}
</style>
<style>
.objectDialogWrapper div.objectDialog > div.objBody > div.objInventory > div.sizeInventoryInfo > span {
  background-position: 90%;
}
</style>
