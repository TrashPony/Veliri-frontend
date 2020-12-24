<template>
  <div>

    <app-mini-map/>
    <app-status-bar/>
    <app-equip-bar-wrapper/>
    <app-sector-status/>
    <app-battle-state/>
    <app-end-status/>

    <div id="displayNotify">
      <div id="catchAnomaly" style="color: #0cfdff" v-if="!battleState && lowPower">
        <div class="displayNotifyText">Мало энергии!</div>
      </div>
      <div id="criticalDamage" style="color: red" v-if="criticalDamage">
        <div class="displayNotifyText">Критические повреждения!</div>
      </div>
      <div id="dead" style="color: red"
           v-if="battleState && battleState.players && battleState.players[currentUser.user_id] && !battleState.players[currentUser.user_id].live">
        <div class="displayNotifyText">Транспорт унитожен!</div>

        <div class="respawnBlock" :class="{disable: battleState.players[currentUser.user_id].count_respawn === 0}">

          <div v-if="battleState.players[currentUser.user_id].respawn_time > 0">
            Возвраждение через {{ battleState.players[currentUser.user_id].respawn_time }} сек.
          </div>

          <div v-if="battleState.players[currentUser.user_id].respawn_time === 0">
            <div class="respawnButton"
                 :class="{disable: battleState.players[currentUser.user_id].count_respawn === 0}"
                 @click="respawn">Возрадится.
            </div>
          </div>

          <div class="countRespawn" v-if="battleState.players[currentUser.user_id].count_respawn < 100">
            Осталось: {{ battleState.players[currentUser.user_id].count_respawn }}
          </div>
        </div>
      </div>
    </div>

    <template v-if="visibleLabels">

      <app-reservoir-tip
        v-for="window in reservoirTips"
        v-bind:windowID="window.id"
        v-bind:meta="window.meta"/>

      <app-user-msg
        v-for="window in userMsgs"
        v-bind:windowID="window.id"
        v-bind:meta="window.meta"/>

      <template v-if="currentUser && currentUser.game_mode === 'open_world'">
        <app-user-label
          v-for="window in userLabels"
          v-bind:windowID="window.id"
          v-bind:meta="window.meta"/>
      </template>
    </template>

    <app-hit-item
      v-for="window in hitItems"
      v-bind:windowID="window.id"
      v-bind:meta="window.meta"/>


    <app-box-pass
      v-for="window in boxPasss"
      v-bind:windowID="window.id"
      v-bind:action="window.meta.action"
      v-bind:boxID="window.meta.boxID"
      v-bind:boxSlot="window.meta.slot"/>

    <app-object-dialog
      v-for="window in objectDialogs"
      v-bind:windowID="window.id"
      v-bind:meta="window.meta"/>

    <app-teams/>
    <app-build-menu v-if="openComponents['buildDialogWrapper'] && openComponents['buildDialogWrapper'].open"/>
    <app-geo-scan v-if="openComponents['anomalyScannerWrapper'] && openComponents['anomalyScannerWrapper'].open"/>

    <div id="globalMenu">

      <div id="hangarButton"
           @click="openService('inventoryBox')"
           style="background-image: url('https://img.icons8.com/ios-glyphs/30/000000/hangar.png')"/>

      <div id="inventoryButton"
           @click="openService('wrapperInventoryAndStorage')"
           style="background-image: url('https://img.icons8.com/ios/32/000000/stacking.png')"/>

      <div v-if="gameUser && gameUser.game_mod === 'open_world'"
           @click="openService('marketBox')"
           style="background-image: url('https://img.icons8.com/ios-glyphs/100/000000/buy.png')"/>

      <div v-if="gameUser && gameUser.game_mod === 'open_world'"
           @click="openService('GlobalViewMap')"
           style="background-image: url('https://img.icons8.com/windows/64/000000/map.png')"/>

      <div style="background-image: url('https://img.icons8.com/material-outlined/48/000000/conference-call.png')"
           @click="sub === 'social' ? sub = '' : sub = 'social'">
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

      <div v-if="gameUser && gameUser.game_mod === 'open_world'"
           @click="evacuation"
           style="background-image: url('https://img.icons8.com/color/40/000000/drone.png')"/>

      <div @click="openService('buildDialogWrapper')"
           style="background-image: url('https://img.icons8.com/cotton/64/000000/forklift-tracktor.png')"/>

      <div @click="openService('helpWrapper', {name: 'Приветсвие'})"
           style="background-image: url('https://img.icons8.com/color/48/000000/help--v1.png')"/>

      <div v-if="gameUser && gameUser.game_mod !== 'open_world'"
           @click="exitGame"
           style="background-image: url('https://img.icons8.com/ios-glyphs/30/000000/emergency-exit.png')"/>

    </div>
  </div>
