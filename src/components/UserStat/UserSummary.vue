<template>
  <div class="UserSummaryWrapper">
    <div class="summaryWrapper">
      <h4>Статистика</h4>
      <div class="summary">

        <div class="summaryCell">
          <h5>Количество боев в миссиях</h5>
          <div>9999</div>
        </div>

        <div class="summaryCell">
          <h5>Количество боев в рейдах</h5>
          <div>9999</div>
        </div>

        <div class="summaryCell">
          <h5>Уничтожено врагов</h5>
          <div>9999</div>
        </div>

        <div class="summaryCell">
          <h5>Среднее число убийств за бой</h5>
          <div>5.0</div>
        </div>

      </div>
    </div>
    <div class="historyWrapper">
      <h4>История</h4>
      <div class="history">
        <table>
          <tr>
            <th>Тип боя</th>
            <th>Карта</th>
            <th>Итог</th>
            <th>Время</th>
            <th>Дата</th>
            <th>Награда</th>
          </tr>

          <tr>
            <td>Тип боя</td>
            <td>Карта</td>
            <td>Итог</td>
            <td>Время</td>
            <td>Дата</td>
            <td>Награда</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "UserSummary",
  props: ['user'],
  mounted() {
    this.$parent.resize(null, null, $(this.$parent.$el))
  },
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
  font-size: 8px;
  border-right: 1px solid rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  color: rgba(255, 255, 255, 0.8);
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
}

.summary:after {
  content: '';
  clear: both;
  display: block;
}

.summaryCell {
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
}

.summaryCell div {
  width: 100%;
  text-align: center;
  color: #f1bd00;
  font-weight: 900;
  margin-top: 15px;
  clear: both;
}
</style>
