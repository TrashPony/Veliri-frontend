<template>
  <div id="chat" ref="chat" @mousedown="toUp" @mouseover="over" @mouseout="out">

    <div id="notifyBlock">
      <template v-for="notify in chatState.notifys">

        <div v-if="notify.name === 'craft'" style="background: #00fffe" @click="deleteNotify(notify)">
          <div class="missionNotify">
            <h3>Завершено производство</h3>
            <div class="notifyParagraph">
              На базе <span class="importantly">{{ notify.base.name }}</span>
              что в секторе <span class="importantly">{{ notify.map.Name }}</span>
              завершено производство
              <div class="notifyIconItem">
                <app-background-item-cell v-bind:slotItem="notify.item"/>
              </div>
              <span class="importantly">{{ notify.item.item.name }}</span>
              в количестве <span class="importantly">{{ notify.item.quantity }}</span> единиц.
              <p> Созданные вещи ожидают вас на складе базы <span class="importantly">{{ notify.base.name }}</span></p>
            </div>
          </div>
        </div>

        <div v-if="notify.name === 'sell' || notify.name === 'buy'" style="background: #cd00ff"
             @click="deleteNotify(notify)">
          <div class="missionNotify">
            <h3>Совершена {{ typeDealName(notify.name)[0] }}</h3>
            <div class="notifyParagraph">
              На базе <span class="importantly">{{ notify.base.name }}</span>
              что в секторе <span class="importantly">{{ notify.map.Name }}</span>
              было {{ typeDealName(notify.name)[1] }}
              <div class="notifyIconItem">
                <app-background-item-cell v-bind:slotItem="notify.item"/>
              </div>
              <span class="importantly">{{ notify.item.item.name }}</span>
              в количестве <span class="importantly">{{ notify.item.quantity }}</span> единиц, по цене <span
              class="importantly">{{ notify.price }}</span>
              <span class="cr">cr</span> за шт.
              <p>Общая стоимость сделки составила <span
                class="importantly">{{ notify.item.quantity * notify.price }}</span>
                <span class="cr">cr</span>.</p>
              <p>{{ typeDealName(notify.name)[2] }}</p>
            </div>
          </div>
        </div>

        <div v-if="notify.name === 'skill_up'" style="background: #ff9700" @click="deleteNotify(notify)">
          <div class="missionNotify" v-html="notify.text"></div>
        </div>
      </template>
    </div>

    <app-control v-bind:head="'Чат'"
                 v-bind:move="true"
                 v-bind:close="false"
                 v-bind:refWindow="'chat'"
                 v-bind:resizeFunc="resize"
                 v-bind:minSize="{height: 200, width: 300}"/>

    <div class="tabs" id="chatTabs">

      <div id="chatTabsLeftArrow" onclick="document.getElementById('tabsGroupWrapper').scrollLeft -= 20;"><</div>

      <div id="tabsGroupWrapper">
        <div id="tabsGroup">

          <div class="localTabChat"
               @click="changeCanal(0)"
               v-bind:class="{ actionChatTab: chatState.currentChatID === 0, alertChatTab: chatState.groups[0] && chatState.groups[0].newMessage && 0 !== chatState.currentChatID}">
            Локальный

            <template v-if="chatState.currentChatID === 0 && chatState.groups[0] && chatState.groups[0].newMessage">
              {{ scrollToBottom(false, true, 0) }}
            </template>
          </div>

          <div v-for="group in chatState.groups"
               v-if="group.id !== 0"
               @click="changeCanal(group.id)"
               v-bind:class="{ actionChatTab: chatState.currentChatID === group.id, alertChatTab: group.newMessage && group.id !== chatState.currentChatID}">

            {{ group.name }}

            <template v-if="chatState.currentChatID === group.id && group.newMessage">
              {{ scrollToBottom(false, true, group.id) }}
            </template>
          </div>

        </div>
      </div>
      <div id="chatTabsRightArrow" onclick="document.getElementById('tabsGroupWrapper').scrollLeft += 20;">></div>
    </div>

    <div class="topButton" @click="viewAllGroups">+</div>

    <div id="chatBox" ref="chatBox">

      <div class="chatMessage" v-if="getChatGreetings(chatState.groups[chatState.currentChatID])">
        <span class="chatSystem">{{ getChatGreetings(chatState.groups[chatState.currentChatID]) }}</span>
      </div>

      <template
        v-if="chatState.groups.hasOwnProperty(chatState.currentChatID) && chatState.groups[chatState.currentChatID].hasOwnProperty('history')">
        <div class="chatMessage" v-for="message in chatState.groups[chatState.currentChatID].history" v-if="message">

          <template v-if="message.system">
            <span class="chatSystem">{{ message.message }}</span>
          </template>

          <template v-else>
            <div class="chatUserIcon" v-bind:style="{backgroundImage: avatars[message.user_id]}">
              {{ getAvatar(message.user_id) }}
            </div>
            <span class="ChatUserName">{{ message.user_name }}:</span>
            <span class="ChatText">{{ message.message }}</span>
          </template>

        </div>
      </template>
    </div>
    <div id="usersBox">
      <app-user-line v-for="user in chatState.users[chatState.currentChatID]"
                     v-bind:user="user"
                     v-bind:parent="'chat'"
                     v-bind:meta="{currentChatID: chatState.currentChatID}"
                     v-bind:exitFunc="unsubscribe"
                     v-bind:buttonExit="currentUser.user_id === user.user_id && chatState.currentChatID !== 0 &&
                      chatState.groups[chatState.currentChatID].type !== 'group' && chatState.groups[chatState.currentChatID].type !== 'corporation'"
      />
    </div>

    <app-input v-bind:currentChatID="currentChatID" v-bind:disabled="inputDisabled"/>
  </div>
