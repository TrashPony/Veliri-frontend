<template>
  <div id="chatSubMenu" v-bind:style="{ left: userSubMenuProps.x + 'px', top: userSubMenuProps.y + 'px' }">
    <div class="wrapper">
      <div class="chatSubMenuUserHead">
        <div class="chatUserLine">
          <div class="chatUserIcon" v-bind:style="{backgroundImage: userSubMenuProps.avatar}"></div>
          <div>
            <div class="chatUserName">{{ userSubMenuProps.user.user_name }}</div>
            <div class="chatUserTitle">{{ userSubMenuProps.user.title }}</div>
          </div>
        </div>
      </div>

      <div class="chatSubMenuUserAction">
        <input type="button" value="Подробнее" @click="information">

        <input v-if="userSubMenuProps.user.user_id !== currentUser.user_id"
               type="button"
               value="Написать"
               @click="createPrivateChatGroup">

        <template v-if="userSubMenuProps.additionalTabs">
          <input v-if="userSubMenuProps.additionalTabs.includes('makeLeaderGroup')"
                 type="button" value="Сделать лидером"
                 @click="makeLeaderGroup">
        </template>

        <input v-if="userSubMenuProps.user.user_id !== currentUser.user_id &&
        (!groupState.state || !groupState.state.hasOwnProperty(userSubMenuProps.user.user_id))"
               type="button" value="Пригласить в группу" @click="sendInviteGroup">

        <input v-if="mayInviteCorp" type="button" value="Пригласить в кластер" @click="sendInviteCorp">
        <input v-if="mayKickCorp" type="button" value="Выгнать" @click="kickCorp">
        <input v-if="mayLeaveCorp" type="button" value="Покинуть" @click="kickCorp">
        <input v-if="mayChangeRoleCorp" type="button" value="Изменить роль" @click="changeRoleCorp">

        <input type="button" value="Закрыть" @click="close">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "UserSubMenu",
  props: ['userSubMenuProps'],
  methods: {
    createPrivateChatGroup() {
      this.$store.getters.getWSByService('chat').socket.send(JSON.stringify({
        event: "CreateNewPrivateGroup",
        user_id: Number(this.$props.userSubMenuProps.user.user_id),
      }));
      this.close();
    },
    information() {
      this.$store.commit({
        type: 'toggleWindow',
        id: 'userStat' + this.$props.userSubMenuProps.user.user_id,
        component: 'userStat',
        meta: {user_id: this.$props.userSubMenuProps.user.user_id},
        forceOpen: true,
      });
      this.close();
    },
    close() {
      this.$props.userSubMenuProps.user = null;
    },
    makeLeaderGroup() {
      this.$store.getters.getWSByService('chat').socket.send(JSON.stringify({
        event: "ChangeLeaderGroup",
        user_id: Number(this.$props.userSubMenuProps.user.user_id),
      }));
      this.close();
    },
    sendInviteGroup() {
      this.$store.getters.getWSByService('chat').socket.send(JSON.stringify({
        event: "InviteToGroup",
        user_name: this.$props.userSubMenuProps.user.user_name,
      }));
      this.close();
    },
    sendInviteCorp() {
      this.$store.getters.getWSByService('chat').socket.send(JSON.stringify({
        event: "InviteToCorp",
        user_name: this.$props.userSubMenuProps.user.user_name,
      }));
      this.close();
    },
    kickCorp() {
      this.$store.getters.getWSByService('chat').socket.send(JSON.stringify({
        event: "KickFromCorp",
        user_name: this.$props.userSubMenuProps.user.user_name,
      }));
      this.close();
    },
    changeRoleCorp() {
      this.$parent.userSubMenuProps.dialogChangeRole = true;
      this.close();
    },
    getMemberRoleCorp(id) {
      for (let i in this.corporation.members) {
        if (Number(id) === Number(i)) {
          let member = this.corporation.members[i];
          if (member) {
            return this.corporation.roles[member.role_id];
          }
        }
      }
    }
  },
  computed: {
    currentUser() {
      return this.$store.getters.getUser
    },
    groupState() {
      if (this.currentUser.game_mode === 'open_world') {
        return this.$store.getters.getGroupState;
      } else {
        return this.$store.getters.getGroupSessionState;
      }
    },
    corporation() {
      return this.$store.getters.getChatState.corporation;
    },
    mayInviteCorp() {
      let props = this.$props.userSubMenuProps;
      if (!this.corporation || props.user.corporation_id > 0 || props.user.user_id === this.currentUser.user_id) {
        return false
      }

      let role = this.getMemberRoleCorp(this.currentUser.user_id);
      if (role) {
        return role.invite_users;
      }

      return false
    },
    mayKickCorp() {
      if (!this.corporation) {
        return false
      }

      let props = this.$props.userSubMenuProps;

      if (props.parent && props.parent === 'corporation' &&
        props.user.user_id !== this.currentUser.user_id &&
        props.user.corporation_id === this.currentUser.corporation_id) {

        let role = this.getMemberRoleCorp(this.currentUser.user_id);
        if (role) {
          return role.kick_users;
        }
      }

      return false
    },
    mayLeaveCorp() {
      if (!this.corporation) {
        return false
      }

      let props = this.$props.userSubMenuProps;
      let role = this.getMemberRoleCorp(this.currentUser.user_id);
      if (role && role.name === "Leader") {
        return false
      }

      return props.parent && props.parent === 'corporation' && props.user.user_id === this.currentUser.user_id
    },
    mayChangeRoleCorp() {
      if (!this.corporation) {
        return false
      }

      let props = this.$props.userSubMenuProps;
      let role = this.getMemberRoleCorp(this.currentUser.user_id);
      if (role) {
        return role.change_role_user && props.user.user_id !== this.currentUser.user_id &&
          props.user.corporation_id === this.currentUser.corporation_id &&
          props.parent && props.parent === 'corporation'
      }

      return false
    }
  }
}
</script>

