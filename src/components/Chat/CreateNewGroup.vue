<template>
  <div id="NewChatCreateWrapper" ref="NewChatCreateWrapper" @mousedown="toUp">

    <app-control v-bind:head="'Создание нового канала'"
                 v-bind:move="true" v-bind:close="true"
                 v-bind:refWindow="'NewChatCreateWrapper'"/>

    <div id="NewChatCreate">

      <input id="nameNewChatGroup" v-model="name" type="text" placeholder="Имя канала...">
      <input id="passNewChatGroup" v-model="password" type="text" placeholder="Пароль (если пусто то без пароля)">

      <div id="avatarNewChatGroupWrapper">
        <div id="avatarNewChatGroup" v-bind:style="{backgroundImage: `url('` + avatar + `')`} "></div>
        <input style="position: absolute; left: -9999px;" type="file" @change="previewAvatarGroup($event)"
               name="uploadFile" id="file"/>
        <label for="file" id="labelFile"> Загрузить</label>
      </div>
      <div id="greetingsNewChatGroupWrapper">
        <h4> Приветственное сообщение </h4>
        <textarea v-model="greetings" id="greetingsNewChatGroup"/>
      </div>
      <input type="button" value="Создать" style="float: right; margin-right: 25px" @click="create">
    </div>
    <div>
      <input type="button" value="Закрыть" style="float: left; margin-left: 25px" @click="closeWindow">
    </div>
  </div>
</template>

<script>
  import Control from '../Window/Control';

  export default {
    name: "CreateNewGroup",
    data() {
      return {
        name: '',
        password: '',
        avatar: '',
        greetings: '',
      }
    },
    methods: {
      toUp() {
        this.$store.commit({
          type: 'setWindowZIndex',
          id: this.$el.id,
        });
      },
      create() {
        this.$store.getters.getWSByService('chat').socket.send(JSON.stringify({
          event: "CreateNewChatGroup",
          password: this.password,
          file: this.avatar,
          name: this.name,
          greetings: this.greetings,
        }));
        this.closeWindow()
      },
      closeWindow() {
        this.$store.commit({
          type: 'toggleWindow',
          id: 'NewChatCreateWrapper',
          component: '',
        });
        this.$store.commit({
          type: 'toggleWindow',
          id: 'allGroupsWindow',
          component: '',
        });
      },
      previewAvatarGroup(e) {
        let app = this;

        let file_reader = new FileReader(e.target.files[0]);
        file_reader.readAsDataURL(e.target.files[0]);
        file_reader.onload = function (evt) {
          app.avatar = evt.target.result;
        };
      }
    },
    components: {
      AppControl: Control,
    }
  }
</script>

<style scoped>
  #NewChatCreateWrapper {
    height: 227px;
    width: 300px;
    position: absolute;
    left: calc(50% - 150px);
    top: calc(50% - 150px);
    border: 1px solid #25a0e1;
    background-size: 100% 2px;
    background-image: linear-gradient(1deg, rgba(33, 176, 255, 0.6), rgba(37, 160, 225, 0.6) 6px);
    border-radius: 5px;
  }

  #nameNewChatGroup, #passNewChatGroup {
    float: left;
    margin: 0 10px 2px;
    width: 263px;
  }

  #avatarNewChatGroupWrapper {
    float: left;
    clear: both;
    height: 100px;
    width: 100px;
    margin-left: 10px;
    box-shadow: inset 0 0 3px;
    border-radius: 5px;
    position: relative;
  }

  #avatarNewChatGroupWrapper label {
    position: absolute;
    bottom: 5px;
    left: calc(50% - 46px);
    width: 71px;
    font-size: 12px;
    background: #79a0b4;
    border-radius: 5px;
    color: #ff7800;
    text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
    padding: 0 10px;
    box-shadow: 0 0 2px black;
    opacity: 0.3;
    transition: 0.2s;
  }

  #avatarNewChatGroupWrapper label:hover {
    opacity: 1;
  }

  #avatarNewChatGroupWrapper label:active {
    transform: scale(0.97);
  }

  #avatarNewChatGroup {
    height: 100%;
    width: 100%;
    background-size: cover;
  }

  #greetingsNewChatGroupWrapper {
    float: left;
    height: 100px;
    width: 100px;
    margin-left: 10px;
  }

  #greetingsNewChatGroupWrapper h4 {
    text-align: left;
    height: 14px;
    font-size: 9px;
    margin: 0 0 2px -4px;
    border-radius: 0 20px 0 0;
    padding-left: 11px;
    border: 1px solid #793f1f;
    background-size: 10px 2px;
    background-image: linear-gradient(1deg, rgba(251, 93, 0, 0.55), rgba(225, 37, 46, 0.6) 6px);
    color: #ff7800;
    line-height: 15px;
    width: 162px;
    text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
  }

  #greetingsNewChatGroupWrapper textarea {
    box-shadow: inset 0 0 5px black;
    background: linear-gradient(0deg, transparent 60%, rgba(0, 0, 0, 0.1) 21%), #adc6cd;
    background-size: 10px 3px;
    height: 61px;
    width: 150px;
    margin: 0 0 0 -4px;
    border-radius: 5px;
    padding: 10px;
    text-align: justify;
    resize: none;
    color: #ffef0f;
    text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
  }

  #NewChatCreate {
    box-shadow: inset 0 0 5px black;
    background: #8cb3c7;
    border-radius: 5px;
    width: calc(100% - 8px);
    height: 172px;
    margin: 24px auto 0;
    padding-top: 5px;
  }

  #NewChatCreateWrapper input[type="button"] {
    margin-top: 3px;
  }

  #NewChatCreateWrapper h3 {
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
</style>
