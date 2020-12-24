<template>
  <div class="UserLabel"
       v-if="!hide"
       :id="windowID"
       :ref="windowID" :style="{left: meta.pos.left + 'px', top: meta.pos.top + 'px'}"
       v-bind:class="{pk: violators[meta.ownerID] && violators[meta.ownerID].type === 'pk',
        pvp: violators[meta.ownerID] && violators[meta.ownerID].type === 'pvp'}">

    <div class="UserLabelBlock" v-if="!battleState">
      <div>
        <div class="logo" v-bind:style="{backgroundImage: avatar}"></div>
        <h4>
          <template v-if="tag !== ''">[<span>{{tag}}</span>]</template>
          {{meta.ownerName}}
        </h4>
        <div class="detailUser" @click="openUser">подробно</div>
      </div>
    </div>

    <div class="UserLabelBlockMin" v-if="battleState">
      <h4 :style="{color: fontColor}">
        <template v-if="tag !== ''">[<span>{{tag}}</span>]</template>
        {{meta.ownerName}}
      </h4>
      <h4 style="font-family: 'Comfortaa', cursive" :style="{color: fontColor}">
        v
      </h4>
    </div>
  </div>
</template>

<script>
  import urls from '../../const';

  export default {
    name: "UserLabel",
    props: ['windowID', 'meta'],
    data() {
      return {
        avatar: null,
        corporation: {info: null, logo: null},
        updater: null,
        hide: false,
      }
    },
    destroyed() {
      clearInterval(this.updater);
    },
    created() {
      this.hide = true;
      this.getAvatar();
      this.getUserInfo();

      let app = this;
      app.updater = setInterval(function () {
        if (app.$props.meta.pos.left + 150 > window.innerWidth ||
          app.$props.meta.pos.top + 150 > window.innerHeight ||
          app.$props.meta.pos.left < 0 || window.innerHeight < 0) {

          app.hide = true;
        } else {
          app.hide = false;
        }
      }, 100)
    },
    methods: {
      getAvatar() {
        let app = this;
        app.$api.get(urls.avatarURL + '?user_id=' + app.$props.meta.ownerID).then(function (response) {
          app.$set(app, 'avatar', "url('" + response.data.avatar + "')");
        });
      },
      getUserInfo() {
        let app = this;
        app.$api.get(urls.userInfoURL + '?user_id=' + app.$props.meta.ownerID).then(function (response) {
          if (response.data && response.data.corporation_id > 0) {
            app.getCorp(response.data.corporation_id);
          }
        });
      },
      getCorp(id) {
        let app = this;
        app.$api.get(urls.corpInfoURL + '?corporation_id=' + id).then(function (response) {
          app.$set(app.corporation, 'info', response.data);
        });
      },
      openUser() {
        this.$store.commit({
          type: 'toggleWindow',
          id: 'userStat' + this.$props.meta.ownerID,
          component: 'userStat',
          meta: {user_id: this.$props.meta.ownerID},
          forceOpen: true,
        });
      }
    },
    computed: {
      battleState() {
        return this.$store.getters.getBattleState;
      },
      myTeam() {
        for (let i in this.battleState.teams) {
          if (this.battleState.teams.hasOwnProperty(i) && this.battleState.teams[i].players[this.currentUser.user_id]) {
            return this.battleState.teams[i]
          }
        }
      },
      currentUser() {
        return this.$store.getters.getUser
      },
      hostile() {
        return !this.myTeam.players[this.$props.meta.ownerID]
      },
      fontColor() {

        if (this.currentUser.user_id === this.$props.meta.ownerID) {
          return 'rgb(21,255,25)'
        }

        if (this.hostile) {
          return 'rgb(255,57,34)'
        } else {
          return 'rgb(101,157,255)'
        }
      },
      tag() {
        if (this.corporation.info) {
          return this.corporation.info.tag
        } else {
          return ""
        }
      },
      violators() {
        return this.$store.getters.getChatState.violators
      }
    }
  }
</script>

<style scoped>
  .UserLabel {
    pointer-events: none;
    z-index: -1;
    position: absolute;
  }

  .UserLabel h4 {
    white-space: nowrap;
    line-height: 23px;
    font-size: 13px;
    margin: 0;
    color: #ffffff;
    float: left;
  }

  .UserLabel h4 span {
    color: #e4ff00;
    font-size: 10px;
  }

  .UserLabel .logo {
    height: 26px;
    width: 26px;
    border-radius: 2px;
    float: left;
    margin: 2px;
    background-size: cover;
  }

  .UserLabel .detailUser {
    transition: 100ms;
    position: absolute;
    color: #05daff;
    font-size: 9px;
    float: right;
    bottom: 2px;
    right: 3px;
    pointer-events: all;
  }

  .UserLabel .detailUser:hover {
    cursor: pointer;
    color: #03e2ff;
  }

  .UserLabel .detailUser:active {
    transform: scale(0.9);
  }

  .UserLabel .UserLabelBlock {
    position: relative;
    left: -50%;
    margin-top: -50%;
    border: 1px solid #2e2e2e;
    height: 30px;
    min-width: 100px;
    max-width: 300px;
    border-radius: 5px;
    box-shadow: 0 0 2px black;
    background-color: rgba(127, 127, 127, 0.3);
    padding-right: 6px;
    text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
  }

  .UserLabel.pvp .UserLabelBlock {
    background-color: rgba(255, 237, 0, 0.6);
  }

  .UserLabel.pk .UserLabelBlock {
    background-color: rgba(255, 0, 9, 0.6);
  }

  .UserLabelBlockMin {
    position: relative;
    left: -50%;
    margin-top: -40%;
    text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
  }

  .UserLabelBlockMin h4 {
    float: none;
    text-align: center;
    line-height: 13px;
    font-weight: 900;
    font-family: 'Audiowide', serif;
  }
</style>
