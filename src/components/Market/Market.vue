<template>
  <div id="marketBox" ref="marketBox" @mousedown="toUp">
    <app-control v-bind:head="language === 'RU' ? 'Рынок:' : 'Market:'"
                 v-bind:move="true"
                 v-bind:close="true"
                 v-bind:refWindow="'marketBox'"
                 v-bind:resizeFunc="resize"
                 v-bind:minSize="{height: 280, width: 500}"/>

    <div id="leftBar">
      <div id="headMarket">
        <div id="balance">{{ language === 'RU' ? 'Мой баланс:' : 'My balance:' }} <span>{{ market.my_credits }}</span>
          cr.
        </div>
      </div>

      <app-filter/>
    </div>

    <div id="ordersBlock">

      <div class="marketTopMenu">
        <div v-bind:class="{active: !myOrder}" @click="switchOrders(false)">
          {{ language === 'RU' ? 'Рынок' : 'Market' }}
        </div>
        <div v-bind:class="{active: myOrder}" @click="switchOrders(true)">
          {{ language === 'RU' ? 'Мои запросы/предложения' : 'My requests / suggestions' }}
        </div>
      </div>

      <template v-if="!myOrder">

        <div id="selectItemIcon">
          <template v-if="filters.item">
            <app-background-item-cell v-bind:slotItem="getSlotIcon"/>
            <input @click="detail" type="button" value="ПОДРОБНО">
          </template>
        </div>

        <div id="selectItemName">
          <template v-if="filters.item">
            <span>{{ itemName }}</span>
            <span class="category">{{ handbook.categories[language][filters.selectType].name }}</span>
            <div class="marketButton" @click="newBuyOrder(getSlotIcon)" style="margin: 7px auto;">Купить</div>
          </template>
        </div>

        <div class="ordersHead" style="margin-top: 85px; display: block;">
          {{ language === 'RU' ? 'Предложения' : 'Offers' }}
        </div>
        <div id="sellOrdersBlock">
          <table class="ordersTable" id="marketSellTable">
            <tr>
              <th>{{ language === 'RU' ? 'Растояние' : 'Distance' }} <span class="sortArrow">⇕</span></th>
              <th>{{ language === 'RU' ? 'Кол-во' : 'Qty' }} <span class="sortArrow">⇕</span></th>
              <th>{{ language === 'RU' ? 'Цена' : 'Price' }} <span class="sortArrow">⇕</span></th>
              <th>{{ language === 'RU' ? 'Тип' : 'Type' }} <span class="sortArrow">⇕</span></th>
              <th>{{ language === 'RU' ? 'Название' : 'Name' }} <span class="sortArrow">⇕</span></th>
              <th>{{ language === 'RU' ? 'Место' : 'Place' }} <span class="sortArrow">⇕</span></th>
            </tr>

            <tr v-for="order in market.orders"
                v-if="order.Type === 'sell' && orderVisible(order)"
                v-bind:class="{my : market.my_orders.hasOwnProperty(order.Id)}"
                @click="buyFromOrder(order)"
                class="marketRow">

              <td v-if="order.path_jump === -1"><span class='basePath'>{{ language === 'RU' ? 'База' : 'Base' }}</span>
              </td>
              <td v-if="order.path_jump === 0">
                <span class='basePath'>{{ language === 'RU' ? 'Сектор' : 'Sector' }}</span>
              </td>
              <td v-if="order.path_jump > 0">{{ order.path_jump }}</td>

              <td>{{ order.Count }}</td>
              <td class="creditsTD">{{ order.Price }}</td>
              <td>{{ handbook.categories[language][order.TypeItem].name }}</td>
              <td>{{ getNameItemByOrder(order) }}</td>
              <td>{{ order.PlaceName }}</td>
            </tr>
          </table>
        </div>

        <div class="ordersHead">{{ language === 'RU' ? 'Запросы' : 'Requests' }}</div>
        <div id="BuyOrdersBlock">
          <table class="ordersTable" id="marketBuyTable">
            <tr>
              <th>{{ language === 'RU' ? 'Растояние' : 'Distance' }} <span class="sortArrow">⇕</span></th>
              <th>{{ language === 'RU' ? 'Кол-во' : 'Qty' }} <span class="sortArrow">⇕</span></th>
              <th>{{ language === 'RU' ? 'Цена' : 'Price' }} <span class="sortArrow">⇕</span></th>
              <th>{{ language === 'RU' ? 'Тип' : 'Type' }} <span class="sortArrow">⇕</span></th>
              <th>{{ language === 'RU' ? 'Название' : 'Name' }} <span class="sortArrow">⇕</span></th>
              <th>{{ language === 'RU' ? 'Место' : 'Place' }} <span class="sortArrow">⇕</span></th>
              <th>{{ language === 'RU' ? 'Мин. выкуп' : 'Min. redemption' }} <span class="sortArrow">⇕</span></th>
            </tr>

            <tr v-for="order in market.orders"
                v-if="order.Type === 'buy' && orderVisible(order)"
                v-bind:class="{my : market.my_orders.hasOwnProperty(order.Id)}"
                @click="sellInOrder(order)"
                class="marketRow">

              <td v-if="order.path_jump === -1"><span class='basePath'>{{ language === 'RU' ? 'База' : 'Base' }}</span>
              </td>
              <td v-if="order.path_jump === 0">
                <span class='basePath'>{{ language === 'RU' ? 'Сектор' : 'Sector' }}</span>
              </td>
              <td v-if="order.path_jump > 0">{{ order.path_jump }}</td>

              <td>{{ order.Count }}</td>
              <td class="creditsTD">{{ order.Price }}</td>
              <td>{{ handbook.categories[language][order.TypeItem].name }}</td>
              <td>{{ getNameItemByOrder(order) }}</td>
              <td>{{ order.PlaceName }}</td>
              <td>{{ order.MinBuyOut }}</td>
            </tr>
          </table>
        </div>
      </template>

      <div id="MyOrdersBlock" v-if="myOrder">
        <table class="ordersTable" id="marketMyTable">
          <tr>
            <th>{{ language === 'RU' ? 'Растояние' : 'Distance' }}<span class="sortArrow">&#x21D5;</span></th>
            <th>{{ language === 'RU' ? 'Кол-во' : 'Qty' }}<span class="sortArrow">&#x21D5;</span></th>
            <th>{{ language === 'RU' ? 'Цена' : 'Price' }}<span class="sortArrow">&#x21D5;</span></th>
            <th>{{ language === 'RU' ? 'Тип' : 'Type' }}<span class="sortArrow">&#x21D5;</span></th>
            <th>{{ language === 'RU' ? 'Название' : 'Name' }}<span class="sortArrow">&#x21D5;</span></th>
            <th>{{ language === 'RU' ? 'Место' : 'Place' }}<span class="sortArrow">&#x21D5;</span></th>
            <th>{{ language === 'RU' ? 'Мин. выкуп' : 'Min. redemption' }}<span class="sortArrow">&#x21D5;</span></th>
            <th>{{ language === 'RU' ? 'Тип сделки' : 'Transaction type' }}<span class="sortArrow">&#x21D5;</span></th>
            <th>{{ language === 'RU' ? 'Общая стоимость' : 'Total cost' }}<span class="sortArrow">&#x21D5;</span></th>
            <th/>
          </tr>

          <tr v-for="order in market.my_orders" class="marketRow myOrders">

            <td v-if="order.path_jump === -1">
              <span class='basePath'>{{ language === 'RU' ? 'База' : 'Base' }}</span>
            </td>
            <td v-if="order.path_jump === 0">
              <span class='basePath'>{{ language === 'RU' ? 'Сектор' : 'Sector' }}</span>
            </td>
            <td v-if="order.path_jump > 0">{{ order.path_jump }}</td>

            <td>{{ order.Count }}</td>
            <td class="creditsTD">{{ order.Price }}</td>
            <td>{{ handbook.categories[language][order.TypeItem].name }}</td>
            <td>{{ getNameItemByOrder(order) }}</td>
            <td>{{ order.PlaceName }}</td>
            <td>{{ order.MinBuyOut }}</td>

            <td>
              <span v-if="order.Type === 'sell'" style='color: #ffb300'>{{ order.Type }}</span>
              <span v-if="order.Type === 'buy'" style='color: #25ff00'>{{ order.Type }}</span>
            </td>

            <td>{{ order.Price * order.Count }}</td>
            <td><input class="button cancel order" type="button" value="Отменить" @click="cancelOrder(order.Id)"></td>
          </tr>
        </table>
      </div>
    </div>

    <template v-if="dialog.order">
      <div class="mask"/>
      <app-sell v-if="dialog.dialogType === 'sell'" v-bind:order="dialog.order"/>
      <app-buy v-if="dialog.dialogType === 'buy'" v-bind:order="dialog.order"/>
      <app-new-buy v-if="dialog.dialogType === 'new-buy'" v-bind:slotItem="dialog.order"/>
    </template>
  </div>
