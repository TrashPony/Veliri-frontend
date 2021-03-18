<template>
  <div>
    <div class="range_wrapper">
      <div class="range_button" @click="changeValue(Number(current)-1)">-</div>
      <input class="range" type="range" v-model="current" @input="change" :min="$props.min" :max="$props.max"
             :step="$props.step">
      <div class="range_button" @click="changeValue(Number(current)+1)"
           style="right: 0; left: unset; text-align: right">+
      </div>

      <div class="min_wrapper">
        {{ $props.min }}
      </div>

      <div class="max_wrapper">
        {{ $props.max }}
      </div>

      <template v-if="$props.possibleMax !== this.$props.max">
        <div class="min_wrapper" style="background: rgb(167,63,63);" :style="{left:possibleMaxPos + '%'}">
          {{ $props.possibleMax }}
        </div>

        <div class="separator" :style="{left: 'calc(' + possibleMaxPos + '% + 28px)'}"/>
        <div class="close_range"
             :style="{left: 'calc(' + possibleMaxPos + '% + 31px)', width: 'calc(' + (100 - Number(possibleMaxPos)) + '% - 43px)'}"></div>
      </template>

      <input class="current" type="number" v-model="current" @input="change" :min="$props.min" :max="$props.max * 10"
             :style="{left: currentPos + '%'}">
    </div>
  </div>
</template>

<script>
import Input from "../Chat/Input";

export default {
  name: "Range",
  components: {Input},
  props: ['min', 'max', 'step', 'possibleMax', 'preCurrent'],
  data() {
    return {
      current: 0,
      currentPos: 10,
      possibleMaxPos: 0,
    }
  },
  mounted() {
    this.initPositions()
  },
  updated() {
    this.initPositions()
  },
  methods: {
    initPositions() {
      if (this.$props.possibleMax === undefined) {
        this.$props.possibleMax = this.$props.max
      } else {
        let percent = ((this.$props.possibleMax / this.$props.max) * 100)
        this.possibleMaxPos = this.getPos(percent)
      }

      if (this.$props.preCurrent !== undefined) {
        this.current = this.$props.preCurrent
      }

      this.changeCurrentPos()
    },
    change() {
      this.changeValue(this.current)
      this.changeCurrentPos()
    },
    changeCurrentPos() {
      let percent = ((this.current / this.$props.max) * 100)
      this.currentPos = this.getPos(percent)
    },
    getPos(percent) {
      let px = ($(this.$el).width() - 42) * (percent / 100)
      return ((px / $(this.$el).width()) * 100)
    },
    changeValue(val) {
      if (val > this.$props.possibleMax) {
        val = this.$props.possibleMax
      }

      if (val === "" || val < 0) {
        val = 0
      }

      this.current = val
      this.$emit('change', val);
    }
  }
}
</script>

<style scoped>

.range_wrapper {
  width: 100%;
  position: relative;
}

.range {
  height: 10px;
  width: calc(100% - 28px);
  padding: 0 2px;
  -webkit-appearance: none;
  position: absolute;
  top: 0;
  left: 12px;
  z-index: 1;
  box-shadow: 0 0 2px black;
}

.range:hover {
  outline: none;
  background: #87b6cf;
}

.range:focus {
  outline: none;
}

.range::-webkit-slider-runnable-track {
  width: 100%;
  height: 8px;
  cursor: pointer;
  border-radius: 3px;
  border: 1px solid rgba(0, 0, 0, 0.4);
  background: rgba(246, 255, 252, 0.4);
}

.range::-webkit-slider-thumb {
  box-shadow: 0 0 2px black;
  border: 0 solid rgba(0, 0, 0, 0);
  height: 6px;
  width: 12px;
  background: rgba(255, 129, 0, 0.6);
  cursor: pointer;
  -webkit-appearance: none;
  border-radius: 2px;
}

.range:hover::-webkit-slider-runnable-track {
  background: rgba(246, 255, 252, 0.4);
}

.range::-moz-range-track {
  width: 100%;
  height: 6px;
  cursor: pointer;
  border-radius: 3px;
  border: 1px solid rgba(0, 0, 0, 0.4);
  background: rgba(246, 255, 252, 0.4);
}

.range::-moz-range-thumb {
  box-shadow: 0 0 2px black;
  border: 0 solid rgba(0, 0, 0, 0);
  height: 6px;
  width: 12px;
  background: rgba(255, 129, 0, 0.6);
  cursor: pointer;
  -webkit-appearance: none;
  border-radius: 2px;
}

.range:hover::-moz-range-thumb {
  background: #ff8f35;
}

.range:hover::-webkit-slider-thumb {
  background: #ff8f35;
}

.range_button, .min_wrapper, .max_wrapper, .current {
  position: absolute;
  left: 0;
  top: 0;
  width: calc(50% - 4px);
  height: 10px;
  float: left;
  font-size: 11px;
  display: inline-block;
  transition: 100ms;
  background: rgba(255, 129, 0, 0.6);
  color: #fff;
  line-height: 9px;
  box-shadow: 0 0 2px #000;
  cursor: pointer;
  border-radius: 3px;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  z-index: 0;
  text-align: left;
  padding: 0 4px;
  font-family: Audiowide, cursive;
  font-weight: 100;
  text-shadow: none;
}

.range_button:hover {
  background: rgba(255, 129, 0, 1);
}

.range_button:active {
  font-size: 8px;
  line-height: 12px;
}

.min_wrapper, .max_wrapper, .current {
  top: 13px;
  min-width: 5px;
  width: unset;
  background: rgba(217, 195, 172, 0.6);
  font-size: 9px;
  line-height: 10px;
  color: #e3881b;
  text-shadow: 0 1px 1px black, 1px 0 1px black, 1px 1px 1px black, 0 0 1px black, 0 -1px 1px black, -1px 0 1px black, -1px -1px 1px black;
  letter-spacing: 1px;
  cursor: auto;
  transition: unset;
}

.current {
  z-index: 5;
  background: rgb(63, 103, 164);
  -moz-appearance: textfield;
}

.current::-webkit-outer-spin-button,
.current::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.max_wrapper {
  right: 0;
  left: unset;
}

.separator, .close_range {
  position: absolute;
  height: 10px;
  width: 3px;
  background: rgb(167, 63, 63);
  z-index: 10;
  box-shadow: 0 0 2px black;
}

.close_range {
  background: rgba(0, 0, 0, 0.4);
  border-radius: 0 5px 5px 0;
}
</style>
