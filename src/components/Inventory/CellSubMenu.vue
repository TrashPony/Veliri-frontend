<template>
  <div>
    <div v-if="subMenuProps.points && action===''"
         id="InventoryTip"
         v-bind:style="{ left: subMenuProps.x + 'px', top: subMenuProps.y + 'px' }">
      <div class="wrapper">
        <div class="headSubMenu">
          <div class="iconItem">
            <app-background-item-cell v-bind:slotItem="subMenuProps.slot"/>
          </div>
          <div class="nameItem">{{ itemName }}</div>
        </div>

        <template v-for="point in subMenuProps.points">
          <input v-if="point==='detail'" @click="detail" type="button"
                 :value="language === 'RU' ? 'Подробнее' : 'More details'">
          <input v-if="point==='split'" @click="splitDialog" type="button"
                 :value="language === 'RU' ? 'Разделить' : 'Split'">
          <input v-if="point==='throw'" @click="throwItems" type="button"
                 :value="language === 'RU' ? 'Выбросить' : 'Throw'">
          <input v-if="point==='install'" @click="installDialog" type="button"
                 :value="language === 'RU' ? 'Установить' : 'Install'">
          <input v-if="point==='cell'" @click="cellDialog" type="button"
                 :value="language === 'RU' ? 'Продать' : 'Sell'">
          <input v-if="point==='repair'" @click="repair" type="button"
                 :value="language === 'RU' ? 'Починить' : 'Repair'">
          <input v-if="point==='remove'" @click="remove" type="button"
                 :value="language === 'RU' ? 'Снять' : 'Take off'">
          <input v-if="point==='to_hold'" @click="moveItem('storage', 'squadInventory')" type="button"
                 :value="language === 'RU' ? 'В трюм' : 'To hold'">
          <input v-if="point==='to_storage'" @click="moveItem('squadInventory', 'storage')" type="button"
                 :value="language === 'RU' ? 'На склад' : 'To storage'">
          <input v-if="point==='cancel'" @click="cancel" type="button"
                 :value="language === 'RU' ? 'Отменить' : 'Cancel'">
        </template>
      </div>
    </div>

    <div id="sellDialog"
         v-if="action==='cell'"
         v-bind:style="{ left: subMenuProps.x + 'px', top: subMenuProps.y + 'px' }">

      <div class="wrapper">
        <div style="float: left; width: 100%;">
          <div class="iconItem">
            <app-background-item-cell v-bind:slotItem="subMenuProps.slot"/>
          </div>

          <div>
            <div class="range_button" style="border-radius: 5px 0 0 5px" @click="splitChangeCount(-1)">-1</div>
            <input type="range" v-model="cellProps.count" min="1" :max="subMenuProps.slot.quantity">
            <div class="range_button" @click="splitChangeCount(1)">+1</div>

            <input type="number" v-model="cellProps.count" min="1" :max="subMenuProps.slot.quantity"/>

            <div style="width: calc(100% - 53px); float: left; margin-bottom: 5px;">
              <span>{{ language === 'RU' ? 'Цена за шт.' : 'Price per piece' }}</span>
              <input id="sellPrice" v-model="cellProps.price" min="1" type="number">
            </div>
          </div>
        </div>

        <div style="width: 100%; float: left;">
          <input type="button" :value="language === 'RU' ? 'Отмена' : 'Cancel'" @click="cancel"
                 style="float: left; margin-left: 10px;">
          <input type="button" :value="language === 'RU' ? 'Продать' : 'Sell'" @click="cell"
                 style="float: right; margin-right: 10px;">
        </div>
      </div>
      <!--      <div class="wrapper">-->
      <!--        <div>-->
      <!--          <div class="sellIconItem">-->
      <!--            <app-background-item-cell v-bind:slotItem="subMenuProps.slot"/>-->
      <!--          </div>-->
      <!--          <div class="sellNameItem">{{ itemName }}</div>-->
      <!--        </div>-->

      <!--        <div style="clear: both; padding: 5px;">-->
      <!--          <div style="clear: both; margin-top: 5px;">-->
      <!--            <span>{{ language === 'RU' ? 'Кол-во' : 'Qty' }}</span>-->
      <!--            <input id="sellQuantity" v-model="cellProps.count" type="number" min="1" :max="subMenuProps.slot.quantity">-->
      <!--          </div>-->

      <!--          <div style="margin-top: 5px;">-->
      <!--            <span>{{ language === 'RU' ? 'Цена за шт.' : 'Price per piece' }}</span>-->
      <!--            <input id="sellPrice" v-model="cellProps.price" min="1" type="number">-->
      <!--          </div>-->

      <!--          <div style="margin-top: 25px;">-->
      <!--            <span>{{ language === 'RU' ? 'Всего выручки:' : 'Total revenue:' }} </span>-->
      <!--            <output>{{ cellProps.count * cellProps.price }}</output>-->
      <!--          </div>-->
      <!--        </div>-->

      <!--        <input type="button" @click="cancel" style="pointer-events: auto; float: left"-->
      <!--               :value="language === 'RU' ? 'Отменить' : 'Cancel'">-->
      <!--        <input type="button" @click="cell" style="pointer-events: auto; float: right"-->
      <!--               :value="language === 'RU' ? 'Продать' : 'Sell'">-->
      <!--      </div>-->
    </div>

    <div id="QuantityRange"
         v-if="action==='split'"
         v-bind:style="{ left: subMenuProps.x + 'px', top: subMenuProps.y + 'px' }">
      <div class="wrapper">
        <div>
          <div class="iconItem">
            <app-background-item-cell v-bind:slotItem="subMenuProps.slot"/>
          </div>

          <div class="range_button" style="border-radius: 5px 0 0 5px" @click="splitChangeCount(-1)">-1</div>
          <input type="range" v-model="splitProps.count" min="1" :max="subMenuProps.slot.quantity">
          <div class="range_button" @click="splitChangeCount(1)">+1</div>

          <input type="number" v-model="splitProps.count" min="1" :max="subMenuProps.slot.quantity"/>
        </div>

        <div style="width: 150px; float: left;">
          <input type="button" value="Отмена" @click="cancel" style="float: left;">
          <input type="button" value="Разделить" @click="split" style="float: right; margin-right: 10px;">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BackgroundItemCell from './BackgroundItemCell'
