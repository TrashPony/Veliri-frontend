<template>
  <div class="minSquad" v-if="groupState.uuid !== '' && groupState.state">
    <div class="row"
         v-for="member in groupState.members"
         v-if="groupState.state[member.user_id] && member.user_id !== currentUser.user_id && !groupState.state[member.user_id].hd && member.user_role !== 'hidden'">

      <div :class="{dead: dead(member)}">

        <div class="chatUserIcon" v-bind:style="{backgroundImage: avatars[member.user_id]}">
          {{ getAvatar(member.user_id) }}
        </div>

        <div class="bars">
          <div class="chatUserName">
            {{ member.user_name }}
          </div>

          <table v-if="groupState.state && groupState.state[member.user_id].on">
            <tr v-if="groupState.state[member.user_id].mhp > 0">
              <td>
                <div class="bar_wrapper">
                  <div id="hp_bar"
                       :style="{width: (100 / (groupState.state[member.user_id].mhp / groupState.state[member.user_id].hp)) + '%', backgroundColor: colorDamage((100 / (groupState.state[member.user_id].mhp / groupState.state[member.user_id].hp)))}"></div>
                </div>
              </td>
            </tr>

            <tr v-if="groupState.state && groupState.state[member.user_id].mpw > 0">
              <div class="bar_wrapper">
                <div id="power_bar"
                     :style="{width: (100 / (groupState.state[member.user_id].mpw / groupState.state[member.user_id].pw)) + '%'}"></div>
              </div>
            </tr>
          </table>
          <table v-else>
            <tr>
              <td>Не в сети</td>
            </tr>
          </table>
        </div>

        <template v-if="battleState && battleState.kills">
          <span class="kills count">x{{ battleState.kills[member.user_id] }}</span>
        </template>
      </div>

      <div class="respawn_time"
           v-if="dead(member) && battleState.players[member.user_id].count_respawn > 0 && battleState.players[member.user_id].respawn_time > 0">
        {{ battleState.players[member.user_id].respawn_time }}
      </div>

    </div>
  </div>
</template>

<script>
import urls from '../../const';

export default {
  name: "MinSquad",
  methods: {
    getAvatar(userID) {
      let app = this;

      if (app.avatars.hasOwnProperty(userID)) return;

      app.$api.get(urls.avatarURL + '?user_id=' + userID).then(function (response) {
        app.$store.commit({
          type: 'addAvatar',
          id: userID,
          avatar: "url('" + response.data.avatar + "')",
        });
      });
    },
    colorDamage(percent) {
      return this.$store.getters.GetColorDamage(percent)
    },
    dead(member) {
      if (this.groupState.state && this.groupState.state[member.user_id] && this.groupState.state[member.user_id].hp === 0) {
        return true
      } else {
        return false
      }
    }
  },
  computed: {
    groupState() {
      return this.$store.getters.getGroupState;
    },
    currentUser() {
      return this.$store.getters.getUser
    },
    avatars() {
      return this.$store.getters.getChatState.avatars;
    },
    battleState() {
      return this.$store.getters.getBattleState
    }
  }
}
</script>

<style scoped>
.minSquad {
  position: absolute;
  min-height: 35px;
  width: 150px;
  top: 100%;
  left: 2px;
  margin-top: 3px;
}

.row {
  clear: both;
  height: 38px;
  margin-bottom: 2px;
  background: rgb(8, 138, 210);
  border: 1px solid #25a0e1;
  border-radius: 5px;
  padding: 1px;
  position: relative;
}

.chatUserIcon {
  border-radius: 5px;
  height: 38px;
  width: 38px;
  background: rgba(0, 0, 0, 0.3);
  float: left;
  box-shadow: inset 0 0 2px black;
  background-size: cover;
  margin-right: 2px;
}

.chatUserName {
  line-height: 16px;
  height: 15px;
  margin-left: 2px;
  white-space: nowrap;
  overflow: hidden;
  color: #e6e1d8;
  font-size: 9pt;
  background: rgba(0, 0, 0, 0.32);
  border-radius: 4px;
  text-align: center;
}

.bar_wrapper {
  width: 100%;
  height: 5px;
  border: 1px solid #4c4c4c;
  text-align: left;
  display: block;
  box-shadow: 0 0 2px black;
  border-radius: 10px;
  background-size: 12%;
  overflow: hidden;
  background-color: #959595;
  margin: 0 auto 0;
  position: relative;
}

#hp_bar, #power_bar {
  overflow: visible;
  background: rgba(72, 255, 40, 0.7);
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  box-shadow: inset 0 0 2px black;
}

#power_bar {
  background: rgba(3, 245, 255, 0.7);
}

table {
  width: calc(100% - 44px);
  color: #e6e1d8;
}

.kills {
  top: 0;
  position: absolute;
  height: 25px;
  font-size: 9pt;
}

.kills.count {
  left: calc(100% + 4px);
  line-height: 18px;
  color: white;
  font-weight: 900;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
}

.dead {
  opacity: 0.3;
}

.respawn_time {
  left: calc(100% + 4px);
  bottom: 0;
  position: absolute;
  font-size: 9pt;
  z-index: 2;
  color: white;
  font-weight: 900;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
}
</style>
