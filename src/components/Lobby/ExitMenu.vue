<template>
  <div id="ExitMenu" ref="ExitMenu" @mousedown="toUp">
    <app-control
      v-bind:head="'Выход с базы '"
      v-bind:move="false"
      v-bind:close="true"
      v-bind:refWindow="'ExitMenu'"
      v-bind:noHeight="true"
      v-bind:noWidth="true"
      v-bind:noPos="true"/>

    <div class="wrapper">
      <div class="section body_state">
        <div class="name_option">Корпус:</div>
        <div class="value" :style="{color: bodyState.color}">{{ bodyState.title }}</div>
        <div class="action" @click="repair()">Починить</div>
      </div>

      <div class="section items">
        <div class="name_option">Оружие:</div>
        <div class="value">
          <template v-if="inventory && inventory.unit">
            <template v-for="slot in inventory.unit.weapon_slots">

              <app-item-cell
                class="valueItem"
                v-bind:fine="slot.weapon ? inventory.fine[slot.weapon.name] : true"
                v-bind:textFine="slot.weapon ? inventory.fine[slot.weapon.name] ? 'Не хватает навыка' : '' : ''"
                v-bind:opacity="slot.weapon ? inventory.fine[slot.weapon.name] ? 0.4 : false : false"
                v-bind:itemSlot="{type: 'weapon', item: slot.weapon}"
                v-bind:equipProps="{type: 'weapon', data: slot}"
                v-bind:size="30"/>

              <app-item-cell
                class="valueItem"
                v-bind:fine="!(slot.ammo && slot.ammo_quantity > 0)"
                v-bind:itemSlot="{type: 'ammo', quantity: slot.ammo_quantity, item: slot.ammo}"
                v-bind:equipProps="{type: 'ammo', data: slot}"
                v-bind:size="30"/>

            </template>
          </template>
        </div>
        <div class="action" @click="openService('inventoryBox')">Ангар</div>
      </div>

      <div class="section items thorium" v-if="baseStatus.state.type !== 'lobby'">
        <div class="name_option">Топливо:</div>
        <div class="value thorium">
          <template v-if="inventory && inventory.unit && inventory.unit.body">
            <app-item-cell v-for="slot in inventory.unit.thorium_slots"
                           class="bodyThorium valueItem"
                           v-bind:equipProps="{type: 'thorium', data: slot}"
                           v-bind:noShowName="true"
                           v-bind:text="`<h6>${slot.count}</h6> <p class='sep'>/</p> <p>${slot.max_count}</p>`"
                           v-bind:itemSlot="{type: 'recycle', item: {name: 'enriched_thorium'}}"
                           v-bind:size="30"/>
          </template>
        </div>
        <div class="action" @click="openService('wrapperInventoryAndStorage')">Инвентарь</div>
      </div>

    </div>


    <div v-if="baseStatus.state.type !== 'lobby'" @click="outBase" class="outBase">Покинуть базу</div>
    <div v-if="baseStatus.state.type === 'lobby'" class="QuickTypeBattles">

      <div class="sectionBattles">

        <div class="sectionBattlesHead">Против игроков</div>

        <div class="QuickTypeBattleWrapper">
          <div class="QuickTypeBattle" @click="startBattle('battle', '')"
               :style="{ backgroundImage: 'url(' + require('../../assets/indexImg/battle.png') + ')'}"
               v-bind:class="{ QuickActive: waitGame.MyWait && waitGame.MyWait.type_battle === 'battle' }">
            <span>Встречный бой</span>
          </div>

          <div class="SubTypeBattle" @click="startBattle('battle', 'ai')">Против ботов</div>
          <div class="SubTypeBattle" @click="startBattle('battle', 'training')">Обучение</div>
        </div>

        <div class="QuickTypeBattleWrapper">
          <div class="QuickTypeBattle" @click="startBattle('team_death_match', '')"
               v-bind:class="{ QuickActive: waitGame.MyWait && waitGame.MyWait.type_battle === 'team_death_match' }">
            <span>Командный бой насмерть</span>
          </div>

          <div class="SubTypeBattle" @click="startBattle('team_death_match', 'ai')">Против ботов</div>
        </div>

        <div class="QuickTypeBattleWrapper last">
          <div class="QuickTypeBattle" @click="startBattle('destroy_base', '')"
               v-bind:class="{ QuickActive: waitGame.MyWait && waitGame.MyWait.type_battle === 'destroy_base' }">
            <span>Уничтожение базы</span>
          </div>

          <div class="SubTypeBattle" @click="startBattle('destroy_base', 'ai')">Против ботов</div>
        </div>
      </div>

      <div class="sectionBattles">

        <div class="sectionBattlesHead">Кооператив</div>

        <div class="QuickTypeBattleWrapper">
          <div class="QuickTypeBattle" @click="startBattle('defense', '')"
               :style="{ backgroundImage: 'url(' + require('../../assets/indexImg/defense.png') + ')'}"
               v-bind:class="{ QuickActive: waitGame.MyWait && waitGame.MyWait.type_battle === 'defense' }">
            <span>Оборона</span>
          </div>
        </div>

        <div class="QuickTypeBattleWrapper">
          <div class="QuickTypeBattle" @click="startBattle('convoy', '')"
               v-bind:class="{ QuickActive: waitGame.MyWait && waitGame.MyWait.type_battle === 'convoy' }">
            <span>Конвой (добыча ресурсов)</span>
          </div>
        </div>

        <div class="QuickTypeBattleWrapper last">
          <div class="QuickTypeBattle" @click="startBattle('breakthrough', '')"
               v-bind:class="{ QuickActive: waitGame.MyWait && waitGame.MyWait.type_battle === 'breakthrough' }">
            <span>Прорыв</span>
          </div>
        </div>
      </div>

      <div class="readySection" v-if="groupState.uuid !== '' && groupState.leaderID !== Number(currentUser.user_id)">
        <template v-if="groupState.state && groupState.state[currentUser.user_id]">
          <div class="SubTypeBattle ready" @click="setReady()" v-if="!groupState.state[currentUser.user_id].rd">
            Готов!
          </div>
          <div class="SubTypeBattle ready wait" @click="setReady()" v-if="groupState.state[currentUser.user_id].rd">
            Ожидание...
          </div>
        </template>
      </div>

      <div v-if="waitGame.MyWait" class="waitGame">
        <div>Время в очереди: {{ waitGame.MyWait.time }} сек.</div>
        <div>Игроков очереди: {{ waitGame.usersWait }}</div>

        <div class="action waitBattle" @click="exitWait">Отмена</div>
      </div>
    </div>
  </div>
