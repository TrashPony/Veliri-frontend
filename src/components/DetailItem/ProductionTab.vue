<template>
  <div>
    <div class="detailItemBpBlock" v-if="type === 'blueprints'">

      <template v-if="completeProductions">
        <h4>Продукция</h4>
        <div class="detailItemBpBlockRow">
          <div class="detailItemBpBlockIcon">
            <app-background-item-cell v-bind:slotItem="completeProductions"/>
          </div>
          <div class="detailItemBpBlockName">{{ completeProductions.item.name }}</div>
          <div class="detailItemBpBlockDetailButton" @click="openDetail(completeProductions)">i</div>
        </div>
      </template>

      <template v-if="needResource">
        <h4>Требуемые ресурсы</h4>
        <div class="detailItemBpBlockRow" v-for="resource in needResource">
          <div class="detailItemBpBlockIcon">
            <app-background-item-cell v-bind:slotItem="resource"/>
          </div>
          <div class="detailItemBpBlockName">{{ resource.item.name }}
            <span style="color: #fff16f">х{{ resource.quantity }}</span>
          </div>
          <div class="detailItemBpBlockDetailButton" @click="openDetail(resource)">i</div>
        </div>
      </template>
    </div>

    <div class="detailItemBpBlock" v-if="type === 'recycle'">
    </div>

    <div class="detailItemBpBlock"
         v-if="type !== 'blueprints' && type !== 'recycle'">

      <template v-if="blueprints && blueprints.length > 0">
        <h4>Чертежи</h4>
        <div class="detailItemBpBlockRow" v-for="slot in blueprints">

          <div class="detailItemBpBlockIcon">
            <app-background-item-cell v-bind:slotItem="slot.bp"/>
          </div>

          <div class="detailItemBpBlockName">{{ slot.bp.item.name }}</div>
          <div class="detailItemBpBlockDetailButton" @click="openDetail(slot.bp)">i</div>
        </div>
      </template>

      <template v-if="recycleItems">
        <h4>Компоненты после переработки</h4>
        <div class="detailItemBpBlockRow" v-for="resource in recycleItems">
          <div class="detailItemBpBlockIcon">
            <app-background-item-cell v-bind:slotItem="resource"/>
          </div>
          <div class="detailItemBpBlockName">{{ resource.item.name }}
            <span style="color: #fff16f">х{{ resource.quantity }}</span>
          </div>
          <div class="detailItemBpBlockDetailButton" @click="openDetail(resource)">i</div>
        </div>
      </template>

    </div>
  </div>
</template>

<script>
import BackgroundItemCell from '../Inventory/BackgroundItemCell'
import urls from '../../const';

export default {
  name: "ProductionTab",
  props: ['type', 'item'],
  data() {
    return {
      blueprints: null,
      needResource: null,
      completeProductions: null,
      recycleItems: null,
    }
  },
  created() {
    let app = this;
    let item = app.$props.item;
    let user = this.$store.getters.getUser;

    if (app.$props.type === 'blueprints') {

      app.$api.get(urls.itemURL + '?id=' + item.item_id + "&type=" + item.item_type + "&method=item").then(function (response) {

        if (response.data.type === "dynamic_objects") {
          response.data.type = "structure";
          response.data.item.name = response.data.item.name + "_" + user.fraction;
        }

        app.completeProductions = response.data;

      }).catch(function (err) {
        console.log(err)
      });

      app.$api.get(urls.bpURL + '?id=' + item.id + "&method=id").then(function (response) {
        app.needResource = response.data[0].resources
      }).catch(function (err) {
        console.log(err)
      });

    } else if (app.$props.type === 'recycle') {
      // TODO
    } else {
      let id = item.id;
      if (!id) id = item.type_id;

      app.$api.get(urls.bpURL + '?id=' + id + "&type=" + app.$props.type + "&method=item").then(function (response) {
        app.blueprints = response.data
      }).catch(function (err) {
        console.log(err)
      });

      app.$api.get(urls.getRecycleItems + '?id=' + id + "&type=" + app.$props.type).then(function (response) {
        app.recycleItems = response.data
      }).catch(function (err) {
        console.log(err)
      });
    }
  },
  methods: {
    openDetail(slot) {
      if (slot.item.hasOwnProperty('id')) {
        this.$store.commit({
          type: 'toggleWindow',
          id: 'detailItem' + slot.type + slot.item.id,
          component: 'detailItem',
          meta: {itemType: slot.type, itemID: slot.item.id},
          forceOpen: true,
        });
      } else if (slot.item.hasOwnProperty('type_id')) {
        this.$store.commit({
          type: 'toggleWindow',
          id: 'detailItem' + slot.type + slot.item.type_id,
          component: 'detailItem',
          meta: {itemType: slot.type, itemID: slot.item.type_id},
          forceOpen: true,
        });
      }
    },
  },
  components: {
    AppBackgroundItemCell: BackgroundItemCell,
  }
}
</script>

<style scoped>
.detailItemBpBlock h4 {
  margin: 0;
  width: calc(100% - 4px);
  padding: 2px;
  background: #df6f2c;
  padding-left: 15px;
  box-shadow: 0 0 2px black;
  font-size: 12px;
  clear: both;
}

.detailItemBpBlockIcon {
  position: relative;
  height: 30px;
  width: 30px;
  float: left;
}

.detailItemBpBlockName {
  float: left;
  line-height: 30px;
  color: white;
  margin-left: 10px;
}

.detailItemBpBlockDetailButton {
  float: right;
  line-height: 23px;
  height: 20px;
  width: 20px;
  text-align: center;
  border: 2px solid rgb(173, 173, 173);
  border-radius: 50%;
  color: yellow;
  font-weight: 900;
  background: #138edc;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
  margin-top: 3px;
  box-shadow: 0 0 4px black;
}

.detailItemBpBlockRow {
  background: rgba(0, 0, 0, 0.2);
  float: left;
  width: calc(100% - 4px);
  border: 1px solid rgba(0, 0, 0, 0.3);
  padding: 2px;
  transition: 200ms;
}

.detailItemBpBlockRow:hover {
  background: rgba(0, 0, 0, 0.1);
}

.detailItemBpBlockDetailButton:active {
  transform: scale(0.95);
}

.detailItemBpBlockDetailButton:hover {
  box-shadow: 0 0 4px white;
  color: white;
}
</style>
