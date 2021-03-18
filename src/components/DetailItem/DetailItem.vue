<template>
  <div class="detailItemInfo" :id="windowID" :ref="windowID" v-if="slot" @mousedown="toUp">

    <app-control v-bind:head="itemName" v-bind:move="true" v-bind:close="true"
                 v-bind:noHeight="true"
                 v-bind:noWidth="true"
                 v-bind:resizeFunc="resize"
                 v-bind:refWindow="windowID"
                 v-bind:minSize="{height: 170, width: 170}"/>

    <div class="detailItemInfoHead">
      <div class="detailItemInfoIcon">
        <app-background-item-cell v-if="slot.item" v-bind:slotItem="slot" v-bind:noShowName="true"/>
      </div>
      <div class="detailItemInfoHeads">
        <h4>{{ itemName }}</h4>
        <h6>{{ handbook.categories[language][type].name }}</h6>
      </div>

      <div class="detailItemInfoTabs">

        <div v-bind:class="{active: tab === 'description'}"
             @click="changeTab('description')">
          Описание
        </div>

        <div v-if="slot.item.hasOwnProperty('bonuses') && Object.keys(slot.item.bonuses).length !== 0"
             v-bind:class="{active: tab === 'bonus'}"
             @click="changeTab('bonus')">
          Особености
        </div>

        <div v-bind:class="{active: tab ==='characteristic'}"
             v-if="characteristicTypes.includes(type)"
             @click="changeTab('characteristic')">
          Хар-ки
        </div>

        <div v-bind:class="{active: tab ==='requirements'}"
             v-if="requirements"
             @click="changeTab('requirements')">
          Требования
        </div>

        <div v-bind:class="{active: tab ==='equipment'}"
             v-if="equipmentTypes.includes(type)"
             @click="changeTab('equipment')">
          Оснащение
        </div>

        <div v-bind:class="{active: tab ==='production'}"
             v-if="productionTypes.includes(type)"
             @click="changeTab('production')">
          Произ-во
        </div>

      </div>
    </div>

    <div class="detailItemInfoBody">
      <div class="description" v-if="tab === 'description'"
           v-html="itemDescription"/>
      <app-characteristic-tab v-if="tab === 'characteristic'" v-bind:type="type" v-bind:item="slot.item"/>
      <app-equipment-tab v-if="tab === 'equipment'" v-bind:type="type" v-bind:item="slot.item"/>
      <app-production-tab v-if="tab === 'production'" v-bind:type="type" v-bind:item="slot.item"/>
      <app-requirements v-if="tab === 'requirements'" v-bind:requirements="requirements"/>
      <app-bonus-tab v-if="tab === 'bonus'" v-bind:bonuses="slot.item.bonuses"/>
    </div>
  </div>
</template>

<script>
import Control from '../Window/Control';
import BackgroundItemCell from '../Inventory/BackgroundItemCell';
import CharacteristicTab from './CharacteristicTab';
import EquipmentTab from './EquipmentTab';
import ProductionTab from './ProductionTab';
import Requirements from './Requirements';
import BonusTab from './BonusTab';

import urls from '../../const';

