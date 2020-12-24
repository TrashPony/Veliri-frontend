<template>
  <div class="sessionRankWrapper">
    <div class="sessionRankWrapper2">

      <div class="userAvatarWrapper" v-bind:style="{backgroundImage:  'url(\'' + avatar + '\')'}"/>

      <div>

        <h3 class="userName">
          <template v-if="tag !== ''">[<span>{{ tag }}</span>]</template>
          {{ currentUser.user_name }}
        </h3>

        <div class="state">
          <div class="Rank">
            30
          </div>

          <div>
            <h5>Боевой ранг {{ 1000000000 }} / {{ 2000000000 }}</h5>
            <div class="RankBar">
              <div class="RankBarInner" :style="{width: 50 + '%'}"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import urls from '../../const';

export default {
  name: "SessionBattleRank",
  data() {
    return {
      avatar: null,
      logo: null,
    }
  },
  created() {
    this.getAvatar();
    this.getCorpLogo();
  },
  methods: {
    getCorpLogo() {
      let app = this;

      if (app.corporation.info) {
        app.$api.get(urls.corpLogoURL + '?corporation_id=' + app.corporation.info.id).then(function (response) {
          app.$set(app, 'logo', response.data.avatar);
        });
      }
    },
    getAvatar() {
      let app = this;
      app.$api.get(urls.avatarURL + '?user_id=' + app.currentUser.user_id).then(function (response) {
        app.$set(app, 'avatar', response.data.avatar);
      });
    },
  },
  computed: {
    currentUser() {
      return this.$store.getters.getUser
    },
    tag() {
      if (this.corporation.info) {
        return this.corporation.info.tag
      } else {
        return ""
      }
    },
    corporation() {
      return this.$store.getters.getChatState.corporation;
    },
  }
}
</script>

<style scoped>
.sessionRankWrapper {
  height: 50px;
  width: 100%;
  border: 1px solid rgba(37, 160, 225, 0.2);
  background: rgba(8, 138, 210, 0.2);
  box-shadow: none;
  border-radius: 0 0 50px 5px;
}

.sessionRankWrapper2 {
  height: 44px;
  clear: both;
  border: 1px solid rgba(37, 160, 225, 0.5);
  background: rgba(8, 138, 210, 0.5);
  border-radius: 0 0 50px 5px;
  margin: 2px;
  line-height: 35px;
  color: white;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
}

.userAvatarWrapper {
  background-color: rgb(128, 128, 128);
  height: 42px;
  width: 42px;
  float: left;
  margin: 0 5px 5px 1px;
  border: 1px solid rgba(0, 0, 0, 0.4);
  box-shadow: inset 0 0 1px 0 black;
  background-size: cover;
  border-radius: 5px;
}

.userName {
  margin: 1px 0 0 2px;
  background: rgb(221, 112, 52);
  color: rgba(255, 255, 255, 0.8);
  border-radius: 0 0 50px 5px;
  font-size: 13px;
  line-height: 17px;
  height: 17px;
  user-select: none;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 1);
  font-weight: bold;
  box-shadow: 0 0 2px rgba(0, 0, 0, 1);
  padding-left: 10px;
  text-align: left;
  width: calc(100% - 16px);
}

.userName span {
  color: #e4ff00;
  font-size: 10px;
}

.Rank {
  height: 21px;
  width: 31px;
  float: left;
  background-color: rgb(128, 128, 128);
  border: 1px solid rgba(0, 0, 0, 0.4);
  box-shadow: inset 0 0 1px 0 black;
  margin: -1px 0 0 -1px;
  font-family: 'Audiowide', cursive;
  line-height: 22px;
  font-size: 17px;
  text-align: center;
  border-radius: 3px;
}

.state {
  margin-top: 3px;
}

.state h5 {
  margin: 0;
  width: calc(100% - 100px);
  float: left;
  height: 12px;
  font-size: 9px;
  line-height: 10px;
  text-align: left;
  text-indent: 5px;
}

.RankBar {
  position: relative;
  width: calc(100% - 125px);
  height: 8px;
  margin: 0 2px;
  background: rgb(145, 145, 145);
  float: left;
  border-radius: 5px;
  box-shadow: inset 0 0 2px black;
  overflow: hidden;
}

.RankBarInner {
  top: 0;
  left: 0;
  position: absolute;
  height: 100%;
  width: 50%;
  box-shadow: inset 0 0 2px 1px black;
  background: #ff8100;
}
</style>
