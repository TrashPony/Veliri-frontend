<template>
  <div id="MotherShipParams">

    <div id="SquadsList" v-if="inventory.inBase">
      <div v-for="(squadName, index) in inventory.baseSquads" @click="changeSquad(index)">
        <span class="squadListName">{{ squadName }}</span>
      </div>
    </div>

    <div class="Value params" v-if="msParams.attack" @click="toggleMenu('attack')">▼
      {{ language === 'RU' ? 'Атака' : 'Attack' }}
    </div>
    <div class="Value params" v-if="!msParams.attack" @click="toggleMenu('attack')">▶
      {{ language === 'RU' ? 'Атака' : 'Attack' }}
    </div>

    <template v-if="inventory.stateMS && msParams.attack">
      <div class="infoParams" id="infoParamsAttack" v-if="inventory.stateMS.install">
        <table>
          <tr>
            <td>{{ language === 'RU' ? 'Урон' : 'Damage' }}:</td>
            <td>
              <span
                v-bind:class="{up: getParamClass('weapon_min_damage') === 'up', fine: (getParamClass('weapon_min_damage') === 'fine') || inventory.fine['ammo_damage']}">{{
                  inventory.stateMS.weapon_min_damage
                }}
                <app-state-tip v-bind:titleEquip="'Оружие мин. урон'" v-bind:param="'weapon_min_damage'"/>
              </span>
              -
              <span
                v-bind:class="{up: getParamClass('weapon_max_damage') === 'up', fine: getParamClass('weapon_max_damage') === 'fine'}">{{
                  inventory.stateMS.weapon_max_damage
                }}
                <app-state-tip v-bind:titleEquip="'Оружие макс. урон'" v-bind:param="'weapon_max_damage'"/>
              </span>
            </td>
          </tr>
          <tr>
            <td>{{ language === 'RU' ? 'Тип атаки' : 'Attack type' }}:</td>
            <td>{{ inventory.stateMS.damage_type }}</td>
          </tr>
          <tr>
            <td>{{ language === 'RU' ? 'Очередь' : 'Queue' }}:</td>
            <td>{{ inventory.stateMS.count_fire_bullet }}</td>
          </tr>
          <tr>
            <td>{{ language === 'RU' ? 'Дальность стрельбы' : 'Range attack' }}:</td>
            <td>{{ inventory.stateMS.weapon_min_range }} - {{ inventory.stateMS.weapon_max_range }}</td>
          </tr>
          <tr>
            <td>{{ language === 'RU' ? 'Точность' : 'Accuracy' }}:</td>
            <td v-if="inventory.fine['weapon_accuracy']">
              <span class="fine">штраф</span>
            </td>
            <td v-else>{{ inventory.stateMS.weapon_accuracy }}</td>
          </tr>
          <tr>
            <td>{{ language === 'RU' ? 'Скорость поворота орудия' : 'Speed of rotation of the gun' }}:</td>
            <td v-if="inventory.fine['gun_rotate_speed']">
              <span class="fine">{{ language === 'RU' ? 'штраф' : 'fine' }}</span>
            </td>
            <td v-else>
              <span
                v-bind:class="{up: getParamClass('gun_rotate_speed') === 'up', fine: getParamClass('gun_rotate_speed') === 'fine'}">
                {{ inventory.stateMS.gun_rotate_speed }} гр/сек
                <app-state-tip v-bind:titleEquip="'Скорость поворота орудия'" v-bind:param="'gun_rotate_speed'"/>
              </span>

            </td>
          </tr>
          <tr>
            <td>{{ language === 'RU' ? 'Скорость полета снаряда' : 'Projectile flight speed' }}:</td>
            <td>{{ inventory.stateMS.bullet_speed }}</td>
          </tr>
          <tr>
            <td>{{ language === 'RU' ? 'Скорострельность' : 'Rate of fire' }}:</td>
            <td>
              <span
                v-bind:class="{up: getParamClass('reload_time') === 'up', fine: getParamClass('reload_time') === 'fine'}">
                {{ Math.round(60000 / inventory.stateMS.reload_time) }} выс./мин
                <app-state-tip v-bind:titleEquip="'Скорострельность'"
                               v-bind:param="'reload_time'"
                               v-bind:baseValue="Math.round(60000 / inventory.stateMS.reload_time)"
                               v-bind:skillValue="Math.round(60000 / (inventory.stateMS.reload_time - inventory.stateSkill.reload_time)) - Math.round(60000 / inventory.stateMS.reload_time)"/>
              </span>
            </td>
          </tr>
          <tr>
            <td>{{ language === 'RU' ? 'Время перезарядки' : 'Reload time' }}:</td>
            <td>{{ inventory.stateMS.reload_ammo_time / 1000 }} сек.</td>
          </tr>
        </table>
      </div>
      <div class="infoParams" style="height: 15px" v-if="!inventory.stateMS.install">
        <table>
          <tr>
            <td>{{ language === 'RU' ? 'Оружие не укомплектовано' : 'Weapon is not equipped' }}</td>
          </tr>
        </table>
      </div>
    </template>

    <div class="Value params" v-if="msParams.defend" @click="toggleMenu('defend')">▼
      {{ language === 'RU' ? 'Защита' : 'Protection' }}
    </div>
    <div class="Value params" v-if="!msParams.defend" @click="toggleMenu('defend')">▶
      {{ language === 'RU' ? 'Защита' : 'Protection' }}
    </div>

    <div class="infoParams" v-if="inventory.stateMS && msParams.defend">
      <table>
        <tr>
          <td>{{ language === 'RU' ? 'Структура' : 'Structure' }}</td>
          <td>{{ inventory.stateMS.max_hp }}</td>
        </tr>
        <tr>
          <td>{{ language === 'RU' ? 'Броня' : 'Armor' }}</td>
          <td>
            <span
              v-bind:class="{
              up: inventory.stateSkill.armor + inventory.stateEquip.armor > 0,
              fine: inventory.stateSkill.armor + inventory.stateEquip.armor < 0}">
              {{ inventory.stateMS.armor }} %
              <app-state-tip v-bind:titleEquip="'Корпус'" v-bind:param="'armor'"/>
            </span>
          </td>
        </tr>
        <tr>
          <td colspan="2" style="text-align: left;color: #c3c3c3;text-shadow: none;">
            {{ language === 'RU' ? 'Уязвимости' : 'Vulnerabilities' }}:
          </td>
        </tr>
        <tr>
          <td colspan="2">
            <div class="vul">
              <div :style="{background: '#666666', width: inventory.stateMS.vul_to_kinetics + '%' }"></div>
              <span>{{ inventory.stateMS.vul_to_kinetics }} %</span>
            </div>
            <div class="vul">
              <div :style="{background: '#de5011', width: inventory.stateMS.vul_to_thermo + '%' }"></div>
              <span>{{ inventory.stateMS.vul_to_thermo }} %</span>
            </div>
            <div class="vul">
              <div :style="{background: '#f8ff0d', width: inventory.stateMS.vul_to_explosion+'%' }"></div>
              <span>{{ inventory.stateMS.vul_to_explosion }} %</span>
            </div>
          </td>
        </tr>
      </table>
    </div>

    <div class="Value params" v-if="msParams.nav" @click="toggleMenu('nav')">▼
      {{ language === 'RU' ? 'Навигация' : 'Navigation' }}
    </div>
    <div class="Value params" v-if="!msParams.nav" @click="toggleMenu('nav')"> ▶
      {{ language === 'RU' ? 'Навигация' : 'Navigation' }}
    </div>

    <div class="infoParams" v-if="inventory.stateMS && msParams.nav" style="height: 32px">
      <table>
        <tr>
          <td>{{ language === 'RU' ? 'Дальность обзора' : 'Range view' }}</td>
          <td>{{ inventory.stateMS.range_view }}</td>
        </tr>
        <tr>
          <td>{{ language === 'RU' ? 'Дальность радара' : 'Range radar' }}</td>
          <td>{{ inventory.stateMS.range_radar }}</td>
        </tr>
      </table>
    </div>

    <div class="Value params" v-if="msParams.move" @click="toggleMenu('move')">▼
      {{ language === 'RU' ? 'Ходовая' : 'Running gear' }}
    </div>
    <div class="Value params" v-if="!msParams.move" @click="toggleMenu('move')">▶
      {{ language === 'RU' ? 'Ходовая' : 'Running gear' }}
    </div>

    <div class="infoParams" v-if="inventory.stateMS && msParams.move" style="height: 48px;">
      <table>
        <tr>
          <td>{{ language === 'RU' ? 'Макс. скорость' : 'Max speed' }}</td>
          <td v-if="inventory.fine['speed']">
            <span class="fine">{{ language === 'RU' ? 'штраф' : 'fine' }}</span>
          </td>
          <td v-else>
            <span v-bind:class="{up: inventory.stateSkill.speed > 0, fine: inventory.stateSkill.speed < 0}">
              {{ Math.round(inventory.stateMS.speed * 29) }}
              <app-state-tip v-bind:titleEquip="'Корпус'" v-bind:param="'speed'"
                             v-bind:baseValue="Math.round((inventory.stateMS.speed - inventory.stateSkill.speed) * 29)"
                             v-bind:skillValue="Math.round(inventory.stateSkill.speed * 29)"/>
            </span>
            км/сек
          </td>
        </tr>
        <tr>
          <td>{{ language === 'RU' ? 'Ускорение' : 'Acceleration' }}</td>
          <td v-if="inventory.fine['power_factor']">
            <span class="fine">{{ language === 'RU' ? 'штраф' : 'fine' }}</span>
          </td>
          <td v-else>
            <span
              v-bind:class="{up: inventory.stateSkill.power_factor > 0, fine: inventory.stateSkill.power_factor < 0}">
              +{{ Math.round((inventory.stateMS.power_factor) * 29) }}
              <app-state-tip v-bind:titleEquip="'Корпус'" v-bind:param="'power_factor'"
                             v-bind:baseValue="Math.round((inventory.stateMS.power_factor - inventory.stateSkill.power_factor) * 29)"
                             v-bind:skillValue="Math.round(inventory.stateSkill.power_factor * 29)"/>
            </span>км/сек
          </td>
        </tr>
        <tr>
          <td>{{ language === 'RU' ? 'Скорость поворота' : 'Turn speed' }}</td>
          <td v-if="inventory.fine['turn_speed']">
            <span class="fine">{{ language === 'RU' ? 'штраф' : 'fine' }}</span>
          </td>
          <td v-else>
            <span v-bind:class="{up: inventory.stateSkill.turn_speed > 0, fine: inventory.stateSkill.turn_speed < 0}">
              {{ Math.round((inventory.stateMS.turn_speed * 64) * 180 / Math.PI) }}
              <app-state-tip v-bind:titleEquip="'Корпус'" v-bind:param="'turn_speed'"
                             v-bind:baseValue="Math.round(((inventory.stateMS.turn_speed - inventory.stateSkill.turn_speed)*64) * 180/Math.PI)"
                             v-bind:skillValue="Math.round((inventory.stateSkill.turn_speed*64) * 180/Math.PI)"/>
            </span>
            гр/сек
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>

