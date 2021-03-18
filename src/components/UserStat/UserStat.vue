<template>
  <div class="UsersStatus" :id="windowID" :ref="windowID" @mousedown="toUp" v-if="users[user_id]">

    <app-control
      v-bind:head="headers.user + ': ' + [users[user_id].user_id ? users[user_id].user_name : users[user_id].login]"
      v-bind:move="true"
      v-bind:close="true"
      v-bind:refWindow="windowID"
      v-bind:resizeFunc="resize"
      v-bind:minSize="{height: 175, width: user_id === currentUser.user_id ? 300 : 400}"
      v-bind:noHeight="true"
      v-bind:noWidth="true"/>

    <div class="usersStatusTabs">
      <div class="TabsLeftArrow" onclick="document.getElementById('usersStatusTabsGroup').scrollLeft -= 20;">&lt;</div>
      <div class="tabsWrapper">
        <div class="usersStatusTabsGroup">

          <div class="commonUserStat"
               v-bind:class="{actionChatTab : tab === 'common'}"
               @click="changeTab('common')">
            {{ headers.common }}
          </div>
          <div
            v-if="user_id === currentUser.user_id"
            v-bind:class="{actionChatTab : tab === 'skill'}"
            @click="changeTab('skill')"
            class="skillUserStat">
            {{ headers.skills }}
          </div>
          <div
            v-if="user_id === currentUser.user_id"
            v-bind:class="{actionChatTab : tab === 'missions'}"
            @click="changeTab('missions')"
            class="StatUserStat">
            {{ headers.missions }}
          </div>

          <div
            v-if="user_id === currentUser.user_id && false"
            v-bind:class="{actionChatTab : tab === 'relations'}"
            @click="changeTab('relations')"
            class="StatUserStat">
            {{ headers.relations }}
          </div>

          <template v-if="currentUser && currentUser.game_mode !== 'open_world'">
            <div
              v-if="user_id === currentUser.user_id"
              v-bind:class="{actionChatTab : tab === 'summary'}"
              @click="changeTab('summary')"
              class="StatUserStat">
              {{ headers.summary }}
            </div>
          </template>

        </div>
      </div>
      <div class="TabsRightArrow" onclick="document.getElementById('usersStatusTabsGroup').scrollLeft += 20;">&gt;</div>
    </div>

    <app-my-user v-if="tab === 'common' && user_id === currentUser.user_id" v-bind:user="users[user_id]"/>
    <app-other-user v-if="tab === 'common' && user_id !== currentUser.user_id" v-bind:user="users[user_id]"/>
    <app-skills v-if="tab === 'skill'&& user_id === currentUser.user_id"/>
    <app-user-summary v-if="tab === 'summary'&& user_id === currentUser.user_id" v-bind:user="users[user_id]"/>
    <app-relations v-if="tab === 'relations'&& user_id === currentUser.user_id" v-bind:user="users[user_id]"/>
    <app-missions v-if="tab === 'missions'&& user_id === currentUser.user_id" v-bind:user="users[user_id]"/>
  </div>
</template>

<script>
import Control from '../Window/Control';
import MyUser from './MyUser';
import OtherUser from './OtherUser';
import Skills from './Skills';
import UserSummary from './UserSummary';
import Relations from './Relations';
import Missions from './Missions';

