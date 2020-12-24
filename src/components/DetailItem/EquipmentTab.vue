<template>
  <table v-if="type === 'body'">
    <tr>
      <td colspan="2" style="text-align: left;color: black;text-shadow: none;">Стандарт оружия</td>
    </tr>
    <tr>
      <td colspan="2">
        <div class="weapon_standard_size"
             :style="{background: [item.standard_size_small ? `green` : `#a81717`]}">
          Легкое
        </div>
        <div class="weapon_standard_size"
             :style="{background: [item.standard_size_medium ? `green` : `#a81717`]}">
          Среднее
        </div>
        <div class="weapon_standard_size"
             :style="{background: [item.standard_size_big ? `green` : `#a81717`]}">
          Тяжелое
        </div>
      </td>
    </tr>
    <tr>
      <td colspan="2" style="text-align: left;color: black;text-shadow: none;">Ячейки для топлива</td>
    </tr>
    <tr>
      <td>
        <div class="UIThoriumSlot" v-for="slot in thorium_slots">

          <app-background-item-cell v-bind:slotItem="{type: 'recycle', item: {name: 'enriched_thorium'}}"/>

          <div class="UIThoriumSlotCount" title="Емкость ячейки">
            <div style="background-image: url('https://img.icons8.com/cotton/32/000000/petrol--v1.png')"></div>
            <span>{{ slot.max_count }}</span>
          </div>

          <div class="UIThoriumSlotCount" style="clear: both" title="Количество отработки">
            <div style="background-image: url('https://img.icons8.com/offices/80/000000/recycling.png')"></div>
            <span> {{ slot.processing_thorium }}</span>
          </div>

        </div>
      </td>
    </tr>
    <tr>
      <td>Разьемы большой мощьности</td>
      <td>{{ countEquipSlots.b }}</td>
    </tr>
    <tr>
      <td>Разьемы средней мощьности</td>
      <td>{{ countEquipSlots.m }}</td>
    </tr>
    <tr>
      <td>Разьемы малой мощьности</td>
      <td>{{ countEquipSlots.s }}</td>
    </tr>
  </table>
</template>

<script>
import BackgroundItemCell from '../Inventory/BackgroundItemCell'
import urls from '../../const';

export default {
  name: "EquipmentTab",
  props: ['type', 'item'],
  data() {
    return {
      equip_slots: [],
      weapon_slots: [],
      thorium_slots: [],
    }
  },
  created() {
    let app = this;
    app.$api.get(urls.bodySlotsInfo + '?id=' + app.$props.item.id).then(function (response) {

      for (let i in response.data.equips) {
        response.data.equips[i] = JSON.parse(response.data.equips[i])
      }

      for (let i in response.data.weapons) {
        response.data.weapons[i] = JSON.parse(response.data.weapons[i])
      }

      for (let i in response.data.thorium) {
        response.data.thorium[i] = JSON.parse(response.data.thorium[i])
      }

      app.equip_slots = response.data.equips;
      app.weapon_slots = response.data.weapons;
      app.thorium_slots = response.data.thorium;
    }).catch(function (err) {
      console.log(err)
    });
  },
  computed: {
    countEquipSlots() {
      let s = 0;
      let m = 0;
      let b = 0;

      for (let equipSlot of this.equip_slots) {
        if (equipSlot.type_slot === 1) s++;
        if (equipSlot.type_slot === 1) m++;
        if (equipSlot.type_slot === 1) b++;
      }

      return {s: s, m: m, b: b}
    }
  },
  components: {
    AppBackgroundItemCell: BackgroundItemCell,
  }
}
</script>

<style scoped>
.detailItemInfoBody table {
  font-size: 11px;
  width: 100%;
  border-collapse: collapse;
}

.detailItemInfoBody tr {
  transition: 200ms;
}

.detailItemInfoBody tr td {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.detailItemInfoBody tr td:last-child {
  color: #ffef0f;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
  text-align: right;
}

.vul {
  width: calc(33% - 3px);
  height: 20px;
  float: left;
  background: rgba(122, 127, 122, 0.4);
  margin-left: 3px;
  box-shadow: inset 0 0 2px black;
  position: relative;
}

.vul div {
  height: 100%;
  box-shadow: inset 0 0 2px 1px black;
}

.vul span {
  position: absolute;
  top: calc(50% - 6px);
  left: calc(50% - 6px);
  color: white;
}

.detailItemInfoBody tr:hover {
  background: rgba(179, 179, 179, 0.5);
}

.weapon_standard_size {
  width: calc(33% - 3px);
  height: 20px;
  float: left;
  background: rgba(122, 127, 122, 0.4);
  margin-left: 3px;
  box-shadow: inset 0 0 2px black;
  position: relative;
  color: white;
  text-align: center;
  line-height: 21px;
}

.UIThoriumSlot {
  width: 50px;
  height: 50px;
  float: left;
  background: rgba(75, 64, 76, 0.4);
  margin: 3px;
  box-shadow: inset 0 0 2px black;
  position: relative;
  text-align: center;
}

.UIThoriumSlot .itemIconInventoryCell {
  opacity: 0.3;
  pointer-events: none;
  z-index: 0;
}

.UIThoriumSlotCount {
  margin-left: 2px;
}

.UIThoriumSlotCount div {
  height: 25px;
  width: 25px;
  background-position: center;
  background-size: contain;
  background-color: rgba(0, 0, 0, 0.1);
  float: left;
  filter: drop-shadow(0 0 2px rgba(0, 0, 0));
}

.UIThoriumSlot span {
  position: relative;
  z-index: 1;
  line-height: 25px;
}
</style>
