<template>
  <div class="kill_board">
    <div class="kill" v-for="kill in getKillsNotify">
      <div class="hostile_team" :class="{my_team: kill.killer.myTeam, [kill.killer.fraction]: true}">{{
          kill.killer.name
        }}
      </div>
      <div class="weapon">
        <app-background-item-cell v-bind:slotItem="{type: 'ammo', quantity: 0, item: kill.ammo}"/>
      </div>
      <div class="hostile_team" :class="{my_team: kill.dead.myTeam, [kill.dead.fraction]: true}">{{
          kill.dead.name
        }}
      </div>
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
        let key = notify.killer_name + notify.dead_name;

        this.kills[key] = {
          killer: {
            name: notify.killer_name,
            fraction: notify.killer_fraction,
          },
          dead: {
            name: notify.dead_name,
            fraction: notify.dead_fraction,
          },
          ammo: notify.bullet.ammo
        };

        if (this.battleState) {
          this.kills[key].killer.myTeam = this.myTeam.players.includes(notify.killer_name);
          this.kills[key].dead.myTeam = this.myTeam.players.includes(notify.dead_name);
        }

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
  line-height: 26px;
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

.my_team, .Replics {
  color: rgb(255, 81, 83);
}

.my_team, .Explores {
  color: rgb(87, 255, 81);
}

.my_team, .Reverses {
  color: rgb(70, 115, 255);
}

.my_team, .APD {
  color: rgb(241, 237, 8);
}

</style>
