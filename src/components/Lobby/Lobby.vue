<template>
  <div id="lobbyWrapper">
    <template v-if="baseStatus.state">

      <app-training/>

      <div id="ServiceTable">

        <div id="hangarButton"
             @click="openService('inventoryBox')"
             style="background-image: url('https://img.icons8.com/ios-glyphs/30/000000/hangar.png')"/>

        <div id="inventoryButton"
             @click="openService('wrapperInventoryAndStorage')"
             style="background-image: url('https://img.icons8.com/ios/32/000000/stacking.png')"/>

        <div @click="openService('marketBox')"
             style="background-image: url('https://img.icons8.com/ios-glyphs/100/000000/buy.png')"/>

        <template v-if="currentUser.fraction === baseStatus.fraction">

          <div id="processorButton"
               v-if="baseStatus.state.type === 'processing_plant' || baseStatus.state.type === 'lobby'"
               @click="openService('processorRoot')"
               style="background-image: url('https://img.icons8.com/metro/26/000000/recycle-sign.png')"/>

          <div id="workbenchButton" v-if="baseStatus.state.type === 'base'|| baseStatus.state.type === 'lobby'"
               @click="openService('Workbench')"
               style="background-image: url('https://img.icons8.com/ios-glyphs/30/000000/manufacturing.png')"/>

          <div id="prefabricatedButton"
               v-if="baseStatus.state.type === 'prefabricated_plant' || baseStatus.state.type === 'lobby'"
               @click="openService('prefabricatedMenuWrapper')"
               style="background-image: url('https://img.icons8.com/ios-filled/50/000000/screw.png')"/>

        </template>

        <div v-if="currentUser.fraction === baseStatus.fraction"
             id="DepartmentOfEmploymentButton"
             @click="openBaseDepartment"
             style="background-image: url('https://img.icons8.com/ios/50/000000/department.png')"/>

        <div v-if="baseStatus.state.type !== 'lobby'" @click="openService('GlobalViewMap')"
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

        <div id="OutBaseButton"
             @click="openService('ExitMenu')"
             style="background-image: url('https://img.icons8.com/material/40/000000/exit.png')"/>

        <div style="background-image: url('https://img.icons8.com/color/48/000000/help--v1.png')"
             @click="sub === 'help' ? sub = '' : sub = 'help'">

          <div v-if="sub === 'help'" class="sub" @click.stop="">

            <div
              @click.stop="openService('TechnologyMenu', {fraction: currentUser.fraction, category: 'body'})">
              <img src="https://img.icons8.com/offices/40/000000/tree-structure.png"/>
              <h4>Дерево технологий</h4>
            </div>

            <div
              @click.stop="openService('helpWrapper', {name: 'Приветсвие'})">
              <img src="https://img.icons8.com/color/48/000000/help--v1.png"/>
              <h4>Помощь</h4>
            </div>
          </div>
        </div>

        <div class="RankWrapper">
          <app-session-battle-rank/>
        </div>
      </div>

      <div id="OutDialog" v-if="baseStatus.exit">
        <h3>Ожидайте освобождение главных ворот!</h3>
        <div>
          <div class="arrow">
            <span/>
            <span/>
            <span/>
          </div>
        </div>
      </div>

      <template
        v-if="(baseStatus.state.type !=='not_work' && baseStatus.state.type !== 'hostile') || baseStatus.state.type === 'lobby'">
        <app-base-status/>

        <template v-if="currentUser.fraction === baseStatus.fraction">
          <app-workbench
            v-if="(baseStatus.state.type === 'base'|| baseStatus.state.type === 'lobby') && openComponents['Workbench'] && openComponents['Workbench'].open"/>

          <app-processor-root
            v-if="(baseStatus.state.type === 'processing_plant'|| baseStatus.state.type === 'lobby') && openComponents['processorRoot'] && openComponents['processorRoot'].open"/>

          <app-prefabricated-menu
            v-if="(baseStatus.state.type === 'prefabricated_plant'|| baseStatus.state.type === 'lobby') && openComponents['prefabricatedMenuWrapper'] && openComponents['prefabricatedMenuWrapper'].open"/>

        </template>
      </template>

      <app-exit-menu
        v-if="openComponents['ExitMenu'] && openComponents['ExitMenu'].open"/>

      <div id="dialogBase" style="height: 100px;"
           v-if="baseStatus.state.type ==='not_work' || baseStatus.state.type ==='hostile'">

        <app-control v-bind:head="'Сообщение базы: '"
                     v-bind:move="true"
                     v-bind:close="false"
                     v-bind:refWindow="'dialogBase'"/>

        <div id="textWrapper" style="height: calc(100% - 63px)">
          <div v-if="baseStatus.state.type ==='not_work'"> База обесточена и не может поставлять услуги</div>
          <div v-if="baseStatus.state.type ==='hostile'"> База захвачена врагом!</div>
        </div>


        <input value="Выйди из базы" type="button" @click="outBase()">
        <input value="Перенсти сознание в столицу" type="button" onclick="">
      </div>
    </template>
  </div>