</template>

<script>
import MiniMap from '../MiniMap/MiniMap'
import StatusBar from '../StatusBar/StatusBar'
import EquipBarWrapper from '../EquipBar/EquipBarWrapper'
import HitItem from '../HitItem/HitItem'
import SectorStatus from '../SectorStatus/SectorStatus'
import ReservoirTip from '../ReservoirTip/ReservoirTip'
import UserLabel from '../UserLabel/UserLabel'
import BoxPass from '../BoxPass/BoxPass'
import BuildMenu from '../BuildMenu/BuildMenu'
import ObjectDialog from '../ObjectDialog/ObjectDialog'
import {gameStore} from "../../game/store";
import UserMsg from "../UserMsg/UserMsg";
import Teams from "../Teams/Teams";
import BattleState from "../BattleState/BattleState";
import EndStatus from '../BattleState/EndStatus';
import GeoScan from '../GeoScan/GeoScan';

export default {
  name: "Global",
  data() {
    return {
      sub: '',
    }
  },
  created() {
    if (!this.$store.getters.getWSByService('market').connect) {
      this.$store.commit({
        type: 'reconnectWS',
        service: 'market',
        force: false,
      });
    }

    if (this.$store.getters.getWSByService('chat').connect) {
      this.$store.getters.getWSByService('chat').socket.send(JSON.stringify({
        event: "OpenChat",
      }));
    } else {
      this.$store.commit({
        type: 'reconnectWS',
        service: 'chat',
        force: false,
      });
    }

    if (this.$store.getters.getWSByService('inventory').connect) {
      this.$store.getters.getWSByService('inventory').socket.send(JSON.stringify({
        event: "openInventory"
      }));
    } else {
      this.$store.commit({
        type: 'reconnectWS',
        service: 'inventory',
        force: false,
      });
    }

    if (this.$store.getters.getWSByService('global').connect) {
      this.$store.getters.getWSByService('global').socket.send(JSON.stringify({
        event: "InitGame"
      }));
    } else {
      this.$store.commit({
        type: 'reconnectWS',
        service: 'global',
        force: true,
      });
    }
  },
  mounted() {
    gameStore.reload = false;
  },
  methods: {
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
    respawn() {
      this.$store.getters.getWSByService('global').socket.send(JSON.stringify({
        event: "respawn"
      }));
    },
    getWindows(type) {
      let windows = [];
      for (let i in this.openComponents) {
        if (this.openComponents.hasOwnProperty(i) && this.openComponents[i].open && this.openComponents[i].meta && this.openComponents[i].component === type) {
          windows.push(this.openComponents[i])
        }
      }

      return windows
    },
    exitGame() {
      this.$store.getters.getWSByService('chat').socket.send(JSON.stringify({
        event: "ExitGame",
      }));
    },
  },
  computed: {
    visibleLabels() {
      if (!this.inventory.selectEquip || this.inventory.selectEquip.type !== 'weapon') {
        return true
      } else {
        for (let tip of this.reservoirTips) {
          this.$store.commit({
            type: 'toggleWindow',
            id: tip.id,
            forceClose: true,
          });
        }

        for (let msg of this.userMsgs) {
          this.$store.commit({
            type: 'toggleWindow',
            id: msg.id,
            forceClose: true,
          });
        }
      }
    },
    currentUser() {
      return this.$store.getters.getUser
    },
    openComponents() {
      return this.$store.getters.getNeedOpenComponents
    },
    criticalDamage() {
      let inv = this.$store.getters.getInventory;
      if (inv && inv.stateMS && inv.unit) {
        return (100 / (inv.stateMS.max_hp / inv.unit.hp)) < 25 && inv.unit.hp > 0
      } else {
        return false
      }
    },
    lowPower() {
      let fillSlot = 0

      if (!this.$store.getters.getThoriumSlots) return true;

      for (let i in this.$store.getters.getThoriumSlots) {
        let slot = this.$store.getters.getThoriumSlots[i];
        if (slot.count > 0) {
          fillSlot++
        }
      }

      return fillSlot !== this.$store.getters.getThoriumSlots.length
    },
    reservoirTips() {
      return this.getWindows('reservoirTip')
    },
    hitItems() {
      return this.getWindows('HitItem')
    },
    userMsgs() {
      return this.getWindows('UserMsg');
    },
    userLabels() {
      return this.getWindows('userLabel');
    },
    boxPasss() {
      return this.getWindows('boxPass');
    },
    objectDialogs() {
      return this.getWindows('ObjectDialog');
    },
    gameUser() {
      return this.$store.getters.getGamePlayer
    },
    inventory() {
      return this.$store.getters.getInventory
    },
    battleState() {
      return this.$store.getters.getBattleState
    },
  },
  components: {
    AppMiniMap: MiniMap,
    AppStatusBar: StatusBar,
    AppEquipBarWrapper: EquipBarWrapper,
    AppSectorStatus: SectorStatus,
    AppReservoirTip: ReservoirTip,
    AppBoxPass: BoxPass,
    AppBuildMenu: BuildMenu,
    AppObjectDialog: ObjectDialog,
    AppUserLabel: UserLabel,
    AppHitItem: HitItem,
    AppUserMsg: UserMsg,
    AppTeams: Teams,
    AppBattleState: BattleState,
    AppEndStatus: EndStatus,
    AppGeoScan: GeoScan,
  }
}
</script>

