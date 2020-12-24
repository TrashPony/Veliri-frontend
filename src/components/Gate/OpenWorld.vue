<template>
  <div>

    <template v-if="!createMenu">
      <app-user-line v-for="player in players"
                     @click.native="selectPlayer(player.id)"
                     v-if="Object.keys(player).length !== 0 && player.game_mod === 'open_world'"
                     v-bind:user="player"
                     v-bind:noMenu="true"/>

      <div class="createNewUser button" @click="openCreateMenu" style="margin-bottom: 4px">Создать +</div>
    </template>

    <template v-if="createMenu">
      <div class="createNewUser" style="margin-bottom: 4px">
        Введите имя
      </div>
      <input v-model="newName" class="createNewUser input" placeholder="Имя персонажа"/>
      <div class="createNewUser button" @click="create">Создать</div>
    </template>

    <div class="createNewUser button" @click="cancel">назад</div>
  </div>
</template>

<script>
  import Input from "../Chat/Input";
  import UserLine from '../Chat/UserLine';

  export default {
    name: "OpenWorld",
    data() {
      return {
        createMenu: false,
        newName: null,
      }
    },
    methods: {
      openCreateMenu() {
        this.createMenu = true;
      },
      cancel() {
        if (this.createMenu) {
          this.createMenu = false;
        } else {
          this.$parent.selectGameMode = '';
        }
      },
      create() {
        this.$store.getters.getWSByService('chat').socket.send(JSON.stringify({
          event: "CreateNewPlayer",
          user_name: this.newName,
          game_mod: 'open_world',
        }));
        this.createMenu = false;
      },
      selectPlayer(id) {
        this.$store.getters.getWSByService('chat').socket.send(JSON.stringify({
          event: "SelectPlayer",
          id: id,
        }));

        this.$store.commit({
          type: 'setVisibleLoader',
          visible: true,
          text: 'Пытаемся понять что происходит...'
        });

        this.$router.push({path: '/lobby'});

      },
    },
    computed: {
      user() {
        return this.$store.getters.getGameUser;
      },
      players() {
        return this.$store.getters.getUserPlayers;
      },
    },
    components: {
      AppUserLine: UserLine,
    }
  }
</script>

<style scoped>
  .createNewUser {
    height: 20px;
    width: calc(100% - 4px);
    background: rgba(108, 108, 108, 0.51);
    margin: 2px;
    border-radius: 5px;
    color: white;
    line-height: 20px;
    box-shadow: 0 0 2px black;
  }

  .createNewUser.input {
    width: calc(100% - 14px);
  }

  .createNewUser.input::placeholder {
    color: white;
  }

  .createNewUser.button {
    transition: 100ms;
    background: rgba(255, 129, 0, 0.75);
  }

  .createNewUser.button:hover {
    background: rgba(255, 129, 0, 1);
  }

  .createNewUser.button:active {
    transform: scale(0.98);
  }
</style>
