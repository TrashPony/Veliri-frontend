<template>
  <div class="roles">
    <div class="rolesTableWrap">

      <label> Роль:
        <select v-model="role">
          <option value="none">Выберите роль</option>
          <option v-for="(role, key) in corporation.roles" :value="key">{{role.name}}</option>
        </select>

        <input type="button" value="Удалить" style="height: 17px; line-height: 17px" @click="removeRole">
      </label>

      <div class="rolesTableWrap2">
        <table class="rolesTable" v-if="corporation.roles && corporation.roles[role]"
               v-bind:class="{readOnly: corporation.roles[role].read_only}">

          <tr>
            <td>Приглашать игроков</td>
            <td>
              <input type="checkbox" v-model="corporation.roles[role].invite_users"
                     @change="changeRole(corporation.roles[role])">
            </td>
          </tr>

          <tr>
            <td>Выгонять игроков</td>
            <td><input type="checkbox" v-model="corporation.roles[role].kick_users"
                       @change="changeRole(corporation.roles[role])"></td>
          </tr>

          <tr>
            <td>Редактировать роли</td>
            <td><input type="checkbox" v-model="corporation.roles[role].edit_roles"
                       @change="changeRole(corporation.roles[role])"></td>
          </tr>

          <tr>
            <td>Менять роли игрокам</td>
            <td><input type="checkbox" v-model="corporation.roles[role].change_role_user"
                       @change="changeRole(corporation.roles[role])"></td>
          </tr>
        </table>
      </div>

      <label style="margin-top: 10px">
        Добавить роль:
        <input v-model="newRoleName" type="text" placeholder="Назвение" style="width: 125px">
        <input type="button" value="ok" @click="addNewRole">
      </label>
    </div>
  </div>
</template>

<script>
  import Input from "../Chat/Input";

  export default {
    name: "Roles",
    components: {Input},
    data() {
      return {
        role: 'none',
        newRoleName: null,
      }
    },
    methods: {
      addNewRole() {
        this.$store.getters.getWSByService('chat').socket.send(JSON.stringify({
          event: "addNewCorporationRole",
          name: this.newRoleName,
        }));
        this.newRoleName = null;
      },
      removeRole() {
        this.$store.getters.getWSByService('chat').socket.send(JSON.stringify({
          event: "removeCorporationRole",
          id: Number(this.role),
        }));
      },
      changeRole(role) {
        this.$store.getters.getWSByService('chat').socket.send(JSON.stringify({
          event: "editRole",
          role: role,
        }));
      }
    },
    computed: {
      corporation() {
        return this.$store.getters.getChatState.corporation;
      },
    }
  }
</script>

<style scoped>
  .roles {
    border-radius: 5px;
    width: 100%;
    height: 100%;
  }

  .rolesTableWrap {
    height: 100%;
    width: 100%;
    border-radius: 5px;
  }

  .rolesTableWrap2 {
    width: calc(100% - 4px);
    min-height: 84px;
    margin: 2px;
    background: #94a6b3;
    border-radius: 5px;
    box-shadow: inset 0 0 2px black;
    overflow-x: hidden;
    overflow-y: scroll;
  }

  .rolesTable {
    width: 100%;
    border-spacing: 0;
  }

  .rolesTable tr td {
    border-bottom: 1px solid #7b7b7b;
    padding: 1px 2px 0;
  }

  .rolesTable tr td:last-child {
    width: 50px;
    text-align: center;
  }

  label {
    display: block;
  }

  select {
    box-shadow: inset 0 0 1px 1px rgb(118, 118, 118);
    outline: none;
    width: 170px;
    border-radius: 5px;
    border: 0;
    background: #79a0b4;
    height: 17px;
    color: rgba(255, 255, 255, 0.5);
    font-weight: 900;
    transition: 200ms;
    color: #ff7800;
    font-size: 11px;
    text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
  }

  select * {
    color: black;
    font-weight: bold;
  }

  .readOnly {
    pointer-events: none;
    opacity: 0.4;
  }

  input[type="button"]:active {
    transform: scale(0.98);
  }
</style>