export default {
  name: "DetailItem",
  props: ['type', 'id', 'windowID'],
  data() {
    return {
      slot: null,
      tab: 'description',
      productionTypes: ["detail", "blueprints", "boxes", "body", "ammo", "equip", "weapon", "resource"],
      characteristicTypes: ["trash", "resource", "recycle", "detail", "boxes", "body", "ammo", "equip", "weapon"],
      equipmentTypes: ["body"],
      requirements: null,
    }
  },
  created() {
    let app = this;

    app.$api.get(urls.itemURL + '?id=' + app.$props.id + "&type=" + app.$props.type + "&method=item").then(function (response) {
      app.slot = response.data;

      if (app.slot && app.slot.item && app.slot.item.hasOwnProperty('requirements')) {
        let idsString = "";

        for (let id in app.slot.item.requirements) {
          if (idsString !== "") idsString += "&";
          idsString += "id=" + id
        }

        app.$api.get(urls.skillInfoURL + '?' + idsString).then(function (response) {

          for (let id in app.slot.item.requirements) {
            if (response.data[id]) {
              response.data[id].level = app.slot.item.requirements[id]
            }
          }

          app.requirements = response.data;
        });
      }
    }).catch(function (err) {
      //console.log(err)
    });
  },
  methods: {
    toUp() {
      this.$store.commit({
        type: 'setWindowZIndex',
        id: this.$el.id,
      });
    },
    changeTab(tab) {
      this.tab = tab;
    },
    resize(event, ui, el) {
      el.find('.detailItemInfoBody').css("height", el.height() - 109);
    },
  },
  computed: {
    itemName() {
      if (!this.slot) {
        return ''
      }

      if (this.slot.type === "blueprints") {
        if (this.slot.item.in_map) {
          return this.handbook['structure'][this.language][this.slot.item.name.split('_bp')[0]].name
        } else {
          return this.handbook[this.slot.item.item_type][this.language][this.slot.item.item_name].name
        }
      }

      return this.handbook[this.slot.type][this.language][this.slot.item.name].name
    },
    itemDescription() {
      if (!this.slot) {
        return ''
      }

      if (this.slot.type === "blueprints") {
        if (this.slot.item.in_map) {
          return "<p>Чертеж для строительства: " + this.handbook['structure'][this.language][this.slot.item.name.split('_bp')[0]].name + "</p>"
        } else {
          return "<p>Чертеж для создания: " + this.handbook[this.slot.item.item_type][this.language][this.slot.item.item_name].name + "</p>"
        }
      }

      return this.handbook[this.slot.type][this.language][this.slot.item.name].description
    },
    language() {
      return this.$store.getters.getSettings.Language
    },
    handbook() {
      return this.$store.getters.getHandBook
    }
  },
  components: {
    AppControl: Control,
    AppBackgroundItemCell: BackgroundItemCell,
    AppCharacteristicTab: CharacteristicTab,
    AppEquipmentTab: EquipmentTab,
    AppProductionTab: ProductionTab,
    AppRequirements: Requirements,
    AppBonusTab: BonusTab,
  }
}
</script>

<style scoped>
.detailItemInfo {
  height: 300px;
  width: 360px;
  position: absolute;
  border: 1px solid #25a0e1;
  background: rgb(8, 138, 210);
  padding: 20px 3px 3px 3px;
  border-radius: 4px;
  top: 30%;
  left: calc(50% - 154px)
}

.detailItemInfoHead {
  width: 100%;
  white-space: nowrap;
}

.detailItemInfoIcon {
  position: relative;
  height: 75px;
  width: 75px;
  float: left;
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.2);
  margin-right: 10px;
  margin-bottom: 5px;
  box-shadow: inset 0 0 2px;
}

.detailItemInfoHeads {
  text-align: left;
}

.detailItemInfoTabs {
  height: 15px;
  width: calc(100% - 5px);
  background: rgba(0, 0, 0, 0.2);
  margin: 0 0 0 5px;
  border-radius: 3px 3px 0 0;
  overflow: hidden;
  white-space: nowrap;
  display: flex;
}

.detailItemInfoTabs div {
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
  text-overflow: ellipsis;
  overflow: hidden;
}

.detailItemInfoTabs div:last-child {
  /*border: 0;*/
}

.detailItemInfoTabs .active {
  color: #fff200 !important;
  background: rgb(187, 93, 42) !important;
}

.detailItemInfoBody {
  float: left;
  width: calc(100% - 10px);
  height: 195px;
  margin: 0 auto 0;
  overflow-y: scroll;
  border-radius: 5px;
  box-shadow: inset 0 0 5px black;
  background: #89969c;
  pointer-events: auto;
  overflow-x: hidden;
  padding: 5px;
  text-align: justify;
  font-size: 12px;
}


.detailItemInfoHead h4, .detailItemInfoHead h6 {
  margin: 0;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.detailItemInfoHead h4 {
  font-size: 10px;
  display: block;
  color: rgba(255, 255, 255, 0.8);
  text-shadow: 0 0 4px black;
  text-align: left;
  margin-top: 4px;
  height: 13px;
}

.detailItemInfoHead h6 {
  font-size: 8px;
  display: block;
  text-shadow: 0 0 4px black;
  text-align: left;
  text-indent: 6px;
  margin-top: 4px;
  color: #fff200;
}

.detailItemInfoTabs div:hover {
  color: #fff200 !important;
}
</style>

<style>
.detailItemInfo .description p {
  text-indent: 1.5em;
}
</style>
