<template>
  <div id="subMenu" ref="subMenu">

    <app-control v-bind:head="language === 'RU' ? 'Продажа: ' : 'Sale: ' + order.Item.name"
                 v-bind:refWindow="'subMenu'" v-bind:noPos="true"
                 v-bind:noHeight="true" v-bind:noWidth="true"/>

    <div class="marketDialogItemIcon">
      <app-background-item-cell v-bind:slotItem="{type: order.TypeItem, item: order.Item}"/>
    </div>

    <div class="wrapper">
      <div>
        <span style="float: left"> {{ language === 'RU' ? 'Имеется на складе' : 'Available in storage' }} </span>
        <span class="holdInput count" id="sellCountInStorage"
              style="float: right">{{ market.count_items[order.Id] }}</span>
      </div>

      <div>
        <span style="float: left"> {{ language === 'RU' ? 'Цена за шт.' : 'Price per piece' }}</span>
        <span class="holdInput cr" style="float: right">{{ order.Price }}</span>
      </div>

      <div>
        <span style="float: left"> {{ language === 'RU' ? 'Продать' : 'Sell count' }} </span>
        <input v-model="quantity" id="buyCount" style="float: right" type="number" min="1" :max="order.Count">
      </div>

      <div>
        <span style="float: left"> {{ language === 'RU' ? 'Всего кредитов' : 'Total credits' }} </span>
        <output style="float: right">{{ order.Price * quantity }}</output>
      </div>

      <input type="button" class="lobbyButton inventoryTip" @click="back"
             :value="language === 'RU' ? 'Отменить' : 'Cancel'">
      <input type="button" class="lobbyButton inventoryTip" @click="sell"
             :value="language === 'RU' ? 'Продать' : 'Sell'">
    </div>
  </div>
</template>

<script>
import Control from "../Window/Control"
import BackgroundItemCell from '../Inventory/BackgroundItemCell'

export default {
  name: "Sell",
  props: ['order'],
  data() {
    return {
      quantity: 1
    }
  },
  created() {
    if (this.$props.order.Item.hasOwnProperty('id')) {
      this.$store.getters.getWSByService('market').socket.send(JSON.stringify({
        event: 'getItemsInStorage',
        item_id: Number(this.$props.order.Item.id),
        item_type: this.$props.order.TypeItem,
        order_id: Number(this.$props.order.Id),
      }));
    } else {
      this.$store.getters.getWSByService('market').socket.send(JSON.stringify({
        event: 'getItemsInStorage',
        item_id: Number(this.$props.order.Item.type_id),
        item_type: this.$props.order.TypeItem,
        order_id: Number(this.$props.order.Id),
      }));
    }
  },
  methods: {
    back() {
      this.$parent.dialog.order = null;
    },
    sell() {
      this.$store.getters.getWSByService('market').socket.send(JSON.stringify({
        event: 'sell',
        order_id: Number(this.$props.order.Id),
        quantity: Number(this.quantity),
      }));
      this.back();
    }
  },
  computed: {
    language() {
      return this.$store.getters.getSettings.Language
    },
    market() {
      return this.$store.getters.getMarket
    },
  },
  components: {
    AppControl: Control,
    AppBackgroundItemCell: BackgroundItemCell,
  }
}
</script>

<style scoped>
#subMenu {
  top: 20%;
  left: calc(50% - 165px);
  width: 335px;
  z-index: 10;
  border: 1px solid #25a0e1;
  background: rgb(8, 138, 210);
  box-shadow: 0 0 2px black;
  padding: 20px 0 0 0;
  height: 140px;
}

#subMenu input[type="button"] {
  margin: 15px 2px 0;
}

.wrapper {
  float: left;
  width: 230px;
}

.wrapper > div {
  width: 235px;
  float: left;
  margin-top: 2px;
}
</style>
