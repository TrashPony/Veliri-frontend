<template>
  <div>

    <app-mini-map/>
    <app-status-bar/>
    <app-equip-bar-wrapper/>
    <app-battle-state/>
    <app-end-status/>
    <app-points-board/>

    <div id="displayNotify">
      <div id="catchAnomaly" style="color: #0cfdff" v-if="!battleState && lowPower">
        <div class="displayNotifyText">Мало энергии!</div>
      </div>
      <div id="criticalDamage" style="color: red" v-if="criticalDamage">
        <div class="displayNotifyText">Критические повреждения!</div>
      </div>

      <div id="autoPilot" style="color: #04adf8" v-if="inventory.unit && inventory.unit.autoPilot">
        <div class="displayNotifyText">Autopilot</div>
      </div>

      <div id="secureZone" v-if="SecureZone">
        <div class="displayNotifyText">Безопасная зона</div>
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

    </template>

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
  </div>
</template>

<script>
import MiniMap from '../MiniMap/MiniMap'
import StatusBar from '../StatusBar/StatusBar'
import EquipBarWrapper from '../EquipBar/EquipBarWrapper'
import HitItem from '../HitItem/HitItem'
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
import PointsBoard from '../BattleState/PointsBoard';

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
      gameStore.gameDataInit.data = false;
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
  },
  computed: {
    SecureZone() {
      return this.$store.getters.getSecureZone
    },
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
    AppPointsBoard: PointsBoard,
  }
}
</script>

<style scoped>
#displayNotify {
  position: absolute;
  width: 100%;
  pointer-events: none;
  top: 15%;
}

#criticalDamage, #catchAnomaly, #dead, #autoPilot, #secureZone {
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
