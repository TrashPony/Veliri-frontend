<template>
  <div id="lobbyWrapper">

    <div class="RankWrapper">
      <app-session-battle-rank/>
    </div>

    <template v-if="baseStatus.state">

      <app-training/>

      <div id="ServiceTable">
        <div class="head">
          <div class="base_icon"
               :style="{backgroundImage: 'url(' + require('../../assets/map/objects/sector_structure/' + baseStatus.state.sprite_texture + '.png') + ')'}"/>
          <h3 class="base_name">
            <span class="base_type">{{ getBaseTypeName(baseStatus.state.type) + ':' }}</span>
            <span style="float: left">{{ baseStatus.state.name }}</span>
          </h3>

          <div class="section">
            <div class="fractionLogo" v-if="baseStatus.fraction !== ''"
                 :style="{backgroundImage: 'url(' + require('../../assets/' + getLogo(baseStatus.fraction))+')'}"/>
            <span style="line-height: 18px;">Фракция:</span> <br>
            <span class="importantly">{{ baseStatus.fraction !== '' ? baseStatus.fraction : '-' }}</span>
          </div>
        </div>

        <div class="sub" @click.stop="">
          <div @click.stop="openService('ExitMenu')" id="OutBaseButton">
            <img src="https://img.icons8.com/material/40/000000/exit.png"/>
            <h4>Выйти с базы</h4>
          </div>

          <div @click.stop="" v-if="false">
            <img/>
            <h4>Наблюдение</h4>
          </div>
        </div>

        <h2 class="head_category">Имущество: </h2>
        <div class="sub" @click.stop="">

          <div id="hangarButton" @click.stop="openService('inventoryBox')">
            <img src="https://img.icons8.com/ios-glyphs/30/000000/hangar.png"/>
            <h4>Ангар</h4>
          </div>

          <div id="inventoryButton" @click.stop="openService('wrapperInventoryAndStorage')">
            <img src="https://img.icons8.com/ios/32/000000/stacking.png"/>
            <h4>Склад/Трюм</h4>
          </div>

          <div @click.stop="openService('marketBox')">
            <img src="https://img.icons8.com/ios-glyphs/100/000000/buy.png"/>
            <h4>Рынок</h4>
          </div>

          <div @click.stop="openService('FractionMarket')"
               v-if="baseStatus.fraction === currentUser.fraction && baseStatus.state.type === 'base'">
            <img src="https://img.icons8.com/pastel-glyph/64/000000/sport-badge.png"/>
            <h4>Фракционный магазин</h4>
          </div>
        </div>

        <template
          v-if="(baseStatus.state.type !=='not_work' && baseStatus.state.type !== 'hostile') &&
          (baseStatus.state.type === 'lobby' || baseStatus.state.type === 'processing_plant' || baseStatus.state.type === 'base' || baseStatus.state.type === 'prefabricated_plant')">
          <h2 class="head_category">Производство: </h2>

          <div class="sub" @click.stop="">
            <div id="processorButton" @click.stop="openService('processorRoot')"
                 v-if="baseStatus.state.type === 'processing_plant' || baseStatus.state.type === 'lobby'">
              <img src="https://img.icons8.com/metro/26/000000/recycle-sign.png"/>
              <h4>Переработчик</h4>
            </div>

            <div id="workbenchButton" @click.stop="openService('Workbench')"
                 v-if="baseStatus.state.type === 'base'|| baseStatus.state.type === 'lobby'">
              <img src="https://img.icons8.com/ios-glyphs/30/000000/manufacturing.png"/>
              <h4>Верстак</h4>
            </div>

            <div id="prefabricatedButton" @click.stop="openService('prefabricatedMenuWrapper')"
                 v-if="baseStatus.state.type === 'prefabricated_plant' || baseStatus.state.type === 'lobby'">
              <img src="https://img.icons8.com/ios-filled/50/000000/screw.png"/>
              <h4>Детали</h4>
            </div>
          </div>
        </template>

        <template v-if="(baseStatus.state.type !=='not_work' && baseStatus.state.type !== 'hostile')">
          <h2 class="head_category">Связь: </h2>
          <div class="sub" @click.stop="">

            <div id="DepartmentOfEmploymentButton" @click.stop="openBaseDepartment">
              <img src="https://img.icons8.com/ios/50/000000/department.png"/>
              <h4>Диспетчер базы</h4>
            </div>

            <div id="News" @click.stop="openService('News')">
              <img src="https://img.icons8.com/material-outlined/100/000000/news.png"/>
              <h4>Новости</h4>
            </div>

            <div v-for="story in baseStatus.stories" @click.stop="openStory(story.id)">
              <img src="https://img.icons8.com/material/96/000000/todo-list--v2.png"/>
              <h4>{{ story.name }}</h4>
            </div>

          </div>
        </template>
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

        <app-fraction-market
          v-if="(baseStatus.state.type === 'base'|| baseStatus.state.type === 'lobby') && openComponents['FractionMarket'] && openComponents['FractionMarket'].open"/>

        <app-workbench
          v-if="(baseStatus.state.type === 'base'|| baseStatus.state.type === 'lobby') && openComponents['Workbench'] && openComponents['Workbench'].open"/>

        <app-processor-root
          v-if="(baseStatus.state.type === 'processing_plant'|| baseStatus.state.type === 'lobby') && openComponents['processorRoot'] && openComponents['processorRoot'].open"/>

        <app-prefabricated-menu
          v-if="(baseStatus.state.type === 'prefabricated_plant'|| baseStatus.state.type === 'lobby') && openComponents['prefabricatedMenuWrapper'] && openComponents['prefabricatedMenuWrapper'].open"/>

        <app-news v-if="openComponents['News'] && openComponents['News'].open"/>

      </template>

      <app-exit-menu v-if="openComponents['ExitMenu'] && openComponents['ExitMenu'].open"/>

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
import News from '../News/News'
import FractionMarket from '../FractionMarket/FractionMarket'
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
    getLogo(fraction) {
      return `logo/${fraction}.png`
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
    },
    openStory(storyID) {
      this.$store.getters.getWSByService('chat').socket.send(JSON.stringify({
        event: "openStory",
        id: Number(storyID),
      }));
    },
    getBaseTypeName(baseType) {
      return this.$store.getters.getBaseTypeName(baseType, this.language)
    }
  },
  computed: {
    language() {
      return this.$store.getters.getSettings.Language
    },
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
    AppFractionMarket: FractionMarket,
    AppNews: News,
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
  top: 60px;
  left: 5px;
  text-align: center;
  float: left;
  border-radius: 5px;
  position: relative;
  padding: 2px;
  width: 220px;
  border: 1px solid #25a0e1;
  background: rgb(8, 138, 210);
  box-shadow: 0 0 2px black;
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
  min-height: 20px;
  min-width: 200px;
  border-radius: 5px;
  top: calc(100% + 8px);
  filter: drop-shadow(0px 0px 6px black);
  box-shadow: 0 0 2px black;
}

