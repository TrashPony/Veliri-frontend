<template>

  <div id="wrapperInventoryAndStorage"
       ref="wrapperInventoryAndStorage"
       @mousedown="toUp">

    <app-cell-sub-menu
      v-if="subMenuProps.slot && subMenuProps.src === inventory.warehouse"
      v-bind:subMenuProps="subMenuProps"/>

    <app-control v-bind:head="language === 'RU' ? 'Инвентарь:' : 'Inventory:'"
                 v-bind:move="true"
                 v-bind:close="true"
                 v-bind:refWindow="'wrapperInventoryAndStorage'"
                 v-bind:resizeFunc="resize"
                 v-bind:minSize="{height: 161, width: 345}"/>

    <div id="warehousesTabs">
      <app-warehouse-tab v-for="(warehouse, id) in inventory.warehouses"
                         @mouseover.native="warehouseMouseOver(id)"
                         @mouseout.native="warehouseMouseLeave"
                         v-bind:title="warehouseTitle(warehouse.title)"
                         v-bind:id="id"/>
    </div>

    <div id="Inventory">

      <app-size v-if="!warehouseOver && inventory.warehouses[inventory.warehouse]"
                v-bind:capacity="inventory.warehouses[inventory.warehouse].capacity"
                v-bind:size="inventory.warehouses[inventory.warehouse].size"
                v-bind:itemSlot="mouserOveSlot"/>

      <app-size v-if="warehouseOver && inventory.warehouses[inventory.warehouse]"
                v-bind:capacity="inventory.warehouses[warehouseOver].capacity"
                v-bind:size="inventory.warehouses[warehouseOver].size"
                v-bind:itemSlot="mouserOveSlot"/>

      <app-size v-if="!inventory.warehouses[inventory.warehouse]"
                v-bind:capacity="0"
                v-bind:size="0"/>

      <div class="categoryTabs">
        <ol>
          <!-- all -->
          <li v-bind:class="{ activeInventoryTabs: inventory.filters.category === 'all'}"
              @click="selectCategory('all')"
              style="background-image: url('https://img.icons8.com/ios/50/000000/all-out.png')"/>
          <!-- body -->
          <li v-bind:class="{ activeInventoryTabs: inventory.filters.category==='body'}"
              @click="selectCategory('body')"
              style="background-image: url('https://img.icons8.com/ios-filled/50/000000/utv.png')"/>
          <!-- weapon -->
          <li v-bind:class="{ activeInventoryTabs: inventory.filters.category==='weapon'}"
              @click="selectCategory('weapon')"
              style="background-image: url('https://img.icons8.com/material/50/000000/gatling-gun.png')"/>
          <!-- ammo -->
          <li v-bind:class="{ activeInventoryTabs: inventory.filters.category==='ammo'}" @click="selectCategory('ammo')"
              style="background-image: url('https://img.icons8.com/ios-filled/50/000000/bullet-2.png')"/>
          <!-- equip -->
          <li v-bind:class="{ activeInventoryTabs: inventory.filters.category==='equip'}"
              @click="selectCategory('equip')"
              style="background-image: url('https://img.icons8.com/ios-filled/50/000000/-voltmeter---v1.png')"/>
          <!-- detail -->
          <li v-bind:class="{ activeInventoryTabs: inventory.filters.category==='detail'}"
              @click="selectCategory('detail')"
              style="background-image: url('https://img.icons8.com/ios-glyphs/50/000000/gears.png')"/>
          <!-- resource -->
          <li v-bind:class="{ activeInventoryTabs: inventory.filters.category==='resource'}"
              @click="selectCategory('resource')"
              style="background-image: url('https://img.icons8.com/ios-glyphs/50/000000/sheet-metal.png')"/>
          <!-- blueprints -->
          <li v-bind:class="{ activeInventoryTabs: inventory.filters.category==='blueprints'}"
              @click="selectCategory('blueprints')"
              style="background-image: url('https://img.icons8.com/ios-filled/50/000000/blueprint.png')"/>
          <!-- boxes -->
          <li v-bind:class="{ activeInventoryTabs: inventory.filters.category==='boxes'}"
              @click="selectCategory('boxes')"
              style="background-image: url('https://img.icons8.com/ios/50/000000/box.png')"/>
          <!-- trash -->
          <li v-bind:class="{ activeInventoryTabs: inventory.filters.category==='trash'}"
              @click="selectCategory('trash')"
              style="background-image: url('https://img.icons8.com/ios-filled/50/000000/categorize.png')"/>

        </ol>
      </div>

      <div id="inventoryStorageInventory" class="inventoryStorage" ref="inventoryStorageInventory">
        <template v-if="inventory.warehouses[inventory.warehouse]">
          <app-item-cell v-for="slot in inventory.warehouses[inventory.warehouse].inventory"
                         v-if="visibleCell(slot, inventory.filters)"
                         v-bind:itemSlot="slot"
                         v-bind:size="inventory.cellSize"
                         v-bind:parent="inventory.warehouse"
                         v-bind:drag="true"
                         v-bind:showHP="true"
                         v-bind:noAllowClass="NotAllowCell(slot, inventory.findFilter)"
                         @mouseover.native="itemMouseOver(slot)"
                         @mouseout.native="itemMouseLeave"
                         @click.native="openSubMenu($event, slot)"/>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import Control from '../Window/Control';
