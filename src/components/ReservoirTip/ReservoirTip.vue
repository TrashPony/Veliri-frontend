<template>
  <div :id="windowID" :ref="windowID" class="reservoirTip" :style="{left: meta.pos.left, top: meta.pos.top}">

    <app-control v-bind:head="meta.name" v-bind:move="false" v-bind:close="false" v-bind:refWindow="windowID"
                 v-bind:noHeight="true" v-bind:noWidth="true" v-bind:noPos="true"/>

    <div class="Description" v-if="meta.description && meta.description !== ''" v-html="meta.description"></div>

    <div class="reservoirInfo" v-if="meta.item && meta.count">
      <div class="iconOreTip">
        <app-background-item-cell v-if="meta.item" v-bind:slotItem="meta.item" v-bind:noShowName="false"/>
      </div>
      <div class="nameOre">{{meta.name}}</div>
      <div class="countOre" id="countOre${reservoir.x}${reservoir.y}">{{meta.count}}</div>
    </div>

  </div>
</template>

<script>
  import Control from '../Window/Control';
  import BackgroundItemCell from '../Inventory/BackgroundItemCell';

  /**
   meta{
      name: '',
      description: '',
      count: '',
      item: {
        type:
        item: {
          name: ''
        }
      }
  }
   **/

  export default {
    name: "ReservoirTip",
    props: ['meta', 'windowID'],
    components: {
      AppControl: Control,
      AppBackgroundItemCell: BackgroundItemCell,
    }
  }
</script>

<style scoped>
  .reservoirTip {
    min-height: 0;
    min-width: 130px;
    max-width: 260px;
    vertical-align: top;
    position: absolute;
    left: 1002px;
    top: 641px;
    border-radius: 5px;
    box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.6);
    border: 1px solid #25a0e1;
    background: rgb(8, 138, 210);
    padding: 20px 4px 4px 4px;
    opacity: 0.80;
  }

  .reservoirTip:hover {
    opacity: 1;
  }

  .reservoirTip .reservoirInfo {
    box-shadow: inset 0 0 5px black;
    background: rgb(132, 132, 132);
    margin: 3px 0 0;
    border-radius: 5px;
    height: 25px;
    padding: 5px;
  }

  .reservoirTip h3 {
    display: block;
    width: 100%;
    margin: -7px 0 4px -1px;
    border: 1px solid black;
    border-radius: 5px 5px 0 0;
    box-shadow: 0 0 10px rgba(0, 0, 0, 1);
    line-height: 23px;
    background: rgba(101, 165, 195, 0.6);
    height: 21px;
    color: white;
  }

  .reservoirTip .iconOreTip {
    height: 25px;
    width: 25px;
    float: left;
    border-radius: 10px;
    position: relative;
  }

  .reservoirTip .nameOre {
    margin-left: 5px;
    height: 25px;
    line-height: 25px;
    float: left;
    color: #ff7800;
    text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
  }

  .reservoirTip .countOre {
    margin-left: 3px;
    height: 25px;
    line-height: 25px;
    float: right;
    color: #eeff03;
    text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
  }

  .reservoirTip .Description {
    border-radius: 5px;
    width: calc(100% - 14px);
    padding: 7px;
    box-shadow: inset 0 0 3px black;
    background: linear-gradient(0deg, transparent 0%, rgba(0, 0, 0, 0.1) 20%), #adc6cd;
    background-size: 100% 3px;
    font-size: 12px;
    font-weight: 900;
  }
</style>
