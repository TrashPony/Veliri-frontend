<template>
  <div>
    <div class="team">
      <div class="members">
        <table>

          <tr class="headState">
            <th class="member"></th>
            <th class="kills">Убийства</th>
            <th class="assist">Содействия</th>
            <th class="damage">Урон</th>
            <th class="damage">Востан.</th>
            <th class="base">Счет</th>
          </tr>

          <tr v-for="memberID in myTeam.players"
              v-if="battleState.players[memberID] && battleState.players[memberID].player && battleState.players[memberID].player.user_id > 0">
            <td class="member">
              <app-user-line v-bind:noMenu="true" v-bind:user="battleState.players[memberID].player"/>
            </td>
            <td>{{ battleState.kills[memberID] }}</td>
            <td>{{ battleState.assist[memberID] }}</td>
            <td>{{ battleState.damage[memberID] }}</td>
            <td>{{ battleState.heal[memberID] }}</td>
            <td>{{ battleState.points[memberID] }}</td>
          </tr>
        </table>
      </div>

      <div class="buttons">
        <div @click="exit">Выход</div>
      </div>
    </div>
  </div>
</template>

<script>
import UserLine from '../Chat/UserLine';

export default {
  name: "EndStatusPVE",
  methods: {
    exit() {
      this.$store.getters.getWSByService('chat').socket.send(JSON.stringify({
        event: "ExitGame",
      }));
    },
  },
  computed: {
    currentUser() {
      return this.$store.getters.getUser
    },
    battleState() {
      let state = this.$store.getters.getBattleState;
      if (state && !this.end_game && state.end) {
        this.end_status = true;
        this.end_game = true;
      }
      return state;
    },
    myTeam() {
      for (let i in this.battleState.teams) {
        if (this.battleState.teams.hasOwnProperty(i) && this.battleState.teams[i].players.includes(this.currentUser.user_id)) {
          return this.battleState.teams[i]
        }
      }
    },
  },
  components: {
    AppUserLine: UserLine,
  }
}
</script>

<style scoped>
.members {
  clear: both;
  min-height: 100px;
  overflow-x: hidden;
  overflow-y: scroll;
  box-shadow: inset 0 0 2px black;
}

.members table {
  border-collapse: collapse;
  width: 100%;
}

.members table tr:hover {
  background: rgba(0, 0, 0, 0.3);
}

.members table td {
  height: 15px;
  color: white;
  line-height: 15px;
  width: 140px;
  border-right: 1px solid rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
  font-size: 10px;
  text-align: center;
}

.headState {
  height: 15px;
}

.headState th {
  height: 15px;
  font-size: 10px;
  color: white;
  border-right: 1px solid rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
  text-align: center;
  line-height: 15px;
  opacity: 0.75;
  margin: 0;
  padding: 0;
}

.member {
  text-align: left;
}

.buttons {
  margin-top: 5px;
  width: 100%;
}

.buttons div {
  height: 23px;
  width: 75px;
  padding: 0 15px;
  margin: 2px;
  border-radius: 5px;
  color: white;
  line-height: 25px;
  box-shadow: 0 0 2px black;
  transition: 100ms;
  background: rgba(255, 129, 0, 0.75);
  text-align: center;
  float: right;
}

.buttons div:hover {
  background: rgba(255, 129, 0, 1);
}

.buttons div:active {
  transform: scale(0.98);
}

.buttons .disable {
  background: rgba(108, 108, 108, 0.75);
}

.buttons .disable:hover {
  background: rgba(108, 108, 108, 0.75);
}
</style>
