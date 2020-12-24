<template>
  <div id="subMenu" ref="subMenu">

    <app-control v-bind:head="language === 'RU' ? 'Покупка: ' : 'Purchase: ' + slotItem.item.name"
                 v-bind:refWindow="'subMenu'" v-bind:noPos="true"
                 v-bind:noHeight="true" v-bind:noWidth="true"/>

    <div class="marketDialogItemIcon">
      <app-background-item-cell v-bind:slotItem="slotItem"/>
    </div>

    <div class="wrapper">
      <div><input v-model="count" type="number" min="1" max="99999999">
        <span>{{ language === 'RU' ? 'штук' : 'pieces' }}</span>
      </div>
      <div><input v-model="credits" type="number" min="1" max="99999999">
        <span>{{ language === 'RU' ? 'кредитов' : 'credits' }}</span>
      </div>
      <div><input v-model="min" type="number" min="1" max="99999999">
        <span>{{ language === 'RU' ? 'мин. выкуп' : 'min. redemption' }}</span>
      </div>

      <div style="text-align: left;margin-top: 10px;">
        <span>{{ count }} {{ language === 'RU' ? 'шт.' : 'pieces' }}</span>
        {{ language === 'RU' ? 'за' : 'behind' }}
        <span class="holdInput cr" style="padding-right: 20px;"> {{ count * credits }} </span>
      </div>
    </div>

    <div id="BuyDialogButtonWrapper">
      <input type="button" class="lobbyButton inventoryTip" @click="buy"
             :value="language === 'RU' ? 'Разместить заказ' : 'Place an order'">
      <input type="button" class="lobbyButton inventoryTip" @click="back"
             :value="language === 'RU' ? 'Отменить' : 'Cancel'">
    </div>
  </div>
</template>

<script>
import Control from "../Window/Control"
import BackgroundItemCell from '../Inventory/BackgroundItemCell'

export default {
  name: "NewBuy",
  props: ['slotItem'],
  data() {
    return {
      count: 1,
      credits: 1,
      min: 1,
    }
  },
  methods: {
    back() {
      this.$parent.dialog.order = null;
    },
    buy() {

      let id = 0;
      if (this.$props.slotItem.item.hasOwnProperty('id')) {
        id = this.$props.slotItem.item.id
      } else {
        id = this.$props.slotItem.item.type_id
      }

      this.$store.getters.getWSByService('market').socket.send(JSON.stringify({
        event: 'placeNewBuyOrder',
        item_id: Number(id),
        item_type: this.$props.slotItem.type,
        price: Number(this.credits),
        quantity: Number(this.count),
        expires: Number(14),
        min_buy_out: Number(this.min),
      }));
      this.back()
    }
  },
  computed: {
    language() {
      return this.$store.getters.getSettings.Language
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
  width: 285px;
  z-index: 10;
  border: 1px solid #25a0e1;
  background: rgb(8, 138, 210);
  box-shadow: 0 0 2px black;
  padding: 20px 0 0 0;
  height: 147px;
}

#subMenu input[type="button"] {
  margin: 15px 20px 0;
}

.wrapper {
  float: left;
  width: 185px;
}

.wrapper > div {
  width: 235px;
  float: left;
  margin-top: 2px;
}
</style>