import Input from "../Chat/Input";

export default {
  name: "CellSubMenu",
  props: ['subMenuProps'],
  data() {
    return {
      // эти компоненты конечно стоит наверно поделить, но мне чет влом
      action: '',
      cellProps: {
        count: 1,
        price: 1,
      },
      splitProps: {
        count: 1,
      }
    }
  },
  methods: {
    moveItem(src, dst) {
      this.$store.getters.getWSByService('inventory').socket.send(JSON.stringify({
        event: "itemsToDst",
        source: src,
        destination: dst,
        storage_slots: {[Number(this.$props.subMenuProps.slot.number)]: 0},
      }));
      this.cancel()
    },
    splitChangeCount(change) {
      this.splitProps.count += change
      if (this.splitProps.count < 1) {
        this.splitProps.count = 1
      }

      if (this.splitProps.count > this.$props.subMenuProps.slot.quantity) {
        this.splitProps.count = Number(this.$props.subMenuProps.slot.quantity)
      }
    },
    splitDialog() {
      this.action = 'split';
    },
    installDialog() {
      if (this.$props.subMenuProps.slot.item.protect) {
        this.$store.commit({
          type: 'toggleWindow',
          id: 'boxPassInstall',
          component: 'boxPass',
          meta: {
            slot: Number(this.$props.subMenuProps.slot.number),
            action: 'install',
          },
          forceOpen: true,
        });
      } else {
        this.$store.getters.getWSByService('global').socket.send(JSON.stringify({
          event: "placeNewBox",
          slot: Number(this.$props.subMenuProps.slot.number),
        }));
      }
      this.cancel()
    },
    cellDialog() {
      this.action = 'cell';
    },
    split() {
      this.$store.getters.getWSByService('inventory').socket.send(JSON.stringify({
        event: "divideItems",
        inventory_slot: Number(this.$props.subMenuProps.slot.number),
        storage: this.$props.subMenuProps.src === 'storage', // TODO костыль
        count: Number(this.splitProps.count),
      }));
      this.cancel()
    },
    cell() {
      this.$store.getters.getWSByService('market').socket.send(JSON.stringify({
        event: 'placeNewSellOrder',
        storage_slot: Number(this.$props.subMenuProps.slot.number),
        quantity: Number(this.cellProps.count),
        price: Number(this.cellProps.price),
      }));
      this.cancel()
    },
    repair() {
      this.$store.getters.getWSByService('inventory').socket.send(JSON.stringify({
        event: "ItemRepair",
        inventory_slot: Number(this.$props.subMenuProps.slot.number),
        storage: this.$props.subMenuProps.src === 'storage', // TODO костыль
      }));
      this.cancel()
    },
    detail() {
      if (this.$props.subMenuProps.slot.item.hasOwnProperty('id')) {
        this.$store.commit({
          type: 'toggleWindow',
          id: 'detailItem' + this.$props.subMenuProps.slot.type + this.$props.subMenuProps.slot.item.id,
          component: 'detailItem',
          meta: {itemType: this.$props.subMenuProps.slot.type, itemID: this.$props.subMenuProps.slot.item.id},
          forceOpen: true,
        });
      } else if (this.$props.subMenuProps.slot.item.hasOwnProperty('type_id')) {
        this.$store.commit({
          type: 'toggleWindow',
          id: 'detailItem' + this.$props.subMenuProps.slot.type + this.$props.subMenuProps.slot.item.type_id,
          component: 'detailItem',
          meta: {itemType: this.$props.subMenuProps.slot.type, itemID: this.$props.subMenuProps.slot.item.type_id},
          forceOpen: true,
        });
      }
      this.cancel()
    },
    throwItems() {
      let throwItems = [];
      throwItems[this.$props.subMenuProps.slot.number] = this.$props.subMenuProps.slot;
      this.$store.getters.getWSByService('global').socket.send(JSON.stringify({
        event: "ThrowItems",
        throw_items: throwItems
      }));
      this.cancel()
    },
    remove() {
      if (this.$props.subMenuProps.src === 'Constructor') {

        if (this.$props.subMenuProps.type === 'ammo') {
          this.$store.getters.getWSByService('inventory').socket.send(JSON.stringify({
            event: "RemoveMotherShipAmmo",
            equip_slot: Number(this.$props.subMenuProps.data.number_slot),
            destination: "storage",
          }));
        }

        if (this.$props.subMenuProps.type === 'weapon') {
          this.$store.getters.getWSByService('inventory').socket.send(JSON.stringify({
            event: "RemoveMotherShipWeapon",
            equip_slot: Number(this.$props.subMenuProps.data.number_slot),
            destination: "storage",
          }));
        }

        if (this.$props.subMenuProps.type === 'equip') {
          this.$store.getters.getWSByService('inventory').socket.send(JSON.stringify({
            event: "RemoveMotherShipEquip",
            equip_slot: Number(this.$props.subMenuProps.data.number_slot),
            equip_slot_type: Number(this.$props.subMenuProps.data.type_slot),
            destination: "storage",
          }));
        }

        this.cancel()
      }
    },
    cancel() {
      this.$props.subMenuProps.slot = null;
    },
  },
  computed: {
    itemName() {
      let slot = this.$props.subMenuProps.slot;
      if (!slot) {
        return ''
      }

      if (slot.type === "blueprints") {
        if (slot.item.in_map) {
          return this.handbook['structure'][this.language][slot.item.name.split('_bp')[0]].name
        } else {
          return this.handbook[slot.item.item_type][this.language][slot.item.item_name].name
        }
      }

      return this.handbook[slot.type][this.language][slot.item.name].name
    },
    language() {
      return this.$store.getters.getSettings.Language
    },
    handbook() {
      return this.$store.getters.getHandBook
    }
  },
  components: {
    Input,
    AppBackgroundItemCell: BackgroundItemCell,
  }
}
</script>

