<template>
  <div id="allGroupsWindow" ref="allGroupsWindow" @mousedown="toUp">

    <app-control v-bind:head="'Чат Каналы'" v-bind:move="true" v-bind:close="true"
                 v-bind:refWindow="'allGroupsWindow'"/>

    <div class="mask" v-if="needPass.group"></div>
    <div id="chatPassBlock" v-if="needPass.group">
      <input id="enterChatPassword" type="text" v-model="needPass.pass" placeholder="введите пароль">
      <input type="button" value="Отмена" @click="subscribe()">
      <input type="button" value="Войти" @click="subscribe(needPass.group, needPass.pass)">
    </div>

    <div id="ViewChatGroups">
      <div>
        <h4>Основные группы: </h4>
        <div class="chatGroup" v-for="group in groups.public" @click="subscribe(group)">
          <div class="chatLogo" v-bind:style="{backgroundImage: avatars[group.id]}">{{getAvatarGroup(group.id)}}</div>
          <div class="chatName">{{group.name}}</div>
          <div class="chatPlayerCount">{{getCountUsers(group)}}</div>
          <div class="public" v-if="group.secure"></div>
        </div>
      </div>

      <div id="userGroups">
        <h4>Пользовательские группы: </h4>
        <input v-model="filter" id="filterChatGroup" type="text" placeholder="поиск группы...">
        <div class="chatGroup" v-for="group in groups.users" v-if="group.name.indexOf(filter) + 1"
             @click="subscribe(group)">
          <div class="chatLogo" v-bind:style="{backgroundImage: avatars[group.id]}">{{getAvatarGroup(group.id)}}</div>
          <div class="chatName">{{group.name}}</div>
          <div class="chatPlayerCount">{{getCountUsers(group)}}</div>
          <div class="public" v-if="group.secure"></div>
        </div>
      </div>
    </div>
    <div>
      <input type="button" value="Создать" style="float: right; margin-right: 25px" @click="openCreateDialog">
      <input type="button" value="Закрыть" style="margin-left: 25px" @click="closeWindow">
    </div>
  </div>
</template>

<script>
  import Control from '../Window/Control';
  import urls from '../../const';

  export default {
    name: "ViewAllGroups",
    data() {
      return {
        avatars: {},
        filter: '',
        needPass: {
          group: null,
          pass: '',
        },
      }
    },
    mounted() {
      this.$store.getters.getWSByService('chat').socket.send(JSON.stringify({
        event: "GetAllGroups",
      }));
    },
    methods: {
      toUp() {
        this.$store.commit({
          type: 'setWindowZIndex',
          id: this.$el.id,
        });
      },
      openCreateDialog() {
        this.$store.commit({
          type: 'toggleWindow',
          id: 'NewChatCreateWrapper',
          component: '',
        });
      },
      closeWindow() {
        this.$store.commit({
          type: 'toggleWindow',
          id: 'allGroupsWindow',
          component: '',
        });
      },
      subscribe(group, pass) {
        if (!group) {
          this.needPass.group = null;
          this.needPass.pass = '';
          return
        }

        if (group.secure && !pass) {
          this.needPass.group = group;
          this.needPass.pass = '';
        } else {
          this.$store.getters.getWSByService('chat').socket.send(JSON.stringify({
            event: "SubscribeGroup",
            group_id: Number(group.id),
            password: pass,
          }));
          this.needPass.group = null;
          this.needPass.pass = '';
        }
      },
      getCountUsers(group) {
        let playerCount = 0;
        let playerOnline = 0;

        for (let j in group.users) {
          playerCount++;
          if (group.users[j]) playerOnline++;
        }

        return `${playerOnline} / ${playerCount}`
      },
      getAvatarGroup(id) {
        let app = this;
        if (app.avatars.hasOwnProperty(id)) return;
        app.$api.get(urls.groupAvatarURL + '?chat_group_id=' + id).then(function (response) {
          app.$set(app.avatars, id, "url('" + response.data.avatar + "')");
        });
      }
    },
    computed: {
      groups() {
        let allGroups = this.$store.getters.getChatState.allGroups;

        let groups = {
          users: [],
          public: [],
        };

        for (let i in allGroups) {
          if (allGroups.hasOwnProperty(i)) {
            if (allGroups[i].user_create) {
              groups.users.push(allGroups[i])
            } else {
              groups.public.push(allGroups[i])
            }
          }
        }

        return groups;
      }
    },
    components: {
      AppControl: Control,
    }
  }