</template>

<script>
import Control from '../Window/Control';
import BaseStatus from './BaseStatus'
import ExitMenu from './ExitMenu'
import SessionBattleRank from './SessionBattleRank'
import Workbench from '../Workbench/Workbench'
import ProcessorRoot from '../ProcessorRoot/ProcessorRoot'
import PrefabricatedMenu from '../PrefabricatedMenu/PrefabricatedMenu'
import {gameStore} from "../../game/store";
import Training from '../Training/Training'
import Loader from '../Loader/Loader'
import {RemoveOldMap} from "../../game/map/remove_old_map";

export default {
  name: "Lobby",
  data() {
    return {
      sub: '',
      connectChecker: null,
    }
  },
  destroyed() {
    clearInterval(this.connectChecker);
  },
  created() {

    let app = this;
    gameStore.reload = true;
    gameStore.unitReady = false;
    RemoveOldMap();

    app.connectChecker = setInterval(function () {
      if (!app.$store.getters.getWSByService('lobby').connect) {
        app.$store.commit({
          type: 'reconnectWS',
          service: 'lobby',
          force: false,
        });
      }

      if (!app.$store.getters.getWSByService('market').connect) {
        app.$store.commit({
          type: 'reconnectWS',
          service: 'market',
          force: false,
        });
      }

      if (!app.$store.getters.getWSByService('chat').connect) {
        app.$store.commit({
          type: 'reconnectWS',
          service: 'chat',
          force: false,
        });
      }

      if (!app.$store.getters.getWSByService('inventory').connect) {
        app.$store.commit({
          type: 'reconnectWS',
          service: 'inventory',
          force: false,
        });
      }
    }, 1000);

    app.$store.commit({
      type: 'reconnectWS',
      service: 'lobby',
      force: true,
    });

    if (app.$store.getters.getWSByService('chat').connect) {
      app.$store.getters.getWSByService('chat').socket.send(JSON.stringify({
        event: "OpenChat",
      }));
    }

    if (app.$store.getters.getWSByService('inventory').connect) {
      app.$store.getters.getWSByService('inventory').socket.send(JSON.stringify({
        event: "openInventory"
      }));
    }
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
    outBase() {
      this.$store.getters.getWSByService('lobby').socket.send(JSON.stringify({
        event: "OutBase"
      }));
      this.$store.commit({
        type: 'toggleWindow',
        id: 'ExitMenu',
        forceClose: true,
      });
    },
    openBaseDepartment() {
      this.$store.getters.getWSByService('chat').socket.send(JSON.stringify({
        event: "openDepartmentOfEmployment",
      }));
    }
  },
  computed: {
    currentUser() {
      return this.$store.getters.getUser
    },
    baseStatus() {
      return this.$store.getters.getBaseStatus
    },
    openComponents() {
      return this.$store.getters.getNeedOpenComponents
    }
  },
  components: {
    AppTraining: Training,
    AppBaseStatus: BaseStatus,
    AppWorkbench: Workbench,
    AppProcessorRoot: ProcessorRoot,
    AppPrefabricatedMenu: PrefabricatedMenu,
    AppControl: Control,
    AppLoader: Loader,
    AppExitMenu: ExitMenu,
    AppSessionBattleRank: SessionBattleRank,
  }
}
</script>

<style scoped>
#lobbyWrapper {
  height: 100vh;
  width: 100%;
  text-align: center;
  background-color: #7f7f7f;
  background-image: url('../../assets/bases/base.jpg');
  background-size: cover;
  background-attachment: fixed;
  background-position: center;
}

