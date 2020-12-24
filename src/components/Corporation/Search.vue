<template>
  <div>
    <h3 class="head">Поиск кластера</h3>

    <div style="min-height: 20px">
      <div v-for="corp in corporations"
           v-if="corp.open && (!newRequestCorpID || newRequestCorpID === corp.id)" class="corpSection">

        <div class="userAvatar" v-bind:style="{backgroundImage:  'url(\'' + logs[corp.id] + '\')'}">
          {{getCorpLogo(corp.id)}}
        </div>
        <h3 class="head">
          [<span>{{corp.tag}}</span>]
          {{corp.name}}
        </h3>
        <p>{{corp.description}}</p>


        <template v-if="!newRequestCorpID">
          <div style="clear:both;">
            <template v-if="myRequests.hasOwnProperty(corp.id)">
              <h4>
                моя заявка:
                <input type="button" value="отозвать" @click="rejectRequest(corp.id)">
                <input type="button" value="изменить" @click="newRequestCorpID = corp.id">
              </h4>
              <div class="myRequestBlock">{{myRequests[corp.id].text}}</div>
            </template>

            <template v-if="!myRequests.hasOwnProperty(corp.id)">
              <input type="button" value="Подать заявку" style="float: right" @click="newRequestCorpID = corp.id">
            </template>
          </div>
        </template>

        <div class="newRequest" v-if="newRequestCorpID">

          <textarea v-model="newRequestText" placeholder="Текст заявки"/>

          <div>
            <input type="button" value="Отправить" @click="sendRequest">
            <input type="button" value="Отмена" style="margin-right: 6px;" @click="newRequestCorpID = null">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import urls from "../../const";

  export default {
    name: "Search",
    data() {
      return {
        logs: {},
        newRequestCorpID: 0,
        newRequestText: '',
      }
    },
    created() {
      this.$store.getters.getWSByService('chat').socket.send(JSON.stringify({
        event: "GetCorporations",
      }));
    },
    methods: {
      getCorpLogo(corpID) {
        let app = this;
        app.$api.get(urls.corpLogoURL + '?corporation_id=' + corpID).then(function (response) {
          app.$set(app.logs, corpID, response.data.avatar);
        });
      },
      sendRequest() {
        this.$store.getters.getWSByService('chat').socket.send(JSON.stringify({
          event: "CreateInviteRequest",
          id: Number(this.newRequestCorpID),
          message_text: this.newRequestText,
        }));

        this.newRequestCorpID = null
      },
      rejectRequest(corpID) {
        this.$store.getters.getWSByService('chat').socket.send(JSON.stringify({
          event: "RejectInviteRequest",
          id: Number(corpID),
        }));

        this.newRequestCorpID = null
      }
    },
    computed: {
      corporations() {
        return this.$store.getters.getChatState.corporations;
      },
      myRequests() {
        return this.$store.getters.getChatState.corporation.inviteRequest;
      }
    }
  }
</script>

<style scoped>
  .head {
    margin: 0 0 5px 0;
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

  .corpSection {
    background: rgba(144, 199, 255, 0.35);
    border-radius: 5px;
    padding: 6px;
    box-shadow: 0 0 2px black;
    margin-bottom: 7px;
    float: left;
    width: calc(100% - 10px);
  }

  .corpSection .head {
    background: rgb(168, 85, 39);
    padding: 2px;
  }

  .corpSection:last-child {
    margin-bottom: 0;
  }

  .userAvatar {
    background-color: rgb(128, 128, 128);
    height: 68px;
    width: 68px;
    float: left;
    margin: -1px 5px 5px -1px;
    border: 1px solid rgba(0, 0, 0, 0.4);
    box-shadow: inset 0 0 1px 0 black;
    background-size: cover;
  }

  .head span {
    color: #e4ff00;
    font-size: 10px;
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
    min-height: 67px;
    text-shadow: #28a5e4 0 0 4px;
    font-size: 9pt;
    float: left;
    resize: none;
    overflow-x: hidden;
    margin: 0;
  }

  .newRequest {
    clear: both;
  }

  .newRequest input {
    float: right;
    width: 65px
  }

  .newRequest div {
    margin-top: 5px;
    float: right
  }

  h4 {
    margin: 0 0 5px 0;
    background: hsla(21, 71%, 54%, 0.4);
    color: rgb(255, 255, 255);
    border-radius: 4px;
    font-size: 10px;
    line-height: 16px;
    height: 16px;
    user-select: none;
    text-shadow: 1px 1px 1px rgba(0, 0, 0, 1);
    font-weight: bold;
    box-shadow: 0 0 2px rgba(0, 0, 0, 1);
    padding-left: 5px;
    padding-right: 5px;
    float: left;
  }

  h4 input {
    font-size: 10px;
    height: 14px;
    line-height: 12px;
    margin-top: 1px;
    float: right;
    margin-left: 5px;
  }

  h4 input:active {
    transform: scale(0.98);
  }

  .myRequestBlock {
    float: left;
    width: calc(100% - 6px);
    min-height: 25px;
    padding: 3px;
    background: rgba(0, 0, 0, 0.25);
    border-radius: 5px;
    box-shadow: inset 0 0 2px black;
    color: white;
    font-size: 11px;
  }
</style>
