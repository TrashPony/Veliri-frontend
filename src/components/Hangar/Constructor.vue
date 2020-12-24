<template>
  <div id="ConstructorBackGround" ref="ConstructorBackGround">

    <app-cell-sub-menu v-if="subMenuProps.slot" v-bind:subMenuProps="subMenuProps"/>

    <div id="weaponIcon"/>
    <div id="MSWeaponPanel" v-if="inventory.stateMS">
      <div class="weaponTypeNotAllow" v-bind:class="{ weaponTypeAllow: inventory.unit.body.standard_size_small}"></div>
      <div class="weaponTypeNotAllow" v-bind:class="{ weaponTypeAllow: inventory.unit.body.standard_size_medium}"></div>
      <div class="weaponTypeNotAllow" v-bind:class="{ weaponTypeAllow: inventory.unit.body.standard_size_big}"></div>
    </div>

    <div id="powerIcon"/>
    <div id="powerPanel" v-if="inventory.stateMS">
      <span>{{ inventory.stateMS.use_power }} / {{ inventory.stateMS.max_power }}</span>
    </div>

    <div class="repairButton" @click="repair"></div>

    <div id="ConstructorMS">

      <app-view-m-s @click.native="openSubMenu($event, inventory.unit.body, 'body')"/>

      <div class="figure"></div>
      <div class="figure" style="transform: rotate(-225deg);left: 154px;top: 67px;"></div>
      <div class="figure" style="left: 24px;top: -11px;transform: rotate(16deg);"></div>
    </div>

    <template v-if="inventory.unit && inventory.unit.body">


      <div class="tipBodyFine" v-if="inventory.fine[inventory.unit.body.name]">Не хватает навыка!
        <div id="bodyFine"/>
      </div>

      <div id="hp_bar_wrapper">
        <span> HP </span>
        <div id="hp_bar"
             :style="{width: (100 / (inventory.stateMS.max_hp / inventory.unit.hp)) > 0 ? Math.round(100 / (inventory.stateMS.max_hp / inventory.unit.hp)) + '%' : 0}"></div>
      </div>

      <template v-if="currentUser.game_mode === 'open_world'">
        <div class="bodyThoriumWrapper"
             ref="bodyThoriumWrapper"
             v-if="inventory.unit.thorium_slots"
             :style="{left: 'calc(50%' + ' - ' + thoriumSlotsOffset(inventory.unit) + 'px)'}">

          <app-item-cell v-for="slot in inventory.unit.thorium_slots"
                         class="bodyThorium"
                         @click.native="removeThorium(slot)"
                         v-bind:equipProps="{type: 'thorium', data: slot}"
                         v-bind:noShowName="true"
                         v-bind:text="`<h6>${slot.count}</h6> <p class='sep'>/</p> <p>${slot.max_count}</p>`"
                         v-bind:itemSlot="{type: 'recycle', item: {name: 'enriched_thorium'}}"
                         v-bind:size="35"/>
        </div>
      </template>

      <!--  1 -->
      <app-item-cell v-for="slot in inventory.unit.equip_slots"
                     v-if="slot.type_slot === 1"
                     v-bind:style="{ left: getPos(160 - (slot.number_slot-1) * 20).x + 'px', top: getPos(160 - (slot.number_slot-1) * 20).y + 'px' }"
                     class="bodyEquip"
                     v-bind:fine="slot.equip ? inventory.fine[slot.equip.name] : false"
                     v-bind:textFine="slot.equip ? inventory.fine[slot.equip.name] ? 'Не хватает навыка' : '' : ''"
                     v-bind:opacity="slot.equip ? inventory.fine[slot.equip.name] ? 0.4 : false : false"
                     v-bind:itemSlot="{type: 'equip', item: slot.equip}"
                     v-bind:class="{mining: slot.mining}"
                     v-bind:text="slot.equip ? '' : 'I'"
                     v-bind:equipProps="{type: 'equip', data: slot}"
                     @mouseover.native="setFindEquipFilter(slot)"
                     @mouseout.native="removeFindFilter()"
                     @click.native="openSubMenu($event, slot, 'equip')"
                     v-bind:size="38"/>
      <!--  2 -->
      <app-item-cell v-for="slot in inventory.unit.equip_slots"
                     v-if="slot.type_slot === 2"
                     v-bind:style="{ left: getPos(40 - (slot.number_slot-1) * 20).x + 'px', top: getPos(40 - (slot.number_slot-1) * 20).y + 'px' }"
                     class="bodyEquip"
                     v-bind:fine="slot.equip ? inventory.fine[slot.equip.name] : false"
                     v-bind:textFine="slot.equip ? inventory.fine[slot.equip.name] ? 'Не хватает навыка' : '' : ''"
                     v-bind:opacity="slot.equip ? inventory.fine[slot.equip.name] ? 0.4 : false : false"
                     v-bind:itemSlot="{type: 'equip', item: slot.equip}"
                     v-bind:class="{mining: slot.mining}"
                     v-bind:text="slot.equip ? '' : 'II'"
                     v-bind:equipProps="{type: 'equip', data: slot}"
                     @mouseover.native="setFindEquipFilter(slot)"
                     @mouseout.native="removeFindFilter()"
                     @click.native="openSubMenu($event, slot, 'equip')"
                     v-bind:size="38"/>

      <!--  3 -->
      <app-item-cell v-for="slot in inventory.unit.equip_slots"
                     v-if="slot.type_slot === 3"
                     v-bind:style="{ left: getPos(280 - (slot.number_slot-1) * 20).x + 'px', top: getPos(280 - (slot.number_slot-1) * 20).y + 'px' }"
                     class="bodyEquip"
                     v-bind:fine="slot.equip ? inventory.fine[slot.equip.name] : false"
                     v-bind:textFine="slot.equip ? inventory.fine[slot.equip.name] ? 'Не хватает навыка' : '' : ''"
                     v-bind:opacity="slot.equip ? inventory.fine[slot.equip.name] ? 0.4 : false : false"
                     v-bind:itemSlot="{type: 'equip', item: slot.equip}"
                     v-bind:class="{mining: slot.mining}"
                     v-bind:text="slot.equip ? '' : 'III'"
                     v-bind:equipProps="{type: 'equip', data: slot}"
                     @mouseover.native="setFindEquipFilter(slot)"
                     @mouseout.native="removeFindFilter()"
                     @click.native="openSubMenu($event, slot, 'equip')"
                     v-bind:size="38"/>

      <!--  оружие всегда на 3тем слоте -->
      <template v-for="slot in inventory.unit.weapon_slots">

        <app-item-cell
          v-bind:style="{ left: getPos(280 - (slot.number_slot - 1) * 20).x + 'px', top: getPos(280 - (slot.number_slot - 1) * 20).y + 'px' }"
          class="bodyWeapon"
          v-bind:fine="slot.weapon ? inventory.fine[slot.weapon.name] : false"
          v-bind:textFine="slot.weapon ? inventory.fine[slot.weapon.name] ? 'Не хватает навыка' : '' : ''"
          v-bind:opacity="slot.weapon ? inventory.fine[slot.weapon.name] ? 0.4 : false : false"
          v-bind:itemSlot="{type: 'weapon', item: slot.weapon}"
          v-bind:equipProps="{type: 'weapon', data: slot}"
          @mouseover.native="setFindWeaponFilter(slot)"
          @mouseout.native="removeFindFilter()"
          @click.native="openSubMenu($event, slot, 'weapon')"
          v-bind:size="38"/>

        <app-item-cell
          v-bind:style="{ left: getPos(280 - (slot.number_slot - 1) * 20, 100).x + 'px', top: getPos(280 - (slot.number_slot - 1) * 20, 100).y + 'px' }"
          class="bodyAmmo"
          v-bind:fine="slot.ammo ? inventory.fine[slot.ammo.name] : false"
          v-bind:textFine="slot.ammo ? inventory.fine[slot.ammo.name] ? 'Не хватает навыка' : '' : ''"
          v-bind:opacity="slot.ammo ? inventory.fine[slot.ammo.name] ? 0.4 : false : false"
          v-bind:itemSlot="{type: 'ammo', quantity: slot.ammo_quantity, item: slot.ammo}"
          v-bind:equipProps="{type: 'ammo', data: slot}"
          @mouseover.native="setFindAmmoFilter(slot)"
          @mouseout.native="removeFindFilter()"
          @click.native="openSubMenu($event, slot, 'ammo')"
          v-bind:size="30"/>

      </template>
    </template>

  </div>
