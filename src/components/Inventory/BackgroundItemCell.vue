<template>
  <div class="itemIconInventoryCell"
       v-if="background !== ''"
       @mouseover="showName"
       @mouseleave="hideName"
       :style="{ backgroundImage: 'url(' + background + ')', opacity: opacity ? opacity : 1 }"
       ref="back">

    <div v-if="subBackground && subBackground !== ''"
         class="itemIconInventoryCell"
         :style="{ backgroundImage: 'url(' + require('../../assets/' + subBackground) + ')' }"/>

  </div>
</template>

<script>
export default {
  name: "BackgroundItemCell",
  props: ['slotItem', 'noShowName', 'opacity', 'textFine'],
  data() {
    return {}
  },
  computed: {
    language() {
      return this.$store.getters.getSettings.Language
    },
    handbook() {
      return this.$store.getters.getHandBook
    },
    background() {
      let slot = this.$props.slotItem;

      let back = '';
      try {
        back = require('../../assets/' + this.getBackGround(slot))
      } catch (e) {
        //console.log(e)
      }

      return back;
    },
    subBackground() {
      let slot = this.$props.slotItem;
      if (slot.type === "blueprints" && slot.item) {
        if (slot.item.in_map) {

          let user = this.$store.getters.getUser;

          let name = slot.item.name.split('_bp')[0] + "_" + user.fraction;
          name = name.replace('mp_', '');
          name = name.replace('map_', '');

          return this.getBackGround({type: 'structure', item: {name: name}}, 'subBackground')
        } else {
          return this.getBackGround({type: slot.item.item_type, item: {name: slot.item.item_name}}, 'subBackground')
        }
      }
    }
  },
  methods: {
    getBackGround(slot) {

      if (slot.type === '' || !slot.item || slot.item.name === '') {
        return "indexImg/cube.png";
      }

      if (slot.type === "resource" || slot.type === "recycle") {
        return "resource/" + slot.item.name + ".png";
      } else if (slot.type === "boxes") {
        return slot.type + "/icons/" + slot.item.name + ".png";
      } else if (slot.type === "detail") {
        return "resource/detail/" + slot.item.name + ".png";
      } else if (slot.type === "blueprints") {
        return "blueprints/" + slot.item.icon + ".png";
      } else if (slot.type === "body") {
        return "units/" + slot.type + "/icons/" + slot.item.name + ".png";
      } else if (slot.type === "equip") {
        return "units/" + slot.type + "/icon/" + slot.item.name + ".png";
      } else if (slot.type === "trash") {
        return "trashItems/" + slot.item.name + ".png";
      } else if (slot.type === "ammo") {
        return "units/" + slot.type + "/" + slot.item.name + ".png";
      } else if (slot.type === "weapon") {
        return "units/weapon/icons/" + slot.item.name + ".png";
      } else if (slot.type === "structure") {
        return `map/structures/icon/${slot.item.name}.png`;
      }
    },
    showName() {

      if (this.$props.noShowName) return;

      let el = this.$refs.back;
      let slot = this.$props.slotItem;

      let name = ''
      if (slot.type === "blueprints") {
        if (slot.item.in_map) {
          name = this.handbook['structure'][this.language][slot.item.name.split('_bp')[0]].name
        } else {
          name = this.handbook[slot.item.item_type][this.language][slot.item.item_name].name
        }
      } else {
        name = this.handbook[slot.type][this.language][slot.item.name].name
      }
      // это конечно не про вьюшному, но жить ваще не справедлива
      $('body').append(
        `<div class="nameItemInCell" style="left: ${el.getBoundingClientRect().left - 10}px; top: ${el.getBoundingClientRect().top - 35}px">
            ${name}
            ${this.$props.textFine ? `<span class="itemInCellFine">${this.$props.textFine}</span>` : ``}
           </div>`
      );
    },
    hideName() {
      $('.nameItemInCell').remove();
    }
  }
}
</script>

<style scoped>
.itemIconInventoryCell {
  background-size: contain;
  background-repeat: no-repeat;
  position: absolute;
  height: 100%;
  width: 100%;
  /*filter: drop-shadow(0 0 2px white);*/
  z-index: 0;
  background-position: center;
  top: 0;
  left: 0;
}

.itemIconInventoryCell .itemIconInventoryCell {
  background-size: 85%;
  filter: drop-shadow(0 0 2px black);
  opacity: 0.8;
}
</style>

<style>
.nameItemInCell {
  position: fixed;
  top: -20px;
  left: 0;
  background-size: 100% 2px;
  background-image: linear-gradient(0deg, rgba(7, 41, 60, 0.8), rgba(0, 62, 95, 0.8));
  border: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: 5px;
  min-height: 10px;
  min-width: 40px;
  padding: 5px;
  z-index: 950;
  text-shadow: 1px 1px 2px black, 0 0 1em #696969; /* Параметры тени */
  color: yellow;
  font-size: 11px;
}

.itemInCellFine {
  display: block;
  color: white;
  font-size: 12px;
}
</style>
