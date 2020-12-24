<template>
  <div id="end_status" v-if="battleState && end_status && getResultBattle">
    <div class="wrapper">
      <div class="resultType" :class="{lose: getResultBattle.type !== 'Победа'}">{{ getResultBattle.type }}</div>
      <div class="resultCause">{{ getResultBattle.cause }}</div>

      <div class="resultPlayers">
        <app-end-status-p-v-p v-if="battleState.type === 'battle' || battleState.type === 'team_death_match'"/>
        <app-end-status-p-v-e v-if="battleState.type === 'defense' || battleState.type === 'breakthrough' || battleState.type === 'convoy'"/>
      </div>
    </div>
  </div>
</template>

<script>
import EndStatusPVP from './EndStatusPVP';
import EndStatusPVE from './EndStatusPVE';

export default {
  name: "EndStatus",
  data() {
    return {
      end_status: false,
      end_game: false,
    }
  },
  methods: {
    getCause(cause, type) {
      if (type === "lose" && cause === "base_lost") return "Наша база захвачена";
      if (type === "lose" && cause === "all_players_destroy") return "Все союзники уничтожены";
      if (type === "lose" && cause === "hostile_transport_more") return "У врага осталось больше транспорта";
      if (type === "lose" && cause === "destroy_object") return "Обьект потерян";
      if (type === "lose" && cause === "hostile_team_reached_need_kills_count") return "Враг набрал необходимое количество убийств";

      if (type === "win" && cause === "base_lost") return "База противника захвачена";
      if (type === "win" && cause === "all_players_destroy") return "Все противники уничтожены";
      if (type === "win" && cause === "hostile_transport_more") return "Созных транспортов обсталось больше";
    },
  },
  computed: {
    currentUser() {
      return this.$store.getters.getUser
    },
    myTeam() {
      for (let i in this.battleState.teams) {
        if (this.battleState.teams.hasOwnProperty(i) && this.battleState.teams[i].players.includes(this.currentUser.user_id)) {
          return this.battleState.teams[i]
        }
      }
    },
    battleState() {
      let state = this.$store.getters.getBattleState;
      if (state && !this.end_game && state.end) {
        this.end_status = true;
        this.end_game = true;
      }
      return state;
    },
    hostileTeam() {
      for (let i in this.battleState.teams) {
        if (this.battleState.teams.hasOwnProperty(i) && !this.battleState.teams[i].players.includes(this.currentUser.user_id)) {
          return this.battleState.teams[i]
        }
      }
    },
    getResultBattle() {
      if (this.battleState && this.myTeam) {
        if (this.battleState.loses[this.myTeam.uuid]) {
          return {
            type: this.battleState.loses[this.myTeam.uuid] === 'draw' ? "Ничья" : "Поражение",
            cause: this.getCause(this.battleState.loses[this.myTeam.uuid], "lose")
          }
        } else {
          return {type: "Победа", cause: this.getCause(this.battleState.loses[this.hostileTeam.uuid], "win")}
        }
      }
    },
  },
  components: {
    AppEndStatusPVP: EndStatusPVP,
    AppEndStatusPVE: EndStatusPVE,
  }
}
</script>

<style scoped>
#end_status {
  transform: translate(-50%, 0%);
  left: 50%;
  pointer-events: all;
  position: absolute;
  top: 65px;
  z-index: 50;
  /*left: -170px;*/
}

.wrapper {
  padding: 4px;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
  box-shadow: 0 0 2px 1px black;
  width: 600px;
  min-height: 50px;
  background: rgba(128, 128, 128, 0.9);
}

.resultType {
  color: rgb(70, 115, 255);
  font-size: 26px;
  font-weight: 900;
}

.resultType.lose {
  color: rgb(255, 81, 83);
}

.resultCause {
  color: white;
  font-size: 12px;
}

.resultPlayers {
  width: calc(100% - 4px);
  min-height: 10px;
}

</style>