</template>

<script>

import CellSubMenu from '../Inventory/CellSubMenu';
import ItemCell from '../Inventory/ItemCell';
import ViewMS from './ViewMS';

export default {
  name: "Constructor",
  data() {
    return {
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
  methods: {
    repair() {
      this.$store.getters.getWSByService('inventory').socket.send(JSON.stringify({
        event: "EquipsRepair"
      }));
    },
    getPos(angle, dist = 125) {
      return {
        x: (dist * Math.cos(angle * Math.PI / 180)) + (333 / 2 - 50 / 2),
        y: (dist * Math.sin(angle * Math.PI / 180)) + (333 / 2 - 50 / 2),
      };
    },
    thoriumSlotsOffset(unit) {
      return (41 - 41 / 2) * unit.thorium_slots.length
    },
    removeFindFilter() {
      this.$store.commit({
        type: 'setFindFilter',
        filters: null
      });
    },
    setFindEquipFilter(slot) {
      this.$store.commit({
        type: 'setFindFilter',
        filters: {
          type: 'equip',
          type_slot: slot.type_slot,
          mining: slot.mining,
        }
      });
    },
    setFindWeaponFilter() {
      this.$store.commit({
        type: 'setFindFilter',
        filters: {
          type: 'weapon',
          standard_size: {
            small: this.inventory.unit.body.standard_size_small,
            medium: this.inventory.unit.body.standard_size_medium,
            big: this.inventory.unit.body.standard_size_big,
          },
        }
      });
    },
    setFindAmmoFilter(slot) {
      if (slot.weapon) {
        this.$store.commit({
          type: 'setFindFilter',
          filters: {
            type: 'ammo',
            standard_size: slot.weapon.standard_size,
            weaponType: slot.weapon.type,
          }
        });
      }
    },
    removeThorium(slot) {
      this.$store.dispatch({
        type: 'removeThorium',
        slot: slot.number_slot
      })
    },
    openSubMenu(event, slot, type) {
      let app = this;
      app.subMenuProps.slot = null;

      if (!slot[type] && type !== 'body') return;

      let invSlot;
      if (type === 'body') {
        invSlot = {type: type, item: slot};
      } else {
        invSlot = {type: type, item: slot[type]};
      }

      setTimeout(function () {
        app.getSubMenuPoints(slot, type);
        app.subMenuProps.src = 'Constructor';
        app.subMenuProps.x = event.pageX - $(app.$parent.$refs['inventoryBox']).position().left - 300;
        app.subMenuProps.y = event.pageY - $(app.$parent.$refs['inventoryBox']).position().top - 50;
        app.subMenuProps.type = type;
        app.subMenuProps.data = slot;
        app.subMenuProps.slot = invSlot;
      }, 0)
    },
    getSubMenuPoints(slot, type) {
      this.subMenuProps.points = [];
      this.subMenuProps.points.push('detail');

      if ((this.inventory.inBase || type === 'ammo') && type !== 'body') {
        this.subMenuProps.points.push('remove');
      }

      this.subMenuProps.points.push('cancel');
    },
  },
  computed: {
    inventory() {
      return this.$store.getters.getInventory
    },
    user() {
      return this.$store.getters.getGamePlayer
    },
    currentUser() {
      return this.$store.getters.getUser
    },
  },

  components: {
    AppItemCell: ItemCell,
    AppViewMS: ViewMS,
    AppCellSubMenu: CellSubMenu,
  }
}
</script>

<style scoped>
#ConstructorBackGround {
  border-radius: 20px;
  display: inline-block;
  width: 333px;
  height: 333px;
  background-color: #4c4c4c;
  position: relative;
  margin-left: -3px;
  float: left;
  box-shadow: inset 0 0 5px 1px black;
}

#powerPanel, #MSWeaponPanel {
  right: -3px;
  bottom: -3px;
  position: absolute;
  display: inline-block;
  width: 60px;
  height: 13px;
  border: 1px solid rgb(142, 208, 207);
  border-radius: 20px;
  margin: 5px 7px 5px;
  padding-top: 2px;
  box-shadow: 0 0 2px 1px rgba(0, 0, 0, 1), inset 0 0 2px 1px rgba(0, 0, 0, 1);
  background-color: rgb(142, 208, 207);
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
  transform: scale(1.1);
  color: white;
  font-size: 8px;
  line-height: 14px;
  text-align: center;
}