.sub > div {
  height: 20px;
  clear: both;
  background: #0cc2fb;
  border: 1px solid rgba(37, 160, 225, 0.5);
  background: rgba(8, 138, 210, 0.5);
  border-radius: 3px;
  margin: 1px;
  line-height: 35px;
  color: white;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
  cursor: pointer;
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none;
  overflow: hidden;
}

.sub > div img {
  height: 20px;
  width: 20px;
  background: #8cb3c7;
  float: left;
  transition: 0.1s;
  background-size: contain;
}

.sub > div h4 {
  margin: 0 5px;
  float: left;
  opacity: 0.8;
  font-size: 12px;
  line-height: 21px;
}

.sub > div:hover {
  border: 1px solid rgba(37, 160, 225, 0.8);
  background: rgba(8, 138, 210, 0.8);
}

.sub > div:active {
  transform: scale(0.97);
}

.sub > div:hover h4 {
  opacity: 1;
}

.RankWrapper {
  position: absolute;
  top: 5px;
  left: 5px;
  width: 270px;
  background: none;
  box-shadow: none;
  z-index: 0;
}

.base_icon {
  height: 50px;
  width: 50px;
  float: left;
  margin: 1px 5px 5px 5px;
  background-size: contain;
  background-color: rgba(6, 110, 168, 0.5);
  border-radius: 5px;
  border: 1px solid rgba(6, 110, 168, 0.6);
  box-shadow: inset 0 0 2px black;
}

.base_name {
  margin: 0 0 7px 0;
  background: rgb(221, 112, 52);
  color: rgba(255, 255, 255, 0.8);
  border-radius: 4px;
  font-size: 13px;
  line-height: 18px;
  height: 17px;
  user-select: none;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 1);
  font-weight: bold;
  box-shadow: 0 0 2px rgba(0, 0, 0, 1);
  padding-left: 10px;
  float: right;
  width: calc(100% - 72px);
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.base_type {
  float: left;
  color: #e4ff00;
  font-size: 10px;
  margin-right: 4px;
}

.section {
  line-height: 8px;
  background: rgba(77, 77, 84, 0.3);
  width: 140px;
  height: 28px;
  border-radius: 0 5px 5px 0;
  color: white;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  margin-bottom: 5px;
  font-size: 11px;
  text-align: left;
}

.fractionLogo {
  height: 28px;
  width: 28px;
  float: left;
  margin: -1px 5px 5px -1px;
  background-size: cover;
  background-color: rgba(6, 110, 168, 0.2);
  border-radius: 5px;
  border: 1px solid rgba(6, 110, 168, 0.3);
  box-shadow: inset 0 0 2px black;
}

.importantly {
  color: #f1bd00;
  font-weight: 100;
}

.head_category {
  margin: 3px 0 3px 0;
  background: rgb(221, 112, 52);
  color: rgba(255, 255, 255, 0.8);
  border-radius: 4px;
  font-size: 13px;
  line-height: 17px;
  height: 16px;
  user-select: none;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 1);
  font-weight: bold;
  box-shadow: 0 0 2px rgba(0, 0, 0, 1);
  padding-left: 10px;
  text-align: left;
  clear: both;
}
</style>
