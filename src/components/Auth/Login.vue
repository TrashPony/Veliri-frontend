<template>
  <div id="loginWrapper">
    <div id="mask"></div>
    <div id="loginBlock" ref="loginBlock">
      <app-control v-bind:head="'Логин'" v-bind:move="false" v-bind:close="false" v-bind:refWindow="'loginBlock'"/>
      <form method="POST" id="login" onsubmit="return false;">
        <table>
          <tr>
            <td><input type="text" placeholder="user" name="username" v-model="user"></td>
          </tr>
          <tr>
            <td><input type="password" placeholder="password" name="password" v-model="password"></td>
          </tr>
          <tr id="buttonCell">
            <td>
              <input type="submit" class="button" value="Войти" @click="login">
              <input type="submit" class="button" value="Регистрация" @click="to('/registration')">
            </td>
          </tr>
        </table>
        <div class="Failed" id="error">{{err}}</div>
      </form>
    </div>
  </div>
</template>

<script>
  import Control from '../Window/Control';
  import urls from '../../const'
  //import {gameStore} from "../../game/store";

  export default {
    name: "Login",
    data() {
      return {
        user: null,
        password: null,
        err: '',
      }
    },
    created() {
      try {
        this.$store.getters.getWSByService('inventory').socket.close()
      } catch(e) {
      }

      try {
        this.$store.getters.getWSByService('market').socket.close()
      } catch(e) {
      }

      try {
        this.$store.getters.getWSByService('lobby').socket.close()
      } catch(e) {
      }

      try {
        this.$store.getters.getWSByService('global').socket.close()
      } catch(e) {
      }

      try {
        this.$store.getters.getWSByService('chat').socket.close()
      } catch(e) {
      }
    },
    mounted() {
      this.$store.commit({
        type: 'setVisibleLoader',
        visible: false,
      });
    },
    methods: {
      to(url) {
        this.$router.push({path: url});
      },
      login: function () {

        let app = this;
        app.err = '';

        this.$api.post(urls.loginURL, {
          username: this.user,
          password: this.password,
        }, {
          withCredentials: true,
        }).then(function (response) {
          if (response.data.success) {
            app.load();
          } else {
            if (response.data.error === "not allow") {
              app.err = "Не верный логин либо пароль"
            }
            console.log(response)
          }
        }).catch(function (error) {
          console.log(error);
        });
      },
      load() {
        let app = this;

        // app.$store.commit({
        //   type: 'setVisibleLoader',
        //   visible: true,
        //   text: 'Пытаемся понять что происходит...'
        // });

        setTimeout(function () {
          app.$router.push({path: '/gate'});
        }, 1000);
      }
    },
    components: {
      AppControl: Control,
    }
  }
</script>

<style scoped>

  #loginWrapper {
    height: 100vh;
    width: 100%;
    text-align: center;
    background-color: #7f7f7f;
    background-image: url('../../assets/bases/base.jpg');
    background-size: cover;
    background-attachment: fixed;
    background-position: center;
  }

  #loginBlock {
    position: absolute;
    left: calc(50% - 90px);
    top: 20%;
    display: block;
    border-radius: 5px;
    width: 180px;
    height: 120px;
    border: 1px solid #25a0e1;
    background: rgb(8, 138, 210);
    z-index: 11;
    padding: 20px 0 0 0;
    box-shadow: 0 0 2px black;
  }

  #buttonCell {
    text-align: left;
  }

  td {
    width: 100px;
    padding: 10px;
  }

  th {
    text-shadow: 0 1px 1px rgba(0, 0, 0, .3);
  }

  #loginBlock {
    position: absolute;
    left: calc(50% - 90px);
    top: 20%;
    display: block;
    border-radius: 5px;
    width: 180px;
    height: 120px;
    border: 1px solid #25a0e1;
    background: rgb(8, 138, 210);
    z-index: 11;
    padding: 20px 0 0 0;
    box-shadow: 0 0 2px black;
  }

  #login input[type="text"], #login input[type="password"] {
    text-shadow: none;
    color: black;
  }

  #login input[type="submit"] {
    width: 71px;
    font-size: 9px;
  }

  #mask {
    position: absolute;
    z-index: 1;
    background-color: rgba(0, 0, 0, 0.7);
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
  }
</style>
