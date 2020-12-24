<template>
  <div id="battleState" v-if="battleState">
    <!--    тут говнокод потому что мне лень думоть...-->
    <div class="wrapper">
      <div class="captureBar"
           v-if="battleState.type === 'battle' && (battleState.sub_type === 0 || battleState.sub_type === 2)">
        <div class="bar">
          <div class="inner" style="background: rgba(255, 27, 14, 0.6); right: 0; left: unset;"
               :style="{width: battleState.sub_type === 0 ? myTeam.spawn.capture + '%' : battleState.bases[1].capture + '%'}"></div>
          <div class="bar_text base_name">{{ battleState.sub_type === 0 ? myTeam.spawn.name : battleState.bases[1].name }}</div>
          <div class="bar_split_33"></div>
        </div>
      </div>

      <div class="kill_count" v-if="battleState.type === 'team_death_match'">
        <div class="kill_count_number" style="float: right;">Командные убийства</div>
        <div class="bar">
          <div class="inner" style="right: 0; left: unset;"
               :style="{width: 100 / (15 / countTeamKills(myTeam)) + '%'}"></div>
        </div>
        <div class="kill_count_number" style="float: right;">{{ countTeamKills(myTeam) }} / 15</div>
      </div>

      <div class="base_hp" v-if="battleState.type === 'destroy_base'">
        <div class="kill_count_number" style="float: right;">Наша база</div>
        <div class="bar">
          <div class="inner" style="right: 0; left: unset;" :style="{width: myTeam.object_hp + '%'}"></div>
        </div>
        <div class="kill_count_number" style="float: right;">{{ myTeam.object_hp }}%</div>
      </div>

      <div class="battle_info">
        <div class="time">{{ timeOutMinutes }}</div>
        <div class="name">{{ getNameBattleType }}</div>

        <div class="captureBar center"
             v-if="(battleState.type === 'battle' && battleState.sub_type === 1 || battleState.sub_type === 2) || battleState.type === 'breakthrough'">
          <div class="bar">
            <div class="inner"
                 :style="{width: battleState.bases[0].capture + '%', background: battleState.bases[0].capture_team === hostileTeam.uuid ? 'rgba(255, 27, 14, 0.6)' : 'rgba(38, 100, 255, 0.6)'}"></div>
            <div class="bar_text base_name">{{ battleState.bases[0].name }}</div>
            <div class="bar_split_33"></div>
          </div>
        </div>


        <div class="destroyBasePoints" style="margin-top: 5px" v-if="battleState.type === 'convoy'">
          <div class="transportState" v-for="member in groupState.members"
               v-if="member.user_role === 'transport'">
            <!--          {{ groupState.state[member.user_id] }}-->
            <div class="bar">
              <div class="inner"
                   :style="{width: (100 / (groupState.state[member.user_id].mhp / groupState.state[member.user_id].hp)) + '%', background: 'rgba(48,224,48,0.6)'}">
              </div>
              <div class="bar_text">hp</div>
              <div class="bar_split"></div>
            </div>

            <div class="bar" style="margin-top: 5px">
              <div class="inner"
                   :style="{width: (100 / (groupState.state[member.user_id].inm / groupState.state[member.user_id].in)) + '%', background: 'rgba(255, 96, 0, 0.7)'}">
              </div>
              <div class="bar_text">трюм</div>
              <div class="bar_split"></div>
            </div>
          </div>
        </div>

      </div>

      <div class="base_hp" v-if="battleState.type === 'destroy_base'">
        <div class="kill_count_number" style="color: rgb(205, 70, 53); margin-left: 1px;">База противника</div>
        <div class="bar">
          <div class="inner" style="background: rgba(255, 27, 14, 0.6)"
               :style="{width: hostileTeam.object_hp + '%'}"></div>
        </div>
        <div class="kill_count_number" style="color: rgb(205, 70, 53); margin-left: 1px;">
          {{ hostileTeam.object_hp }}%
        </div>
      </div>

      <div class="kill_count" v-if="battleState.type === 'team_death_match'">
        <div class="kill_count_number" style="color: rgb(205, 70, 53); margin-left: 1px;">Командные убийства</div>
        <div class="bar">
          <div class="inner" style="background: rgba(255, 27, 14, 0.6)"
               :style="{width: 100 / (15 / countTeamKills(hostileTeam)) + '%'}"></div>
        </div>
        <div class="kill_count_number" style="color: rgb(205, 70, 53); margin-left: 1px;">{{
            countTeamKills(hostileTeam)
          }} / 15
        </div>
      </div>

      <div class="teamResources" v-if="battleState.type === 'defense' && teamResources">
        <div class="resource" v-for="resource in resourceState">
          <app-background-item-cell v-if="resource.slot" v-bind:slotItem="resource.slot" v-bind:noShowName="true"/>
          <div class="resource_count">{{ resource.count }}</div>
        </div>
      </div>

      <div class="captureBar"
           v-if="battleState.type === 'battle' && battleState.sub_type === 0 || battleState.sub_type === 2">
        <div class="bar">
          <div class="inner"
               :style="{width: battleState.sub_type === 0 ? hostileTeam.spawn.capture + '%' : battleState.bases[2].capture + '%'}"></div>
          <div class="bar_text base_name">{{ battleState.sub_type === 0 ? hostileTeam.spawn.name : battleState.bases[2].name }}</div>
          <div class="bar_split_33"></div>
        </div>
      </div>

      <div class="destroyBasePoints" v-if="battleState.type === 'destroy_base'">
        <div class="captureBar" v-for="base in sortBases">
          <div class="bar">
            <div class="destroyBasePointsIcon"
                 :style="{ backgroundImage: 'url(' + getPointIcon(base.type_game) + ')'}"></div>

            <div class="inner" :style="{width: base.capture + '%', background: getBaseColor(base.capture_team)}"></div>
          </div>
        </div>
      </div>

      <div style="position: absolute; top: calc(100% + 20px); left: 50%;">
        <app-points-board/>
      </div>
    </div>
  </div>
