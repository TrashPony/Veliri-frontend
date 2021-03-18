<template>
  <div class="menuBar">

    <div class="menuBarInner">
      <div class="menu" style="padding: 0">

        <div class="audio_player_wrapper"
             :style="{right: audioPlayerVisible ? 'calc(100% - 31px)' : 'calc(100% - 200px)' }">
          <app-audio-player/>
        </div>

        <div class="menuPoint_audio" @click="audioPlayerVisible = !audioPlayerVisible"
             style="background-image: url('https://img.icons8.com/material/80/000000/smart-playlist.png')"/>
      </div>
    </div>

    <div class="menuBarInner">
      <div class="menu">

        <div class="menuPoint" @click="openService('inventoryBox')"
             style="background-image: url('https://img.icons8.com/ios-glyphs/30/000000/hangar.png')"/>

        <div class="menuPoint" @click="openService('wrapperInventoryAndStorage')"
             style="background-image: url('https://img.icons8.com/ios/32/000000/stacking.png')"/>

        <div class="menuPoint" v-if="currentUser.game_mode === 'open_world'" @click="openService('marketBox')"
             style="background-image: url('https://img.icons8.com/ios-glyphs/100/000000/buy.png')"/>

        <div class="menuPoint" v-if="currentUser.game_mode === 'open_world'"
             title="Карта" @click="openService('GlobalViewMap')"
             style="background-image: url('https://img.icons8.com/material-outlined/52/000000/treasure-map.png')"/>

        <div class="menuPoint" @click="openService('buildDialogWrapper')"
             style="background-image: url('https://img.icons8.com/material/50/000000/drill.png')"/>

        <div class="menuPoint" v-if="currentUser.game_mode === 'open_world'" @click="evacuation"
             style="background-image: url('https://img.icons8.com/ios-filled/50/000000/tow-truck.png')"/>

        <div class="menuPoint" @click="sub === 'social' ? sub = '' : sub = 'social'" title="Общение"
             style="background-image: url('https://img.icons8.com/pastel-glyph/64/000000/network.png')">

          <div v-if="sub === 'social'" class="sub" @click.stop="">
            <div
              @click.stop="openService('userStat' + currentUser.user_id, {user_id: currentUser.user_id}, 'userStat', true)">
              <img src="https://img.icons8.com/material/48/000000/small-robot.png"/>
              <h4>Личное дело</h4>
            </div>

            <div @click.stop="openService('FriendList')">
              <img src="https://img.icons8.com/windows/32/000000/add-user-group-woman-woman.png"/>
              <h4>Друзья</h4>
            </div>

            <div @click.stop="openService('GroupMenu')">
              <img src="https://img.icons8.com/windows/48/000000/conference-call.png"/>
              <h4>Группа</h4>
            </div>

            <div @click.stop="openService('Corporation')">
              <img src="https://img.icons8.com/windows/80/000000/filled-flag--v1.png"/>
              <h4>Кластер</h4>
            </div>
          </div>

        </div>

        <div class="menuPoint" title="Дерево технологий"
             @click.stop="openService('TechnologyMenu', {fraction: currentUser.fraction, category: 'body'})"
             style="background-image: url('https://img.icons8.com/metro/52/000000/genealogy.png')"/>

        <div class="menuPoint" title="Помощь" @click.stop="openService('helpWrapper', {name: 'Приветсвие'})"
             style="background-image: url('https://img.icons8.com/flat_round/64/000000/question-mark.png')"/>

        <div class="menuPoint" v-if="currentUser.game_mode !== 'open_world'" @click="exitGame"
             style="background-image: url('https://img.icons8.com/ios-glyphs/30/000000/emergency-exit.png')"/>
      </div>
    </div>

    <div class="menuBarInner" title="Автопилот">
      <div class="menu" style="padding: 0" :class="{on: inventory.unit && inventory.unit.autoPilot}">
        <div class="menuPoint_audio" @click="autoPilotChange"
             style="background-image: url('https://img.icons8.com/cotton/64/000000/route.png')"/>
      </div>
    </div>

    <div class="credits_wrapper" title="кредиты">
      <div class="credits">
        <div class="credits_icon"/>
        <div class="credits_count">{{ market.my_credits }}</div>
      </div>
    </div>

    <div class="inventory_size_out_wrapper" title="трюм">
      <div class="inventory_size">
        <div class="inventory_size_icon"/>
        <div class="inventory_size_wrapper">
          <app-size v-if="inventory.warehouses['squadInventory']"
                    v-bind:capacity="inventory.warehouses['squadInventory'].capacity"
                    v-bind:size="inventory.warehouses['squadInventory'].size"/>
        </div>
      </div>
    </div>

    <div class="reactor_out_wrapper" title="топливо" v-if="user && user.game_mode === 'open_world'">
      <div class="reactor">
        <div class="reactor_icon"/>
        <app-reactor-status/>
      </div>
    </div>

    <app-notifys/>

    <div class="bottom_line">
    </div>
  </div>
