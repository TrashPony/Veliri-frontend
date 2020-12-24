<template>
  <div class="msIconWrapper"
       @mouseover="setFindBodyFilter()"
       @mouseout="removeFindFilter()">

    <div id="MSIcon"
         v-if="inventory.unit && inventory.unit.body"
         :style="{ backgroundImage: 'url(' + require('../../assets/' + bodyBackground) + ')' }">

      <div class="weaponIcon"
           v-if="weaponBackground"
           :style="{ backgroundImage: 'url(' + require('../../assets/' + weaponBackground.back) + ')',
              left: weaponBackground.left, top: weaponBackground.top}"/>

      <div class="equipSprites"
           v-for="slot in inventory.unit.equip_slots"
           v-if="equipBackground(slot)"
           :style="{ backgroundImage: 'url(' + require('../../assets/' + equipBackground(slot).back) + ')',
              left: equipBackground(slot).left, top: equipBackground(slot).top}"/>
      
    </div>
  </div>
</template>

<script>
  export default {
    name: "ViewMS",
    mounted() {
      let app = this;
      $(app.$el).droppable({
        drop: function (event, ui) {

          $('.ui-selected').removeClass('ui-selected');
          let draggable = ui.draggable;
          let slotData = draggable.data("slotData");

          if (slotData && slotData.data && slotData.data.type === "body") {
            app.$store.getters.getWSByService('inventory').socket.send(JSON.stringify({
              event: "SetMotherShipBody",
              id_body: Number(slotData.data.item.id),
              inventory_slot: Number(slotData.number),
              source: slotData.parent,
            }));
          }
        }
      });
    },
    methods: {
      setFindBodyFilter() {
        this.$store.commit({
          type: 'setFindFilter',
          filters: {
            type: 'body',
          }
        });
      },
      removeFindFilter() {
        this.$store.commit({
          type: 'setFindFilter',
          filters: null
        });
      },
      equipBackground(slot) {
        if (slot && slot.equip && (slot.equip.x_attach > 0 || slot.equip.y_attach > 0)) {
          return {
            back: "units/equip/" + slot.equip.name + ".png",
            top: (slot.y_attach - slot.equip.y_attach) / 2 + "px",
            left: (slot.x_attach - slot.equip.x_attach) / 2 + "px",
          }
        }
      },
    },
    computed: {
      inventory() {
        return this.$store.getters.getInventory
      },
      bodyBackground() {
        return "units/body/icons/" + this.inventory.unit.body.name + ".png";
      },
      weaponBackground() {
        for (let slot in this.inventory.unit.weapon_slots) {
          let wSlot = this.inventory.unit.weapon_slots[slot]
          if (wSlot.weapon) {
            return {
              top: (wSlot.y_attach - wSlot.weapon.y_attach) / 2 + "px",
              left: (wSlot.x_attach - wSlot.weapon.x_attach) / 2 + "px",
              back: "units/weapon/" + wSlot.weapon.name + "/skins/" + wSlot.weapon.name + "_skin_1.png"
            };
          }
        }
      },
    }
  }
</script>

<style scoped>
  .equipSprites {
    height: 100%;
    width: 100%;
    background-size: 128px;
    position: absolute;
    background-repeat: no-repeat;
    background-position: center;
    pointer-events: none;
  }

  .msIconWrapper {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    border: 1px solid rgba(149, 149, 149, 0.25);
    background-color: rgba(64, 49, 31, 0.75);
    overflow: hidden;
    box-shadow: inset 0 0 7px 2px black;
    z-index: 2;
    position: absolute;
    left: calc(50% - 102px);
    top: calc(50% - 102px);
  }

  #MSIcon {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 1px solid rgba(149, 149, 149, 0.25);
    background-repeat: no-repeat;
    background-size: 128px;
    background-position: center;
    position: absolute;
    left: calc(50% - 102px);
    top: calc(50% - 102px);
    box-shadow: inset 0 0 7px 2px black;
    z-index: 2;
  }

  .weaponIcon {
    height: 100%;
    width: 100%;
    background-size: 128px;
    position: absolute;
    background-repeat: no-repeat;
    z-index: 900;
    background-position: center;
    pointer-events: none;
  }

</style>