<style scoped>
#InventoryTip {
  position: absolute;
  display: inline-block;
  border: 1px solid rgba(37, 160, 225, 0.2);
  background: rgba(8, 138, 210, 0.2);
  border-radius: 5px;
  min-height: 20px;
  min-width: 80px;
  padding: 3px;
  text-shadow: 1px 1px 2px black, 0 0 1em #696969;
  z-index: 91;
  filter: drop-shadow(0 0 2px black);
}

#InventoryTip input {
  display: block;
  margin: 2px auto 0;
  width: 100%;
  pointer-events: auto;
  font-size: 11px;
  text-align: center;
  transition: 100ms;
  background: rgba(255, 129, 0, 0.6);
  height: 18px;
  border-radius: 5px;
  color: #fff;
  line-height: 15px;
  box-shadow: 0 0 2px #000;
  cursor: pointer;
}

#sellDialog span {
  font-size: 10px;
  color: bisque;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
}

#sellDialog #sellPrice {
  margin: 0;
  float: right;
}

#QuantityRange, #sellDialog {
  position: absolute;
  left: calc(50% - 100px);
  top: 27px;
  width: 200px;
  height: 55px;
  display: block;
  background-size: 100% 2px;
  border-radius: 5px;
  border: 1px solid rgba(37, 160, 225, 0.2);
  background: rgba(8, 138, 210, 0.2);
  z-index: 91;
  filter: drop-shadow(0 0 2px black);
  padding: 3px 3px 5px;
}