#ServiceTable {
  top: 15px;
  left: 15px;
  text-align: center;
  float: left;
  border-radius: 5px;
  position: relative;
  padding: 2px;
  border: 1px solid #25a0e1;
  background: rgb(8, 138, 210);
}

#ServiceTable > div {
  height: 30px;
  width: 30px;
  filter: drop-shadow(0 0 2px black);
  box-shadow: inset 0 0 5px black;
  background: #8cb3c7;
  border-radius: 5px;
  margin: 2px 5px 2px 5px;
  float: left;
  transition: 0.1s;
  background-size: contain;
  position: relative;
  z-index: 100;
}

#ServiceTable > div:hover {
  background-color: #b4eaff;
}

#ServiceTable > div:active {
  transform: scale(0.99);
}

#dialogBase {
  pointer-events: auto;
  height: 80px;
  width: 267px;
  border: 1px solid rgb(37, 160, 225);
  background-size: 10px 2px;
  background-image: linear-gradient(1deg, rgba(33, 176, 255, 0.6), rgba(37, 160, 225, 0.6) 6px);
  position: absolute;
  border-radius: 5px;
  padding: 20px 2px 2px;
  left: calc(50% - 133px) !important;
  top: 40% !important;
}

#dialogBase #textWrapper {
  box-shadow: inset 0 0 5px black;
  background: #8cb3c7;
  border-radius: 5px;
  height: calc(100% - 42px);
  position: relative;
  color: #ff7800;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
  padding: 10px;
  font-size: 15px;
}

#dialogBase input {
  margin: 2px auto;
  width: 100%;
  background: rgb(221, 112, 52);
  box-shadow: inset 0 0 4px 0 white;
  color: rgba(255, 255, 255, 0.8);
  display: block;
}

#dialogBase input:hover {
  cursor: pointer;
  box-shadow: inset 0 0 4px 0 #20fffd;
}

#dialogBase input:active {
  transform: scale(0.98);
}

#OutDialog {
  position: absolute;
  top: 50px;
  left: calc(50% - 150px);
  display: block;
  width: 300px;
  height: 100px;
  z-index: 999;
}

#OutDialog h3 {
  color: #ff8100;
  font-size: 11px;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
  margin: 8px 4px;
  padding: 5px 0;
  box-shadow: inset 0 0 2px 0 black;
  border-radius: 9px;
  border: 1px solid #25a0e1;
  background: rgb(8, 138, 210);
}

#OutDialog > div {
  height: 52px;
  width: 175px;
  margin: 0 auto;
  background: rgba(2, 2, 2, 0.2);
  padding-left: 0px;
  border-radius: 0 0 40% 40%;
  margin-top: -9px;
}

.arrow {
  width: 60px;
  height: 32px;
  margin-left: 14px;
  padding-top: 6px;
  transform: rotate(270deg) scale(0.9);
}

.arrow span {
  display: block;
  width: 30px;
  height: 30px;
  border-bottom: 5px solid rgb(222, 156, 0);
  border-right: 5px solid rgb(255, 204, 0);
  transform: rotate(45deg);
  margin: 5px;
  animation: animate 2s infinite;
  filter: drop-shadow(0 0 5px rgba(255, 250, 0, 1));
}

.arrow span:nth-child(2) {
  animation-delay: -0.2s;
}

.arrow span:nth-child(3) {
  animation-delay: -0.4s;
}

@keyframes animate {
  0% {
    opacity: 0;
    transform: rotate(45deg) translate(-20px, -20px);
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: rotate(45deg) translate(20px, 20px);
  }
}

.sub {
  position: absolute;
  min-height: 20px;
  min-width: 200px;
  border: 1px solid rgba(37, 160, 225, 0.2);
  background: rgba(8, 138, 210, 0.2);
  border-radius: 5px;
  top: calc(100% + 8px);
  left: -2px;
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

#ServiceTable .RankWrapper {
  position: absolute;
  top: calc(100% - 2px);
  width: calc(100% - 75px);
  background: none;
  box-shadow: none;
  z-index: 0;
}

#ServiceTable .RankWrapper:hover {
  background: none;
}

#ServiceTable .RankWrapper:active {
  transform: none;
}
</style>
