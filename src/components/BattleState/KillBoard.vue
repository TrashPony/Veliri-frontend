<template>
  <div class="kill_board">
    <div class="kill" v-for="kill in getKillsNotify">
      <div class="hostile_team" :class="{my_team: kill.killer.myTeam}">{{ kill.killer.name }}</div>
      <div class="weapon">
        <app-background-item-cell v-bind:slotItem="{type: 'ammo', quantity: 0, item: kill.ammo}"/>
      </div>
      <div class="hostile_team" :class="{my_team: kill.dead.myTeam}">{{ kill.dead.name }}</div>
    </div>
  </div>
</template>

<script>
import BackgroundItemCell from '../Inventory/BackgroundItemCell'

export default {

  name: "KillBoard",
  data() {
    return {
      kills: {},
    }
  },
  computed: {
    battleState() {
      let state = this.$store.getters.getBattleState;
      return state;
    },
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
    getKillsNotify() {
      let killsNotify = this.$store.getters.getKillsNotify;

      while (killsNotify.length > 0) {

        let notify = killsNotify.shift();
        let key = this.battleState.players[notify.killer_id].player.user_name + this.battleState.players[notify.dead_id].player.user_name;

        this.kills[key] = {
          killer: {
            name: this.battleState.players[notify.killer_id].player.user_name,
            myTeam: this.myTeam.players.includes(notify.killer_id),
          },
          dead: {
            name: this.battleState.players[notify.dead_id].player.user_name,
            myTeam: this.myTeam.players.includes(notify.dead_id),
          },
          ammo: notify.bullet.ammo
        };

        let app = this;
        setTimeout(function () {
          app.$delete(app.kills, key)
        }, 3000)
      }

      return this.kills
    }
  },
  components: {
    AppBackgroundItemCell: BackgroundItemCell,
  }
}
</script>

<style scoped>
.kill_board {
  /*position: absolute;*/
  /*top: calc(100% + 25px);*/
  width: 300px;
}

.kill {
  clear: both;
}

.kill div {
  float: left;
}

.my_team, .hostile_team {
  color: rgb(255, 81, 83);
  font-weight: 900;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
}

.my_team {
  color: rgb(70, 115, 255);
}

.weapon {
  margin: 0 10px;
  position: relative;
  height: 25px;
  width: 25px;
}
</style>
