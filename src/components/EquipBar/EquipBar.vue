<template>
  <div v-if="inventory.equipPanel" id="SquadBarCells">
    <div v-for="(slot, key) in slots"
         class="SquadBarEquipCell"
         @click="selectEquip(slot, key)"
         v-bind:class="[{'mouse_select': slot.active, 'active': slot.type === 'equip' && slot.on}, slot.class]"
         :ref="'SquadBarEquipCell' + key">

      <div>
        <app-background-item-cell v-if="slot.slot" v-bind:slotItem="slot.slot"/>
      </div>
      <span class="QuantityItems" v-if="slot.type ==='item' && slot.slot.quantity">{{ slot.slot.quantity }}</span>
      <div class="reloadEquip" v-if="slot.reload" :style="{height: slot.reloadPercent}"></div>
      <div class="ammoEquip" v-if="slot.ammo">
        <div>
          <app-background-item-cell v-bind:slotItem="slot.ammo.background"/>
        </div>
        <span class="QuantityItems">{{ slot.slot.ammo_quantity }}</span>
      </div>

      <div v-if="slot.slot && (slot.active || slot.on) && modes(slot.slot).length > 0">
        <div class="mode"
             v-for="mode in modes(slot.slot)"
             @click.stop="selectMode(mode.name, slot)"
             v-bind:class="[{'active': slot.mode === mode.name}]"
             :style="{left: mode.left, backgroundImage: modeIcon(mode.name)}">

          <div class="title">{{ mode.title }}</div>

          <app-change-weapon-ammo v-if="mode.name === 'change_weapon_ammo' && subAmmoOpen" v-bind:ammo="ammo"/>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import BackgroundItemCell from '../Inventory/BackgroundItemCell';
import ChangeWeaponAmmo from './ChangeWeaponAmmo';

