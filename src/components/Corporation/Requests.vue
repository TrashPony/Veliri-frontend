<template>
  <div>
    <div class="head">
      <label>
        <span>Прием заявок:</span>
        <input v-model="corporation.info.open" @click="ChangeOpenCorp" type="checkbox">
      </label>
    </div>

    <div class="requests">
      <div v-for="request in requests">
        <app-user-line v-bind:user="request.short_info"
                       v-bind:parent="'corpInviteRequests'"
                       v-bind:parentEl="$parent.$el"/>
        <div class="control">
          <input type="button" value="Принять" @click="acceptRequest(request.short_info.user_id)">
          <input type="button" value="Отказать" @click="rejectRequest(request.short_info.user_id)">
        </div>
        <div class="myRequestBlockWrap">
          <div class="myRequestBlock">{{request.text}}</div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>

  import UserLine from '../Chat/UserLine'

  export default {
    name: "requests",
    computed: {
      corporation() {
        return this.$store.getters.getChatState.corporation;
      },
      requests() {
        return this.$store.getters.getChatState.corporation.inviteRequest;
      }
    },
    methods: {
      ChangeOpenCorp() {
        this.$store.getters.getWSByService('chat').socket.send(JSON.stringify({
          event: "ChangeOpenCorp",
        }));
      },
      rejectRequest(userID) {
        this.$store.getters.getWSByService('chat').socket.send(JSON.stringify({
          event: "RejectInviteRequestCorp",
          id: Number(userID),
        }));
      },
      acceptRequest(userID) {
        this.$store.getters.getWSByService('chat').socket.send(JSON.stringify({
          event: "acceptRequest",
          id: Number(userID),
        }));
      }
    },
    components: {
      AppUserLine: UserLine,
    }
  }
</script>

<style scoped>
  .head h3, .head label {
    margin: 0 0 5px 0;
    background: hsla(21, 71%, 54%, 0.4);
    color: rgb(255, 255, 255);
    border-radius: 4px;
    font-size: 10px;
    line-height: 18px;
    height: 17px;
    user-select: none;
    text-shadow: 1px 1px 1px rgba(0, 0, 0, 1);
    font-weight: bold;
    box-shadow: 0 0 2px rgba(0, 0, 0, 1);
    padding-left: 5px;
    padding-right: 5px;
    float: left;
  }

  .head input {
    padding: 0;
    margin: 2px 0 2px 7px;
    float: right;
  }

  .requests {
    clear: both;
    min-height: 78px;
    max-height: 200px;
    overflow-x: hidden;
    overflow-y: scroll;
    box-shadow: inset 0 0 2px black;
  }

  .myRequestBlock {
    float: left;
    width: 100%;
    min-height: 25px;
    padding: 3px;
    background: rgba(0, 0, 0, 0.25);
    border-radius: 0;
    box-shadow: inset 0 0 2px black;
    color: white;
    font-size: 11px;
    word-wrap: break-word;
  }

  .myRequestBlockWrap {
    float: left;
    padding: 0;
    width: calc(100% - 6px);
  }

  .control {
    float: right;
    width: 122px;
  }

  .control input {
    margin: 3px 2px
  }

  .control input:active {
    transform: scale(0.98);
  }
</style>
<style>
  .requests .chatUserLine {
    outline: 1px solid #656565;
    border: 0;
    width: 140px;
    float: left;
  }
</style>