import Size from './Size';
import ItemCell from './ItemCell';
import WarehouseTab from './WarehouseTab';
import CellSubMenu from './CellSubMenu';

export default {
  name: "Inventory",
  data() {
    return {
      mouserOveSlot: null,
      warehouseOver: null,
      subMenuProps: {
        src: '',
        slot: null,
        x: 0,
        y: 0,
        points: [],
      }
    }
  },
  created() {
    this.$store.getters.getWSByService('inventory').socket.send(JSON.stringify({
      event: "openInventory"
    }));
  },
  mounted() {
    let app = this;


    let wait = setInterval(function () {
      if (app.$refs.inventoryStorageInventory) {

        clearInterval(wait);

        $(app.$refs.inventoryStorageInventory).selectable({
          filter: '.InventoryCell',
          start: function () {
            $('.ui-selected').removeClass('ui-selected');
          }
        });
        $(app.$refs.inventoryStorageInventory).droppable({
          tolerance: "pointer",
          drop: function (event, ui) {

            $('.ui-selected').removeClass('ui-selected');

            let draggable = ui.draggable;
            if (!draggable.data("selectedItems")) return;

            // если родитель конструктор то это снятие эквипа с тушки, там свои методы
            if (draggable.data("slotData").parent === "Constructor") {
              app.$store.getters.getWSByService('inventory').socket.send(JSON.stringify({
                event: draggable.data("slotData").event,
                equip_slot: Number(draggable.data("slotData").equipSlot),
                equip_slot_type: Number(draggable.data("slotData").equipType),
                unit_slot: Number(draggable.data("slotData").unitSlot),
                destination: "squadInventory",
              }));
            } else {
              app.$store.getters.getWSByService('inventory').socket.send(JSON.stringify({
                event: "itemsToDst",
                source: draggable.data("slotData").parent,
                destination: app.inventory.warehouse,
                storage_slots: draggable.data("selectedItems").slotsNumbers
              }));
            }
          }
        });
      }
    }, 100)
  },
  methods: {
    toUp() {
      this.$store.commit({
        type: 'setWindowZIndex',
        id: this.$el.id,
      });
    },
    resize(event, ui, el) {
      let inventory = $('#Inventory');
      let inventoryStorageInventory = $('#inventoryStorageInventory');
      inventory.css("height", el.height() - 4);
      inventory.css("width", el.width() - 100);
      inventoryStorageInventory.css("height", inventory.height() - 41);
    },
    selectCategory(category) {
      this.subMenuProps.slot = null;
      this.$store.commit({
        type: 'setInventoryFilters',
        filters: {category: category},
      });
    },
    itemMouseOver(slot) {
      this.mouserOveSlot = slot
    },
    itemMouseLeave() {
      this.mouserOveSlot = null
    },
    warehouseMouseOver(id) {
      this.warehouseOver = id
    },
    warehouseMouseLeave() {
      this.warehouseOver = null
    },
    openSubMenu(event, slot) {
      let app = this;
      app.subMenuProps.slot = null;

      setTimeout(function () {
        app.getSubMenuPoints(slot);
        app.subMenuProps.src = app.inventory.warehouse;
        app.subMenuProps.x = event.pageX - $(app.$refs['wrapperInventoryAndStorage']).position().left;
        app.subMenuProps.y = event.pageY - $(app.$refs['wrapperInventoryAndStorage']).position().top;
        app.subMenuProps.slot = slot;
      }, 0)
    },
    getSubMenuPoints(slot) {
      this.subMenuProps.points = [];
      this.subMenuProps.points.push('detail');

      if (this.inventory.warehouse === "squadInventory" || this.inventory.warehouse === 'storage') {

        if (!slot.infinite && slot.quantity > 1) this.subMenuProps.points.push('split');

        if (!this.inventory.inBase) {
          this.subMenuProps.points.push('throw');
          if (slot.type === "boxes") {
            this.subMenuProps.points.push('install');
          }
        } else if (this.inventory.warehouse === 'storage') {

          if (!slot.infinite) this.subMenuProps.points.push('cell');

          if (slot.max_hp > slot.hp) {
            this.subMenuProps.points.push('repair');
          }
        }
      }

      this.subMenuProps.points.push('cancel');
    },
    visibleCell(slot, filter) {

      if (slot.quantity === 0 || !slot.item) {
        return false
      }

      if (slot.type === filter.category || filter.category === 'all') {
        return true
      }

      return slot.type === 'recycle' && filter.category === 'resource';
    },
    /**
     * @return {boolean}
     */
    NotAllowCell(slot, filter) {

      if (!filter) return false;

      if (filter.type === 'equip' && slot.type === filter.type && (slot.item.type_slot === filter.type_slot || filter.type_slot === 0)) {
        if (filter.mining && slot.item.x_attach !== 0 && slot.item.y_attach !== 0) {
          return false
        }
        if (!filter.mining) {
          return false;
        }
      }

      if (filter.type === 'weapon' && slot.type === filter.type) {
        if (filter.standard_size.small && slot.item.standard_size === 1) {
          return false;
        }
        if (filter.standard_size.medium && slot.item.standard_size === 2) {
          return false;
        }
        if (filter.standard_size.big && slot.item.standard_size === 3) {
          return false;
        }
      }

      if (filter.type === 'ammo' && slot.type === filter.type) {
        if (filter.standard_size === slot.item.standard_size && filter.weaponType === slot.item.type) {
          return false;
        }
      }

      return !(filter.type === 'body' && slot.type === filter.type);
    },
    warehouseTitle(title) {
      if (this.language === 'RU') {
        if (title === 'Storage') return 'Склад';
        if (title === 'Box') return 'Ящик';
        if (title === 'Hold') return 'Трюм';
      }
      return title
    }
  },
  computed: {
    inventory() {
      return this.$store.getters.getInventory
    },
    language() {
      return this.$store.getters.getSettings.Language
    },
    handbook() {
      return this.$store.getters.getHandBook
    },
  },
  components: {
    AppControl: Control,
    AppSize: Size,
    AppItemCell: ItemCell,
    AppWarehouseTab: WarehouseTab,
    AppCellSubMenu: CellSubMenu,
  }
}
</script>