export default {
  name: "EquipBar",
  data() {
    return {
      subAmmoOpen: false,
      visible: false,
    }
  },
  mounted() {
    for (let i = 1; i <= 12; i++) {
      this.initCell('SquadBarEquipCell' + i, i);
    }
  },
  methods: {
    initCell(ref, number) {
      let app = this;
      let waitCell = setInterval(function () {
        if (app.$refs[ref]) {

          $(app.$refs[ref][0]).data("slotData", {parent: "equipPanel", number: number});

          $(app.$refs[ref][0]).draggable({
            disabled: false,
            stop: function (event, ui) {
              let squadBar = document.getElementById("SquadBarCells");
              let squadBarRect = squadBar.getBoundingClientRect();

              if (squadBarRect.top < event.pageY && squadBarRect.bottom > event.pageY &&
                squadBarRect.left < event.pageX && squadBarRect.right > event.pageX) {
              } else {
                app.$store.getters.getWSByService('inventory').socket.send(JSON.stringify({
                  event: "DropItemEquipPanel",
                  panel_slot: number,
                }));
              }
            },
            helper: 'clone',
            delay: 200,
          });

          $(app.$refs[ref][0]).droppable({
            tolerance: "pointer",
            drop: function (event, ui) {

              $('.ui-selected').removeClass('ui-selected');

              let draggable = ui.draggable;

              console.log(draggable.data("slotData"))
              // если родитель конструктор то это снятие эквипа с тушки, там свои методы
              if (draggable.data("slotData").parent === "Constructor") {
                app.$store.getters.getWSByService('inventory').socket.send(JSON.stringify({
                  event: "ItemToEquipPanel",
                  source: draggable.data("slotData").parent,
                  equip_slot: Number(draggable.data("slotData").equipSlot),
                  equip_slot_type: Number(draggable.data("slotData").equipType),
                  panel_slot: number,
                }));
              } else if (draggable.data("slotData").parent === "squadInventory") {
                app.$store.getters.getWSByService('inventory').socket.send(JSON.stringify({
                  event: "ItemToEquipPanel",
                  source: draggable.data("slotData").parent,
                  panel_slot: number,
                  storage_slots: draggable.data("selectedItems").slotsNumbers
                }));
              } else if (draggable.data("slotData").parent === "equipPanel") {
                app.$store.getters.getWSByService('inventory').socket.send(JSON.stringify({
                  event: "SwitchItemToEquipPanel",
                  src_slot: draggable.data("slotData").number,
                  dst_slot: number,
                }));
              }
            }
          });

          clearInterval(waitCell)
        }
      }, 100)
    },
    selectEquip(slot, key) {
      let equipSlot = this.inventory.equipPanel[key];
      if (!equipSlot) return;

      if (slot.type === 'weapon') {
        this.$store.getters.getWSByService('global').socket.send(JSON.stringify({
          event: "SelectWeapon",
        }));
      }
      if (slot.type === 'equip') {
        this.$store.getters.getWSByService('global').socket.send(JSON.stringify({
          event: "SelectEquip",
          type_slot: equipSlot.type_slot,
          slot: equipSlot.slot,
        }));
      }
      if (slot.type === 'item') {
        this.$store.getters.getWSByService('global').socket.send(JSON.stringify({
          event: "SelectItem",
          type: equipSlot.type,
          id: equipSlot.id,
        }));
      }
    },
    getItemInEquipPanel(cell) {
      if (!cell) return;

      if (cell.source === "squadInventory") {

        let quantity = 0;
        let name = '';

        if (this.inventory.warehouses['squadInventory'] && this.inventory.warehouses['squadInventory'].inventory) {
          for (let slotNumber in this.inventory.warehouses['squadInventory'].inventory) {

            if (!this.inventory.warehouses['squadInventory'].inventory.hasOwnProperty(slotNumber)) continue;

            let slot = this.inventory.warehouses['squadInventory'].inventory[slotNumber];
            if (slot.type === cell.type && slot.item_id === cell.id && slot.item) {
              quantity += slot.quantity;
              name = slot.item.name;
            }
          }
        }

        if (name === '') {
          return null;
        } else {
          return {type: cell.type, quantity: quantity, item: {name: name}}
        }
      }

      if (cell.source === "Constructor") {
        if (this.inventory.unit && this.inventory.unit.body) {
          let {slot} = this.findEquip(cell.type_slot, cell.slot);
          return slot
        }
      }

      return null
    },
    findEquip(findType, findSlot) {
      let item = {slot: null};

      if (findType === 0) {
        for (let i in this.inventory.unit.weapon_slots) {
          let weapon = this.inventory.unit.weapon_slots[i];
          if (weapon.number_slot === findSlot) {
            item = {slot: weapon}
          }
        }
      } else {
        for (let i in this.inventory.unit.equip_slots) {
          let equip = this.inventory.unit.equip_slots[i];
          if (equip.number_slot === findSlot && equip.type_slot === findType) {
            item = {slot: equip}
          }
        }
      }

      return item
    },
    checkSelectEquip(equip, type) {
      if (type === 'equip' && this.inventory.selectEquip && equip.source === "Constructor" &&
        equip.type_slot === this.inventory.selectEquip.type_equip &&
        equip.slot === this.inventory.selectEquip.slot_equip) {
        return true
      }

      if (type === 'weapon' && this.inventory.selectEquip && this.inventory.selectEquip.type === 'weapon') {
        return true
      }

      return false
    },
    selectMode(mode, slot) {

      this.$store.getters.getWSByService('global').socket.send(JSON.stringify({
        event: "SelectEquipMode",
        mode: mode,
        type_slot: Number(slot.slot.type_slot),
        slot: Number(slot.slot.number_slot),
      }));

      if (mode === "change_weapon_ammo") {
        this.subAmmoOpen = !this.subAmmoOpen
      }

      if (mode === "geo_scan_menu") {
        this.$store.commit({
          type: 'toggleWindow',
          id: 'anomalyScannerWrapper',
          component: 'anomalyScannerWrapper',
        });
      }

      if (mode === "build" || mode === "dismantling") {
        this.$store.commit({
          type: 'toggleWindow',
          id: 'buildDialogWrapper',
          component: 'buildDialogWrapper',
          forceOpen: mode === "build",
          forceClose: mode === "dismantling",
        });
      }
    },
    modeIcon(mode) {
      if (mode === 'build') return 'url(https://img.icons8.com/plasticine/100/000000/sledgehammer.png)';
      if (mode === 'dismantling') return 'url(https://img.icons8.com/plasticine/100/000000/angle-grinder.png)';
      if (mode === 'return') return 'url(https://img.icons8.com/plasticine/100/000000/return.png)';
      if (mode === 'digger') return 'url(https://img.icons8.com/color/48/000000/drone.png)';
      if (mode === 'change_weapon_ammo') return 'url(https://img.icons8.com/color/48/000000/bullet-2.png)';
      if (mode === 'reload_weapon') return 'url(https://img.icons8.com/office/40/000000/synchronize.png)';
      if (mode === 'geo_scan_menu') return 'url(https://img.icons8.com/officel/80/000000/radar.png)';
    },
    modes(equipSlot) {
      let modes = [];

      if (equipSlot.type === 'equip') {
        if (equipSlot.equip.applicable === 'build') {
          modes.push({name: 'build', left: 'calc(50% - 29px)', title: 'строительство'});
          modes.push({name: 'dismantling', left: 'calc(50% + 3px)', title: 'демонтаж'});
        }

        if (equipSlot.equip.applicable === 'digger') {
          modes.push({name: 'return', left: 'calc(50% - 29px)', title: 'возврат'});
          modes.push({name: 'digger', left: 'calc(50% + 3px)', title: 'работа'});
        }

        if (equipSlot.equip.applicable === 'geo_scan') {
          modes.push({name: 'geo_scan_menu', left: 'calc(50% - 14px)', title: 'сканер'});
        }
      }

      if (equipSlot.type === 'weapon') {
        modes.push({name: 'reload_weapon', left: 'calc(50% - 29px)', title: 'перезарядка'});
        modes.push({name: 'change_weapon_ammo', left: 'calc(50% + 3px)', title: ''});
      }

      return modes;
    },
  },
  computed: {
    ammo() {
      return this.$store.getters.getAvailableAmmo
    },
    inventory() {
      let inventory = this.$store.getters.getInventory

      if (!this.visible && inventory.equipPanel) {
        this.visible = true;
        for (let i = 1; i <= 12; i++) {
          this.initCell('SquadBarEquipCell' + i, i);
        }
      }

      if (!inventory.equipPanel) {
        this.visible = false;
      }

      return inventory
    },
    slots() {
      let slots = {};

      //inventory.equipPanel[i]
      for (let i = 1; i <= 12; i++) {

        slots[i] = {type: 'empty'};

        if (this.inventory.equipPanel[i]) {

          let equipSlot = this.inventory.equipPanel[i];
          let slotItem = this.getItemInEquipPanel(equipSlot);

          if (!slotItem) {
            slots[i] = {type: 'empty'};
            continue;
          }

          if (slotItem.hasOwnProperty('equip') && slotItem.equip) {
            let cssClass = 'equip';
            if (slotItem.equip.active) {

              if (slotItem.equip.x_attach > 0 && slotItem.equip.y_attach > 0) {
                cssClass = 'distEquip';
              } else {
                cssClass = 'activeEquip';
              }
            } else {
              cssClass = 'passiveEquip';
            }

            slotItem.item = slotItem.equip;
            slotItem.type = 'equip';

            let percentReload = 100 / (slotItem.equip.reload / equipSlot.cr)
            slots[i] = {
              type: 'equip',
              class: cssClass,
              slot: slotItem,
              reload: percentReload > 0,
              reloadPercent: percentReload + "%",
              on: equipSlot.on,
              mode: equipSlot.mode,
              active: this.checkSelectEquip(equipSlot, 'equip')
            }
          }

          if (slotItem.hasOwnProperty('weapon') && slotItem.weapon) {

            slotItem.item = slotItem.weapon;
            slotItem.type = 'weapon';

            slots[i] = {
              type: 'weapon',
              class: 'weapon',
              slot: slotItem,
              reload: slotItem.reload,
              reloadPercent: (100 / (slotItem.time_reload / equipSlot.cr)) + "%",
              active: this.checkSelectEquip(equipSlot, 'weapon'),
            };

            if (slotItem.ammo) {
              slotItem.ammo_quantity = equipSlot.aq;
              slots[i].ammo = {
                ammo: slotItem.ammo,
                background: {
                  type: "ammo",
                  item: {name: slotItem.ammo.name}
                }
              }
            }
          }

          if (!slotItem.hasOwnProperty('equip') && !slotItem.hasOwnProperty('weapon')) {
            slots[i] = {type: 'item', class: 'item', slot: slotItem}
          }
        }
      }

      return slots
    }
  },
  components: {
    AppBackgroundItemCell: BackgroundItemCell,
    AppChangeWeaponAmmo: ChangeWeaponAmmo,
  }
}
</script>