</template>

<script>
import Size from '../Inventory/Size'
import BackgroundItemCell from '../Inventory/BackgroundItemCell';
import AudioPlayer from "../AudioPlayer/AudioPlayer"
import ReactorStatus from '../StatusBar/ReactorStatus';
import Notifys from './Notifys'

export default {
  name: "MenuBar",
  data() {
    return {
      sub: '',
      audioPlayerVisible: false,
    }
  },
  methods: {
    autoPilotChange() {
      this.$store.getters.getWSByService('global').socket.send(JSON.stringify({
        event: "AutoPilotChange"
      }));
    },
    openService(service, meta, component = '', forceOpen = false) {
      this.sub = '';
      this.$store.commit({
        type: 'toggleWindow',
        id: service,
        component: component,
        meta: meta,
        forceOpen: forceOpen,
      });
    },
    evacuation() {
      this.$store.getters.getWSByService('global').socket.send(JSON.stringify({
        event: "evacuation"
      }));
    },
    exitGame() {
      this.$store.getters.getWSByService('chat').socket.send(JSON.stringify({
        event: "ExitGame",
      }));
    },
  },
  computed: {
    language() {
      return this.$store.getters.getSettings.Language
    },
    handbook() {
      return this.$store.getters.getHandBook
    },
    user() {
      return this.$store.getters.getUser
    },
    currentUser() {
      return this.$store.getters.getUser
    },
    market() {
      return this.$store.getters.getMarket
    },
    inventory() {
      return this.$store.getters.getInventory
    },
    chatState() {
      let chats = this.$store.getters.getChatState;
      this.currentChatID = chats.currentChatID;
      return chats
    },
  },
  components: {
    AppSize: Size,
    AppBackgroundItemCell: BackgroundItemCell,
    AppAudioPlayer: AudioPlayer,
    AppReactorStatus: ReactorStatus,
    AppNotifys: Notifys,
  }
}
</script>

<style scoped>
.menuBar {
  position: fixed;
  display: block;
  width: calc(100% - 2px);
  height: 32px;
  bottom: 0;
  z-index: 999;
  pointer-events: none;
}

.menuBarInner {
  margin-right: 5px;
  height: calc(100% - 4px);
  border-radius: 5px 5px 0 0;
  user-select: none;
  white-space: nowrap;
  text-overflow: ellipsis;
  border: 1px solid #25a0e1;
  background: rgb(8, 138, 210);
  box-shadow: 0 0 2px black;
  padding: 2px 2px 0 2px;
  float: right;
  position: relative;
  z-index: 12;
  pointer-events: auto;
}

.menu, .credits, .inventory_size, .reactor {
  float: right;
  padding: 2px;
  box-shadow: 0 0 2px black;
  border-radius: 3px;
  background: #8aaaaa;
}

.reactor {
  padding: 2px 0 2px 0;
  width: 103px;
  height: calc(100% - 5px);
}

.credits, .inventory_size {
  width: 60px;
  height: calc(100% - 5px);
}

.inventory_size {
  width: 90px;
}

.credits_icon, .inventory_size_icon, .reactor_icon {
  height: 16px;
  width: 16px;
  margin-top: -2px;
  float: left;
  filter: drop-shadow(0px 0px 1px black);
  background-size: contain;
  background-image: url(https://img.icons8.com/fluent/48/000000/stack-of-coins.png)
}

.credits_count, .inventory_size_wrapper {
  background: #066ea8;
  float: right;
  width: calc(100% - 21px);
  padding-right: 4px;
  height: 100%;
  border-radius: 4px;
  color: white;
  text-align: right;
  line-height: 13px;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 1);
  box-shadow: inset 0 0 2px black;
  font-size: 9px;
}

