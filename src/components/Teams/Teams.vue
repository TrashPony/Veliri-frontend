<template>
  <div id="teams" ref="teams"
       v-if="false && battleState && battleState.teams && battleState.type !== 'convoy' && battleState.type !== 'defense' && battleState.type !== 'breakthrough'">
    <app-control v-bind:head="'Команда противника:'"
                 v-bind:move="true"
                 v-bind:close="false"
                 v-bind:refWindow="'teams'"/>

    <div class="teamList">
      <div class="team"
           v-for="team in battleState.teams"
           v-if="!team.players.includes(currentUser.user_id) && !team.hide">

        <div class="teamName" :style="{background: getTeamColor(team)}">
          {{ getTeamName(team) }}:
        </div>

        <div class="members">

          <template v-for="memberID in team.players"
                    v-if="battleState.players[memberID] && battleState.players[memberID].live">
            <div class="member">
              <app-user-line v-bind:user="battleState.players[memberID].player"/>
            </div>
<!--            <div class="kills">-->
<!--              x{{ battleState.kills[memberID] }}-->
<!--            </div>-->
          </template>

          <template v-for="memberID in team.players"
                    v-if="battleState.players[memberID] && !battleState.players[memberID].live">
            <div class="member dead">
              <app-user-line v-bind:user="battleState.players[memberID].player"/>
            </div>
            <div class="kills dead">
              x{{ battleState.kills[memberID] }}
            </div>
          </template>

        </div>

      </div>
    </div>
  </div>
</template>

<script>
import Control from '../Window/Control';
import UserLine from '../Chat/UserLine';

export default {
  name: "Teams",
  methods: {
    getTeamColor(team) {
      // if (name === 'Синии') {
      //   return 'rgb(57 115 245)'
      // }
      // if (name === 'Красные') {
      //   return 'rgb(220 55 55)'
      // }
      if (team.players.includes(this.currentUser.user_id)) {
        return 'rgb(57 115 245)'
      } else {
        return 'rgb(220 55 55)'
      }
    },
    getTeamName(team) {
      if (team.players[this.currentUser.user_id]) {
        return 'Синии'
      } else {
        return 'Красные'
      }
    }
  },
  computed: {
    battleState() {
      return this.$store.getters.getBattleState
    },
    currentUser() {
      return this.$store.getters.getUser
    },
  },
  components: {
    AppControl: Control,
    AppUserLine: UserLine,
  }
}
</script>

<style scoped>
#teams {
  position: absolute;
  right: 15px;
  top: 250px;
  height: 200px;
  width: 150px;
  padding: 20px 3px 3px 3px;
  border-radius: 5px;
  border: 1px solid #25a0e1;
  background: rgb(8, 138, 210);
  box-shadow: 0 0 2px black;
}

.teamList {
  overflow-y: scroll;
  overflow-x: hidden;
  height: 100%;
  width: 100%;
  background: #89969c;
  border-radius: 5px;
  box-shadow: inset 0 0 2px black;
}

.teamName {
  margin: 1px 0 2px -8px;
  background: rgb(221, 112, 52);
  color: rgba(255, 255, 255, 0.8);
  border-radius: 4px;
  font-size: 13px;
  line-height: 17px;
  height: 17px;
  user-select: none;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 1);
  font-weight: bold;
  box-shadow: 0 0 2px rgba(0, 0, 0, 1);
  padding-left: 10px;
  width: 100%;
}

.member {
  width: 100%;
  border-right: 1px solid grey;
  float: left;
}

.kills {
  float: left;
  color: white;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 1);
  margin-left: 10px;
  line-height: 30px;
}

.dead {
  opacity: 0.3;
}
</style>
