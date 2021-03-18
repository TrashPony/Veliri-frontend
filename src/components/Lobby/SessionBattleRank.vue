<template>
  <div class="sessionRankWrapper">
    <div class="sessionRankWrapper2">

      <div class="userAvatarWrapper" v-bind:style="{backgroundImage:  'url(\'' + avatar + '\')'}"/>

      <div v-if="currentUser && currentUser.battle_rank">

        <h3 class="userName">
          <template v-if="tag !== ''">[<span>{{ tag }}</span>]</template>
          {{ currentUser.user_name }}
        </h3>

        <div class="state">
          <div class="Rank">
            {{ currentUser.battle_rank.lvl }}
          </div>

          <div>
            <h5>Боевой ранг {{ currentUser.battle_rank.points }} / {{ currentUser.battle_rank.need_points_to_up }}</h5>
            <div class="RankBar">
              <div class="RankBarInner"
                   :style="{width: (100 / (currentUser.battle_rank.need_points_to_up / currentUser.battle_rank.points)) + '%'}"/>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="exitTime" v-if="chatState && chatState.exitTime > 0"
         title="Недавно вы получали урон или нарушили закон, поэтому ваш транспорт сможет выйти из игры только через время.">
      <div class="time">
        {{ TimeFormat(chatState.exitTime).minutes }}:{{ TimeFormat(chatState.exitTime).sec }}
      </div>
    </div>

    <div class="lawTime" v-if="chatState && chatState.violator && chatState.violator.time > 0"
         :title="'Вы нарушили закон и находитель в режиме \'' + chatState.violator.type + '\''">
      <div class="vio">{{ chatState.violator.type.toUpperCase() }}</div>
      <div class="time">
        {{ TimeFormat(chatState.violator.time).minutes }}:{{ TimeFormat(chatState.violator.time).sec }}
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
    let app = this;

    let wait = setInterval(function () {
      if (app.currentUser.user_id) {
        app.getAvatar();
        app.getCorpLogo();
        clearInterval(wait);
      }
    }, 100)
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
    TimeFormat(time) {

      if (time < 0) {
        return '-- : --'
      }

      let minutes = Math.floor(time / 60);
      let sec = time % 60;
      return {minutes: (minutes % 60 < 10 ? "0" : "") + minutes, sec: (sec % 60 < 10 ? "0" : "") + sec};
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
    chatState() {
      return this.$store.getters.getChatState
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

.exitTime, .lawTime {
  position: absolute;
  height: 35px;
  width: 35px;
  background-size: cover;
  background-image: url(https://img.icons8.com/fluent/48/000000/medium-risk.png);
  left: calc(100% + 12px);
  top: 1px;
  filter: drop-shadow(0px 0px 2px black);
}

.lawTime {
  background-image: url(https://img.icons8.com/emoji/48/000000/red-triangle-pointed-up-emoji.png);
  left: calc(100% + 55px);
  top: 2px;
}

.exitTime .time, .lawTime .time {
  color: yellow;
  font-weight: 900;
  font-size: 10px;
  position: absolute;
  top: 100%;
  width: 100%;
  text-align: center;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
}

.vio {
  font-size: 8px;
  line-height: 45px;
  color: white;
  width: 100%;
  text-align: center;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
}
</style>