</template>

<script>
import Control from '../Window/Control';
import BackgroundItemCell from '../Inventory/BackgroundItemCell';
import Input from './Input';
import UserSubMenu from './UserSubMenu';
import UserLine from './UserLine';

import urls from '../../const';

export default {
  name: "Chat",
  data() {
    return {
      currentChatID: 0,
      inputDisabled: true,
      userSubMenuProps: {
        user: null,
        x: 0,
        y: 0,
        avatar: null,
      }
    }
  },
  created() {
    let app = this;
    app.scrollToBottom(true);
  },
  methods: {
    toUp() {
      this.$store.commit({
        type: 'setWindowZIndex',
        id: this.$el.id,
      });
    },
    resize(event, ui, el) {
      el.find('#chatBox').css("height", el.height() - 55);
      el.find('#usersBox').css("height", el.height() - 55);
      el.find('#chatBox').css("width", el.width() - 130);
      el.find('#chatInput').css("width", el.width() - 16);
      el.find('#tabsGroupWrapper').css("width", el.width() - 60);
      el.find('#chatTabs').css("width", el.width() - 25);
    },
    over() {
      this.inputDisabled = false;
    },
    out() {
      this.inputDisabled = true;
    },
    viewAllGroups() {
      this.$store.commit({
        type: 'toggleWindow',
        id: 'allGroupsWindow',
        component: '',
      });
    },
    changeCanal(id) {
      this.$store.commit({
        type: 'setNewMessageChatStateGroup',
        id: id,
        notify: false,
      });
      this.$store.getters.getWSByService('chat').socket.send(JSON.stringify({
        event: "ChangeGroup",
        group_id: Number(id),
      }));
      this.scrollToBottom(true);
    },
    unsubscribe(id) {
      this.$store.getters.getWSByService('chat').socket.send(JSON.stringify({
        event: "Unsubscribe",
        group_id: Number(id),
      }));
    },
    scrollToBottom(force, reset, groupID) {
      let chatBox = this.$refs['chatBox'];
      setTimeout(function () {
        if (chatBox) {
          let chatIsDown = chatBox.scrollTop + 50 > chatBox.scrollHeight - chatBox.clientHeight;
          if (chatIsDown || force) chatBox.scrollTop = chatBox.scrollHeight - chatBox.clientHeight;
        }
      }, 100);

      if (reset && groupID === this.currentChatID) {
        this.$store.commit({
          type: 'setNewMessageChatStateGroup',
          id: groupID,
          notify: false,
        });
      }
    },
    getChatGreetings(group) {
      if (!group) return;

      if (group.id === 0)
        return "Вы входите на территорию " + group.name;

      if (group.greetings)
        return group.greetings;
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
    typeDealName(typeDeal) {
      if (typeDeal === 'sell') {
        return ['продажа', 'продано', ''];
      } else if (notify.name === "buy") {
        return ['покупка', 'куплено', 'Купленные вещи ожидают вас на складе базы <span class="importantly">' + notify.base.name + '</span>'];
      }
    },
    deleteNotify(notify) {
      this.$store.getters.getWSByService('chat').socket.send(JSON.stringify({
        event: "DeleteNotify",
        uuid: notify.uuid,
      }));
    },
  },
  computed: {
    avatars() {
      return this.$store.getters.getChatState.avatars;
    },
    chatState() {
      let chats = this.$store.getters.getChatState;
      this.currentChatID = chats.currentChatID;
      return chats
    },
    currentUser() {
      return this.$store.getters.getUser
    }
  },
  components: {
    AppControl: Control,
    AppInput: Input,
    AppBackgroundItemCell: BackgroundItemCell,
    AppUserSubMenu: UserSubMenu,
    AppUserLine: UserLine,
  }
}
</script>

<style scoped>
#chat {
  position: absolute;
  display: block;
  border-radius: 5px;
  width: 300px;
  height: 200px;
  border: 1px solid #25a0e1;
  background: rgb(8, 138, 210);
  bottom: 15px;
  left: 15px;
  z-index: 11;
  padding: 20px 0 0 0;
  box-shadow: 0 0 2px black;
}