import StateTip from './StateTip'

export default {
  name: "MSParams",
  data() {
    return {
      msParams: {
        attack: false,
        defend: false,
        nav: false,
        move: false,
      }
    }
  },
  methods: {
    toggleMenu(menu) {
      this.msParams[menu] = !this.msParams[menu]
    },
    changeSquad(id) {
      this.$store.getters.getWSByService('inventory').socket.send(JSON.stringify({
        event: "changeSquad",
        squad_id: Number(id),
      }));
    },
    getParamClass(param) {
      if (0 < this.inventory.stateSkill[param] + this.inventory.stateEquip[param] + this.inventory.stateBodyBonus[param]) {
        return 'up'
      } else if (0 > this.inventory.stateSkill[param] + this.inventory.stateEquip[param] + this.inventory.stateBodyBonus[param]) {
        return 'fine'
      }
    }
  },
  computed: {
    language() {
      return this.$store.getters.getSettings.Language
    },
    inventory() {
      return this.$store.getters.getInventory
    },
  },
  components: {
    AppStateTip: StateTip,
  }
}
</script>

<style scoped>
#MotherShipParams {
  border-radius: 5px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, .2);
  display: inline-block;
  vertical-align: top;
  width: 291px;
  height: 326px;
  padding-top: 5px;
  position: relative;
  float: left;
  margin-right: 7px;
  background-size: 100% 3px;
  background-image: linear-gradient(0deg, rgba(7, 41, 60, 0.6) 87%, rgba(0, 62, 95, 0.5) 30%);
  border: 1px solid rgba(0, 0, 0, 0.5);
  overflow-y: scroll;
  overflow-x: hidden;
}