.inventory_size_icon {
  background-image: url(https://img.icons8.com/cotton/64/000000/orthogonal-view.png)
}

.reactor_icon {
  background-image: url('../../assets/resource/enriched_thorium.png')
}

.inventory_size_wrapper {
  width: calc(100% - 16px);
  padding-right: 0;
  overflow: hidden;
  height: 100%;
}

.menuPoint {
  height: 20px;
  width: 20px;
  filter: drop-shadow(0 0 1px black);
  background: #8cb3c7;
  border-radius: 5px;
  margin: 1px 2px 1px 2px;
  float: left;
  transition: 0.1s;
  background-size: contain;
  position: relative;
  z-index: 100;
}

.menuPoint:hover {
  background-color: #b4eaff;
}

.menuPoint:active {
  transform: scale(0.95);
}

.sub {
  position: absolute;
  min-height: 20px;
  min-width: 200px;
  border: 1px solid rgba(37, 160, 225, 0.2);
  background: rgba(8, 138, 210, 0.2);
  border-radius: 5px;
  bottom: calc(100% + 5px);
  right: 0;
}

.sub > div {
  height: 35px;
  clear: both;
  background: #0cc2fb;
  border: 1px solid rgba(37, 160, 225, 0.5);
  background: rgba(8, 138, 210, 0.5);
  border-radius: 3px;
  margin: 2px;
  line-height: 35px;
  color: white;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
}

.sub > div img {
  height: 30px;
  width: 30px;
  /*filter: drop-shadow(0 0 2px black);*/
  box-shadow: inset 0 0 2px black;
  border: 1px solid grey;
  background: #8cb3c7;
  border-radius: 5px;
  margin: 2px 5px 2px 5px;
  float: left;
  transition: 0.1s;
  background-size: contain;
}

.sub > div h4 {
  margin: 0 2px;
  float: left;
  opacity: 0.8;
  font-size: 13px;
}

.sub > div:hover {
  border: 1px solid rgba(37, 160, 225, 0.8);
  background: rgba(8, 138, 210, 0.8);
}

.sub > div:hover h4 {
  opacity: 1;
  cursor: pointer;
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none;
}

.bottom_line {
  border: 1px solid rgba(37, 160, 225, 0.3);
  background: rgba(8, 138, 210, 0.3);
  height: 5px;
  box-shadow: 0 0 2px black;
  position: absolute;
  bottom: 0;
  width: 100%;
  z-index: 0;
}

.credits_wrapper, .inventory_size_out_wrapper, .reactor_out_wrapper {
  float: right;
  z-index: 999;
  position: relative;
  margin-right: 5px;
  pointer-events: auto;
  border-radius: 5px 5px 0 0;
  padding: 2px 2px 0 2px;
  border: 1px solid #25a0e1;
  background: rgb(8, 138, 210);
  box-shadow: 0 0 2px black;
  height: calc(100% - 15px);
  top: 11px;
}

.menuPoint_audio {
  height: 26px;
  width: 26px;
  filter: none;
  background-size: contain;
  border-radius: 5px;
}

.menuPoint_audio:hover {
  background-color: #b4eaff;
}

.menuPoint_audio:active {
  transform: scale(0.95);
}

.audio_player_wrapper {
  position: absolute;
  bottom: calc(100% + 5px);
  right: calc(100% - 35px);
  transition: 100ms;
}

.on {
  background: #00ff22;
}
</style>

<style>
.menuBar .sizeInventoryInfo {
  box-shadow: inset 0 0 2px black !important;
  background: none !important;
  border: none !important;
  border-radius: 2px !important;
  width: 100% !important;
}

.menuBar .sizeInventoryInfo span {
  background-image: none !important;
  font-size: 9px !important;
  line-height: 13px !important;
}

.menuBar .sizeInventoryInfo .realSize {
  background: rgba(255, 96, 0, 1) !important;
  box-shadow: inset 0 0 2px black !important;
}
</style>