#chat .topButton:nth-child(2) {
  font-size: 22px;
  line-height: 0;
}

#chat .tabs {
  height: 15px;
  width: 275px;
  float: left;
  margin: 0;
  user-select: none;
  position: relative;
}

#chatTabsLeftArrow, #chatTabsRightArrow {
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

#chatTabsRightArrow {
  right: 0;
  left: unset;
}

#chatTabsLeftArrow:hover, #chatTabsRightArrow:hover {
  color: #00ffdf;
  opacity: 1;
}

#chatTabsLeftArrow:active, #chatTabsRightArrow:active {
  transform: scale(0.97);
}


#tabsGroup {
  height: 15px;
  width: max-content;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px 3px 0 0;
  overflow: hidden;
  white-space: nowrap;
  display: flex;
}

#tabsGroupWrapper {
  height: 15px;
  width: 285px;
  overflow: hidden;
  margin-left: 15px;
}

#tabsGroup div {
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
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  text-overflow: ellipsis;
  overflow: hidden;
}

.actionChatTab {
  color: #fff200 !important;
  background: rgb(187, 93, 42) !important;
}

#tabsGroup div:hover {
  color: #ffb60f;
}

#tabsGroup div:active {
  transform: scale(0.95);
}

#chatBox, #usersBox {
  word-wrap: break-word;
  overflow-y: scroll;
  border-radius: 5px 0 0 0;
  text-align: left;
  margin: auto auto 2px 3px;
  width: 160px;
  height: 135px;
  text-shadow: #28a5e4 0 0 4px;
  font-size: 11px;
  float: left;
  box-shadow: inset 0 0 2px black;
  background: #adc6cd;
}

#usersBox {
  background: #89969c;
}

#usersBox {
  border-top-left-radius: 0;
  float: right;
  margin: auto 3px 2px 0;
  width: 121px;
  padding: 0;
  height: 145px;
}

.ChatUserName {
  color: white;
}

.ChatText {
  color: #000000;
  letter-spacing: 0;
  text-shadow: 0 0 3px #ffffff;
  font-weight: 900;
}

#chat .topButton {
  margin-top: -1px;
  color: #f9ff00;
  float: right;
  border-radius: 2px;
  background-size: 5px 2px;
  user-select: none;
  pointer-events: auto;
  margin-right: 3px;
  box-shadow: 0 0 2px black;
  background: #8ea6b2;
  font-size: 20px;
  line-height: 18px;
  width: 17px;
  height: 14px;
  text-shadow: none;
  text-align: center;
}

#chat .topButton:hover {
  background: #6e8490;
}

#chat .topButton:active {
  transform: scale(0.97);
}

.chatUserIcon {
  height: 25px;
  width: 25px;
  background: rgba(0, 0, 0, 0.3);
  float: left;
  box-shadow: inset 0 0 5px black;
  background-size: cover;
}

.chatMessage {
  padding: 3px;
  transition: 200ms;
  clear: both;
  min-height: 25px;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
}

.chatMessage:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.chatSystem {
  color: #ff8100;
  font-size: 10px;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
}

.chatMessage .chatUserIcon {
  margin-right: 5px;
}

.alertChatTab {
  animation: shadow 2s infinite ease-in-out;
}

