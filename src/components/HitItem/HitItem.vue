<template>
  <div class="HitItem" :id="windowID" :ref="windowID"
       :style="{left: meta.pos.left + 'px', top: meta.pos.top + 'px', opacity: meta.pos.alpha}">

    <div class="hitInfo" v-if="meta.item && meta.count">
      <div class="count"> {{meta.count > 0 ? '+' : ''}}{{meta.count}}</div>
      <div class="iconItem">
        <app-background-item-cell v-if="meta.item" v-bind:slotItem="meta.item" v-bind:noShowName="true"/>
      </div>
    </div>

  </div>
</template>

<script>
  import BackgroundItemCell from '../Inventory/BackgroundItemCell';

  export default {
    name: "HitItem",
    props: ['windowID', 'meta'],
    components: {
      AppBackgroundItemCell: BackgroundItemCell,
    }
  }
</script>

<style scoped>
  .HitItem {
    position: absolute;
    height: 25px;
    min-width: 30px;
    max-width: 300px;
    text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
  }

  .hitInfo {
    height: 25px;
  }

  .iconItem {
    height: 25px;
    width: 25px;
    float: right;
    border-radius: 10px;
    position: relative;
  }

  .count {
    margin-right: 4px;
    line-height: 28px;
    float: left;
    color: white;
    text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
  }
</style>
