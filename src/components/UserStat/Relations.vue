<template>
  <div class="relations">
    <h4 class="head">Отношения с фракциями</h4>

    <div class="fraction_row">
      <div class="fraction_logo"></div>
      <div class="fraction_bar_wrapper">
        <div class="fraction_name">Replic - <span class="fraction_status">нейтральное</span></div>
        <div class="fraction_out_bar">
          <div class="fraction_in_bar">
            <div></div>
          </div>
          <div class="fraction_bar_center"></div>
        </div>
        <div class="fraction_bar_metric">
          <div style="float: left">-10</div>
          <div style="float: left; margin-left: calc(50% - 50px);">отношение +3.120</div>
          <div style="float: right">+10</div>
        </div>
      </div>
    </div>

    <div class="fraction_row">
      <div class="fraction_logo"></div>
      <div class="fraction_bar_wrapper">
        <div class="fraction_name">Replic - <span class="fraction_status">вражда</span></div>
        <div class="fraction_out_bar">
          <div class="fraction_in_bar">
            <div></div>
          </div>
          <div class="fraction_bar_center"></div>
        </div>
        <div class="fraction_bar_metric">
          <div style="float: left">-10</div>
          <div style="float: left; margin-left: calc(50% - 50px);">отношение -3.435</div>
          <div style="float: right">+10</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Relations",
  mounted() {
    this.$parent.resize(null, null, $(this.$parent.$el))
  },
}
</script>

<style scoped>
.relations {
  box-shadow: inset 0 0 2px black;
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.2);
  margin-right: 3px;
  overflow-y: scroll;
  overflow-x: hidden;
  position: relative;
  width: calc(100% - 8px);
  padding: 4px;
}

.head {
  margin: 7px;
  background: rgb(221, 112, 52);
  color: rgba(255, 255, 255, 0.8);
  border-radius: 4px;
  font-size: 13px;
  line-height: 19px;
  height: 17px;
  user-select: none;
  text-shadow: 1px 1px 1px rgb(0 0 0);
  font-weight: bold;
  box-shadow: 0 0 2px rgb(0 0 0);
  padding-left: 10px;
}

.fraction_row {
  padding: 4px 5px 4px 5px;
  background: rgba(0, 0, 0, 0.17);
  margin-bottom: 5px;
  border-radius: 5px;
  box-shadow: 0 0 2px black;
  position: relative;
  height: 40px;
}

.fraction_logo {
  background-color: rgb(128, 128, 128);
  float: left;
  margin: -1px 5px 5px -1px;
  border: 1px solid rgba(0, 0, 0, 0.4);
  box-shadow: inset 0 0 1px 0 black;
  background-size: cover;
  height: 40px;
  width: 40px;
}

.fraction_bar_wrapper {
  width: calc(100% - 46px);
  float: left;
  position: relative;
}

.fraction_name {
  color: white;
  font-size: 11px;
  line-height: 15px;
}

.fraction_out_bar {
  height: 14px;
  width: 100%;
  border-radius: 5px;
  box-shadow: 0 0 2px black;
}

.fraction_out_bar .fraction_in_bar {
  position: relative;
  width: calc(100% - 4px);
  height: calc(100% - 4px);
  margin: 2px;
  background: rgb(145, 145, 145);
  float: left;
  border-radius: 5px;
  box-shadow: inset 0 0 2px black;
  overflow: hidden;
}

.fraction_out_bar > div > div {
  top: 0;
  left: 0;
  position: absolute;
  height: 100%;
  width: 50%;
  box-shadow: inset 0 0 4px black;
  background: #f19506;
}

.fraction_status {
  color: yellow;
  font-size: 11px;
}

.fraction_bar_center {
  z-index: 999;
  height: 22px;
  width: 2px;
  background: #e84e4e;
  box-shadow: 0 0 2px black;
  position: absolute;
  border-radius: 100%;
  left: calc(50% - 2px);
  margin-top: -4px;
  float: left;
}

.fraction_bar_metric {
  color: white;
  margin-top: 5px;
  font-size: 8px;
  font-weight: 900;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
}
</style>