<style scoped>
.SquadBarEquipCell {
  float: left;
  height: 46px;
  width: 46px;
  background-color: #585858;
  border-radius: 5px;
  box-shadow: inset 0 0 2px, 0 0 2px;
  margin: 2px;
  position: relative;
  border: 2px solid rgba(0, 0, 0, 0.4);
}

.SquadBarEquipCell.weapon {
  background: #852700;
}

.SquadBarEquipCell.distEquip {
  background: #0d8511;
}

.SquadBarEquipCell.activeEquip {
  background: #006485;
}

.SquadBarEquipCell.passiveEquip {
  background: #687585;
}

.SquadBarEquipCell.item {
  background: #bcbbbd;
}

.SquadBarEquipCell.active {
  box-shadow: inset 0 0 2px yellow, 0 0 2px yellow;
  animation: 2s linear 0s infinite alternate active;
}

.mode.active {
  box-shadow: inset 0 0 2px yellow, 0 0 2px yellow;
  border: 1px solid yellow;
}

.SquadBarEquipCell:hover {
  border: 2px solid rgb(255, 183, 6);
}

.reloadEquip {
  height: 100%;
  width: 100%;
  position: absolute;
  background: rgba(0, 0, 0, 0.6);
  border-top: 1px solid grey;
  bottom: 0;
  transition: 200ms;
  z-index: 2;
}