<style scoped>

.chatUserLine {
  position: relative;
  white-space: nowrap;
  overflow: hidden;
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
  height: 25px;
  color: #ff7800;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
}

.chatUserIcon {
  background: rgba(0, 0, 0, 0.3);
  float: left;
  box-shadow: inset 0 0 5px black;
  background-size: cover;
}

#chatSubMenu {
  width: fit-content;
  position: absolute;
  border: 1px solid rgba(37, 160, 225, 0.2);
  background: rgba(8, 138, 210, 0.2);
  border-radius: 5px;
  min-height: 20px;
  min-width: 80px;
  padding: 3px;
  text-shadow: 1px 1px 2px black, 0 0 1em #696969;
  z-index: 91;
  filter: drop-shadow(0 0 2px black);
}

#chatSubMenu .chatUserLine {
  height: 35px;
  background: #5a5a5aa1;
  box-shadow: inset 0 0 2px black;
}

#chatSubMenu .chatUserIcon {
  width: 35px;
  height: 35px;
  background-size: cover;
}

#chatSubMenu .chatUserName {
  display: block;
  line-height: 18px;
  text-align: left;
  padding-right: 4px;
}

#chatSubMenu .chatUserTitle {
  display: block;
  line-height: 15px;
  text-align: left;
  font-size: 12px;
  text-indent: 8px;
  color: #efd800;
  padding-right: 4px;
}

.chatSubMenuUserAction input {
  display: block;
  width: 100%;
  margin: 2px auto 0;
  pointer-events: auto;
  font-size: 9px;
  text-align: center;
  transition: 100ms;
  background: rgba(255, 129, 0, 0.6);
  height: 16px;
  border-radius: 5px;
  color: #fff;
  line-height: 15px;
  box-shadow: 0 0 2px #000;
}

.chatSubMenuUserAction input:active {
  transform: scale(0.98);
}

.chatSubMenuUserAction input:hover {
  background: rgba(255, 129, 0, 1);
}

.chatUserName {
  margin-left: 2px;
}

.chatUserLine div {
  display: inline-block;
}

.wrapper {
  height: 100%;
  width: calc(100% - 2px);
  float: left;
  clear: both;
  border: 1px solid rgba(37, 160, 225, 0.5);
  background: rgba(8, 138, 210, 0.5);
  border-radius: 3px;
  box-shadow: 0 0 2px black;
}

#chatSubMenu .wrapper {
  height: calc(100% - 8px);
  width: calc(100% - 8px);
  padding: 3px;
}
</style>
