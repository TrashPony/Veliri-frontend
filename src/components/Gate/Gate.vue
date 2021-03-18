<template>
  <div class="gate" id="gateBlock" ref="gateBlock">
    <div class="gateBlock">
      <app-control v-bind:head="'Вход'" v-bind:move="false" v-bind:close="false" v-bind:refWindow="'gateBlock'"/>

      <template v-if="selectGameMode===''">
        <div class="entryButton" id="world" @click="selectMode('open_world')">
          <span style="top: 5px">Beta!</span>
          <span>
            {{ settings.Language === 'RU' ? 'Открытый' : 'Open' }}
            <br>
            {{ settings.Language === 'RU' ? 'Мир' : 'World' }}
          </span>
        </div>

        <div class="entryButton" id="battle" v-if="currentUser.user_role === 'admin'"
             @click="selectMode('quick_battle')">
          <span>
            {{ settings.Language === 'RU' ? 'Быстрые' : 'Quick' }}
            <br>
            {{ settings.Language === 'RU' ? 'Бои' : 'Fight' }}
          </span>
        </div>

        <div class="entryButton" id="mapEditor" v-if="currentUser.user_role === 'admin'" @click="to('/map_editor')">
          <span>Map <br> Editor</span>
        </div>

        <div class="entryButton" id="dialogEditor" v-if="currentUser.user_role === 'admin'"
             @click="to('/dialog_editor')">
          <span>Dialog <br> Editor</span>
        </div>

        <div class="entryButton" id="missionEditor" v-if="currentUser.user_role === 'admin'" @click="to('/mission_editor')">
          <span>Mission <br> Editor</span>
        </div>

        <div class="entryButton" v-if="currentUser.user_role === 'admin'" @click="to('/server_state')">
          <span>Server <br> State</span>
        </div>

        <div class="language" v-if="currentUser.user_role === 'admin'">
          <div :class="{disable_language: settings.Language !=='RU'}"
               @click="changeLanguage('RU')"
               style="background-image: url('https://img.icons8.com/cute-clipart/64/000000/russian-federation.png')"/>
          <div :class="{disable_language: settings.Language !=='EN'}"
               @click="changeLanguage('EN')"
               style="background-image: url('https://img.icons8.com/cute-clipart/64/000000/usa.png')"/>
        </div>
      </template>

      <app-open-world v-if="selectGameMode==='open_world'"/>
      <app-quick-fight v-if="selectGameMode==='quick_battle'"/>
    </div>
  </div>
</template>

<script>
import Control from '../Window/Control';
import UserLine from '../Chat/UserLine';
import OpenWorld from './OpenWorld';
import QuickFight from './QuickFight';
import urls from '../../const';
import {CreateGame} from "../../game/create";

