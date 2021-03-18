<template>
  <div id="StatusBarWrapper" ref="StatusBarWrapper"
       :style="{height: '62px', width: '160px'}"
       @mousedown="toUp">

    <app-control v-bind:head="'Игрок: '"
                 v-bind:move="true"
                 v-bind:noHeight="true"
                 v-bind:noWidth="true"
                 v-bind:close="false"
                 v-bind:refWindow="'StatusBarWrapper'"/>

    <div>
      <div id="StatusBarUserInfo" :class="{StatusBarSession: user}" v-if="user">

        <div class="headUserState">
          <div class="user_avatar" v-bind:style="{backgroundImage:  'url(\'' + avatar + '\')'}"/>
          <div>
            <h4 class="user_name">{{ user.login }}</h4>

            <!--            <template-->
            <!--              v-if="user.game_mod !== 'open_world' && battleState && battleState.kills">-->
            <!--              <div class="kills count">x{{ battleState.kills[user.id] }}</div>-->
            <!--            </template>-->

            <div class="hp_bar_wrapper session">
              <span> HP </span>
              <div class="hp_bar_inner"
                   v-if="unit && state"
                   :style="{width: (100 / (state.max_hp / unit.hp)) + '%', backgroundColor: colorDamage((100 / (state.max_hp / unit.hp)))}"></div>
            </div>

            <div class="energy_bar_wrapper session">
              <span> Power </span>
              <div class="energy_bar_inner"
                   v-if="unit && state"
                   :style="{width: (100 / (state.max_power / unit.power)) + '%', backgroundColor: 'rgba(3, 245, 255, 0.7)'}"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="exitTime" v-if="chatState && chatState.exitTime > 0"
         title="Недавно вы получали урон или нарушили закон, поэтому ваш транспорт сможет выйти из игры только через время.">
      <div class="time">
        {{ TimeFormat(chatState.exitTime).minutes }}:{{ TimeFormat(chatState.exitTime).sec }}
      </div>
    </div>

    <div class="lawTime" v-if="chatState && chatState.violator && chatState.violator.time > 0"
         :title="'Вы нарушили закон и находитель в режиме \'' + chatState.violator.type + '\''">
      <div class="vio">{{ chatState.violator.type.toUpperCase() }}</div>
      <div class="time">
        {{ TimeFormat(chatState.violator.time).minutes }}:{{ TimeFormat(chatState.violator.time).sec }}
      </div>
    </div>

    <app-min-squad/>

    <div style="top: calc(100% + 10px); left: 200px; position: absolute; z-index: 2;">
      <app-kill-board/>
    </div>
  </div>
</template>

<script>
import Control from '../Window/Control';
import MinSquad from './MinSquad';
import KillBoard from '../BattleState/KillBoard';

import urls from '../../const';

export default {
  name: "StatusBar",
  data() {
    return {
      avatar: null,
    }
  },
  mounted() {
    let app = this;
    let waitUser = setInterval(function () {
      if (app.user) {
        clearInterval(waitUser);
        app.getAvatar(app.user.id)
      }
    }, 100);
  },
  methods: {
    toUp() {
      this.$store.commit({
        type: 'setWindowZIndex',
        id: this.$el.id,
      });
    },
    afterburnerToggle() {
      alert('nope')
    },
    removeThorium(i) {
      this.$store.getters.getWSByService('global').socket.send(JSON.stringify({
        event: "removeThorium",
        thorium_slot: Number(i)
      }))
    },
    getAvatar(id) {
      let app = this;
      app.$api.get(urls.avatarURL + '?user_id=' + id).then(function (response) {
        app.$set(app, 'avatar', response.data.avatar);
      });
    },
    colorDamage(percent) {
      return this.$store.getters.GetColorDamage(percent)
    },
    TimeFormat(time) {

      if (time < 0) {
        return '-- : --'
      }

      let minutes = Math.floor(time / 60);
      let sec = time % 60;
      return {minutes: (minutes % 60 < 10 ? "0" : "") + minutes, sec: (sec % 60 < 10 ? "0" : "") + sec};
    },
  },
  computed: {
    slots() {
      return this.$store.getters.getThoriumSlots
    },
    battleState() {
      return this.$store.getters.getBattleState
    },
    unit() {
      return this.$store.getters.getUnit
    },
    chatState() {
      return this.$store.getters.getChatState
    },
    currentSpeed() {
      return this.$store.getters.getUnitSpeed
    },
    state() {
      return this.$store.getters.getUnitState
    },
    user() {
      return this.$store.getters.getGamePlayer
    },
    getSpeedColor() {
      if (this.state.efficiency_reactor <= 0.33) {
        return "#FF0000";
      } else if (this.state.efficiency_reactor <= 0.66) {
        return "#FFF000";
      } else if (this.state.efficiency_reactor <= 1) {
        return "#00FF00";
      }
    },
    countRecovery() {
      let countRecovery = 0;

      for (let i in this.unit.body.thorium_slots) {
        let slot = this.unit.body.thorium_slots[i];
        if (slot.count > 0) {
          countRecovery += slot.processing_thorium
        }
      }

      return countRecovery
    },
  },
  components: {
    AppControl: Control,
    AppMinSquad: MinSquad,
    AppKillBoard: KillBoard,
  }
}
</script>

