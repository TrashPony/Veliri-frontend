<template>
  <div class="Corporation" id="Corporation" ref="Corporation" @mousedown="toUp">

    <app-control v-bind:head="'Кластер'"
                 v-bind:move="true"
                 v-bind:close="true"
                 v-bind:refWindow="'Corporation'"
                 v-bind:noHeight="true"
                 v-bind:noWidth="true"/>

    <div class="tabs" v-if="corporation.info">
      <div v-bind:class="{active: menu==='main'}" @click="menu = 'main'">О кластере</div>
      <div v-bind:class="{active: menu==='members'}" @click="menu = 'members'">Участники</div>
      <div v-bind:class="{active: menu==='roles'}" @click="menu = 'roles'">Роли</div>
      <div v-bind:class="{active: menu==='requests'}" @click="menu = 'requests'">Заявки</div>
    </div>

    <div class="wrap">

      <div v-if="!corporation.info && menu==='main'">
        <div>
          Вы не состоите в кластере. <br><br>

          <input type="button" value="Поиск" @click="menu = 'search'">
          <input type="button" value="Создать" @click="menu = 'create'">
        </div>
      </div>

      <app-main v-if="corporation.info && (menu==='main' || menu==='create')"/>
      <app-members v-if="corporation.info && menu==='members'"/>
      <app-roles v-if="corporation.info && menu==='roles'"/>
      <app-requests v-if="corporation.info && menu==='requests'"/>

      <app-create v-if="!corporation.info && menu==='create'"/>
      <app-search v-if="menu==='search'"/>
    </div>
  </div>
</template>

<script>
  import Control from '../Window/Control';
  import Main from './Main';
  import Members from './Members';
  import Create from './Create';
  import Search from './Search';
  import Roles from './Roles';
  import Requests from './Requests';

  export default {
    name: "Corporation",
    data() {
      return {
        updater: null,
        menu: 'main',
      }
    },
    destroyed() {
      if (this.updater) clearInterval(this.updater)
    },
    created() {
      let app = this;
      app.updater = setInterval(function () {
        app.$store.getters.getWSByService('chat').socket.send(JSON.stringify({
          event: "GetCorporation",
        }));
      }, 1000);
    },
    methods: {
      toUp() {
        this.$store.commit({
          type: 'setWindowZIndex',
          id: this.$el.id,
        });
      },
    },
    computed: {
      corporation() {
        return this.$store.getters.getChatState.corporation;
      },
    },
    components: {
      AppControl: Control,
      AppMain: Main,
      AppCreate: Create,
      AppSearch: Search,
      AppMembers: Members,
      AppRoles: Roles,
      AppRequests: Requests,
    }
  }
</script>

<style scoped>
  .Corporation {
    position: absolute;
    display: inline-block;
    background-size: 100% 2px;
    border-radius: 5px;
    min-height: 50px;
    max-width: 350px;
    width: 300px;
    z-index: 10;
    top: 30%;
    left: calc(50% - 60px);
    border: 1px solid #25a0e1;
    background: rgb(8, 138, 210);
    padding: 20px 3px 3px 3px;
    box-shadow: 0 0 2px;
  }

  .wrap {
    width: calc(100% - 14px);
    background: #89969c;
    float: left;
    box-shadow: inset 0 0 2px black;
    overflow-y: scroll;
    overflow-x: hidden;
    border-radius: 5px;
    height: calc(100% - 14px);
    padding: 7px;
    font-size: 12px;
  }

  .tabs {
    height: 15px;
    width: calc(100% - 5px);
    background: rgba(0, 0, 0, 0.2);
    margin: 0 0 0 5px;
    border-radius: 3px 3px 0 0;
    overflow: hidden;
  }

  .tabs div {
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
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Old versions of Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none;
  }

  .tabs div:last-child {
    border-left: 0;
  }

  .tabs .active {
    color: #fff200 !important;
    background: rgb(187, 93, 42);
  }

  .tabs div:hover {
    background: rgb(235, 98, 44);
  }

  .tabs div:active {
    transform: scale(0.98);
  }
</style>