</template>

<script>
import Control from '../Window/Control';
import BackgroundItemCell from '../Inventory/BackgroundItemCell'
import Buy from "./Buy"
import NewBuy from "./NewBuy"
import Sell from "./Sell";
import Filter from "./Filter"

export default {
  name: "Market",
  data() {
    return {
      updater: null,
      myOrder: false,
      dialog: {
        dialogType: '', // sell, buy, newBuy
        order: null,
      },
    }
  },
  destroyed() {
    clearInterval(this.updater);
  },
  created() {
    let app = this;

    app.updater = setInterval(function () {
      app.$store.getters.getWSByService('market').socket.send(JSON.stringify({
        event: "openMarket",
      }));
    }, 1000);
  },
  methods: {
    getNameItemByOrder(order) {
      if (order.TypeItem === "blueprints") {
        if (order.Item.in_map) {
          return this.handbook['structure'][this.language][order.Item.name.split('_bp')[0]].name
        } else {
          return this.handbook[order.Item.item_type][this.language][order.Item.item_name].name
        }
      }

      return this.handbook[order.TypeItem][this.language][order.Item.name].name
    },
    sellInOrder(order) {

      if (this.market.my_orders.hasOwnProperty(order.Id)) {
        return;
      }

      this.dialog.dialogType = 'sell';
      this.dialog.order = order;
    },
    buyFromOrder(order) {

      if (this.market.my_orders.hasOwnProperty(order.Id)) {
        return;
      }

      this.dialog.dialogType = 'buy';
      this.dialog.order = order;
    },
    newBuyOrder(slot) {
      this.dialog.dialogType = 'new-buy';
      this.dialog.order = slot;
    },
    cancelOrder(id) {
      this.$store.getters.getWSByService('market').socket.send(JSON.stringify({
        event: "cancelOrder",
        order_id: Number(id)
      }));
    },
    switchOrders(myOrder) {
      let app = this;
      app.myOrder = myOrder;
      setTimeout(function () {
        app.resize(null, null, $(app.$el));
      }, 0);
    },
    toUp() {
      this.$store.commit({
        type: 'setWindowZIndex',
        id: this.$el.id,
      });
    },
    resize(event, ui, el) {
      el.find('#listItem').css("height", el.height() - 40);
      el.find('#ordersBlock').css("height", el.height() - 7);
      el.find('#sellOrdersBlock').css("height", el.height() / 2 - 74);
      el.find('#BuyOrdersBlock').css("height", el.height() / 2 - 74);
      el.find('#MyOrdersBlock').css("height", el.height() - 26);
      el.find('#ordersBlock').css("width", el.width() - 217);
      el.find('#sellOrdersBlock').css("width", el.width() - 221);
      el.find('#BuyOrdersBlock').css("width", el.width() - 221);
      el.find('#MyOrdersBlock').css("width", el.width() - 221);
      el.find('#selectItemIcon').css("width", 65);
      el.find('#selectItemIcon').css("height", 65);
    },
    detail() {
      if (this.getSlotIcon.item.hasOwnProperty('id')) {
        this.$store.commit({
          type: 'toggleWindow',
          id: 'detailItem' + this.getSlotIcon.type + this.getSlotIcon.item.id,
          component: 'detailItem',
          meta: {itemType: this.getSlotIcon.type, itemID: this.getSlotIcon.item.id},
          forceOpen: true,
        });
      } else {
        this.$store.commit({
          type: 'toggleWindow',
          id: 'detailItem' + this.getSlotIcon.type + this.getSlotIcon.item.type_id,
          component: 'detailItem',
          meta: {itemType: this.getSlotIcon.type, itemID: this.getSlotIcon.item.type_id},
          forceOpen: true,
        });
      }
    },
    orderVisible(order) {
      if (this.filters.selectType === '') return true;

      let filterType = this.filters[this.filters.selectType];

      if (this.filters.selectType === 'body' && order.TypeItem === 'body') {
        if ((filterType.size === order.Item.standard_size || filterType.size === 0) &&
          (filterType.id === order.Item.id || filterType.id === 0)) {
          return true
        }
      }

      if ((this.filters.selectType === 'weapon' && order.TypeItem === 'weapon') || (this.filters.selectType === 'ammo' && order.TypeItem === 'ammo')) {
        if ((filterType.size === order.Item.standard_size || filterType.size === 0) &&
          (filterType.id === order.Item.id || filterType.id === 0) &&
          (filterType.type === order.Item.type || filterType.type === '')) {
          return true
        }
      }

      if (this.filters.selectType === 'equip' && order.TypeItem === 'equip') {
        if ((filterType.size === order.Item.type_slot || filterType.size === 0) &&
          (filterType.id === order.Item.id || filterType.id === 0)) {
          return true
        }
      }

      if (this.filters.selectType === 'boxes' && order.TypeItem === 'boxes' || this.filters.selectType === 'trash' && order.TypeItem === 'trash') {
        return true
      }

      if ((this.filters.selectType === 'blueprints' && order.TypeItem === 'blueprints')) {
        if ((filterType.id === order.Item.id || filterType.id === 0) &&
          (filterType.type === order.Item.item_type || filterType.type === '' || filterType.type === 'map' && order.Item.in_map)) {
          return true
        }
      }

      if (this.filters.selectType === 'resource' && (order.TypeItem === 'resource' || order.TypeItem === 'recycle' || order.TypeItem === 'detail')) {
        if (filterType.type === '') {
          return true
        }
        if (filterType.type === 'resource' && order.TypeItem === 'resource') {
          return true
        }
        if (filterType.type === 'recycle' && order.TypeItem === 'recycle') {
          return true
        }
        if (filterType.type === 'detail' && order.TypeItem === 'detail') {
          return true
        }
      }

      return false
    }
  },
  computed: {
    filters() {
      return this.$store.getters.getMarketFilter
    },
    language() {
      return this.$store.getters.getSettings.Language
    },
    handbook() {
      return this.$store.getters.getHandBook
    },
    itemName() {
      if (this.filters.selectType === "blueprints") {
        return this.handbook[this.filters.item.item_type][this.language][this.filters.item.item_name].name
      }

      let filterType = this.filters[this.filters.selectType];
      try {
        return this.handbook[filterType.type][this.language][this.filters.item.name].name
      } catch (e) {
        return this.handbook[this.filters.selectType][this.language][this.filters.item.name].name
      }
    },
    market() {
      return this.$store.getters.getMarket
    },
    getSlotIcon() {
      let type = this.filters.selectType;

      if (this.filters.selectType === 'resource') {
        if (this.filters[this.filters.selectType].type === 'resource') type = 'resource';
        if (this.filters[this.filters.selectType].type === 'recycle') type = 'recycle';
        if (this.filters[this.filters.selectType].type === 'detail') type = 'detail';
      }

      return {type: type, item: this.filters.item}
    }
  },
  components: {
    AppControl: Control,
    AppBackgroundItemCell: BackgroundItemCell,
    AppSell: Sell,
    AppBuy: Buy,
    AppNewBuy: NewBuy,
    AppFilter: Filter,
  }
}
</script>