<style scoped>
#wrapperInventoryAndStorage {
  position: absolute;
  top: 35%;
  left: calc(700px + 5%);
  z-index: 11;
  width: 345px;
  height: 226px;
  border: 1px solid #25a0e1;
  background: rgb(8, 138, 210);
  padding: 20px 3px 3px 3px;
  border-radius: 4px;
  box-shadow: 0 0 2px black;
}

#warehousesTabs {
  float: left;
  height: 100%;
  width: 96px;
  box-shadow: inset 0 0 2px black;
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.2);
}

#Inventory {
  width: 245px;
  height: 100%;
  user-select: none;
  float: right;
  pointer-events: auto;
}

.categoryTabs {
  margin-top: 4px;
  height: 24px;
  padding-left: 5px;
}

.categoryTabs ol {
  padding: 0;
  margin: 0;
}

.categoryTabs ol li {
  float: left;
  list-style: none;
  height: 20px;
  width: 20px;
  background: #9e9e9e;
  margin: 0 2px 0 0;
  border-radius: 3px;
  border: 1px solid rgba(0, 0, 0, 0.4);
  background-size: 100%;
}

.categoryTabs ol .activeInventoryTabs {
  border: 0 solid transparent;
  box-shadow: inset 0 0 2px 1px black;
  height: 22px;
  width: 22px;
  background: #ce6f3c;
  background-size: 100%;
}

.categoryTabs ol li:hover {
  background-color: #d9d9d9;
}

.inventoryStorage {
  margin: 0 auto 0;
  overflow-y: scroll;
  height: 180px;
  border-radius: 5px;
  background: #89969c;
  pointer-events: auto;
  overflow-x: hidden;
  padding: 0;
  box-shadow: inset 0 0 2px black;
}

.hide {
  display: none !important;
}

</style>
