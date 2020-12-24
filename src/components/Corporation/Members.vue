<template>
  <div>
    <h3> Участники в сети: {{online}}</h3>

    <div class="members">
      <app-user-line v-for="member in corporation.members"
                     v-bind:user="member.short_info"
                     v-bind:online="member.online"
                     v-bind:title="corporation.roles[member.role_id].name"
                     v-bind:parent="'corporation'"
                     v-bind:parentEl="$parent.$el"
      />
    </div>

    <div class="management">
<!--      <input type="button" value="Управление ролями" @click="openChangeRoleMenu">-->
    </div>
  </div>
</template>

<script>
  import UserLine from '../Chat/UserLine';

  export default {
    name: "Members",
    methods: {
      openChangeRoleMenu() {
        this.mask = !this.mask;
        this.changeRole = !this.changeRole;
      }
    },
    computed: {
      corporation() {
        return this.$store.getters.getChatState.corporation;
      },
      online() {
        let online = 0;
        let count = 0;

        for (let i in this.corporation.members) {
          let member = this.corporation.members[i];
          count++;
          if (member.online) {
            online++;
          }
        }

        return `${online}/${count}`
      }
    },
    components: {
      AppUserLine: UserLine,
    }
  }
</script>

<style scoped>
  h3 {
    margin: 0 0 5px 0;
    background: hsla(21, 71%, 54%, 0.4);
    color: rgb(255, 255, 255);
    border-radius: 4px;
    font-size: 10px;
    line-height: 13px;
    height: 12px;
    user-select: none;
    text-shadow: 1px 1px 1px rgba(0, 0, 0, 1);
    font-weight: bold;
    box-shadow: 0 0 2px rgba(0, 0, 0, 1);
    padding-left: 5px;
    padding-right: 5px;
    float: left;
  }

  .members {
    clear: both;
    min-height: 78px;
    max-height: 200px;
    overflow-x: hidden;
    overflow-y: scroll;
    margin-bottom: 10px;
    box-shadow: inset 0 0 2px black;
  }

  .management {

  }

  .management input {
    width: 112px;
    transition: 100ms;
  }

  .management input:active {
    transform: scale(0.98);
  }
</style>