<style scoped>
#marketBox {
  position: absolute;
  top: 15px;
  left: 50%;
  border-radius: 5px;
  z-index: 11;
  padding-top: 15px;
  height: 400px;
  width: 860px;
  border: 1px solid #25a0e1;
  background: rgb(8, 138, 210);
  box-shadow: 0 0 2px black;
}

#ordersBlock {
  box-shadow: 0 0 2px rgba(0, 0, 0, 1);
  background: rgba(183, 195, 201, 0.29);
  border-radius: 2px;
  margin: 5px 2px 0 0;
  float: right;
  height: 390px;
  width: 640px;
}

#selectItemIcon {
  height: 65px;
  width: 65px;
  box-shadow: 0 0 2px rgba(0, 0, 0, 1);
  background: rgba(63, 70, 74, 0.5);
  margin-top: 5px;
  margin-left: 5px;
  border-radius: 2px;
  float: left;
  position: relative;
}

#selectItemName {
  color: rgba(255, 255, 255, 0.8);
  text-shadow: 0 0 4px black;
  min-width: 180px;
  margin: 7px 0 0 10px;
  float: left;
  text-align: left;
}

#selectItemName span {
  font-size: 10px;
  display: block;
  color: rgba(255, 255, 255, 0.8);
  text-shadow: 0 0 4px black;
  text-align: left;
  margin-top: 4px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  height: 13px;
}

