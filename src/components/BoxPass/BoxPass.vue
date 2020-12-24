<template>
  <div class="passBlock" :id="windowID" :ref="windowID" @mousedown="toUp">

    <app-control v-bind:head="language === 'RU' ? 'Введите пароль' : 'Enter password'"
                 v-bind:move="true"
                 v-bind:close="true"
                 v-bind:refWindow="windowID"
                 v-bind:noHeight="true"
                 v-bind:noWidth="true"/>

    <div>
      <div class="numberBlock value" v-bind:class="{active: activeCell==='one'}">{{ pass.one.number }}</div>
      <div class="numberBlock value" v-bind:class="{active: activeCell==='two'}">{{ pass.two.number }}</div>
      <div class="numberBlock value" v-bind:class="{active: activeCell==='three'}">{{ pass.three.number }}</div>
      <div class="numberBlock value" v-bind:class="{active: activeCell==='four'}">{{ pass.four.number }}</div>
    </div>

    <div class="numberBlock" @click="addNumber(1)">1</div>
    <div class="numberBlock" @click="addNumber(2)">2</div>
    <div class="numberBlock" @click="addNumber(3)">3</div>
    <div class="numberBlock" @click="addNumber(4)">4</div>
    <div class="numberBlock" @click="addNumber(5)">5</div>
    <div class="numberBlock" @click="addNumber(6)">6</div>
    <div class="numberBlock" @click="addNumber(7)">7</div>
    <div class="numberBlock" @click="addNumber(8)">8</div>
    <div class="numberBlock" @click="addNumber(9)">9</div>
    <div class="numberBlock" style="margin-left: 45px;" @click="addNumber(0)">0</div>

    <input type="button" class="lobbyButton inventoryTip" @click="closeWindow"
           :value="language === 'RU' ? 'Отменить' : 'Cancel'"
           style="pointer-events: auto;">
    <input type="button" class="lobbyButton inventoryTip"
           :value="language === 'RU' ? 'Ок' : 'Ок'"
           @click="sendPass" style="pointer-events: auto;">
  </div>
</template>

<script>
import Control from '../Window/Control';

export default {
  name: "BoxPass",
  props: ['boxID', 'action', 'windowID', 'boxSlot'],
  data() {
    return {
      pass: {
        one: {number: 0, use: false},
        two: {number: 0, use: false},
        three: {number: 0, use: false},
        four: {number: 0, use: false},
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
    addNumber(number) {
      if (this.pass.four.use) {
        for (let i in this.pass) {
          this.pass[i].use = false;
        }
      }
      for (let i in this.pass) {
        if (!this.pass[i].use) {
          this.pass[i].number = number;
          this.pass[i].use = true;
          break
        }
      }
    },
    closeWindow() {
      this.$store.commit({
        type: 'toggleWindow',
        id: this.$el.id,
        component: '',
      });
    },
    sendPass() {
      if (this.$props.action === 'open') {
        this.$store.getters.getWSByService('global').socket.send(JSON.stringify({
          event: "openBox",
          box_password: Number(this.passValue),
          box_id: Number(this.$props.boxID),
        }));
      }

      if (this.$props.action === 'install') {
        this.$store.getters.getWSByService('global').socket.send(JSON.stringify({
          event: "placeNewBox",
          slot: Number(this.$props.boxSlot),
          box_password: Number(this.passValue),
        }));

        this.closeWindow()
      }
    }
  },
  computed: {
    language() {
      return this.$store.getters.getSettings.Language
    },
    passValue() {
      let value = "";
      for (let i in this.pass) {
        value += this.pass[i].number;
      }
      return value;
    },
    activeCell() {
      for (let i in this.pass) {
        if (!this.pass[i].use) {
          return i
        }
      }

      return 'one'
    }
  },
  components: {
    AppControl: Control,
  }
}
</script>

<style scoped>
.passBlock {
  position: absolute;
  display: inline-block;
  background-size: 100% 2px;
  border-radius: 10px;
  min-height: 20px;
  width: 120px;
  z-index: 950;
  top: 30%;
  left: calc(50% - 60px);
  border: 1px solid #25a0e1;
  background: rgb(8, 138, 210);
  padding: 20px 3px 3px 3px;
  box-shadow: 0 0 2px;
  height: 187px;
}

.passBlock h2 {
  top: -1px;
  left: -1px;
  width: 100%;
  display: block;
  position: absolute;
  height: 17px;
  background: #8aaaaa;
  border: 1px solid #25a0e1;
  border-radius: 5px 5px 0 0;
  box-shadow: inset 0 0 3px rgba(0, 0, 0, 1);
  text-align: left;
  text-indent: 5px;
  font-size: 11px;
  line-height: 18px;
  transition: 200ms;
  color: black;
  text-shadow: none;
  margin: 0;
}

.passBlock .numberBlock {
  width: 30px;
  height: 30px;
  box-shadow: inset 0 0 2px black;
  background: #89969c;
  border-radius: 5px;
  float: left;
  margin: 1px 5px;
  color: #e8af7d;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
  font-weight: bold;
  font-size: 25px;
  user-select: none;
  transition: 100ms;
  line-height: 35px;
  text-align: center;
}

.passBlock .numberBlock:hover {
  box-shadow: inset 0 0 5px #a8a800;
}

.passBlock .numberBlock:active {
  box-shadow: inset 0 0 5px #a7a4a8;
  transform: scale(0.9);
}

.passBlock span {
  display: inline-block;
  width: 80px;
  text-align: left;
}

.passBlock input[type=number] {
  width: 45px;
  font-size: 20px;
  margin-bottom: 5px;
}

.passBlock input[type=button]:first-child {
  float: left;
  clear: both;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  /* display: none; <- Crashes Chrome on hover */
  -webkit-appearance: none;
  margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
}

.passBlock input[type=button] {
  width: 52px;
  font-size: 9px;
  margin-top: 10px;
}

.passBlock input[type=button]:last-child {
  margin-left: 10px;
}

.passBlock .numberBlock.value {
  height: 20px;
  width: 20px;
  font-size: 12px;
  line-height: 23px;
  margin: 5px 5px;
  color: white;
  background: rgba(144, 187, 187, 0.3);
  box-shadow: inset 0 0 2px black;
}

.passBlock .numberBlock.value.active {
  background: #0d8511;
}
</style>
