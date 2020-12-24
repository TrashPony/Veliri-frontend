<template>
  <div class="InventoryCell"
       v-bind:style="{ width: size + 'px', height: size + 'px', outline: few ? 'red solid 1px' : ''}"
       v-bind:class="{notAllow: noAllowClass}">

    <div class="Fine" v-if="fine">

    </div>

    <span class="QuantityItems" v-if="slotData && slotData.quantity && !noQuantity">
      <template v-if="slotData.infinite">
        <span class="infinite">&#8734;</span>
      </template>
      <template v-if="!slotData.infinite">
        {{ slotData.quantity }}
      </template>
    </span>

    <div v-if="showHP && slotHP !== 100" class="ItemHP">
      <div class="hpBar" :style="{width: slotHP + '%', backgroundColor: colorDamage}"></div>
    </div>

    <app-background-item-cell v-if="slotData && slotData.item"
                              v-bind:slotItem="slotData"
                              v-bind:opacity="opacity"
                              v-bind:textFine="textFine"
                              v-bind:noShowName="noShowName"/>

    <span v-if="text" v-html="text"/>

    <div class="noAllowCell" v-if="few"></div>

    <div class="itemTax" v-if="tax">
      <span style="float: left">{{language === 'RU' ? 'Налог:' : 'Tax:'}}</span>
      <span style="float: right">{{ tax }}%</span>
    </div>
  </div>
</template>

<script>
import BackgroundItemCell from './BackgroundItemCell'

