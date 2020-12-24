<template>
  <div>
    <app-user-sub-menu v-if="userSubMenuProps.user" v-bind:userSubMenuProps="userSubMenuProps"/>

    <div class="chatUserLine" @click="openSubMenu($event, user)" v-bind:class="{noActive: noActive}">

      <div class="dialogExitShow" v-if="dialogExitShow" @click.stop="">
        <div @click.stop="closeDialog">
          <img src="https://img.icons8.com/color/50/000000/left2.png"/>
        </div>
        <div @click.stop="exitFunction">
          <img src="https://img.icons8.com/color/48/000000/ok--v1.png"/>
        </div>
      </div>

      <div class="dialogExitShow" v-if="userSubMenuProps.dialogChangeRole" @click.stop="">

        <select class="roleSelect" v-model="role">
          <option value="none">Выберите роль</option>
          <option v-for="(role, key) in corporation.roles" :value="key"
                  v-if="role.name !=='Leader'">{{ role.name }}
          </option>
        </select>

        <div @click.stop="closeDialog">
          <img src="https://img.icons8.com/color/50/000000/left2.png"/>
        </div>
        <div @click.stop="changeCorporationRole">
          <img src="https://img.icons8.com/color/48/000000/ok--v1.png"/>
        </div>
      </div>

      <div class="chatUserIcon" v-bind:style="{backgroundImage: avatars[user.user_id ? user.user_id : user.id]}">
        {{ getAvatar(user.user_id ? user.user_id : user.id) }}
      </div>

      <div class="crown" v-if="crown">
        {{ getAvatar(user.user_id ? user.user_id : user.id) }}
      </div>

      <div class="chatUserName">
        {{ user.user_name ? user.user_name : user.login }}
      </div>

      <div class="userTitle" v-if="title">
        {{ title }}
      </div>

      <div class="userOnline" v-if="online === true || online === false">
        <div v-bind:style="{backgroundColor: online ? '#00ff00':'#ff0000'}"></div>
      </div>

      <div class="ready" v-if="ready === true || ready === false">
        <img v-if="ready === true" src="https://img.icons8.com/color/48/000000/ok--v1.png"/>
        <img v-if="ready === false" src="https://img.icons8.com/office/16/000000/hourglass.png"/>
      </div>

      <div class="exitChatButton" v-if="buttonExit && !dialogExitShow" @click.stop="dialogExit">
        <img src="https://img.icons8.com/color/96/000000/export.png"/>
      </div>

      <div v-if="additionalInfo" class="additionalInfo">
        <table>
          <tr>
            <td>Место:</td>
            <td v-if="additionalInfo.bn !== ''">
              <span class="importantly">{{ additionalInfo.bn }}</span> ({{ additionalInfo.mn }})
            </td>
            <td v-if="additionalInfo.bn === ''">
              <span class="importantly">{{ additionalInfo.mn }}</span>
            </td>
          </tr>

          <tr v-if="additionalInfo.mhp > 0">
            <td>HP:</td>
            <td>
              <div class="bar_wrapper">
                <div id="hp_bar"
                     :style="{width: (100 / (additionalInfo.mhp / additionalInfo.hp)) + '%', backgroundColor: colorDamage((100 / (additionalInfo.mhp / additionalInfo.hp)))}"></div>
              </div>
            </td>
          </tr>

          <tr v-if="additionalInfo.mpw > 0">
            <td>Power:</td>
            <div class="bar_wrapper">
              <div id="power_bar"
                   :style="{width: (100 / (additionalInfo.mpw / additionalInfo.pw)) + '%'}"></div>
            </div>
          </tr>

          <tr v-if="additionalInfo.inm > 0">
            <td>Трюм:</td>
            <td>
              <app-size v-bind:capacity="additionalInfo.inm" v-bind:size="additionalInfo.in"/>
            </td>
          </tr>

        </table>
      </div>
    </div>
  </div>
</template>

<script>
import UserSubMenu from './UserSubMenu';
import Size from '../Inventory/Size'
import urls from '../../const';