#selectItemName .category {
  font-size: 8px;
  display: block;
  text-shadow: 0 0 4px black;
  text-align: left;
  text-indent: 6px;
  margin-top: 4px;
  color: #fff200;
}

#sellOrdersBlock, #BuyOrdersBlock, #MyOrdersBlock {
  margin: 0 0 5px 2px;
  overflow-y: scroll;
  border-radius: 2px;
  box-shadow: inset 0 0 5px black;
  background: #89969c;
  height: 112px;
  width: 630px;
}

#MyOrdersBlock {
  margin-top: 2px;
  height: 315px;
}

.ordersHead {
  width: 110px;
  border-radius: 5px 5px 0 0;
  margin-left: 10px;
  text-align: center;
  background: rgb(221, 112, 52);
  color: rgba(255, 255, 255, 0.8);
  font-size: 13px;
  line-height: 17px;
  height: 17px;
  user-select: none;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 1);
  font-weight: bold;
  box-shadow: 0 0 2px rgba(0, 0, 0, 1);
}

.marketRow {
  border-radius: 0;
}

.marketRow:hover {
  background: rgba(40, 227, 255, 0.37);
}

.marketRow td:first-child, .marketRow td:last-child {
  border-radius: 0;
}

.marketRow td {
  border-right: 1px solid rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  color: rgba(255, 255, 255, 0.8);
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
}

