<template>
  <div class="UserSummaryWrapper">
    <div class="summaryWrapper">
      <h4>Статистика</h4>
      <div class="summary" v-if="battleState">

        <h4 class="subHead">Встречный бой</h4>
        <div class="summaryCell" title="Количество боев">
          <h5>Количество боев</h5>
          <div>{{ battleState.count_mission }}</div>
        </div>

        <div class="summaryCell" title="Уничтожено врагов">
          <h5>Уничтожено врагов</h5>
          <div>{{ battleState.mission_kills }}</div>
        </div>

        <div class="summaryCell" title="Среднее кол-во убийств">
          <h5>Среднее кол-во убийств</h5>
          <div>{{ (battleState.mission_kills / battleState.count_mission).toFixed(2) }}</div>
        </div>

        <div class="summaryCell" title="Среднее кол-во содействий">
          <h5>Среднее кол-во содействий</h5>
          <div>{{ battleState.avg_assists.toFixed(2) }}</div>
        </div>

        <div class="summaryCell" title="Среднее кол-во урона">
          <h5>Среднее кол-во урона</h5>
          <div>{{ battleState.avg_damage }}</div>
        </div>

        <div class="summaryCell" title="Среднее кол-во ремонта">
          <h5>Среднее кол-во ремонта</h5>
          <div>{{ battleState.avg_heal }}</div>
        </div>

        <h4 class="subHead" style="margin-top: 5px">Рейды</h4>
        <div class="summaryCell" title="Количество боев">
          <h5>Количество боев</h5>
          <div>{{ battleState.cont_raids }}</div>
        </div>

      </div>
    </div>
    <div class="historyWrapper" v-if="battleState && battleState.history_battles">
      <h4>История</h4>
      <div class="history">
        <table>
          <tr>
            <th>Тип боя</th>
            <th>Карта</th>
            <th>Итог</th>
            <th>Время</th>
            <th>Дата</th>
            <th>Опыт</th>
          </tr>

          <tr v-for="battle in battleState.history_battles">
            <td>{{ battle.type }}</td>
            <td>{{ battle.map_name }}</td>
            <td class="win" :class="{lose: !battle.user_wins}">{{ battle.user_wins ? `победа` : `поражение` }}</td>
            <td>{{ battleTimeMinutes(battle.time).minutes }} : {{ battleTimeMinutes(battle.time).sec }}</td>
            <td>{{ unitTimeToTime(battle.date_time) }}</td>
            <td>{{ battle.game_points }}</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import urls from '../../const';

export default {
  name: "UserSummary",
  props: ['user'],
  data() {
    return {
      battleState: null,
    }
  },
  mounted() {
    this.$parent.resize(null, null, $(this.$parent.$el))
    let app = this;
    app.$api.get(urls.userBattleInfoURL + '?user_id=' + app.$props.user.id).then(function (response) {
      app.battleState = response.data
      app.battleState.history_battles = app.battleState.history_battles.reverse()
    });
  },
  methods: {
    battleTimeMinutes(time) {
      if (time < 0) {
        return '-- : --'
      }
      let minutes = Math.floor(time / 60);
      let sec = time % 60;
      return {minutes: (minutes % 60 < 10 ? "0" : "") + minutes, sec: (sec % 60 < 10 ? "0" : "") + sec};
    },
    unitTimeToTime(unixTime) {
      let date = new Date(unixTime * 1000);
      return ('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear() + ' ' + ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2);
    }
  }
}
</script>

<style scoped>
.UserSummaryWrapper {
  width: calc(100% - 14px);
  background: #89969c;
  float: left;
  box-shadow: inset 0 0 2px black;
  overflow-y: scroll;
  overflow-x: hidden;
  border-radius: 5px;
  height: calc(100% - 14px);
  padding: 7px;
  font-size: 12px;
}

.UserSummaryWrapper h4 {
  margin: 0 0 7px 0;
  background: rgb(221, 112, 52);
  color: rgba(255, 255, 255, 0.8);
  border-radius: 4px;
  font-size: 13px;
  line-height: 17px;
  height: 17px;
  user-select: none;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 1);
  font-weight: bold;
  box-shadow: 0 0 2px rgba(0, 0, 0, 1);
  padding-left: 10px;
}

.summary {
  padding: 4px 5px 4px 5px;
  background: rgba(0, 0, 0, 0.17);
  margin-bottom: 5px;
  border-radius: 5px;
  box-shadow: 0 0 2px black;
  position: relative;
}

.history {
  box-shadow: inset 0 0 2px black;
  background: #adc6cd;
  word-wrap: break-word;
  overflow-y: scroll;
  border-radius: 5px;
  text-align: left;
  width: 100%;
  text-shadow: #28a5e4 0 0 4px;
  font-size: 9pt;
  float: left;
  resize: none;
  overflow-x: hidden;
  margin: 0;
}

.history table {
  width: 100%;
  margin: auto;
  border-spacing: 0;
}

.history table tr {
  text-align: center;
}

.history table:first-child th {
  background: #216a8e;
  color: rgba(255, 255, 255, 0.8);
  font-size: 8px;
  user-select: none;
  margin: 2px auto;
  position: sticky;
  top: 0;
  padding-top: 2px;
}

.history table tr td {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  text-indent: 1px;
  font-size: 10px;
  padding: 2px;
  border-right: 1px solid rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  color: black;
  text-shadow: none;
  font-weight: 900;
}

.summary:after {
  content: '';
  clear: both;
  display: block;
}

.summaryCell {
  width: 115px;
  float: left;
  margin: 3px;
  background: rgba(77, 77, 84, 0.3);
  border-radius: 5px;
  color: white;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
  box-shadow: 0 0 2px black;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  padding: 5px;
}

.summaryCell h5 {
  text-align: center;
  margin: 0;
  font-size: 10px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  text-indent: 1px;
  padding: 2px;
}

.summaryCell div {
  width: 100%;
  text-align: center;
  color: #f1bd00;
  font-weight: 900;
  margin-top: 15px;
  clear: both;
}

.history .win {
  color: #33ff3a;
  font-size: 12px;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
}

.history .lose {
  color: rgb(236 117 102);
}

.UserSummaryWrapper .subHead {
  float: left;
  width: calc(100% - 25px);
  line-height: 13px;
  height: 13px;
  font-size: 10px;
  background: rgb(181 83 29);
  color: white;
}
</style>
