<template>
  <div class="usersStatusWrapper">

    <div class="userAvatarWrapper">
      <div class="userAvatar" v-bind:style="{backgroundImage:  'url(\'' + avatar + '\')'}"></div>
      <input style="position: absolute; left: -9999px;" id='file' type="file" name="uploadFile" class="file"
             @change="selectAvatarFile($event)"/>
      <label for="file" class="labelFile">Загрузить</label>
    </div>

    <h3 class="userName">
      <template v-if="tag !== ''">[<span>{{ tag }}</span>]</template>
      {{ user.login }}
    </h3>

    <div style="float: left; width: 160px;">
      <div class="section">
        <div class="fractionLogo"
             :style="{backgroundImage: 'url(' + require('../../assets/' + getLogo(currentUser.fraction))+')'}"/>
        <span style="line-height: 18px;">Фракция:</span> <br>
        <span class="importantly">{{ currentUser.fraction }}</span>
      </div>

      <div v-if="corporation.info" class="section">
        <div class="fractionLogo" v-bind:style="{backgroundImage:  'url(\'' + logo + '\')'}"/>
        <span style="line-height: 18px;">Кластер:</span> <br>
        <span class="importantly">{{ corporation.info.name }}</span>
      </div>

      <div v-if="!corporation.info" class="section"
           style="line-height: 35px; font-size: 10px; color: #6c6c6c; text-align: center">
        не состоит в кластере
      </div>
    </div>

    <div class="biography">
      <textarea v-model="biography" class="userBiography" @input="setBiography"/>
    </div>
  </div>
</template>

<script>
import urls from '../../const';

export default {
  name: "MyUser",
  props: ['user'],
  data() {
    return {
      avatar: null,
      biography: '',
      logo: null,
    }
  },
  created() {
    this.getAvatar();
    this.biography = this.$props.user.biography;
    this.getCorpLogo();
  },
  mounted() {
    this.$parent.resize(null, null, $(this.$parent.$el))
  },
  methods: {
    getCorpLogo() {
      let app = this;

      if (app.corporation.info) {
        app.$api.get(urls.corpLogoURL + '?corporation_id=' + app.corporation.info.id).then(function (response) {
          app.$set(app, 'logo', response.data.avatar);
        });
      }
    },
    getAvatar() {
      let app = this;
      app.$api.get(urls.avatarURL + '?user_id=' + app.$props.user.id).then(function (response) {
        app.$set(app, 'avatar', response.data.avatar);
      });
    },
    setBiography() {
      this.$store.getters.getWSByService('chat').socket.send(JSON.stringify({
        event: "SetBiography",
        biography: this.biography,
      }));
    },
    selectAvatarFile(e) {
      let app = this;

      let file_reader = new FileReader(e.target.files[0]);
      file_reader.readAsDataURL(e.target.files[0]);
      file_reader.onload = function (evt) {
        app.avatar = evt.target.result;
        app.$store.getters.getWSByService('chat').socket.send(JSON.stringify({
          event: "LoadAvatar",
          file: evt.target.result
        }));
      };
    },
    getLogo(fraction) {
      return `logo/${fraction}.png`
    },
  },
  computed: {
    currentUser() {
      return this.$store.getters.getUser
    },
    tag() {
      let corp = this.$store.getters.getChatState.corporation;
      if (corp.info) {
        return corp.info.tag
      } else {
        return ""
      }
    },
    corporation() {
      return this.$store.getters.getChatState.corporation;
    },
  }
}
</script>

<style scoped>
input[type=button]:active {
  transform: scale(0.95);
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

.fractionLogo {
  height: 35px;
  width: 35px;
}

textarea {
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

.userAvatarWrapper label {
  display: block;
  height: 20px;
  width: 55px;
  outline: none;
  padding-left: 5px;
  padding-right: 5px;
  box-shadow: inset 0 0 2px black;
  border: 0;
  background: #79a0b4;
  border-radius: 5px;
  color: #ff7800;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
  float: left;
  margin-left: calc(50% - 30px);
  margin-top: -30px;
  font-size: 9px;
  line-height: 21px;
  opacity: 0.3;
}

.userAvatarWrapper label:hover {
  background-color: rgba(0, 120, 211, 0.9);
  opacity: 1;
}

.userAvatarWrapper label:active {
  transform: scale(0.95);
}

.biography {
  clear: both;
}

.importantly {
  color: #f1bd00;
  font-weight: 100;
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
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  margin-bottom: 5px;
}
</style>