#BuyDialogButtonWrapper input[type=button] {
  position: static;
  margin: 6px 4px 0;
  width: 100px;
}

#leftBar {
  width: 200px;
  display: inline-block;
}

.headMarketHeading, #balance {
  text-align: center;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.85);
  margin-left: 5px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 1);
  min-width: 120px;
  max-width: 180px;
  border-radius: 4px;
  padding-left: 10px;
  color: #ff7800;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
}

.searchInput {
  border-radius: 3px;
  width: 180px;
  position: absolute;
  left: 5px;
  bottom: 3px;
}

#headMarket {
  border-radius: 4px;
  height: 20px;
  width: 200px;
  margin: 5px 5px 5px 2px;
  padding-top: 4px;
  position: relative;
}

#headMarket form {
  color: rgba(255, 255, 255, 0.65);
  margin-top: 5px;
  font-size: 12px;
  text-shadow: 0 0 5px rgba(0, 0, 0, 1);
  background: rgba(183, 195, 201, 0.29);
  box-shadow: 0 0 5px rgba(0, 0, 0, 1);
  min-width: 120px;
  max-width: 190px;
  border-radius: 4px;
  margin-left: 5px;
}

#headMarket form input {
  box-shadow: none;
}

#headMarket form h4 {
  margin: 0;
  padding: 0;
}

#balance {
  text-align: left;
  color: rgb(255, 255, 255);
  font-size: 15px;
  box-shadow: inset 0 0 2px black;
  height: 22px;
  line-height: 24px;
  background: #89969c;
}

#balance span {
  text-shadow: 0 0 5px rgba(0, 0, 0, 1);
  color: rgba(128, 255, 130, 0.85);
}

.marketButton {
  width: 80px;
  display: inline-block;
  text-align: center;
  transition: 100ms;
  background: rgba(255, 129, 0, 0.75);
  height: 20px;
  margin: 2px;
  border-radius: 5px;
  color: #fff;
  line-height: 20px;
  box-shadow: 0 0 2px #000;
}

.marketButton:hover {
  background: rgba(255, 129, 0, 1);
}

.marketButton:active {
  transform: scale(0.98);
}

.marketTopMenu {
  height: 15px;
  width: calc(100%);
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px 3px 0 0;
  overflow: hidden;
}

