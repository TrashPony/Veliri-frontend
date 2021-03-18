<template>
  <div id="FractionMarket" ref="FractionMarket" @mousedown="toUp">
    <app-control v-bind:head="language === 'RU' ? 'Фракционный магазин:' : 'Faction Store:'"
                 v-bind:move="true"
                 v-bind:close="true"
                 v-bind:refWindow="'FractionMarket'"
                 v-bind:resizeFunc="resize"
                 v-bind:minSize="{height: 150, width: 300}"/>

    <div class="head">

      <h3 style="line-height: 18px;" class="head_title">Фракционный магазин
        {{ baseStatus.fraction !== '' ? baseStatus.fraction : '-' }}</h3>

      <div class="fractionLogo" v-if="baseStatus.fraction !== ''"
           :style="{backgroundImage: 'url(' + require('../../assets/' + getLogo(baseStatus.fraction))+')'}"/>

      <span class="user_fraction_point">Кол-во очков фракции: <span
        class="importantly">{{ fractionStoreState.user_fraction_points }} оф.</span></span>
    </div>

    <div class="assortment">
      <table class="assortment_table">
        <tr>
          <th style="width: 60px">Предмет</th>
          <th>Кол-во</th>
          <th>Стоимость (оф)</th>
          <th></th>
        </tr>

        <tr v-for="point in fractionStoreState.assortment" v-if="getItems(point) && items[point.id]">
          <td>
            <app-item-cell v-bind:itemSlot="items[point.id]" v-bind:size="45"/>
          </td>
          <td><span class="importantly" style="color: white">{{ point.count }}</span></td>
          <td><span class="importantly">{{ point.points }}</span></td>
          <td><input class="buyButton" type="button" value="Купить" @click="dialogItem = point"/></td>
        </tr>
      </table>
    </div>

    <div class="mask" v-if="dialogItem"/>
    <div class="dialog" v-if="dialogItem">

      <div class="dialogText">
        <app-item-cell v-bind:itemSlot="items[dialogItem.id]" v-bind:size="50"/>
        <span class="importantly" style="color: white; font-size: 12px; margin-top: 5px">
          Приобрести {{ items[dialogItem.id].name }} за <br>
          <span class="importantly">{{ dialogItem.points }} оф. </span> ?
        </span>
      </div>

      <input class="buyButton" type="button" value="Отмена" @click="dialogItem = null"/>
      <input class="buyButton" type="button" value="Купить" @click="buy(dialogItem.id)"/>
    </div>
  </div>
</template>

<script>
import Control from '../Window/Control';
import ItemCell from "../Inventory/ItemCell"
import urls from "../../const";

export default {
  name: "FractionMarket",
  data() {
    return {
      items: {},
      requestItems: {},
      dialogItem: null,
    }
  },
  mounted() {
    this.$store.getters.getWSByService('lobby').socket.send(JSON.stringify({
      event: "GetAssortmentFractionStore"
    }));
  },
  methods: {
    toUp() {
      this.$store.commit({
        type: 'setWindowZIndex',
        id: this.$el.id,
      });
    },
    resize(event, ui, el) {

    },
    getLogo(fraction) {
      return `logo/${fraction}.png`
    },
    getItems(option) {
      let app = this;

      if (app.requestItems[option.id]) return true;
      app.requestItems[option.id] = true

      app.$api.get(urls.itemURL + '?id=' + option.item_id + "&type=" + option.item_type + "&method=item").then(function (response) {
        response.data.quantity = option.count;
        app.$set(app.items, option.id, response.data)
      }).catch(function (err) {
        //console.log(err)
      });

      return true;
    },
    buy(id) {
      this.$store.getters.getWSByService('lobby').socket.send(JSON.stringify({
        event: "FractionStoreBuy",
        id: id,
      }));
      this.dialogItem = null;
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
    baseStatus() {
      return this.$store.getters.getBaseStatus
    },
    fractionStoreState() {
      return this.$store.getters.getFractionStoreState
    }
  },
  components: {
    AppItemCell: ItemCell,
    AppControl: Control,
  }
}
</script>

<style scoped>
#FractionMarket {
  position: absolute;
  top: 35%;
  left: calc(50% - 170px);
  z-index: 11;
  width: 345px;
  height: 226px;
  border: 1px solid #25a0e1;
  background: rgb(8, 138, 210);
  padding: 20px 3px 3px 3px;
  border-radius: 4px;
  box-shadow: 0 0 2px black;
}

