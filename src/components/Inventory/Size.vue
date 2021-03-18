<template>
  <div class="sizeInventoryInfo">

    <span v-if="capacity===9999"> {{ (size / 1000).toFixed(2) }} </span>
    <span v-else> {{ (size / 1000).toFixed(2) }} / {{ (capacity / 1000).toFixed(2) }} </span>

    <div class="realSize" v-bind:style="{ width: getPercentFill + '%'}"></div>
    <div class="itemSize" v-bind:style="{ width: getPercentItem + '%'}" v-if="itemSlot"></div>
  </div>
</template>

<script>
export default {
  name: "Size",
  props: ['capacity', 'size', 'itemSlot'],
  computed: {
    getPercentFill() {
      if (this.$props.capacity === 9999) {
        return 100
      } else {
        return 100 / (this.$props.capacity / this.$props.size);
      }
    },
    getPercentItem() {
      if (this.$props.capacity === 9999) {
        return 100 / (this.$props.size / this.$props.itemSlot.size);
      } else {
        return 100 / (this.$props.capacity / this.$props.itemSlot.size);
      }
    },
  }
}
</script>

<style scoped>
.sizeInventoryInfo {
  width: calc(100% - 5px);
  height: 15px;
  border: 1px solid #4c4c4c;
  text-align: left;
  display: block;
  box-shadow: 0 0 5px rgba(0, 0, 0, 1);
  border-radius: 10px;
  background-size: 12%;
  overflow: hidden;
  background-color: #959595;
  margin: 0 auto 0;
}

.sizeInventoryInfo span {
  color: #e0e0e0;
  display: block;
  font-size: 12px;
  line-height: 16px;
  width: 100%;
  text-align: center;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 1);
  font-weight: bold;
  background-image: url('../../assets/indexImg/cube.png');
  background-repeat: no-repeat;
  background-position: 68%;
  background-size: 17px;
  margin: auto;
  float: left;
}

.realSize {
  overflow: visible;
  background: rgba(255, 96, 0, 0.7);
  height: 100%;
}

.sizeInventoryInfo .itemSize {
  position: relative;
  left: 0;
  top: -18px;
  height: 20px;
  overflow: visible;
  background: rgba(45, 221, 255, 0.9);
}
</style>