export default {
  name: "ItemCell",
  props: ['itemSlot', 'size', 'parent', 'drag', 'text', 'noShowName', 'noAllowClass', 'equipProps', 'few', 'tax',
    'noQuantity', 'fine', 'textFine', 'opacity', 'showHP'],
  data() {
    return {
      uParent: '',
    }
  },
  computed: {
    language() {
      return this.$store.getters.getSettings.Language
    },
    slotData() {
      this.init();
      return this.$props.itemSlot
    },
    slotHP() {
      return (100 / (this.slotData.max_hp / this.slotData.hp))
    },
    colorDamage() {
      return this.$store.getters.GetColorDamage(this.slotHP)
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      if (this.$props.drag) {
        this.initDrag();
      }
      if (this.$props.equipProps) {
        this.initDragEquip();
      }
    },
    initDragEquip() {
      let props = this.$props.equipProps;

      if (props.type === 'equip') {
        this.initEquipSlot(props)
      }
      if (props.type === 'weapon') {
        this.initWeaponSlot(props)
      }
      if (props.type === 'ammo') {
        this.initAmmoSlot(props)
      }
      if (props.type === 'thorium') {
        this.initThoriumSlot(props)
      }
    },
    initThoriumSlot(props) {
      let app = this;
      $(app.$el).droppable({
        tolerance: "pointer",
        drop: function (event, ui) {
          $('.ui-selected').removeClass('ui-selected');

          let draggable = ui.draggable;
          let slotData = draggable.data("slotData");

          if (slotData.data.type === "recycle" && slotData.data.item.name === "enriched_thorium") {
            app.$store.getters.getWSByService('inventory').socket.send(JSON.stringify({
              event: "SetThorium",
              inventory_slot: Number(slotData.number),
              thorium_slot: Number(props.data.number_slot),
              source: slotData.parent,
            }));
          }
        }
      });
    },
    initAmmoSlot(props) {
      let app = this;

      if (props.data && props.data.ammo) {
        $(app.$el).draggable({
          disabled: false,
          start: function () {
            $(app.$el).data("slotData", {
              event: "RemoveMotherShipAmmo",
              parent: "Constructor",
              equipSlot: Number(props.data.number_slot),
            });
          },
          revert: "invalid",
          zIndex: 999,
          helper: 'clone',
          appendTo: "body",
        });
      }

      $(app.$el).droppable({
        tolerance: "pointer",
        drop: function (event, ui) {
          $('.ui-selected').removeClass('ui-selected');
          let draggable = ui.draggable;
          let slotData = draggable.data("slotData");

          if (slotData.data && slotData.data.type === "ammo") {
            app.$store.getters.getWSByService('inventory').socket.send(JSON.stringify({
              event: "SetMotherShipAmmo",
              ammo_id: Number(slotData.data.item.id),
              inventory_slot: Number(slotData.number),
              equip_slot: Number(props.data.number_slot),
              source: slotData.parent,
            }));
          }
        }
      });
    },
    initWeaponSlot(props) {
      let app = this;

      if (props.data && props.data.weapon) {
        $(app.$el).draggable({
          disabled: false,
          start: function () {
            $(app.$el).data("slotData", {
              event: "RemoveMotherShipWeapon",
              parent: "Constructor",
              equipSlot: Number(props.data.number_slot),
            });
          },
          revert: "invalid",
          zIndex: 999,
          helper: 'clone',
          appendTo: "body",
        });
      }

      $(app.$el).droppable({
        tolerance: "pointer",
        drop: function (event, ui) {
          $('.ui-selected').removeClass('ui-selected');
          let draggable = ui.draggable;
          let slotData = draggable.data("slotData");

          if (slotData.data && slotData.data.type === "weapon") {
            app.$store.getters.getWSByService('inventory').socket.send(JSON.stringify({
              event: "SetMotherShipWeapon",
              weapon_id: Number(slotData.data.item.id),
              inventory_slot: Number(slotData.number),
              equip_slot: Number(props.data.number_slot),
              source: slotData.parent,
            }));
          }
        }
      });
    },
    initEquipSlot(props) {

      let app = this;

      if (props.data && props.data.equip) {
        $(app.$el).draggable({
          disabled: false,
          start: function () {
            $(app.$el).data("slotData", {
              event: "RemoveMotherShipEquip",
              parent: "Constructor",
              equipSlot: Number(props.data.number_slot),
              equipType: Number(props.data.type_slot),
            });
          },
          revert: "invalid",
          zIndex: 999,
          helper: 'clone',
          appendTo: "body",
        });
      } else {
        $(app.$el).draggable({
          disabled: true
        })
      }

      $(app.$el).droppable({
        tolerance: "pointer",
        drop: function (event, ui) {

          $('.ui-selected').removeClass('ui-selected');

          let draggable = ui.draggable;
          let slotData = draggable.data("slotData");
          if (slotData.data && slotData.data.type === "equip") {
            app.$store.getters.getWSByService('inventory').socket.send(JSON.stringify({
              event: "SetMotherShipEquip",
              equip_id: Number(slotData.data.item.id),
              inventory_slot: Number(slotData.number),
              equip_slot: Number(props.data.number_slot),
              equip_slot_type: Number(props.data.type_slot),
              source: slotData.parent,
            }));
          }
        }
      });
    },
    initDrag() {

      let app = this;
      let slot = this.$props.itemSlot;

      $(app.$el).data("slotData", {parent: app.$props.parent, data: slot, number: slot.number});

      $(app.$el).draggable({
        start: function () {
          $(app.$el).addClass("ui-selected");

          let selectItems = $('.InventoryCell.ui-selected');
          if (selectItems.length > 0) {

            // если выделено много элементов то отправляем их все
            let slotsNumbers = [];
            slotsNumbers.push(Number($(app.$el).data("slotData").number));
            selectItems.each(function (index) {
              if ($(this).data("slotData") !== undefined && $(this).data("slotData").number !== $(app.$el).data("slotData").number) {
                slotsNumbers.push(Number($(this).data("slotData").number));
              }
            });

            $(app.$el).data("selectedItems", {parent: app.$props.parent, slotsNumbers: slotsNumbers});
          } else {
            $(app.$el).removeData("selectedItems");
          }
        },
        stop: function () {
          $('.ui-selected').removeClass("ui-selected");
        },
        drag: function () {
          let icon = $('.ui-draggable-dragging');
          if ($('.InventoryCell.ui-selected').length > 1) {
            icon.empty().addClass('itemsDrag');
          }

          icon.css('pointer-events', 'none');
          icon.css('height', '30px');
          icon.css('width', '30px');
        },
        disabled: false,
        revert: "invalid",
        zIndex: 999,
        helper: 'clone',
        appendTo: "body",
        delay: 200,
        distance: 10,
        opacity: 0.55,
        refreshPositions: true,
        revertDuration: 150,
        iframeFix: true,
      });

      $(app.$el).droppable({
        tolerance: "pointer",
        greedy: true,
        over: function (event, ui) {
          let draggable = ui.draggable;

          let src = draggable.data("slotData");
          let dst = $(this).data("slotData");

          if (draggable.data("selectedItems") !== undefined) {
            // если в рукаве много айтемов то это нельзя комбинировать
            $(this).droppable("option", "greedy", false);
            return
          }

          if (src && dst && src.data && dst.data && dst.data.item_id === src.data.item_id && dst.data.type === src.data.type) {
            $(this).droppable("option", "greedy", true);
          } else {
            $(this).droppable("option", "greedy", false);
          }
        },
        drop: function (event, ui) {
          $('.ui-selected').removeClass('ui-selected');
          let draggable = ui.draggable;

          let src = draggable.data("slotData");
          let dst = $(this).data("slotData");

          if (draggable.data("selectedItems") > 1) {
            return
          }

          if (src && dst && src.data && dst.data && dst.data.item_id === src.data.item_id && dst.data.type === src.data.type) {
            app.$store.getters.getWSByService('inventory').socket.send(JSON.stringify({
              event: "combineItems",
              source: src.parent,
              src_slot: Number(src.number),
              destination: dst.parent,
              dst_slot: Number(dst.number),
            }));
          }
        }
      });
    }
  },
  components: {
    AppBackgroundItemCell: BackgroundItemCell,
  }
}
</script>