<style scoped>
#StatusBarWrapper {
  position: absolute;
  border-radius: 5px;
  background: rgb(8, 138, 210);
  border: 1px solid #25a0e1;
  padding: 17px 1px 0;
  left: 5px;
  top: 5px;
}

#StatusBarUserInfo {
  float: left;
  height: 100px;
  background: #8c8c8c;
  width: 200px;
  margin: 2px 0 0 0;
  border-radius: 5px;
  box-shadow: inset 0 0 2px;
}

.bars {
  float: left;
  width: 100%;
  margin-top: 3px;
}

.user_avatar {
  float: left;
  height: 50px;
  width: 50px;
  margin: 5px;
  border-radius: 2px;
  background: grey;
  box-shadow: 0 0 2px black;
  z-index: 1;
  position: relative;
  background-size: cover;
}

.user_name {
  color: white;
  float: left;
  padding: 0;
  margin: 6px 2px 2px -10px;
  box-shadow: 0 0 2px black;
  background: rgb(119, 119, 119);
  padding-left: 8px;
  height: 16px;
  display: block;
  line-height: 19px;
  font-size: 12px;
  width: calc(100% - 65px);
}

.hp_bar_wrapper, .energy_bar_wrapper {
  width: calc(100% - 25px);
  height: 10px;
  border: 1px solid #4c4c4c;
  text-align: left;
  display: block;
  box-shadow: inset 0 0 2px black, 0 0 2px black;
  border-radius: 10px;
  background-size: 12%;
  overflow: hidden;
  background-color: #959595;
  margin: 0 auto 0;
}

.hp_bar_wrapper span, .energy_bar_wrapper span {
  display: block;
  font-size: 10px;
  line-height: 11px;
  width: 100%;
  text-align: center;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 1);
  font-weight: bold;
  margin: auto;
  float: left;
  color: white;
}

.hp_bar_inner, .energy_bar_inner {
  overflow: visible;
  height: 100%;
  box-shadow: inset 0 0 2px black;
}

#statusBar #Thorium .Thorium.noActive:after {
  content: "N/A";
  font-size: 14px;
  padding: 5px;
  color: #adadad;
  position: relative;
  top: -6px;
}

#statusBar #Thorium .Thorium:active {
  box-shadow: inset 0 0 5px rgb(84, 184, 255) !important;
}

#statusBar #Thorium .Thorium:hover {
  box-shadow: inset 0 0 5px rgb(187, 255, 241) !important;
}

#Afterburner:active {
  background: url(https://img.icons8.com/ultraviolet/64/000000/biohazard.png) center center / 90% no-repeat;
}

#Afterburner:hover {
  filter: drop-shadow(0px 0px 4px #dd0019) !important;
}

.hp_bar_wrapper.session, .energy_bar_wrapper.session {
  width: calc(100% - 70px);
  float: left;
  margin-top: 4px;
  height: 8px;
}

.hp_bar_wrapper.session span, .energy_bar_wrapper.session span {
  font-size: 9px;
  line-height: 9px;
}

#StatusBarUserInfo.StatusBarSession {
  height: 59px;
  width: 100%;
}

.kills {
  height: 23px;
  width: 23px;
  float: left;
}

.kills.count {
  background: none;
  line-height: 35px;
  margin-left: 5px;
  color: white;
  font-weight: 900;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
}

.exitTime, .lawTime {
  position: absolute;
  height: 35px;
  width: 35px;
  background-size: cover;
  background-image: url(https://img.icons8.com/fluent/48/000000/medium-risk.png);
  left: calc(100% + 12px);
  top: 1px;
  filter: drop-shadow(0px 0px 2px black);
}

.lawTime {
  background-image: url(https://img.icons8.com/emoji/48/000000/red-triangle-pointed-up-emoji.png);
  left: calc(100% + 55px);
  top: 2px;
}

.exitTime .time, .lawTime .time {
  color: yellow;
  font-weight: 900;
  font-size: 10px;
  position: absolute;
  top: 100%;
  width: 100%;
  text-align: center;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
}

.vio {
  font-size: 8px;
  line-height: 45px;
  color: white;
  width: 100%;
  text-align: center;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
}
</style>
<style>
@keyframes alertPulse {
  0% {
    -moz-box-shadow: inset 0 0 5px 0 rgb(255, 209, 0);
    box-shadow: inset 0 0 5px 0 rgb(255, 241, 13);
  }
  70% {
    -moz-box-shadow: inset 0 0 10px 10px rgba(204, 169, 44, 0);
    box-shadow: inset 0 0 10px 10px rgba(204, 169, 44, 0);
  }
  100% {
    -moz-box-shadow: inset 0 0 10px 0 rgba(204, 169, 44, 0);
    box-shadow: inset 0 0 0 10px rgba(204, 169, 44, 0);
  }
}
</style>