#SquadsList {
  border-radius: 10px;
  width: 277px;
  height: 100px;
  box-shadow: inset 0 0 5px black;
  border: 1px solid #4c4c4c;
  background: #8cb3c7;
  position: relative;
  margin-bottom: 4px;
  overflow-y: scroll;
  overflow-x: hidden;
}

.Value.params {
  text-align: left;
  display: block;
  width: 266px;
  padding-left: 10px;
  background: linear-gradient(22deg, rgb(221, 112, 52), #6c6c6c);
  box-shadow: 0 0 5px rgba(0, 0, 0, 1);
  color: #ffffff73;
  border-radius: 4px;
  margin: 2px 0 0 2px;
  font-size: 12px;
  height: 15px;
  user-select: none;
  -moz-user-select: none;
}

.infoParams {
  display: block;
  width: 270px;
  padding-left: 5px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 1);
  margin: 2px 0 0 2px;
  background: rgba(183, 195, 201, 0.29);
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  height: 75px;
}

.infoParams table {
  font-size: 11px;
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  color: #c3c3c3;
}

.infoParams tr td {
  position: relative;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.infoParams tr td:last-child {
  color: white;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
  text-align: right;
}

.Value.params:hover {
  box-shadow: 0 0 5px rgb(125, 125, 125);
}

.Value.params:active {
  box-shadow: 0 0 5px rgb(255, 255, 255);
}

.vul {
  width: calc(33% - 3px);
  height: 20px;
  float: left;
  background: rgba(122, 127, 122, 0.4);
  margin-left: 3px;
  box-shadow: inset 0 0 2px black;
  position: relative;
}

#infoParamsAttack {
  height: 143px;
}

.vul div {
  height: 100%;
  box-shadow: inset 0 0 2px 1px black;
}

.vul span {
  position: absolute;
  top: calc(50% - 6px);
  left: calc(50% - 6px);
  color: white;
}

#SquadsList > div {
  transition: 0.1s;
  height: 15px;
  font-size: 12px;
  text-align: left;
  background: #5d5d5d57;
  padding-left: 10px;
  color: #ffe510;
  cursor: pointer;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
}

#SquadsList > div:hover {
  background: rgba(235, 235, 235, 0.34);
  color: #ff7800;
}

#SquadsList > div:active {
  background: rgba(255, 255, 255, 0.73);
  color: #ff4208;
}

.up {
  color: #abff00;
}

.fine {
  color: red;
}

.infoParams tr span:hover {
  color: #05daff;
  cursor: pointer;
}
</style>

<style>
.infoParams tr span:hover .tip {
  display: block;
}
</style>