@keyframes shadow {
  from {
    color: #ff7800;
  }
  50% {
    color: #ecffa7;
  }
  to {
    color: #ff7800;
  }
}

#notifyBlock {
  position: absolute;
  background-color: rgb(33, 176, 255);
  border: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: 50px 20px 0px 0px;
  width: 259px;
  height: 12px;
  left: 4px;
  top: -16px;
  box-shadow: inset 0 0 4px 0px rgba(0, 0, 0, 0.5);
  padding-left: 3px;
  padding-top: 1px;
}

#notifyBlock > div {
  position: relative;
  height: 9px;
  width: 9px;
  border-radius: 50%;
  background: rgb(255, 240, 0);
  box-shadow: inset 0 0 1px 1px rgba(0, 0, 0, 0.5), 0 0 1px 1px rgba(0, 0, 0, 0.25);
  border: 1px solid;
  float: left;
  margin-left: 3px;
  transition: 0.1s;
}

#notifyBlock > div:hover div {
  visibility: visible;
}

#notifyBlock > div:active {
  transform: scale(0.95);
}

@keyframes new {
  from {
    box-shadow: inset 0 0 1px 1px rgba(0, 0, 0, 0.5), 0 0 1px 1px rgba(0, 0, 0, 0.25);
  }
  50% {
    box-shadow: inset 0 0 1px 1px rgba(31, 255, 0, 0.8), 0 0 30px 20px rgba(0, 255, 36, 0.6);
  }
  to {
    box-shadow: inset 0 0 1px 1px rgba(0, 0, 0, 0.5), 0 0 1px 1px rgba(0, 0, 0, 0.25);
  }
}

#notifyBlock > div:hover {
  box-shadow: 0 0 1px 1px rgba(236, 255, 167, 0.5);
}

.missionNotify {
  visibility: hidden;
  position: absolute;
  bottom: 7px;
  left: 0;
  background-size: 100% 3px;
  background-image: linear-gradient(0deg, rgba(7, 41, 60, 0.6) 87%, rgba(0, 62, 95, 0.5) 30%);
  border: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: 5px;
  height: 190px;
  width: 250px;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
  overflow-y: scroll;
  z-index: 1;
  color: white;
  font-size: 12px;
  padding: 5px;
  overflow-x: hidden;
}

.missionNotify h3 {
  margin: 0;
  text-align: left;
  padding-left: 5px;
  color: yellow;
}

.missionNotify h4 {
  margin: 0;
  color: #78ff00;
  font-size: 11px;
  text-align: left;
  padding-left: 5px;
}

.missionNotify p, .notifyParagraph {
  text-align: justify;
  padding: 5px;
  color: #ff8100;
  margin: 5px 0;
  text-indent: 1.5em;
}

.missionNotify a:visited {
  text-decoration: none;
  color: aqua;
}

.missionNotify a:hover {
  text-decoration: none;
  color: #0093ff;
}

.notifyIconItem {
  display: inline-block;
  height: 35px;
  width: 35px;
  position: relative;
  box-shadow: inset 0 0 4px 0 white;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  margin: 0 4px;
}

#tabsGroup .localTabChat {
  background-color: rgba(0, 255, 255, 0.5);
  color: white;
}

.privateTabChat {
  background-color: rgba(230, 0, 255, 0.5);
}

.modalBlock {
  position: absolute;
  display: block;
  border-radius: 5px;
  width: 300px;
  height: 200px;
  border: 1px solid #25a0e1;
  background: rgb(8, 138, 210);
  top: 15%;
  left: calc(50% - 150px);
  z-index: 11;
  padding: 20px 1px 1px 1px;
  box-shadow: 0 0 3px black;
}

.notifyModalText {
  padding: 5px 10px;
  word-wrap: break-word;
  overflow-y: scroll;
  border-radius: 5px;
  width: calc(100% - 20px);
  height: 165px;
  font-size: 11pt;
  box-shadow: inset 0 0 3px black;
  background: linear-gradient(0deg, transparent 60%, rgba(0, 0, 0, 0.05) 21%), #adc6cd;
  background-size: 100% 3px;
  font-weight: 900;
  text-align: justify;
}

.notifyModalText p {
  text-indent: 15px;
}

.modalBlock input {
  margin: 3px auto;
  width: calc(100% - 6px);
  background: rgb(221, 112, 52);
  box-shadow: inset 0 0 4px 0 white;
  color: rgba(255, 255, 255, 0.8);
  display: block;
}
</style>