#sellDialog {
  height: 77px;
}

#QuantityRange .iconItem, #sellDialog .iconItem {
  position: relative;
  border-radius: 5px;
  width: 36px;
  height: 36px;
  border: 1px solid #959595;
  background-color: #4c4c4c;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  vertical-align: top;
  margin: 9px 5px 0;
  box-shadow: 0 0 5px rgba(0, 0, 0, 1);
  float: left;
}

#QuantityRange input[type=range], #sellDialog input[type=range] {
  float: left;
  margin-top: 10px;
  width: 70px;
  margin-bottom: 5px;
  padding: 0;
}

#QuantityRange input[type=button], #sellDialog input[type=button] {
  width: 65px;
  margin-top: 3px;
  font-size: 9px;
  display: inline-block;
  text-align: center;
  transition: 100ms;
  background: rgba(255, 129, 0, 0.6);
  height: 16px;
  border-radius: 5px;
  color: #fff;
  line-height: 15px;
  box-shadow: 0 0 2px #000;
}

#QuantityRange input[type=button]:active, #sellDialog input[type="button"]:active, #InventoryTip input:active {
  transform: scale(0.98);
}

#QuantityRange input[type=button]:hover, #sellDialog input[type="button"]:hover, #InventoryTip input:hover {
  background: rgba(255, 129, 0, 1);
}

#QuantityRange input[type=number], #sellDialog input[type=number] {
  float: right;
  margin-top: 10px;
  margin-right: 5px;
  color: #ff7800;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
  width: 27px;
  height: 14px;
  text-indent: 1px;
}

#QuantityRange input[type=number]::-webkit-inner-spin-button, #sellDialog input[type=number]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
#QuantityRange input[type=number], #sellDialog input[type=number] {
  -moz-appearance: textfield;
}

.headSubMenu {
  height: 30px;
  min-width: 120px;
}


#InventoryTip .iconItem {
  float: left;
  height: 40px;
  width: 40px;
  position: relative;
  background: rgba(0, 0, 0, 0.2);
  margin: 0px 3px 5px 0px;
  border-radius: 5px;
}

#InventoryTip .nameItem {
  color: yellow;
  float: left;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
  font-size: 10px;
  margin-top: 5px;
}

.wrapper {
  height: 100%;
  width: calc(100% - 2px);
  float: left;
  clear: both;
  border: 1px solid rgba(37, 160, 225, 0.5);
  background: rgba(8, 138, 210, 0.5);
  border-radius: 3px;
  box-shadow: 0 0 2px black;
}

#InventoryTip .wrapper {
  height: calc(100% - 8px);
  width: calc(100% - 8px);
  padding: 3px;
}

.range_button {
  width: 15px;
  height: 14px;
  float: left;
  font-size: 9px;
  display: inline-block;
  text-align: center;
  transition: 100ms;
  background: rgba(255, 129, 0, 0.6);
  border-radius: 0 5px 5px 0;
  color: #fff;
  line-height: 15px;
  box-shadow: 0 0 2px #000;
  margin-top: 11px;
  cursor: pointer;
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none;
}

.range_button:hover {
  background: rgba(255, 129, 0, 1);
}

.range_button:active {
  transform: scale(0.98);
}
</style>