<style scoped>
.InventoryCell {
  border-radius: 5px;
  width: 25px;
  height: 25px;
  display: inline-block;
  background-color: rgba(76, 76, 76, 0.4);
  vertical-align: top;
  margin: 3px;
  box-shadow: 0 0 2px rgba(0, 0, 0, 1);
  float: left;
  position: relative;
  overflow: hidden;
  border: 1px solid #959595;
}

.InventoryCell:hover {
  box-shadow: 0 0 2px 2px #FF9520;
  border: 1px solid #FF9520;
  cursor: pointer;
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

.InventoryCell.ui-selecting {
  box-shadow: 0 0 2px 2px #FF9520;
  border: 1px solid #FF9520;
}

.InventoryCell.ui-selected {
  box-shadow: 0 0 1px 2px #2fef17;
  border: 1px solid #2fef17;
}

.InventoryCell:hover {
  box-shadow: 0 0 2px 2px #FF9520;
  border: 1px solid #FF9520;
  cursor: pointer;
}

.InventoryCell.notAllow div {
  filter: blur(5px) saturate(0);
}

.noAllowCell {
  height: 100%;
  width: 100%;
  background: linear-gradient(135deg, rgba(30, 87, 153, 0) 0%, rgba(30, 87, 153, 0) 40%, rgb(249, 14, 24) 50%, rgba(30, 87, 153, 0) 60%, rgba(30, 87, 153, 0) 100%);
  z-index: 2;
  position: absolute;
  left: 0;
  top: 0;
}

.itemTax {
  position: absolute;
  top: 5px;
  font-size: 12px;
  color: #ff4c4c;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
  width: 90%;
  padding-left: 3px;
}

.Fine {
  background-image: url(https://img.icons8.com/fluent/48/000000/high-priority.png);
  filter: drop-shadow(0px 0px 3px black);
  position: absolute;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  background-size: cover;
  opacity: 1;
  z-index: 0;
}

.ItemHP {
  height: 4px;
  border: 1px solid #a5a5b4;
  width: calc(80% - 2px);
  left: 10%;
  position: absolute;
  top: 4px;
  z-index: 2;
  border-radius: 2px;
  box-shadow: 0 0 2px 1px black;
  overflow: hidden;
  background: #404041;
}

.ItemHP .hpBar {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  box-shadow: inset 0 0 2px 0 black;
}

.infinite {
  font-size: 18px;
  line-height: 10px;
}
</style>

<style>
.itemsDrag {
  background-image: url(../../assets/indexImg/dragDetail.png);
  background-size: cover;
  background-color: grey !important;
}
</style>
