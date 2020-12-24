<template>
  <div>
    <h3 class="head">Создание кластера</h3>
    <div class="form">

      <div class="userAvatarWrapper">
        <div class="userAvatar" v-bind:style="{backgroundImage:  'url(\'' + logo + '\')'}"></div>
        <input style="position: absolute; left: -9999px;" id='file' type="file" class="file" @change="setLogo($event)"/>
        <label for="file" class="labelFile">Загрузить</label>
      </div>

      <div class="main">
        <label> Название (5-24)
          <input v-model="name" type="text" placeholder="Название">
        </label>
        <label> Тэг (2-5)
          <input v-model="tag" type="text" @input="tag = tag.toUpperCase()" placeholder="Тэг">
        </label>
      </div>

      <div class="description">
        <label> Описание <span style="font-size: 11px; color: #6c6c6c">({{description.length}} / 4000)</span>
          <textarea v-model="description" placeholder="Описание"/>
        </label>
      </div>

      <input style="float: right" type="button" value="Создать" @click="createCorporation">
    </div>
  </div>
</template>

<script>
  import Input from "../Chat/Input";

  export default {
    name: "Create",
    components: {Input},
    data() {
      return {
        name: '',
        description: '',
        logo: '',
        tag: '',
      }
    },
    methods: {
      setLogo(e) {
        let app = this;

        let file_reader = new FileReader(e.target.files[0]);
        file_reader.readAsDataURL(e.target.files[0]);
        file_reader.onload = function (evt) {
          app.logo = evt.target.result;
        };
      },
      createCorporation() {
        this.$store.getters.getWSByService('chat').socket.send(JSON.stringify({
          event: "CreateCorporation",
          name: this.name,
          file: this.logo,
          biography: this.description,
          tag: this.tag,
        }));
      }
    }
  }
</script>

<style scoped>
  .userAvatarWrapper label {
    display: block;
    height: 20px;
    width: 60px;
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
    margin-left: calc(50% - 40px);
    margin-top: -25px;
    font-size: 10px;
    line-height: 21px;
    opacity: 0.2;
  }

  .userAvatarWrapper label:hover {
    background-color: rgba(0, 120, 211, 0.9);
    opacity: 1;
  }

  .userAvatarWrapper label:active {
    transform: scale(0.95);
  }

  .userAvatar {
    height: 100px;
    width: 100px;
    background: rgba(0, 0, 0, 0.3);
    box-shadow: inset 0 0 2px black;
    background-size: cover;
    padding: 0;
    margin: 0;
  }

  .userAvatarWrapper {
    float: left;
    width: 110px;
  }

  .userAvatarWrapper input {
    margin-top: 5px;
    margin-left: 19px;
  }

  .userAvatarWrapper input:active {
    transform: scale(0.95);
  }

  .head {
    margin: 0 0 10px 0;
    background: rgb(221, 112, 52);
    color: rgba(255, 255, 255, 0.8);
    border-radius: 4px;
    font-size: 13px;
    line-height: 17px;
    height: 16px;
    user-select: none;
    text-shadow: 1px 1px 1px rgba(0, 0, 0, 1);
    font-weight: bold;
    box-shadow: 0 0 2px rgba(0, 0, 0, 1);
    padding-left: 10px;
  }

  .description {
    margin-top: 10px;
    width: 100%;
    float: left;
  }

  .main input, .description textarea {
    background: #79a0b4;
    border-radius: 5px;
    margin-bottom: 10px;
    width: 150px;
    padding: 0 3px;
    border: 1px solid rgb(118, 118, 118);
    box-shadow: none;
  }

  .description textarea {
    height: 75px;
    margin: 0;
    width: calc(100% - 10px);
    resize: none;
  }
</style>
