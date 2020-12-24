<template>
  <div class="FriendList" id="FriendList" ref="FriendList" @mousedown="toUp">

    <app-control v-bind:head="'Друзья'"
                 v-bind:move="true"
                 v-bind:close="true"
                 v-bind:refWindow="'FriendList'"
                 v-bind:noHeight="true"
                 v-bind:noWidth="true"/>

    <div class="search">
      <input v-model="newFriendName" type="text" placeholder="Имя пользователя"/>
      <input type="button" value="Отправить запрос" @click="addFriend">
    </div>

    <div class="friends">

      <app-user-line v-for="friend in friends.online"
                     v-bind:user="friend"
                     v-bind:parent="'friendList'"
                     v-bind:buttonExit="true"
                     v-bind:meta="{id: friend.user_id}"
                     v-bind:exitFunc="removeFriend"
      />

      <app-user-line v-for="friend in friends.offline"
                     v-bind:user="friend"
                     v-bind:parent="'friendList'"
                     v-bind:noActive="true"
                     v-bind:buttonExit="true"
                     v-bind:meta="{id: friend.user_id}"
                     v-bind:exitFunc="removeFriend"
      />

    </div>
  </div>
</template>

<script>
  import Control from '../Window/Control';
  import UserLine from '../Chat/UserLine';

  export default {
    name: "FriendList",
    data() {
      return {
        newFriendName: null,
        updater: null,
      }
    },
    destroyed() {
      if (this.updater) setInterval(this.updater)
    },
    mounted() {
      let app = this;

      app.updater = setInterval(function () {
        app.$store.getters.getWSByService('chat').socket.send(JSON.stringify({
          event: "GetFriends",
        }));
      }, 1000)
    },
    methods: {
      toUp() {
        this.$store.commit({
          type: 'setWindowZIndex',
          id: this.$el.id,
        });
      },
      addFriend() {
        this.$store.getters.getWSByService('chat').socket.send(JSON.stringify({
          event: "AddFriend",
          user_name: this.newFriendName,
        }));
      },
      removeFriend(id) {
        this.$store.getters.getWSByService('chat').socket.send(JSON.stringify({
          event: "RemoveFriend",
          user_id: Number(id),
        }));
      }
    },
    computed: {
      friends() {

        let friends = this.$store.getters.getChatState.friends;

        let onlineUsers = {};
        let offlineUsers = {};

        for (let id in friends.users) {
          if (friends.users.hasOwnProperty(id)) {
            if (friends.statuses[id]) {
              onlineUsers[id] = friends.users[id];
            } else {
              offlineUsers[id] = friends.users[id];
            }
          }
        }

        return {online: onlineUsers, offline: offlineUsers};
      }
    },
    components: {
      AppControl: Control,
      AppUserLine: UserLine,
    }
  }
</script>

<style scoped>
  .FriendList {
    position: absolute;
    display: inline-block;
    background-size: 100% 2px;
    border-radius: 5px;
    min-height: 20px;
    width: 175px;
    z-index: 950;
    top: 30%;
    left: calc(50% - 60px);
    border: 1px solid #25a0e1;
    background: rgb(8, 138, 210);
    padding: 20px 3px 3px 3px;
    box-shadow: 0 0 2px;
    height: 187px;
  }

  .search {
    float: left;
    width: 100%;
  }

  .search input {
    width: 100%;
    margin-bottom: 4px;
  }

  .search input[type=button]:active {
    transform: scale(0.97);
  }

  .search input[type=text] {
    width: calc(100% - 10px);
  }

  .friends {
    width: 100%;
    background: #89969c;
    float: left;
    box-shadow: inset 0 0 2px black;
    overflow-y: scroll;
    overflow-x: hidden;
    border-radius: 5px;
    height: calc(100% - 47px);
  }
</style>