<style scoped>
#globalMenu {
  bottom: 15px;
  right: 15px;
  text-align: center;
  float: left;
  border-radius: 5px;
  position: absolute;
  padding: 2px;
  border: 1px solid #25a0e1;
  background: rgb(8, 138, 210);
}

#globalMenu > div {
  height: 30px;
  width: 30px;
  filter: drop-shadow(0 0 2px black);
  box-shadow: inset 0 0 5px black;
  background: #8cb3c7;
  border-radius: 5px;
  margin: 2px 5px 2px 5px;
  float: left;
  transition: 0.2s;
  background-size: contain;
}

#globalMenu > div:hover {
  background-color: #b4eaff;
}

#globalMenu > div:active {
  transform: scale(0.99);
}

#displayNotify {
  position: absolute;
  width: 100%;
  pointer-events: none;
  top: 15%;
}

#criticalDamage, #catchAnomaly, #dead {
  font-family: 'Audiowide', cursive;
  width: 100%;
  text-align: center;
  height: 50px;
  color: #bdbd00;
  font-size: 50px;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
}

.displayNotifyText {
  animation: LowGravity 2s infinite;
}

@keyframes LowGravity {
  0% {
    opacity: 0.5;
  }
  50% {
    opacity: 0.9;
  }
  100% {
    opacity: 0.5;
  }
}

.sub {
  position: absolute;
  min-height: 20px;
  width: 200px;
  border: 1px solid rgba(37, 160, 225, 0.2);
  background: rgba(8, 138, 210, 0.2);
  border-radius: 5px;
  bottom: calc(100% + 8px);
  right: -2px;
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

.respawnBlock {
  font-size: 16px;
  color: white;
  border-radius: 5px;
  padding: 3px 4px;
  width: 150px;
  margin: 6px auto;
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none;
  border: 1px solid rgba(37, 160, 225, 0.8);
  background: rgba(8, 138, 210, 0.8);
}

.respawnBlock.disable {
  opacity: 0.5;
}

.respawnButton {
  background: rgba(255, 129, 0, 0.75);
  box-shadow: 0 0 2px black;
  pointer-events: all;
  transition: 100ms;
  border-radius: 5px;
}

.respawnButton.disable {
  background: rgba(84, 78, 72, 0.75);
  color: rgba(145, 145, 145, 0.75);
}

.respawnButton:hover {
  background: rgba(255, 129, 0, 1);
}

.respawnButton.disable:hover {
  background: rgba(84, 78, 72, 0.75);
}

.respawnButton:active {
  transform: scale(0.98);
}

.respawnButton.disable:active {
  transform: scale(1);
}

.countRespawn {
  color: rgba(255, 255, 255, 0.8);
  margin-top: 5px;
  font-size: 14px;
}
</style>