export default {
  name: "UserStat",
  props: ['user_id', 'windowID'],
  data() {
    return {
      tab: 'common',
    }
  },
  mounted() {
    this.$store.getters.getWSByService('chat').socket.send(JSON.stringify({
      event: "OpenUserStat",
      ID: Number(this.$props.user_id),
    }));

    this.resize(null, null, $(this.$el))
  },
  methods: {
    toUp() {
      this.$store.commit({
        type: 'setWindowZIndex',
        id: this.$el.id,
      });
    },
    resize(event, ui, el) {
      try {
        el.find('.usersStatusWrapper').css("height", el.height() - 29);
        el.find('.UserSummaryWrapper').css("height", el.height() - 29);
        el.find('.userBiography').css("height", el.height() - 147);
        el.find('.biography').css("height", el.height() - 147);
        el.find('.skillContent').css("width", el.width() - 165);
        el.find('.skillContent').css("height", el.height() - 29);
        el.find('#HelpSections').css("height", el.height() - 17);
        el.find('.relations').css("height", el.height() - 23);
      } catch (e) {

      }
    },
    changeTab(tab) {
      this.tab = tab;
    }
  },
  computed: {
    currentUser() {
      return this.$store.getters.getUser
    },
    users() {
      return this.$store.getters.getUsers.users
    },
    language() {
      return this.$store.getters.getSettings.Language
    },
    headers() {
      if (this.language === 'RU') {
        return {
          common: "Общие", skills: "Навыки", missions: "Задания", user: "Пользователь",
          summary: "Сводка", history: "История игр", relations: "Отношения"
        }
      } else {
        return {
          common: "Common", skills: "Skills", missions: "Missions", user: "User",
          summary: "Summary", history: "History games", relations: "Отношения"
        }
      }
    }
  },
  components: {
    AppControl: Control,
    AppMyUser: MyUser,
    AppOtherUser: OtherUser,
    AppSkills: Skills,
    AppUserSummary: UserSummary,
    AppRelations: Relations,
    AppMissions: Missions,
  }
}
</script>

<style scoped>
.actionChatTab {
  color: #fff200 !important;
  background: rgb(187, 93, 42) !important;
}
</style>

<style>
.UsersStatus {
  top: 50px;
  left: calc(50% - 200px);
  min-height: 175px;
  width: 400px;
  position: absolute;
  border-radius: 5px;
  padding: 20px 3px 3px;
  z-index: 11;
  border: 1px solid #25a0e1;
  background: rgb(8, 138, 210);
  box-shadow: 0 0 2px black;
  height: 175px;
}

.usersStatusTabs {
  position: relative;
  width: 100%;
}

.tabsWrapper {
  height: 15px;
  width: 100%;
}

.usersStatusTabsGroup {
  height: 15px;
  width: calc(100% - 35px);
  background: rgba(0, 0, 0, 0.2);
  margin: 0 0 0 14px;
  border-radius: 3px 3px 0 0;
  overflow: hidden;
}

.usersStatusTabsGroup div {
  height: 15px;
  float: left;
  font-size: 10px;
  font-weight: 900;
  line-height: 15px;
  border-right: 1px solid rgba(191, 191, 191, 0.43);
  padding: 0 3px;
  color: #bfbfbf;
  text-shadow: 1px 1px black;
  cursor: pointer;
  transition: 200ms;
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none;
}

.usersStatusTabsGroup div:hover {
  color: #ffb60f;
  background: rgb(235, 98, 44);
}

.usersStatusTabsGroup div:active {
  transform: scale(0.98);
}

.TabsLeftArrow, .TabsRightArrow {
  height: 15px;
  width: 15px;
  position: absolute;
  color: #f9ff00;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
  font-size: 15px;
  line-height: 15px;
  font-weight: 900;
  top: 0;
  left: 2px;
  opacity: 0.3;
}

.TabsRightArrow {
  right: 0;
  left: unset;
}

.TabsLeftArrow:hover, .TabsRightArrow:hover {
  color: #00ffdf;
  opacity: 1;
}

.usersStatusWrapper {
  width: calc(100% - 14px);
  background: #89969c;
  float: left;
  box-shadow: inset 0 0 2px black;
  overflow-y: scroll;
  overflow-x: hidden;
  border-radius: 5px;
  height: calc(100% - 14px);
  padding: 7px;
  font-size: 12px;
}

.userAvatarWrapper input {
  margin-top: 5px;
  margin-left: 19px;
}

.userAvatarWrapper input:active {
  transform: scale(0.95);
}

</style>