export default {
  name: "UserLine",
  props: ['user', 'buttonExit', 'exitFunc', 'parent', 'meta', 'noActive', 'crown', 'additionalInfo', 'additionalTabs',
    'title', 'online', 'parentEl', 'noMenu', 'ready'],
  data() {
    return {
      dialogExitShow: false,
      role: 'none',
      userSubMenuProps: {
        user: null,
        x: 0,
        y: 0,
        avatar: null,
        additionalTabs: null,
        parent: null,
        dialogChangeRole: null,
      }
    }
  },
  methods: {
    colorDamage(percent) {
      return this.$store.getters.GetColorDamage(percent)
    },
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
    openSubMenu(event, user) {

      if (this.$props.noMenu) {
        return
      }

      let parent = this.$parent.$el;
      if (this.$props.parentEl) {
        parent = this.$props.parentEl
      }

      this.userSubMenuProps.x = event.pageX - $(parent).position().left;
      this.userSubMenuProps.y = event.pageY - $(parent).position().top;
      this.userSubMenuProps.user = user;
      this.userSubMenuProps.parent = this.$props.parent;
      this.userSubMenuProps.additionalTabs = this.$props.additionalTabs;
      this.userSubMenuProps.avatar = this.avatars[user.user_id];
    },
    closeDialog() {
      this.dialogExitShow = false;
      this.userSubMenuProps.dialogChangeRole = false;
    },
    dialogExit() {
      this.userSubMenuProps.user = null;
      this.dialogExitShow = true;
    },
    exitFunction() {
      this.closeDialog();

      if (this.$props.parent === 'chat') {
        this.$props.exitFunc(this.$props.meta.currentChatID);
      }
      if (this.$props.parent === 'friendList') {
        this.$props.exitFunc(this.$props.meta.id);
      }
      if (this.$props.parent === 'GroupMenu') {
        this.$props.exitFunc(this.$props.meta.id);
      }
    },
    changeCorporationRole() {
      this.closeDialog();
      this.$store.getters.getWSByService('chat').socket.send(JSON.stringify({
        event: "changeRoleUserInCorporation",
        user_id: Number(this.$props.user.user_id),
        id: Number(this.role),
      }));
    }
  },
  computed: {
    avatars() {
      return this.$store.getters.getChatState.avatars;
    },
    corporation() {
      return this.$store.getters.getChatState.corporation;
    },
  },
  components: {
    AppUserSubMenu: UserSubMenu,
    AppSize: Size,
  }
}
</script>

<style scoped>
.chatUserLine {
  position: relative;
  white-space: nowrap;
  overflow: hidden;
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
  min-height: 25px;
  color: #e6e1d8;
  font-size: 9pt;
  transition: 100ms;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
}

.chatUserLine:hover {
  background: rgba(0, 0, 0, 0.2);
}

.chatUserLine:active {
  background: rgba(214, 214, 214, 0.2);
}

.chatUserLine div {
  display: inline-block;
}

.chatUserIcon, .crown {
  height: 25px;
  width: 25px;
  background: rgba(0, 0, 0, 0.3);
  float: left;
  box-shadow: inset 0 0 5px black;
  background-size: cover;
  margin-right: 2px;
}

.crown {
  background: rgba(0, 0, 0, 0.1);
  height: 21px;
  width: 21px;
  margin: 2px;
  box-shadow: none;
  border-radius: 3px;
  background-image: url("https://img.icons8.com/color/48/000000/crown.png");
  background-size: contain;
}

.chatUserName {
  line-height: 35px;
  height: 25px;
  margin-left: 2px;
}

.noActive {
  opacity: 0.25;
}

.noActive:hover {
  opacity: 0.75;
}

.dialogExitShow {
  position: absolute;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.75);
  height: 100%;
  width: 100%;
  z-index: 10;
}

.exitChatButton {
  position: relative;
}

.dialogExitShow div, .exitChatButton, .ready {
  height: 20px;
  width: 20px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  float: right;
  margin: 2px;
  opacity: 0.4;
  transition: 200ms;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 1;
}

.dialogExitShow div {
  position: static;
}

.ready {
  right: 22px;
  opacity: 1;
}

.dialogExitShow div img, .exitChatButton img, .ready img {
  position: relative;
  height: 100%;
  width: 100%;
  z-index: 10;
}

.dialogExitShow div:hover, .exitChatButton:hover {
  border: 1px solid rgba(255, 242, 15, 0.7);
  background: rgba(255, 232, 0, 0.6);
  opacity: 0.8;
}

.dialogExitShow div:active {
  transform: scale(0.97);
}

.chatUserLine .additionalInfo {
  display: block;
  min-height: 25px;
  width: 100%;
  background: rgba(0, 255, 251, 0.2);
}

.additionalInfo table {
  font-size: 11px;
  color: #c1c1c1;
  width: calc(100% - 8px);
  margin: 2px auto;
}

.additionalInfo table tr td:first-child {
  text-align: right;
  width: 30px;
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

.userTitle {
  color: #ffef0f;
  margin-left: 40px;
}

.userOnline {
  float: right;
  position: relative;
  margin-top: 5px;
  margin-right: 5px;
  height: 15px;
  width: 15px;
  opacity: 0.7;
}

.userOnline div {
  height: calc(100% - 2px);
  width: calc(100% - 2px);
  border-radius: 50%;
  box-shadow: inset 0 0 2px #737373;
  border: 1px solid #737373;
}

.roleSelect {
  box-shadow: inset 0 0 1px 1px rgb(118, 118, 118);
  outline: none;
  width: 190px;
  border-radius: 5px;
  border: 0;
  background: #79a0b4;
  height: 20px;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 900;
  transition: 200ms;
  color: #ff7800;
  margin: 3px;
  font-size: 11px;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
}

select * {
  color: black;
  font-weight: bold;
}
</style>
<style>
.chatUserLine .additionalInfo .sizeInventoryInfo {
  display: block;
  width: 100%;
  box-shadow: 0 0 2px black;
  height: 5px;
}

.chatUserLine .additionalInfo .sizeInventoryInfo span {
  display: none;
}
</style>
