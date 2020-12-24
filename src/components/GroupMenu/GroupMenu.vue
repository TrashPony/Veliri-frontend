<template>
  <div class="GroupMenu" id="GroupMenu" ref="GroupMenu" @mousedown="toUp">

    <app-control v-bind:head="'Отряд'"
                 v-bind:move="true"
                 v-bind:close="true"
                 v-bind:refWindow="'GroupMenu'"
                 v-bind:noHeight="true"
                 v-bind:noWidth="true"/>

    <div class="group">
      <template v-if="groupState.uuid !== ''">
        <template v-for="member in groupState.members">

          <app-user-line v-if="groupState.state && groupState.state[member.user_id]"
                         v-bind:user="member"
                         v-bind:parent="'GroupMenu'"
                         v-bind:additionalTabs="groupState.leaderID === Number(currentUser.user_id) && member.user_id !== currentUser.user_id ? ['makeLeaderGroup']: null"
                         v-bind:additionalInfo="currentUser.game_mode === 'open_world' && groupState.state[member.user_id].on ? groupState.state[member.user_id]: null"
                         v-bind:crown="groupState.leaderID === Number(member.user_id)"
                         v-bind:buttonExit="groupState.leaderID === Number(currentUser.user_id) || member.user_id === currentUser.user_id"
                         v-bind:noActive="!groupState.state[member.user_id].on"
                         v-bind:meta="{id: member.user_id}"
                         v-bind:ready="currentUser.game_mode === 'open_world' || groupState.leaderID === Number(member.user_id) ? null : groupState.state[member.user_id].rd"
                         v-bind:exitFunc="leaveFromGroup"
          />

          <app-user-line v-if="!groupState.state"
                         v-bind:user="member"
                         v-bind:parent="'GroupMenu'"
                         v-bind:additionalTabs="groupState.leaderID === Number(currentUser.user_id) && member.user_id !== currentUser.user_id ? ['makeLeaderGroup']: null"
                         v-bind:crown="groupState.leaderID === Number(member.user_id)"
                         v-bind:buttonExit="groupState.leaderID === Number(currentUser.user_id) || member.user_id === currentUser.user_id"
                         v-bind:noActive="true"
                         v-bind:meta="{id: member.user_id}"
                         v-bind:exitFunc="leaveFromGroup"
          />
        </template>
      </template>

      <template v-if="groupState.uuid === ''">
        <h4 class="noGroup">Вы не состоите в отряде...</h4>
      </template>
    </div>
  </div>
</template>

<script>
import Control from '../Window/Control';
import UserLine from '../Chat/UserLine';

export default {
  name: "GroupMenu",
  methods: {
    toUp() {
      this.$store.commit({
        type: 'setWindowZIndex',
        id: this.$el.id,
      });
    },
    leaveFromGroup(id) {
      this.$store.getters.getWSByService('chat').socket.send(JSON.stringify({
        event: "LeaveGroup",
        user_id: Number(id),
      }));
    }
  },
  computed: {
    groupState() {
      if (this.currentUser.game_mode === 'open_world') {
        return this.$store.getters.getGroupState;
      } else {
        return this.$store.getters.getGroupSessionState;
      }
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
.GroupMenu {
  position: absolute;
  display: inline-block;
  background-size: 100% 2px;
  border-radius: 5px;
  min-height: 20px;
  width: 200px;
  z-index: 950;
  top: 30%;
  left: calc(50% - 60px);
  border: 1px solid #25a0e1;
  background: rgb(8, 138, 210);
  padding: 20px 3px 3px 3px;
  box-shadow: 0 0 2px;
  height: 250px;
}

.group {
  width: 100%;
  background: #89969c;
  float: left;
  box-shadow: inset 0 0 2px black;
  overflow-y: scroll;
  overflow-x: hidden;
  border-radius: 5px;
  height: calc(100% - 0px);
}

.noGroup {
  font-size: 10px;
  text-align: center;
}
</style>
