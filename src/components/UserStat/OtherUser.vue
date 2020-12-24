<template>
  <div class="usersStatusWrapper">

    <div class="userAvatarWrapper">
      <div class="userAvatar" v-bind:style="{backgroundImage: avatar}"></div>
    </div>

    <h3 class="userName">
      <template v-if="tag !== ''">[<span>{{ tag }}</span>]</template>
      {{ user.user_name }}
    </h3>

    <div style="float: left; width: 160px;">

      <div class="section">
        <div class="fractionLogo"
             :style="{backgroundImage: 'url(' + require('../../assets/' + getLogo(user.fraction))+')'}"/>
        <span style="line-height: 18px;">Фракция:</span> <br>
        <span class="importantly">{{ user.fraction }}</span>
      </div>

      <div v-if="corporation.info" class="section">
        <div class="fractionLogo" v-bind:style="{backgroundImage:  'url(\'' + corporation.logo + '\')'}"/>
        <span style="line-height: 18px;">Кластер:</span> <br>
        <span class="importantly">{{ corporation.info.name }}</span>
      </div>

      <div v-if="!corporation.info" class="section"
           style="line-height: 35px; font-size: 10px; color: #6c6c6c; text-align: center">
        не состоит в кластере
      </div>
    </div>

    <div class="actionPanel">
      <input type="button" value="Отправить сообщение" @click="sendMessage">
      <input type="button" value="Предложить дружбу" @click="sendInviteFriend">
      <input type="button" value="Пригласить в отряд" @click="sendInviteGroup">
      <input type="button" value="Пригласить в кластер" @click="sendInviteCorp">
    </div>

    <div class="biography">
      {{ user.biography }}
    </div>
  </div>
</template>

<script>
import urls from '../../const';

export default {
  name: "OtherUser",
  props: ['user'],
  data() {
    return {
      avatar: null,
      corporation: {info: null, logo: null},
    }
  },
  created() {
    this.getAvatar();
    this.getCorp();
  },
  mounted() {
    this.$parent.resize(null, null, $(this.$parent.$el))
  },
  methods: {
    getAvatar() {
      let app = this;
      app.$api.get(urls.avatarURL + '?user_id=' + app.$props.user.user_id).then(function (response) {
        app.$set(app, 'avatar', "url('" + response.data.avatar + "')");
      });
    },
    getCorp() {
      let app = this;
      app.$api.get(urls.corpInfoURL + '?corporation_id=' + app.$props.user.corporation_id).then(function (response) {
        app.$set(app.corporation, 'info', response.data);
        app.getCorpLogo();
      });
    },
    getCorpLogo() {
      let app = this;
      app.$api.get(urls.corpLogoURL + '?corporation_id=' + app.corporation.info.id).then(function (response) {
        app.$set(app.corporation, 'logo', response.data.avatar);
      });
    },
    getLogo(fraction) {
      return `logo/${fraction}.png`
    },
    sendMessage() {
      this.$store.getters.getWSByService('chat').socket.send(JSON.stringify({
        event: "CreateNewPrivateGroup",
        user_id: Number(this.$props.user.user_id),
      }));
    },
    sendInviteFriend() {
      this.$store.getters.getWSByService('chat').socket.send(JSON.stringify({
        event: "AddFriend",
        user_name: this.$props.user.user_name,
      }));
    },
    sendInviteGroup() {
      this.$store.getters.getWSByService('chat').socket.send(JSON.stringify({
        event: "InviteToGroup",
        user_name: this.$props.user.user_name,
      }));
    },
    sendInviteCorp() {
      this.$store.getters.getWSByService('chat').socket.send(JSON.stringify({
        event: "InviteToCorp",
        user_name: this.$props.user.user_name,
      }));
    }
  },
  computed: {
    tag() {
      if (this.corporation.info) {
        return this.corporation.info.tag
      } else {
        return ""
      }
    },
  }
}
</script>

<style scoped>
.userAvatar, .userAvatarWrapper, .fractionLogo {
  background-color: rgb(128, 128, 128);
  height: 100px;
  width: 100px;
  float: left;
  margin: -1px 5px 5px -1px;
  border: 1px solid rgba(0, 0, 0, 0.4);
  box-shadow: inset 0 0 1px 0 black;
  background-size: cover;
}

.userName {
  margin: 0 0 7px 0;
  background: rgb(221, 112, 52);
  color: rgba(255, 255, 255, 0.8);
  border-radius: 4px;
  font-size: 13px;
  line-height: 17px;
  height: 17px;
  user-select: none;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 1);
  font-weight: bold;
  box-shadow: 0 0 2px rgba(0, 0, 0, 1);
  padding-left: 10px;
}

.userName span {
  color: #e4ff00;
  font-size: 10px;
}

.fractionLogo {
  height: 35px;
  width: 35px;
}

.section {
  line-height: 16px;
  clear: both;
  background: rgba(77, 77, 84, 0.3);
  width: 100%;
  height: 35px;
  border-radius: 0 5px 5px 0;
  color: white;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
  box-shadow: 0 0 2px black;
}

.biography {
  box-shadow: inset 0 0 2px black;
  background: #adc6cd;
  padding: 5px 1px 5px 5px;
  word-wrap: break-word;
  overflow-y: scroll;
  border-radius: 5px;
  text-align: left;
  width: calc(100% - 5px);
  text-shadow: #28a5e4 0 0 4px;
  font-size: 9pt;
  float: left;
  resize: none;
  overflow-x: hidden;
  margin: 0;
}

.actionPanel {
  float: left;
  width: 103px;
  margin-left: 4px;
  margin-top: -2px;
}

.actionPanel input {
  font-size: 9px;
  width: 105px;
  display: inline-block;
  text-align: center;
  transition: 100ms;
  background: rgba(255, 129, 0, 0.6);
  height: 16px;
  margin: 2px;
  border-radius: 5px;
  color: #fff;
  line-height: 15px;
  box-shadow: 0 0 2px #000;
}

.actionPanel input:hover {
  background: rgba(255, 129, 0, 1);
}

.actionPanel input:active {
  transform: scale(0.98);
}
</style>