</template>

<script>
import BackgroundItemCell from '../Inventory/BackgroundItemCell'
import UserLine from '../Chat/UserLine';
import PointsBoard from './PointsBoard';
import {CreateSpawn} from "../../game/map_editor/spawn";
import {gameStore} from "../../game/store";
import {unitInfo} from "../../game/unit/mouse_body_over";
import urls from "../../const";
import Phaser from "phaser";

export default {
  name: "BattleState",
  data() {
    return {
      draw_capture: false,
      resourceState: {},
    }
  },
  methods: {
    getResourceItem(id) {
      let app = this;
      app.$api.get(urls.itemURL + '?id=' + id + "&type=recycle&method=item").then(function (response) {
        app.resourceState[id].slot = response.data;
      }).catch(function (err) {
        console.log(err)
      });
    },
    countTeamKills(team) {
      let allKills = 0;

      if (!team) return allKills;

      for (let user_id of team.players) {
        allKills += this.battleState.kills[user_id];
      }

      return allKills
    },
    getPointIcon(type) {
      let icon = '';
      if (type === 'big_radar') icon = 'unknown_civilization_1.png';
      if (type === 'artillery') icon = 'replic_gauss_gun.png';
      if (type === 'battle_apd_factory') icon = 'prefabricated_plant.png';
      return require('../../assets/indexImg/session_destroy_base_icon/' + icon)
    },
    getBaseColor(uuidTeam) {

      if (!this.battleState.teams[uuidTeam]) {
        return 'rgba(0, 0, 0, 0.2)';
      }

      if (this.battleState.teams[uuidTeam].name === 'team_3') {
        return 'rgb(219,162,50)';
      }

      if (this.battleState.teams[uuidTeam].players.includes(this.currentUser.user_id)) {
        return 'rgba(48, 105, 248, 0.6)';
      } else {
        return 'rgba(255, 27, 14, 0.6)';
      }
    }
  },
  computed: {
    groupState() {
      return this.$store.getters.getGroupState;
    },
    battleState() {

      let state = this.$store.getters.getBattleState;
      if (!this.draw_capture && gameStore.unitReady) {
        if (state && state.type === 'battle') {
          if (state.sub_type === 0) {
            this.draw_capture = true;
            CreateSpawn(this.myTeam.spawn);
            CreateSpawn(this.hostileTeam.spawn);
          }

          if (state.sub_type === 1) {
            this.draw_capture = true;
            CreateSpawn(state.bases[0]);
          }

          if (state.sub_type === 2) {
            this.draw_capture = true;
            for (let i in state.bases) {
              CreateSpawn(state.bases[i]);
            }
          }
        } else {
          this.draw_capture = true;
          for (let i in state.bases) {
            CreateSpawn(state.bases[i]);
          }
        }

        if (this.draw_capture) {
          for (let unitID in gameStore.units) {
            unitInfo(gameStore.units[unitID], gameStore.units[unitID].sprite, gameStore.units[unitID].sprite.unitBody)
          }
        }
      }

      return state
    },
    currentUser() {
      return this.$store.getters.getUser
    },
    teamResources() {

      if (this.battleState && this.battleState.team_resources) {

        for (let id in this.battleState.team_resources) {
          if (this.battleState.team_resources.hasOwnProperty(id)) {
            if (!this.resourceState.hasOwnProperty(id)) {
              this.resourceState[id] = {slot: null, id: id, count: this.battleState.team_resources[id]};
              this.getResourceItem(id)
            } else {
              this.resourceState[id].count = this.battleState.team_resources[id]
            }
          }
        }

        return true
      }

      return false
    },
    myTeam() {
      for (let i in this.battleState.teams) {
        if (this.battleState.teams.hasOwnProperty(i) && this.battleState.teams[i].players.includes(this.currentUser.user_id)) {
          return this.battleState.teams[i]
        }
      }
    },
    hostileTeam() {
      for (let i in this.battleState.teams) {

        if (this.battleState.teams[i].name === 'team_3') {
          continue
        }

        if (this.battleState.teams.hasOwnProperty(i) && !this.battleState.teams[i].players.includes(this.currentUser.user_id)) {
          return this.battleState.teams[i]
        }
      }
    },
    timeOutMinutes() {

      if (this.battleState.time_out < 0) {
        return '-- : --'
      }

      let minutes = Math.floor(this.battleState.time_out / 60);
      let sec = this.battleState.time_out % 60;
      return minutes + " : " + (sec % 60 < 10 ? "0" : "") + sec;
    },
    getNameBattleType() {
      let type = this.battleState.type;

      if (this.battleState.wait_ready) return 'ожидание...';

      if (this.battleState.main_mission !== "") {
        if (this.battleState.main_mission === "capture_base") return "Захватите базу";
        if (this.battleState.main_mission === "wait_evacuation") return "Дождитесь эвакуации";
        if (this.battleState.main_mission === "escort_transport_to_the_camp_site") return "Сопроваодите транспорт до места установки аванпоста";
        if (this.battleState.main_mission === "clear_the_camp_area") return "Зачистите территорию аванпоста";
        if (this.battleState.main_mission === "wait_place_camp") return "Дождитесь установки аванпоста";
        if (this.battleState.main_mission === "fill_in_warehouse_resources_find_or_get") return "Заполните склад ресурсами которые найдете или добудете";
      }

      if (this.battleState.end) return 'лутание';
      if (type === "battle") return 'встречный бой';
      if (type === "defense") return 'волна №' + (this.battleState.wave + 1);
      if (type === "team_death_match") return 'командный бой';
    },
    sortBases() {

      if (!this.myTeam) return [];
      // todo это работает только для режима "уничтожения базы"
      let radars = [];
      let artillery = [];
      let factory = [];

      let sortBases = [];

      for (let i in this.battleState.bases) {
        if (this.battleState.bases[i].type_game === "big_radar") {
          radars.push(this.battleState.bases[i])
        }

        if (this.battleState.bases[i].type_game === "artillery") {
          artillery.push(this.battleState.bases[i])
        }

        if (this.battleState.bases[i].type_game === "battle_apd_factory") {
          factory.push(this.battleState.bases[i])
        }
      }

      sortBases[2] = artillery[0]

      let distRadar1 = Phaser.Math.Distance.Between(radars[0].x, radars[0].y, this.myTeam.spawn.x, this.myTeam.spawn.y)
      let distRadar2 = Phaser.Math.Distance.Between(radars[1].x, radars[1].y, this.myTeam.spawn.x, this.myTeam.spawn.y)

      if (distRadar1 > distRadar2) {
        sortBases[this.battleState.bases.length - 1] = radars[0]
        sortBases[0] = radars[1]
      } else {
        sortBases[0] = radars[0]
        sortBases[this.battleState.bases.length - 1] = radars[1]
      }

      let distFactory1 = Phaser.Math.Distance.Between(factory[0].x, factory[0].y, this.myTeam.spawn.x, this.myTeam.spawn.y)
      let distFactory2 = Phaser.Math.Distance.Between(factory[1].x, factory[1].y, this.myTeam.spawn.x, this.myTeam.spawn.y)
      if (distFactory1 > distFactory2) {
        sortBases[this.battleState.bases.length - 2] = factory[0]
        sortBases[1] = factory[1]
      } else {
        sortBases[1] = factory[0]
        sortBases[this.battleState.bases.length - 2] = factory[1]
      }

      return sortBases
    }
  },
  components: {
    AppBackgroundItemCell: BackgroundItemCell,
    AppUserLine: UserLine,
    AppPointsBoard: PointsBoard,
  }
}
</script>