#MSWeaponPanel {
  left: -3px;
  top: -3px;
  padding-top: 2px;
}

#ConstructorMS {
  border-radius: 50%;
  padding: 5px;
  vertical-align: middle;
  width: 318px;
  height: 318px;
  margin: auto;
  left: 0;
  box-shadow: 0 0 3px 1px rgba(0, 0, 0, 1);
  background-size: 100% 2px;
  background-image: linear-gradient(0deg, rgba(7, 41, 60, 0.6) 50%, rgba(0, 62, 95, 0.5) 30%);
  border: 1px solid rgba(0, 0, 0, 0.5);
  position: relative;
  overflow: hidden;
}

.repairButton {
  width: 40px;
  height: 40px;
  background: url(../../assets/indexImg/repairButton.png) no-repeat 5px 5px;
  background-color: rgba(0, 255, 253, 0.2);
  background-size: 76%;
  border: 1px solid black;
  position: absolute;
  top: 5px;
  right: 5px;
  border-radius: 20px;
  user-select: none;
  -moz-user-select: none;
  box-shadow: 0 0 10px rgba(0, 0, 0, 1);
}

.repairButton:active, .repairButtonActive:active {
  top: 8px;
  right: 8px;
  width: 34px;
  height: 34px;
}

.repairButton:hover {
  box-shadow: 0 0 2px 2px rgba(0, 255, 253, 0.6);
  border: 1px solid rgba(0, 255, 253, 0.6);
}

