<template>
  <div id="DepartmentOfEmployment" ref="DepartmentOfEmployment" @mousedown="toUp">

    <app-control v-bind:head="'Диалог:'"
                 v-bind:move="true"
                 v-bind:close="true"
                 v-bind:closeFunc="closeDialog"
                 v-bind:noHeight="true"
                 v-bind:noWidth="true"
                 v-bind:refWindow="'DepartmentOfEmployment'"/>

    <div id="infoBlock">

      <div id="missionFace" v-bind:style="{backgroundImage: avatar}"></div>

      <div id="missionText" v-html="openDialog.page.text"></div>

      <div id="missionAsc">
        <div class="asks"
             v-for="asc in openDialog.page.asc" v-if="checkAccess(asc)"
             v-bind:class="{visitedAsk : checkVisited(asc)}"
             @click="doAsc(asc)">

          <div class="wrapperAsk" v-html="asc.text"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Control from '../Window/Control';
  import urls from '../../const';

  export default {
    name: "InWorld",
    data() {
      return {
        avatar: null,
      }
    },
    created() {
      this.$store.commit({
        type: 'toggleWindow',
        id: 'DepartmentOfEmployment',
        component: 'DepartmentOfEmployment',
        forceOpen: true,
      });
    },
    methods: {
      toUp() {
        this.$store.commit({
          type: 'setWindowZIndex',
          id: this.$el.id,
        });
      },
      closeDialog() {
        this.$store.commit({
          type: 'setOpenDialog',
          page: null,
          mission: null,
          visited_pages: null,
        });
      },
      checkAccess(asc) {
        if (asc.access_pages && asc.access_pages.length > 0) {
          for (let pageNumber of asc.access_pages) {
            if (!this.openDialog.visited_pages.hasOwnProperty(pageNumber)) {
              return false
            }
          }
        }
        return true
      },
      checkVisited(asc) {
        if (this.openDialog.visited_pages && this.openDialog.visited_pages.hasOwnProperty(asc.to_page)) {
          return true
        }
        return false
      },
      doAsc(asc) {
        this.$store.getters.getWSByService('chat').socket.send(JSON.stringify({
          event: "Ask",
          to_page: asc.to_page,
          ask_id: asc.id,
        }));
      }
    },
    computed: {
      currentUser() {
        return this.$store.getters.getUser
      },
      openDialog() {
        let app = this;

        let dialog = this.$store.getters.getOpenDialog;
        app.$api.get(urls.dialogPicURL + '?dialog_page_id=' + dialog.page.id + "&user_id=" + this.currentUser.user_id).then(function (response) {
          app.$set(app, 'avatar', "url('" + response.data.picture + "')");
        });

        return dialog
      }
    },
    components: {
      AppControl: Control,
    }
  }
</script>

<style scoped>
  #DepartmentOfEmployment, .DepartmentOfEmployment {
    position: absolute;
    display: block;
    border-radius: 5px;
    z-index: 11;
    width: 402px;
    min-height: 152px;
    top: 50px;
    left: calc(50% - 200px);
    padding: 20px 1px 1px 1px;
    color: #0cc2fb;
    text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
    border: 1px solid #25a0e1;
    background: rgb(8, 138, 210);
    box-shadow: 0 0 2px black;
  }

  #infoBlock, .infoBlock {
    width: 100%;
    float: left;
  }

  #missionText, .missionText {
    padding: 5px;
    word-wrap: break-word;
    border-radius: 5px 5px 0 0;
    text-align: justify;
    margin: auto auto 2px 3px;
    width: calc(100% - 141px);
    height: 110px;
    float: left;
    box-shadow: inset 0 0 3px black;
    background: linear-gradient(0deg, transparent 60%, rgba(0, 0, 0, 0.05) 21%), #adc6cd;
    background-size: 10px 3px;
    color: #000000;
    font-size: 13px;
    text-indent: 1.5em;
    overflow-y: scroll;
    text-shadow: none;
    font-weight: 900;
  }

  #missionAsc, .missionAsc {
    word-wrap: break-word;
    overflow-y: auto;
    border-radius: 0 0 5px 5px;
    text-align: center;
    margin: auto auto 0 3px;
    width: calc(100% - 5px);
    min-height: 26px;
    text-shadow: #28a5e4 0 0 4px;
    font-family: sans-serif;
    font-size: 9pt;
    float: left;
    box-shadow: inset 0 0 3px black;
    background: linear-gradient(0deg, transparent 60%, rgba(0, 0, 0, 0.05) 21%), #adc6cd;
    background-size: 10px 3px;
    padding-top: 3px;
  }

  #missionFace, .missionFace {
    height: 120px;
    width: 124px;
    background: rgba(0, 0, 0, 0.3);
    box-shadow: inset 0 0 2px 2px black, 0 0 2px black;
    background-size: cover;
    border-radius: 5px;
    margin-left: 2px;
    float: left;
  }

  .asks {
    width: calc(100% - 21px);
    border-radius: 2px;
    border: 1px solid #25a0e1;
    background-color: rgba(33, 176, 255, 0.6);
    float: left;
    text-align: left;
  }

  #missionAsc .asks, .missionAsc .asks {
    border: 0 solid #25a0e1;
    background-color: rgba(0, 0, 0, 0.3);
    padding: 3px 3px 3px 10px;
    margin-left: 4px;
    box-shadow: 0 0 2px black;
  }

  #missionAsc .asks:hover, .missionAsc .asks:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }

  .visitedAsk {
    color: #447b98;
    background-color: rgba(0, 0, 0, 0.75);
  }

  #missionText i {
    text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
  }

  #missionAsc .wrapperAsk, .missionAsc .wrapperAsk {
    font-size: 12px;
    font-weight: 900;
    text-align: left;
    box-shadow: none;
    background: none;
    text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
  }

  .asks:active {
    transform: scale(0.98);
  }
</style>