</script>

<style scoped>
  #ViewChatGroups {
    box-shadow: inset 0 0 5px black;
    background: #8cb3c7;
    border-radius: 5px;
    width: 100%;
    height: 277px;
    float: left;
    margin-top: 3px;
    overflow-y: scroll;
    overflow-x: hidden;
  }

  #allGroupsWindow {
    top: 20%;
    left: calc(50% - 100px);
    height: 300px;
    width: 230px;
    position: absolute;
    background-size: 100% 2px;
    border-radius: 5px;
    padding: 20px 5px 5px 5px;
    border: 1px solid #25a0e1;
    background: rgb(8, 138, 210);
  }

  #allGroupsWindow .topButton {
    margin-top: 5px;
  }

  #allGroupsWindow h3 {
    display: block;
    height: 17px;
    background: linear-gradient(0deg, red, yellow);
    border: 1px solid black;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 1);
    font-size: 15px;
    margin: 3px 3px 0 3px;
    font-weight: 100;
    padding: 0 5px;
  }

  #allGroupsWindow h4 {
    text-align: left;
    height: 14px;
    font-size: 12px;
    margin: 0px 0 1px 1px;
    border-radius: 0 20px 0 0;
    padding-left: 11px;
    border: 1px solid #793f1f;
    background-size: 10px 2px;
    background-image: linear-gradient(1deg, rgba(251, 93, 0, 0.55), rgba(225, 37, 46, 0.6) 6px);
    color: #ff7800;
    line-height: 15px;
    text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
  }

  #allGroupsWindow input {
    margin-top: 3px;
    float: left;
  }

  #allGroupsWindow input[type="button"]:active {
    transform: scale(0.95);
  }

  #userGroups input {
    width: calc(100% - 20px);
    margin-left: 5px;
  }

  .chatGroup {
    clear: both;
    height: 25px;
    border-radius: 5px;
    width: 208px;
    padding: 2px 5px 2px;
    color: #ff7800;
    font-size: 15px;
    text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
  }

  .chatGroup:hover {
    background: linear-gradient(22deg, rgba(183, 195, 201, 0.29), rgba(183, 195, 201, 0.29));
  }

  .chatGroup:active {
    transform: scale(0.95)
  }

  .chatLogo {
    height: 25px;
    width: 25px;
    background: rgba(128, 128, 128, 0.3);
    border-radius: 5px;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }

  .chatName {
    width: 91px;
    line-height: 25px;
    text-align: left;
    margin-left: 10px;
  }

  .chatPlayerCount {
    width: 60px;
    line-height: 25px;
    text-align: left;
    color: #cfdede;
  }

  .chatGroup > div {
    float: left;
  }

  .chatGroup .chatPlayerCount {
    text-align: center;
  }

  .chatGroup .public {
    height: 24px;
    width: 20px;
    background-size: cover;
    background-image: url("https://img.icons8.com/plasticine/100/000000/lock-2.png");
  }

  #chatPassBlock {
    position: absolute;
    left: calc(50% - 100px);
    top: calc(20%);
    width: 200px;
    height: 55px;
    display: block;
    border-radius: 5px;
    z-index: 12;
    border: 1px solid #25a0e1;
    background: rgb(8, 138, 210);
  }

  #chatPassBlock input[type="text"] {
    width: 177px;
    margin: 6px;
  }

  #chatPassBlock input[type="button"] {
    width: 80px;
    margin-top: 0;
    margin-left: 14px;
    z-index: 1;
  }

  .mask {
    position: absolute;
    height: 100%;
    width: 100%;
    background: rgba(0, 0, 0, 0.6);
    left: 0;
    top: 0;
    border-radius: 5px;
  }
</style>