.bodyThoriumWrapper {
  z-index: 2;
  position: absolute;
  left: 100px;
  top: 206px;
  border-radius: 5px;
  box-shadow: inset 0 0 2px rgb(255, 255, 255);
  border: 1px solid rgba(255, 255, 255, 0.36);
  padding: 1px;
}

#ConstructorBackGround .bodyThorium {
  background-color: rgba(76, 76, 76, 0.5);
  margin: 1px;
}

#ConstructorBackGround .bodyEquip, #ConstructorBackGround .bodyWeapon, #ConstructorBackGround .bodyAmmo {
  position: absolute;
  border-radius: 18px;
  z-index: 2;
}

#ConstructorBackGround .mining {
  background: rgba(255, 236, 14, 0.4);
}

#ConstructorBackGround .bodyWeapon {
  background: rgba(255, 58, 53, 0.71);
}

#ConstructorBackGround .bodyAmmo {
  border-radius: 10px;
}

.figure {
  position: absolute;
  height: 193px;
  width: 193px;
  background: rgba(86, 88, 88, 0.3);
  left: 24px;
  top: 141px;
  z-index: 1;
  border-radius: 200% 50% 200% 50%;
  transform: rotate(-103deg);
  box-shadow: inset 0 0 2px 0 rgb(245, 255, 255);
  border: 1px solid rgba(255, 255, 255, 0.25);
}

#powerIcon {
  background-image: url(https://img.icons8.com/plasticine/100/000000/charge-battery.png);
  background-size: cover;
  height: 40px;
  width: 55px;
  position: absolute;
  bottom: 22px;
  right: 6px;
  filter: drop-shadow(0px 0px 5px white);
}

#weaponIcon {
  background-image: url(https://img.icons8.com/ultraviolet/30/000000/gatling-gun.png);
  background-size: cover;
  height: 30px;
  width: 30px;
  position: absolute;
  top: 22px;
  left: 12px;
  filter: drop-shadow(0px 0px 0px white);
}

.weaponTypeNotAllow, .weaponTypeAllow {
  width: 7px;
  height: 7px;
  background: rgba(255, 0, 0, 0.64);
  float: left;
  border-radius: 4px;
  border: 1px solid black;
  margin: 1px 4px 0 6px;
}

.weaponTypeAllow {
  background: rgba(104, 255, 89, 0.64);
}
</style>
