<template>
  <div id="DepartmentOfEmploymentInBase" ref="DepartmentOfEmploymentInBase" @mousedown="toUp">

    <app-control v-bind:head="'Диспетчер'"
                 v-bind:move="true"
                 v-bind:close="true"
                 v-bind:closeFunc="closeDialog"
                 v-bind:noHeight="true"
                 v-bind:noWidth="true"
                 v-bind:refWindow="'DepartmentOfEmploymentInBase'"/>

    <div id="infoBlock">
      <div id="missionText" :style="{maxHeight: $route.path === '/global' ? '110px' : '210px'}"
           v-html="openDialog.page.text"/>
      <div id="rewardBlock">
        <div id="missionFace" v-bind:style="{backgroundImage: avatar}"></div>
      </div>
    </div>

    <div class="rewardBlock" v-if="openDialog.mission">
      <div id="rewards">
        <h3>Награда при завершение задания: </h3>
        <div id="rewardsCredits">
          <div class="credits_icon"/>
          <span id="countRewardCredits">
            {{ openDialog.mission.reward_cr }}
          </span>
        </div>
        <div id="rewardsItems" v-if="openDialog.mission.rewardItems">
          <app-item-cell v-for="slot in openDialog.mission.rewardItems" v-bind:itemSlot="slot" v-bind:size="35"/>
        </div>
      </div>
    </div>

    <div id="missionAsc">
      <div class="asks"
           v-for="asc in openDialog.page.asc" v-if="checkAccess(asc)"
           v-bind:class="{visitedAsk : checkVisited(asc)}"
           @click="doAsc(asc)">

        <div class="wrapperAsk" v-html="asc.text"/>
      </div>
    </div>

  </div>
</template>

<script>
import ItemCell from '../Inventory/ItemCell';
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
    AppItemCell: ItemCell,
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
  min-height: 100px;
  top: 50px;
  left: calc(50% - 200px);
  padding: 19px 1px 1px;
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

.rewardBlock {
  float: left;
  margin-bottom: 2px;
  width: 100%;
}

#missionText, .missionText {
  padding: 5px;
  word-wrap: break-word;
  border-radius: 5px 5px 0 0;
  text-align: justify;
  margin: auto auto 2px 0;
  width: 263px;
  min-height: 111px;
  max-height: 210px;
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
  width: calc(100% - 10px);
  min-height: 10px;
  text-shadow: #28a5e4 0 0 4px;
  font-family: sans-serif;
  font-size: 9pt;
  float: left;
  box-shadow: inset 0 0 3px black;
  background: linear-gradient(0deg, transparent 60%, rgba(0, 0, 0, 0.05) 21%), #adc6cd;
  background-size: 10px 3px;
}

#missionFace {
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

.rewardBlock h3 {
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
  margin: 3px auto 3px;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
}

#rewards {
  overflow-y: scroll;
  border-radius: 5px 0;
  width: 100%;
  box-shadow: inset 0 0 5px black;
  background: #89969c;
  overflow-x: hidden;
  height: 100%;
  padding-bottom: 2px;
}

.rewardBlock h3 {
  margin: 4px 0 4px 4px;
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
  text-align: left;
  width: calc(100% - 21px);
}

#rewardsCredits {
  float: left;
  padding: 2px;
  box-shadow: 0 0 2px black;
  border-radius: 3px;
  background: #8aaaaa;
  width: 60px;
  height: 12px;
  margin: 3px 3px 6px 5px;
}

#rewardsCredits span, .rewardsCredits span {
  background: #066ea8;
  float: right;
  width: calc(100% - 21px);
  padding-right: 4px;
  height: 100%;
  border-radius: 4px;
  color: white;
  text-align: right;
  line-height: 14px;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 1);
  box-shadow: inset 0 0 2px black;
  font-size: 9px;
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

.credits_icon {
  height: 16px;
  width: 16px;
  margin-top: -2px;
  float: left;
  filter: drop-shadow(0px 0px 1px black);
  background-size: contain;
  background-image: url(https://img.icons8.com/fluent/48/000000/stack-of-coins.png)
}
</style>
<style>
#missionText i {
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
}
</style>