<style scoped>
#battleState {
  position: absolute;
  left: calc(50%);
  min-height: 50px;
  z-index: -1;
  pointer-events: none;
  transform: translate(-50%, 0%);
  background: linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.4) 40%, rgba(0, 0, 0, 0.4) 60%, rgba(0, 0, 0, 0) 100%);
  padding: 2px 15px 7px;
}

.wrapper {
  min-width: 50px;
  white-space: nowrap;
}

.captureBar {
  margin-top: 20px;
}

.captureBar, .kill_count, .base_hp, .transportState {
  float: left;
  width: 90px;
  height: 100%;
}

.kill_count, .base_hp, .transportState {
  width: 150px;
  padding: 3px;
}

.captureBar .bar, .kill_count .bar, .base_hp .bar, .transportState .bar {
  height: 15px;
  width: 90px;
  background-color: rgba(128, 128, 128, 0.75);
  box-shadow: 0 0 2px black;
  position: relative;
}

.base_hp .bar {
  background-size: 10%;
  background-image: linear-gradient(90deg,
  rgba(0, 0, 0, 0) 0%,
  rgba(0, 0, 0, 0) 90%,
  rgba(0, 0, 0, 0.5) 91%,
  rgba(0, 0, 0, 0.5) 100%);
}

.kill_count .bar, .base_hp .bar, .transportState .bar {
  width: 150px;
  text-align: center;
  float: left;
}

