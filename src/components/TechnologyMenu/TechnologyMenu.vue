<template>
  <div id="TechnologyMenu" ref="TechnologyMenu" @mousedown="toUp">
    <app-control v-bind:head="'Дерево технологий '"
                 v-bind:move="true" v-bind:close="true"
                 v-bind:refWindow="'TechnologyMenu'"
                 v-bind:resizeFunc="resize"
                 v-bind:minSize="{height: 150, width: 300}"/>

    <app-cell-sub-menu v-if="subMenuProps.slot" v-bind:subMenuProps="subMenuProps"/>

    <div class="detailItemInfoTabs">
      <div v-bind:class="{active: tab === 'body'}" @click="tab = 'body'">Корпуса</div>
      <!--      <div v-bind:class="{active: tab === 'weapons'}" @click="tab = 'weapons'">Оружие</div>-->
    </div>

    <div class="fraction" v-if="tab === 'body'">
      <div v-bind:class="{fractionActive: fraction === 'Replics'}" @click="fraction = 'Replics'"
           :style="{ backgroundImage: 'url(' + require('../../assets/logo/Replics.png') + ')' }"/>
      <div v-bind:class="{fractionActive: fraction === 'Explores'}" @click="fraction = 'Explores'"
           :style="{ backgroundImage: 'url(' + require('../../assets/logo/Explores.png') + ')' }"/>
      <div v-bind:class="{fractionActive: fraction === 'Reverses'}" @click="fraction = 'Reverses'"
           :style="{ backgroundImage: 'url(' + require('../../assets/logo/Reverses.png') + ')' }"/>
      <div v-bind:class="{fractionActive: fraction === 'APD'}" @click="fraction = 'APD'"
           :style="{ backgroundImage: 'url(' + require('../../assets/logo/Free.png') + ')' }"/>
    </div>

    <div class="MainTechnologyMenu" v-dragscroll>
      <div class="TechnologyMenuCanvasWrapper">
        <app-body v-if="tab === 'body'" v-bind:fraction="fraction"/>
        <app-weapon v-if="tab === 'weapons'" v-bind:fraction="fraction"/>
      </div>
    </div>
  </div>
</template>

<script>
import Body from './Body';
import Weapon from './Weapon';
import Control from '../Window/Control';
import {dragscroll} from 'vue-dragscroll'
import CellSubMenu from '../Inventory/CellSubMenu';

export default {
  name: "TechnologyMenu",
  props: ['meta'],
  directives: {
    'dragscroll': dragscroll
  },
  data() {
    return {
      tab: 'body',
      fraction: 'Replics',
      subMenuProps: {
        src: '',
        slot: null,
        x: 0,
        y: 0,
        points: ['detail', 'cancel'],
      }
    }
  },
  created() {
    if (this.$props.meta) {
      if (this.$props.meta.fraction) {
        this.fraction = this.$props.meta.fraction
      }
      if (this.$props.meta.category) {
        this.tab = this.$props.meta.category
      }
    }
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
  },
  components: {
    AppControl: Control,
    AppBody: Body,
    AppWeapon: Weapon,
    AppCellSubMenu: CellSubMenu,
  }
}
</script>

<style scoped>
#TechnologyMenu {
  height: 150px;
  width: 300px;
  position: absolute;
  left: calc(50% - 100px);
  top: 20%;
  padding: 20px 3px 3px 3px;
  border: 1px solid #25a0e1;
  background: rgb(8, 138, 210);
  border-radius: 5px;
  z-index: 10;
}

.MainTechnologyMenu {
  box-shadow: inset 0 0 5px black;
  background: rgb(21 94 132);;
  border-radius: 5px;
  height: calc(100% - 14px);
  position: relative;
  width: 100%;
  background-size: cover;
  overflow: scroll;
  cursor: grab;
}

.TechnologyMenuCanvasWrapper {

}

.detailItemInfoTabs {
  height: 15px;
  width: calc(100% - 5px);
  background: rgba(0, 0, 0, 0.2);
  margin: 0 0 0 5px;
  border-radius: 3px 3px 0 0;
  overflow: hidden;
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
}

.detailItemInfoTabs div:last-child {
  /*border: 0;*/
}

.detailItemInfoTabs .active {
  color: #fff200 !important;
  background: rgb(187, 93, 42) !important;
}

.detailItemInfoTabs div:hover {
  color: #fff200 !important;
}

.fraction {
  position: absolute;
  height: 25px;
  width: 150px;
  top: 40px;
  left: 8px;
  z-index: 2;
}

.fraction div {
  height: 25px;
  width: 25px;
  border: 1px solid rgba(37, 160, 225, 0.5);
  background-color: rgba(12, 50, 71, 0.5);
  border-radius: 3px;
  float: left;
  margin-right: 2px;
  cursor: pointer;
  background-size: contain;
}

.fraction div:hover {
  border: 1px solid rgba(225, 140, 37, 0.5);
}

.fraction .fractionActive {
  border: 1px solid rgb(225, 140, 37);
  background-color: rgba(210, 160, 8, 0.5);
}

.fraction .fractionActive:hover {
  border: 1px solid rgb(225, 140, 37);
}
</style>
