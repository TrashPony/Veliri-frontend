<template>
  <div id="DepartmentOfEmploymentInBase" ref="DepartmentOfEmploymentInBase" @mousedown="toUp">

    <app-control v-bind:head="'Диспетчер'"
                 v-bind:move="true"
                 v-bind:close="true"
                 v-bind:closeFunc="closeDialog"
                 v-bind:refWindow="'DepartmentOfEmploymentInBase'"/>

    <div id="infoBlock">
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

    <div id="rewardBlock">

      <div id="missionFace" v-bind:style="{backgroundImage: avatar}"></div>

      <div id="rewardBlock2" v-if="openDialog.mission">
        <h3>Награда:</h3>
        <div id="rewards">
          <div id="rewardsCredits">Крудиты: <span id="countRewardCredits">{{openDialog.mission.reward_cr}}</span></div>
          <div id="rewardsItems"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Control from '../Window/Control';
  import urls from '../../const';

  export default {
    name: "InBase",
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
  #DepartmentOfEmploymentInBase {
    position: absolute;
    display: block;
    border-radius: 5px;
    z-index: 11;
    width: 402px;
    height: 370px;
    top: 50px;
    left: calc(50% - 200px);
    padding: 20px 3px 3px;
    color: #0cc2fb;
    text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
    border: 1px solid #25a0e1;
    background: rgb(8, 138, 210);
    box-shadow: 0 0 2px black;
  }

  #infoBlock, .infoBlock {
    width: 275px;
    float: left;
  }

  #rewardBlock, .rewardBlock {
    float: left;
    height: 244px;
  }

  #missionText, .missionText {
    padding: 5px;
    word-wrap: break-word;
    border-radius: 5px 5px 0 0;
    text-align: justify;
    margin: auto auto 2px 0;
    width: 263px;
    height: 233px;
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
    padding: 5px;
    word-wrap: break-word;
    overflow-y: auto;
    border-radius: 0 0 5px 5px;
    text-align: center;
    margin: auto auto 0 0;
    width: 392px;
    height: 115px;
    text-shadow: #28a5e4 0 0 4px;
    font-family: sans-serif;
    font-size: 9pt;
    float: left;
    box-shadow: inset 0 0 3px black;
    background: linear-gradient(0deg, transparent 60%, rgba(0, 0, 0, 0.05) 21%), #adc6cd;
    background-size: 10px 3px;
  }

  #rewardBlock, .rewardBlock {
    float: left;
    height: 244px;
  }

  #missionFace, .missionFace {
    height: 120px;
    width: 124px;
    background: rgba(0, 0, 0, 0.3);
    box-shadow: inset 0 0 2px 2px black, 0 0 2px black;
    background-size: cover;
    border-radius: 5px;
    margin-left: 2px;
  }

  .asks {
    width: calc(100% - 15px);
    border-radius: 5px;
    border: 1px solid #25a0e1;
    background-color: rgba(33, 176, 255, 0.6);
    float: left;
    margin-top: 4px;
    transition: 100ms;
    text-align: left;
  }

  #missionAsc .asks, .missionAsc .asks {
    border: 0 solid #25a0e1;
    background-image: linear-gradient(1deg, rgba(33, 176, 255, 0.3), rgba(37, 160, 225, 0.3) 6px);
    background-color: unset;
    padding: 3px 3px 3px 10px;
  }

  #missionAsc .asks:hover, .missionAsc .asks:hover {
    background-image: linear-gradient(1deg, rgba(255, 224, 0, 0.3), rgba(219, 225, 0, 0.3) 6px);
  }

  .visitedAsk {
    color: #447b98;
    background-image: linear-gradient(0deg, rgba(23, 173, 255, 0), rgba(30, 48, 57, 0.3) 0px);
  }

  #rewardBlock h3, .rewardBlock h3 {
    text-align: center;
    width: 70px;
    line-height: 18px;
    padding-right: 5px;
    box-shadow: inset 0 0 2px black;
    border: 0;
    font-size: 11px;
    outline: none;
    padding-left: 5px;
    border-radius: 5px;
    color: #ff7800;
    margin: 10px auto 3px;
    text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
  }

  #rewards, .rewards {
    overflow-y: scroll;
    border-radius: 5px 0px;
    width: 126px;
    box-shadow: inset 0 0 5px black;
    background: #89969c;
    overflow-x: hidden;
    height: 92px;
  }

  #rewardsCredits, .rewardsCredits {
    background: #307294;
    box-shadow: inset 0 0 5px black, 0 0 5px black;
    float: left;
    width: 103px;
    border-radius: 5px;
    color: #ff8100;
    text-align: left;
    padding-left: 5px;
    padding-right: 5px;
    height: 20px;
    line-height: 20px;
    margin: 1px;
    font-size: 10px;
  }

  #rewardsCredits span, .rewardsCredits span {
    float: right;
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
<style>
  #missionText i {
    text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
  }
</style>