.marketTopMenu div {
  height: 15px;
  float: left;
  font-size: 9px;
  font-weight: 900;
  line-height: 15px;
  border-right: 1px solid rgba(191, 191, 191, 0.43);
  padding: 0 3px;
  color: #bfbfbf;
  text-shadow: 1px 1px black;
  cursor: pointer;
  transition: 200ms;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.marketTopMenu div:last-child {
  /*border: 0;*/
}

.marketTopMenu .active {
  color: #fff200 !important;
  background: rgb(187, 93, 42) !important;
}

.marketTopMenu div:hover {
  color: #fff200 !important;
}

.activePin {
  border-bottom: 0 !important;
  box-shadow: none !important;
}

.ordersTable {
  width: 100%;
  margin: auto;
  border-spacing: 0;
}

.ordersTable tr:first-child {
  box-shadow: 0 0 5px rgba(0, 0, 0, 1);
}

.ordersTable tr:first-child th {
  background: #216a8e;
  color: rgba(255, 255, 255, 0.8);
  font-size: 8px;
  user-select: none;
  margin: 2px auto;
  position: sticky;
  top: 0;
  padding-top: 2px;
}

.ordersTable tr {
  text-align: center;
}

.ordersTable td {
  font-size: 8px;
}

#marketBuyTable td {
  width: 12%;
}

#marketSellTable td {
  width: 14%;
}

#MyOrdersBlock td {
  width: 9%;
}

.button.cancel.order {
  outline: none;
  border: transparent;
  border-radius: 0;
  padding: 2px 10px 2px;
  z-index: 11;
}

.creditsTD:after {
  content: " cr.";
  color: rgba(128, 255, 130, 0.85);
}

.sortArrow {
  float: right;
  font-size: 10px;
  font-weight: 100;
  line-height: 8px;
}

.basePath {
  margin-left: -10px;
  color: rgba(255, 255, 255, 0.8);
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
}

#selectItemIcon input {
  position: absolute;
  bottom: 0;
  font-size: 10px;
  left: -1px;
  height: 16px;
  line-height: 15px;
  opacity: 0.5;
}

#selectItemIcon input:hover {
  opacity: 1;
}

#selectItemIcon input:active {
  transform: scale(0.96);
}

.marketRow.my {
  background: rgb(28, 109, 179);
}
</style>

<style>
#subMenu {
  min-height: 20px;
  min-width: 80px;
  position: absolute;
  display: inline-block;
  background-size: 100% 2px;
  background-image: linear-gradient(0deg, rgba(7, 41, 60, 0.8), rgba(0, 62, 95, 0.8));
  border: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: 5px;
  padding: 5px;
  z-index: 950;
  color: bisque;
  font-size: 12px;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
}

#subMenu h2 {
  display: block;
  width: 100%;
  height: 17px;
  margin: 0 auto 5px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 1);
  font-size: 15px;
  font-weight: 100;
  float: left;
  color: yellow;
  background: rgba(255, 255, 255, 0.3);
}

#subMenu form {
  text-align: left;
  width: 235px;
  margin-top: 10px;
}

#subMenu form div {
  float: left;
  width: 100%;
}

#subMenu form:after {
  content: '';
  clear: both;
  display: block;
}

#subMenu span, #subMenu input[type=number] {
  min-width: 60px;
  line-height: 22px;
  position: relative;
}

#subMenu input[type=number] {
  text-align: center;
}

#subMenu output, #subMenu .holdInput {
  width: 60px;
  margin-right: 8px;
  line-height: 22px;
  padding-left: 5px;
  padding-right: 5px;
  text-align: center;
  background: #79a0b4;
  box-shadow: inset 0 0 2px black;
  border-radius: 5px;
  color: lime;
  position: relative;
}

#subMenu output:after, #subMenu .holdInput.cr:after, #subMenu .holdInput.count:after {
  content: 'cr.';
  text-align: right;
  color: #7e919a;
  position: absolute;
  right: 3px;
}

#subMenu .holdInput.count:after {
  content: 'шт.';
}

#subMenu input[type=number] {
  margin-right: 8px;
}

#subMenu input[type=button] {
  position: static;
  margin: 15px 7% 0;
  width: 100px;
}

#subMenu div {
  text-align: left;
}

#subMenu .marketDialogItemIcon {
  clear: both;
  width: 90px;
  position: relative;
  float: left;
  margin-right: 10px;
  height: 75px;
}

.mask {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 5px;
}
</style>