export default {
  name: "Gate",
  data() {
    return {
      selectGameMode: '',
      error: '',
    }
  },
  created() {
    this.$store.commit({
      type: 'setVisibleLoader',
      visible: true,
      text: `<span>Получаем информацию...</span>`,
    });

    this.$store.commit({
      type: 'resetState',
    });
  },
  mounted() {
    let app = this;

    if (app.$route.query['auth_key'] && app.$route.query['api_id'] && app.$route.query['viewer_id'] && app.$route.query['access_token']) {

      let queryStr = '?auth_key=' + app.$route.query['auth_key'] + '&api_id=' + app.$route.query['api_id'] +
        '&viewer_id=' + app.$route.query['viewer_id'] + '&access_token=' + app.$route.query['access_token']

      app.$api.get(urls.vkAppLogin + queryStr, {
        withCredentials: true,
      }).then(function (response) {
        if (response.data.success) {
          app.resetConnects()
        } else {
          app.error = response.data.error
        }
      });

    } else {
      app.resetConnects()
    }
  },
  methods: {
    resetConnects() {
      if (this.$store.getters.getWSByService('chat').connect) {

        this.$store.getters.getWSByService('chat').socket.send(JSON.stringify({
          event: "OpenChat",
        }));

        this.$store.getters.getWSByService('chat').socket.send(JSON.stringify({
          event: "GetPlayers",
        }));

      } else {
        this.$store.commit({
          type: 'reconnectWS',
          service: 'chat',
          force: false,
        });
      }
    },
    changeLanguage(language) {
      this.$store.getters.getWSByService('chat').socket.send(JSON.stringify({
        event: "SetLanguage",
        language: language,
      }));
    },
    to(url) {
      let app = this;

      if (url === '/lobby') {
        app.$store.commit({
          type: 'setVisibleLoader',
          visible: true,
          text: 'Пытаемся понять что происходит...'
        });
      }

      setTimeout(function () {
        app.$router.push({path: url});
      }, 1000);
    },
    selectMode(mode) {
      this.selectGameMode = mode;
    }
  },
  computed: {
    currentUser() {
      let currentUser = this.$store.getters.getGameUser

      if (currentUser.hasOwnProperty('id')) {
        this.$store.commit({
          type: 'setVisibleLoader',
          visible: false,
        });
      }

      return currentUser
    },
    settings() {
      return this.$store.getters.getSettings
    },
  },
  components: {
    AppControl: Control,
    AppUserLine: UserLine,
    AppOpenWorld: OpenWorld,
    AppQuickFight: QuickFight,
  }
}
</script>

<style scoped>
.gate {
  height: 100vh;
  width: 100%;
  text-align: center;
  background-color: #7f7f7f;
  background-image: url('../../assets/bases/base.jpg');
  background-size: cover;
  background-attachment: fixed;
  background-position: center;
}

.gateBlock {
  position: absolute;
  left: calc(50% - 107px);
  top: 20%;
  display: block;
  border-radius: 5px;
  width: 246px;
  min-height: 40px;
  border: 1px solid #25a0e1;
  background: rgb(8, 138, 210);
  z-index: 11;
  padding: 20px 0 2px 0;
  box-shadow: 0 0 2px black;
}

.entryButton {
  height: 100px;
  width: 100px;
  box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.6);
  float: left;
  margin: 15px 0 5px 15px;
  border-radius: 7px;
  background: rgba(255, 255, 255, 0.2);
  position: relative;
  transition: 100ms;
  background-size: cover;
}

.entryButton span {
  position: absolute;
  width: 77px;
  padding: 4px 4px 0 4px;
  left: calc(50% - 43px);
  bottom: 5px;
  font-size: 13px;
  color: white;
  background: rgba(0, 0, 0, 0.25);
  border-radius: 7px;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
}

.entryButton:hover {
  box-shadow: 0 0 3px 1px white;
}

.entryButton:active {
  transform: scale(0.98);
}

#battle {
  background-image: url("../../assets/indexImg/gate2.jpg");

}

#world {
  background-image: url("../../assets/indexImg/gate1.jpg");
}

.disable {
  filter: grayscale(1);
  pointer-events: none;
}

.language {
  position: absolute;
  left: 100%;
  border: 1px solid #25a0e1;
  border-left: 0;
  background-color: rgb(8, 138, 210);
  box-shadow: 0 0 2px 0 black;
  border-radius: 0 5px 5px 0;
}

.language div {
  height: 25px;
  width: 25px;
  background-size: cover;
  filter: drop-shadow(0 0 1px black);
}

.language .disable_language {
  filter: grayscale(75%);
  opacity: 0.75;
}

.language .disable_language:hover {
  filter: drop-shadow(0 0 1px white) grayscale(0%);
  opacity: 1;
}
</style>

<style>
.gateBlock .chatUserLine {
  background: rgba(250, 235, 215, 0.28);
  text-align: left;
}

.gateBlock .chatUserLine .chatUserIcon {
  height: 40px;
  width: 40px;
}

.gateBlock .chatUserLine .chatUserName {
  line-height: 30px;
  font-size: 20px;
}
</style>