</template>

<script>
import Control from '../Window/Control';
import ItemCell from '../Inventory/ItemCell';

export default {
  name: "ExitMenu",
  mounted() {
    if (!this.$store.getters.getWSByService('inventory').connect) {
      this.$store.commit({
        type: 'reconnectWS',
        service: 'inventory',
        force: false,
      });
    } else {
      this.$store.getters.getWSByService('inventory').socket.send(JSON.stringify({
        event: "openInventory"
      }));
    }
  },
  methods: {
    startBattle(type, subType) {
      this.$store.getters.getWSByService('chat').socket.send(JSON.stringify({
        event: "StartBattle",
        type: type,
        sub_type: subType,
      }));
    },
    exitWait() {
      this.$store.getters.getWSByService('chat').socket.send(JSON.stringify({
        event: "ExitWait",
      }));
    },
    setReady() {
      this.$store.getters.getWSByService('chat').socket.send(JSON.stringify({
        event: "ToggleReady",
      }));
    },
    toUp() {
      this.$store.commit({
        type: 'setWindowZIndex',
        id: this.$el.id,
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
    repair() {
      this.$store.getters.getWSByService('inventory').socket.send(JSON.stringify({
        event: "EquipsRepair"
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
  },
  computed: {
    inventory() {
      return this.$store.getters.getInventory
    },
    bodyState: function () {
      let inventory = this.inventory;
      if (inventory.unit && inventory.unit.body) {

        let percentHP = Math.round(100 / (inventory.stateMS.max_hp / inventory.unit.hp));
        if (percentHP === 100) return {title: 'готов', color: this.$store.getters.GetColorDamage(percentHP)};
        if (percentHP < 100 && percentHP > 50) return {
          title: 'поврежден',
          color: this.$store.getters.GetColorDamage(percentHP)
        };
        return {title: 'крит. состояние', color: this.$store.getters.GetColorDamage(percentHP)};

      } else {
        return {title: "не установлен", color: "#ff0000"}
      }
    },
    baseStatus() {
      return this.$store.getters.getBaseStatus
    },
    waitGame() {
      return this.$store.getters.getWaitGame
    },
    currentUser() {
      return this.$store.getters.getUser
    },
    groupState() {
      if (this.currentUser.game_mode !== 'open_world') {
        return this.$store.getters.getGroupSessionState;
      }
    },
  },
  components: {
    AppControl: Control,
    AppItemCell: ItemCell,
  }
}
</script>

<style scoped>
#ExitMenu {
  position: absolute;
  border-radius: 5px;
  background: rgb(8, 138, 210);
  border: 1px solid #25a0e1;
  padding: 18px 3px 0;
  width: 320px;
  left: calc(50% - 160px);
  top: 50px;
  min-height: 136px;
}

.section {
  clear: both;
}

.outBase {
  display: block;
  width: calc(100% - 4px);
  background: rgb(136, 68, 34);
  box-shadow: 0 0 2px rgba(0, 0, 0, 1);
  color: rgba(255, 255, 255, 0.8);
  border-radius: 4px;
  margin: 2px 0 0 2px;
  font-size: 13px;
  line-height: 17px;
  height: 16px;
  user-select: none;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 1);
  font-weight: bold;
  text-align: center;
  float: left;
}

.outBase:hover {
  background: rgb(221, 112, 52);
  box-shadow: inset 0 0 4px 0 white;
}

.outBase:active {
  transform: scale(0.98);
}

.body_state {

}

.wrapper {
  width: calc(100% - 14px);
  background: #89969c;
  float: left;
  box-shadow: inset 0 0 2px black;
  overflow-y: scroll;
  overflow-x: hidden;
  border-radius: 5px;
  height: calc(100% - 34px);
  padding: 7px;
  font-size: 12px;
}

.name_option {
  text-align: left;
  display: block;
  width: 80px;
  padding-left: 10px;
  background: rgb(222, 101, 40);
  box-shadow: -1px 1px 2px rgba(0, 0, 0, 1);
  color: rgba(255, 255, 255, 0.8);
  border-radius: 4px 0 0 4px;
  margin: 4px 0 0 0;
  font-size: 14px;
  line-height: 22px;
  height: 20px;
  user-select: none;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 1);
  font-weight: bold;
  float: left;
}

.value {
  background: #6c6c6c;
  height: 20px;
  width: 119px;
  float: left;
  margin: 4px 0 0 0;
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 1);
  text-shadow: 0 2px 2px #000000, 0 1px 2px #000000;
  font-weight: bold;
  line-height: 21px;
}

.action {
  text-align: center;
  display: block;
  width: 79px;
  background: rgb(136, 68, 34);
  box-shadow: 0 0 2px rgba(0, 0, 0, 1);
  color: rgba(255, 255, 255, 0.8);
  border-radius: 4px;
  margin: 6px 0 0 6px;
  line-height: 17px;
  height: 16px;
  user-select: none;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 1);
  font-weight: bold;
  float: left;
  font-size: 11px;
}

.action:hover {
  background: rgb(221, 112, 52);
  box-shadow: inset 0 0 4px 0 white;
}

.action:active {
  transform: scale(0.98);
}

.valueItem {
  margin: 1px 3px;
}

.section.items > div {
  height: 35px;
  line-height: 35px;
}

.section.items .action {
  height: 32px;
}

.section.items .value.thorium {
  line-height: 10px;
  position: relative;
  z-index: 0;
}

.QuickTypeBattles {
  float: left;
  width: calc(100% - 8px);
  padding: 4px;
}

.QuickTypeBattleWrapper {
  float: left;
  width: 98px;
  margin-right: 9px;
}

.QuickTypeBattle {
  float: left;
  height: 98px;
  width: 98px;
  background: grey;
  border-radius: 10px;
  box-shadow: 0 0 2px black;
  background-size: cover;
  color: white;
  font-size: 11px;
  position: relative;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
  opacity: 0.75;
}

.QuickTypeBattle span {
  position: absolute;
  width: 100%;
  left: 0;
  top: 38px;
}

.QuickTypeBattle:hover {
  opacity: 1;
}

.QuickTypeBattle:active {
  transform: scale(0.97);
}

.QuickTypeBattleWrapper.last {
  margin-right: 0;
}

.waitGame {
  float: left;
  min-height: 20px;
  width: calc(100% - 6px);
  background: #6c6c6c;
  margin-top: 5px;
  box-shadow: 0 0 2px black;
  border-radius: 5px;
  padding: 8px 3px 3px;
  color: white;
  line-height: 22px;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
}

.action.waitBattle {
  margin: 5px calc(50% - 40px) 5px;
}

.QuickActive {
  opacity: 1;
}

.SubTypeBattle {
  text-align: center;
  display: block;
  width: 98px;
  background: rgb(136, 68, 34);
  box-shadow: 0 0 2px rgba(0, 0, 0, 1);
  color: rgba(255, 255, 255, 0.8);
  border-radius: 4px;
  margin: 4px 0 0 0;
  line-height: 17px;
  height: 16px;
  user-select: none;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 1);
  font-weight: bold;
  float: left;
  font-size: 11px;
}

.SubTypeBattle:hover {
  background: rgb(221, 112, 52);
}

.SubTypeBattle:active {
  transform: scale(0.98);
}

.sectionBattles {
  clear: both;
  float: left;
  margin-bottom: 5px;
}

.sectionBattles:last-child {
  margin-bottom: 0;
}

.sectionBattlesHead {
  height: 15px;
  font-size: 10px;
  font-weight: 900;
  line-height: 15px;
  border-right: 1px solid rgba(191, 191, 191, 0.43);
  padding: 0 3px;
  text-shadow: 1px 1px black;
  transition: 200ms;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  color: #fff200;
  background: rgb(187, 93, 42);
  margin-bottom: 3px;
  box-shadow: 0 0 2px black;
}

.readySection {
  clear: both;
  width: 100%;
  float: left;
}

.SubTypeBattle.ready {
  width: 100%;
  height: 25px;
  font-size: 18px;
  line-height: 25px;
}

.SubTypeBattle.ready.wait {
  background: rgb(221, 112, 52);
}
</style>

<style>
#ExitMenu .section.items .value.thorium .sep {
  font-size: 6px;
  line-height: 5px;
}
</style>