.transportState .bar {
  height: 13px;
  font-size: 10px;
  color: white;
  font-weight: 900;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
  line-height: 13px;
  border-radius: 2px;
  overflow: hidden;
}

.captureBar .bar .inner, .kill_count .bar .inner, .base_hp .bar .inner, .transportState .bar .inner {
  left: 0;
  top: 0;
  position: absolute;
  height: 100%;
  width: 70%;
  background: rgba(48, 105, 248, 0.6);
}

.captureBar .bar .point {
  float: left;
  border-right: 1px solid rgba(0, 0, 0, 0.75);
  width: 29px;
  height: 100%;
}

.captureBar .bar .inner:last-child {
  border: 0;
  width: 30px;
}

.battle_info {
  float: left;
  min-width: 100px;
  margin: 15px 10px 2px;
}

.time, .name {
  text-align: center;
  color: white;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
}

.name {
  font-size: 10px;
}

.center {
  clear: both;
  margin-top: 5px;
  margin-left: 5px;
}

.teamResources {
  pointer-events: all;
  float: left;
  min-height: 25px;
  min-width: 25px;
}

.resource {
  position: relative;
  float: left;
  height: 30px;
  width: 30px;
  background: rgba(128, 128, 128, 0.45);
  border-radius: 3px;
  margin: 0 2px;
  box-shadow: 0 0 2px black;
}

.resource_count {
  margin: 2px;
  position: relative;
  color: white;
  font-size: 10px;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
}

.kill_count_number {
  float: left;
  font-family: 'Audiowide', cursive;
  margin-top: 1px;
  font-size: 13px;
  color: rgb(128, 164, 253);
  font-weight: bold;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
}

.destroyBasePoints {
  float: left;
  min-height: 15px;
  clear: both;
}

.destroyBasePoints .captureBar {
  margin: 3px 3px 0;
  width: 80px;
}

.destroyBasePoints .captureBar .bar {
  height: 20px;
  width: 80px;
}

.destroyBasePointsIcon {
  height: 20px;
  width: 20px;
  background: rgba(128, 128, 128, 0);
  position: relative;
  left: calc(50% - 12px);
  margin-bottom: 3px;
  background-size: contain;
  border-radius: 3px;
  box-shadow: inset 0 0 2px black;
  z-index: 2;
}

.bar_text {
  z-index: 3;
  position: absolute;
  width: 100%;
  text-align: center;
}

.bar_split, .bar_split_33 {
  z-index: 2;
  position: absolute;
  width: 100%;
  height: 100%;
  background-size: 10%;
  background-image: linear-gradient(90deg,
  rgba(0, 0, 0, 0) 0%,
  rgba(0, 0, 0, 0) 90%,
  rgba(0, 0, 0, 0.3) 91%,
  rgba(0, 0, 0, 0.3) 100%);
}

.bar_split_33 {
  background-size: 34%;
  background-image: linear-gradient(90deg,
  rgba(0, 0, 0, 0) 0%,
  rgba(0, 0, 0, 0) 95%,
  rgba(0, 0, 0, 0.7) 96%,
  rgba(0, 0, 0, 0.7) 100%);
}

.base_name {
  color: white;
  font-size: 12px;
  line-height: 18px;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
}
</style>