.ammoEquip {
  height: 50%;
  width: 50%;
  position: absolute;
  z-index: 1;
  background: rgba(0, 0, 0, 0.6);
  bottom: 0;
  border: 1px solid grey;
}

@keyframes active {
  0% {
    border-left: 2px solid rgb(174, 255, 3);
    border-right: 2px solid rgb(253, 255, 0);
    border-top: 2px solid rgb(255, 212, 5);
    border-bottom: 2px solid rgb(255, 91, 0);
  }
  25% {
    border-left: 2px solid rgb(255, 91, 0);
    border-right: 2px solid rgb(174, 255, 3);
    border-top: 2px solid rgb(253, 255, 0);
    border-bottom: 2px solid rgb(255, 212, 5);
  }

  50% {
    border-left: 2px solid rgb(255, 212, 5);
    border-right: 2px solid rgb(255, 91, 0);
    border-top: 2px solid rgb(174, 255, 3);
    border-bottom: 2px solid rgb(253, 255, 0);
  }
  75% {
    border-left: 2px solid rgb(253, 255, 0);
    border-right: 2px solid rgb(255, 212, 5);
    border-top: 2px solid rgb(255, 91, 0);
    border-bottom: 2px solid rgb(174, 255, 3);
  }
}

.user_avatar {
  float: left;
  height: 50px;
  width: 50px;
  margin: 5px;
  border-radius: 2px;
  background: grey;
  box-shadow: 0 0 2px black;
  z-index: 1;
  position: relative;
  background-size: cover;
}

.user_name {
  color: white;
  float: left;
  padding: 0;
  margin: 6px 2px 2px -10px;
  box-shadow: 0 0 2px black;
  width: 146px;
  background: rgb(119, 119, 119);
}

.bars {
  float: left;
  width: 100%;
  margin-top: 3px;
}

#hp_bar {
  overflow: visible;
  background: rgba(72, 255, 40, 0.7);
  height: 100%;
}

.hp_bar_wrapper {
  width: calc(100% - 25px);
  height: 10px;
  border: 1px solid #4c4c4c;
  text-align: left;
  display: block;
  box-shadow: inset 0 0 2px black, 0 0 2px black;
  border-radius: 10px;
  background-size: 12%;
  overflow: hidden;
  background-color: #959595;
  margin: 0 auto 0;
}

.hp_bar_wrapper span {
  display: block;
  font-size: 10px;
  line-height: 11px;
  width: 100%;
  text-align: center;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 1);
  font-weight: bold;
  margin: auto;
  float: left;
  color: white;
}

#SquadBar .mouse_select {
  box-shadow: inset 0 0 7px 2px white, 0 0 2px white;
  border: 2px solid rgba(255, 255, 255, 0.8);
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

.mode {
  border: 1px solid #2e2e2e;
  position: absolute;
  height: 26px;
  width: 26px;
  border-radius: 2px;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
  background-color: rgba(127, 127, 127, 0.8);
  top: -53px;
  background-size: cover;
}

.mode .title {
  position: absolute;
  bottom: calc(100% + 2px);
  display: none;
  color: white;
  font-size: 12px;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
}

.mode:hover .title {
  display: block;
}

#SquadBarCells:after {
  content: ' ';
  display: block;
  clear: both;
}
</style>