.head {
  line-height: 8px;
  background: rgba(77, 77, 84, 0.3);
  width: 100%;
  height: 52px;
  border-radius: 5px;
  color: white;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  margin-bottom: 5px;
  font-size: 11px;
  text-align: left;

}

.fractionLogo {
  height: 28px;
  width: 28px;
  float: left;
  margin: -1px 5px 5px -1px;
  background-size: cover;
  background-color: rgba(6, 110, 168, 0.2);
  border-radius: 5px;
  border: 1px solid rgba(6, 110, 168, 0.3);
  box-shadow: inset 0 0 2px black;
}

.head_title {
  margin: 0 0 7px 0;
  background: rgb(221, 112, 52);
  color: rgba(255, 255, 255, 0.8);
  border-radius: 4px;
  font-size: 13px;
  line-height: 17px;
  height: 17px;
  user-select: none;
  text-shadow: 1px 1px 1px rgb(0 0 0);
  font-weight: bold;
  box-shadow: 0 0 2px rgb(0 0 0);
  padding-left: 10px;
}

.user_fraction_point {
  display: block;
  margin-top: 8px;
  font-size: 9px;
}

.assortment {
  background: #89969c;
  float: left;
  overflow-y: scroll;
  overflow-x: hidden;
  box-shadow: inset 0 0 2px black;
  width: 100%;
  height: calc(100% - 57px);
}

.assortment_table {
  width: 100%;
  margin: auto;
  border-spacing: 0;
}

.assortment_table tr:first-child {
  box-shadow: 0 0 5px rgb(0 0 0);
}

.assortment_table tr {
  text-align: center;
}

.assortment_table tr:first-child th {
  background: #216a8e;
  color: rgba(255, 255, 255, 0.8);
  font-size: 8px;
  user-select: none;
  margin: 2px auto;
  position: sticky;
  top: 0;
  padding-top: 2px;
  z-index: 2;
}

.assortment_table td {
  border-right: 1px solid rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
}

.buyButton, .dialogButton {
  display: block;
  width: 100%;
  margin: 2px auto 0;
  pointer-events: auto;
  font-size: 9px;
  text-align: center;
  transition: 100ms;
  background: rgba(255, 129, 0, 0.6);
  height: 16px;
  border-radius: 5px;
  color: #fff;
  line-height: 15px;
  box-shadow: 0 0 2px #000;
}

.buyButton:hover, .dialogButton:hover {
  background: rgba(255, 129, 0, 1);
}

.buyButton:active, .dialogButton:active {
  transform: scale(0.98);
}

.dialog {
  position: absolute;
  left: calc(50% - 100px);
  top: 20%;
  height: 99px;
  width: 200px;
  border: 1px solid #25a0e1;
  background: rgb(8, 138, 210);
  padding: 3px;
  border-radius: 4px;
  box-shadow: 0 0 2px black;
  z-index: 10;
}

.dialogText {
  background: #89969c;
  border-radius: 5px;
  padding: 3px;
  width: calc(100% - 10px);
  height: 58px;
  box-shadow: inset 0 0 2px;
}

.mask {
  position: absolute;
  z-index: 1 !important;
  background-color: rgba(0, 0, 0, 0.7);
  height: calc(100% + 2px);
  width: calc(100% + 2px);
  top: -1px;
  left: -1px;
}

</style>
