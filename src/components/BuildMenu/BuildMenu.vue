<template>
  <div id="buildDialogWrapper" ref="buildDialogWrapper"  @mousedown="toUp">


    <app-control v-bind:head="'Строительство'"
                 v-bind:move="true"
                 v-bind:close="true"
                 v-bind:refWindow="'buildDialogWrapper'"
                 v-bind:resizeFunc="resize"
                 v-bind:minSize="{height: 97, width: 204}"/>

    <div id="buildDialog">
      <template>
        <app-item-cell v-for="slot in buildMenu.blueprints"
                       v-if="slot"
                       @mouseover.native="cellOver(slot)"
                       @mousemove.native="cellMove($event)"
                       @mouseout.native="cellOut"
                       @click.native="selectBP(slot)"
                       v-bind:itemSlot="slot"/>

        <div class="buildStatusBP"
             v-if="tip.visible && buildMenu.needItems[buildMenu.overBP]"
             :style="{left: tip.left, top: tip.top}">

          <div class="structure_head">
            <div class="structure_icon">
              <app-background-item-cell v-bind:slotItem="{type: 'structure', item: {name: tip.structureName}}"/>
            </div>
            <div class="structure_description">{{buildMenu.needItems[buildMenu.overBP].structure.description}}</div>
          </div>

          <div class="structure_params">
            TODO - сделать метод который будет возвращать таблицу параметров структур в зависимости от типа
          </div>

          <div class="need_items">
            <h5>Необходимо ресурсов:</h5>
            <div class="structure_need_items">
              <app-item-cell v-for="slot in buildMenu.needItems[buildMenu.overBP].slots" v-if="slot"
                             v-bind:itemSlot="slot"
                             v-bind:size="30"
                             v-bind:few="!slot.find"/>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
  import Control from '../Window/Control';
  import ItemCell from '../Inventory/ItemCell';
  import BackgroundItemCell from '../Inventory/BackgroundItemCell';
  import {gameStore} from "../../game/store";

  export default {
    name: "BuildMenu",
    data() {
      return {
        tip: {
          left: 0,
          top: 0,
          visible: false,
          structureName: '',
        }
      }
    },
    mounted() {
      let app = this;

      let wait = setInterval(function () {
        if (gameStore.unitReady) {
          app.$store.getters.getWSByService('global').socket.send(JSON.stringify({
            event: "OpenBuildMenu",
          }));
          clearInterval(wait);
        }
      }, 100)
    },
    methods: {
      resize() {
      },
      toUp() {
        this.$store.commit({
          type: 'setWindowZIndex',
          id: this.$el.id,
        });
      },
      selectBP(slot) {
        this.$store.getters.getWSByService('global').socket.send(JSON.stringify({
          event: "SelectBuildBP",
          id: slot.item.id,
        }))
      },
      cellOver(slot) {
        this.$store.getters.getWSByService('global').socket.send(JSON.stringify({
          event: "GetStructureParams",
          id: slot.item.id,
        }));

        this.$store.getters.getWSByService('global').socket.send(JSON.stringify({
          event: "GetStructureNeedItems",
          id: slot.item.id,
        }));

        this.$store.commit({
          type: 'setOverBP',
          id: slot.item.id,
        });

        // todo costil
        let user = this.$store.getters.getUser;
        let name = slot.item.name.split('_bp')[0] + "_" + user.fraction;
        name = name.replace('mp_', '');
        this.tip.structureName = name.replace('map_', '');
      },
      cellMove(e, id) {
        this.tip.visible = true;
        this.tip.left = e.pageX - $(this.$el).position().left + 20 + 'px';
        this.tip.top = e.pageY - $(this.$el).position().top + 20 + 'px';
      },
      cellOut() {
        this.tip.visible = false;
        this.$store.commit({
          type: 'setOverBP',
          id: null,
        });
      }
    },
    computed: {
      buildMenu() {
        return this.$store.getters.getBuildMenu
      },
    },
    components: {
      AppControl: Control,
      AppItemCell: ItemCell,
      AppBackgroundItemCell: BackgroundItemCell,
    }
  }
</script>

<style scoped>
  #buildDialogWrapper {
    height: 97px;
    width: 204px;
    position: absolute;
    left: calc(50% - 100px);
    top: 40%;
    padding: 21px 3px 3px 3px;
    border: 1px solid #25a0e1;
    background: rgb(8, 138, 210);
    border-radius: 5px;
    z-index: 10;
  }

  #buildDialog {
    background: #89969c;
    height: 100%;
    width: 100%;
    border-radius: 5px;
    box-shadow: inset 0 0 3px black;
    overflow-x: hidden;
    overflow-y: scroll;
  }

  #buildDialog .InventoryCell {
    height: 40px;
    width: 40px;
  }

  .buildStatusBP {
    pointer-events: none;
    position: absolute;
    min-height: 150px;
    width: 170px;
    background-size: 100% 2px;
    background-image: linear-gradient(0deg, rgba(7, 41, 60, 0.6), rgba(0, 62, 95, 0.5));
    border: 1px solid rgba(0, 0, 0, 0.5);
    border-radius: 5px;
    z-index: 12;
    color: #ff8100;
    font-size: 10px;
    text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
  }

  .buildStatusBP .structure_head {
    float: left;
    width: 100%;
    margin-bottom: 4px;
  }

  .buildStatusBP .structure_icon {
    float: left;
    border-radius: 5px;
    background: #4c4c4c;
    border: 1px solid #959595;
    width: 50px;
    height: 50px;
    margin: 5px 0 0 4px;
    position: relative;
  }

  .buildStatusBP .structure_description {
    border-radius: 5px;
    background: #4c4c4c;
    border: 1px solid #959595;
    float: left;
    min-height: 35px;
    width: 92px;
    margin: 5px;
    padding: 5px;
  }

  .buildStatusBP h5 {
    margin: 4px 0 0;
    text-align: left;
    text-indent: 5px;
    color: aliceblue;
  }

  .structure_need_items {
    min-height: 35px;
    width: calc(100% - 10px);
    padding: 5px;
  }

  .structure_need_items .InventoryCell {
    height: 30px;
    width: 30px;
  }
</style>
