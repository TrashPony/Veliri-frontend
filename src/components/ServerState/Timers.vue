<template>
  <div class="main">
    <div id="tabs">
      <div class="tab" v-for="(time, tab) in tabs" :class="{active: tab === selectTab}" @click="selectTab = tab">
        {{ tab }} <span>(avg time: {{ time }} ms.)</span>
      </div>

      <div class="tab" @click="selectTab = ''">none</div>
    </div>
    <table id="log_table">
      <tr>
        <th>Название функции</th>
        <!--        <th>Время вызова</th>-->
        <th>Время выполнения</th>
      </tr>
      <tr v-for="log in logs"
          v-if="selectTab === '' || log.func_name === selectTab"
          :class="{war: log.work_ms > 10 && log.work_ms < 20, crit: log.work_ms > 19}">
        <td>{{ log.func_name }}</td>
        <!--        <td>{{ parseDateTime(log.start_time) }}</td>-->
        <td>{{ log.work_ms }} ms.</td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: "Timers",
  data() {
    return {
      updater: null,
      selectTab: "",
      map_id: 2,
    }
  },
  destroyed() {
    if (this.updater) clearInterval(this.updater);
  },
  created() {
    let app = this;

    if (!app.$store.getters.getWSByService('chat').connect) {
      app.$store.commit({
        type: 'reconnectWS',
        service: 'chat',
        force: false,
      });
    }

    app.updater = setInterval(function () {
      app.$store.getters.getWSByService('chat').socket.send(JSON.stringify({
        event: "get_server_state_timers",
        id: Number(app.map_id),
      }));
    }, 200);
  },
  methods: {
    getAvgFuncTime(funcName) {
      let times = []

      for (let i in this.logs) {
        if (this.logs[i].func_name === funcName) {
          times.push(this.logs[i].work_ms)
        }
      }

      const sum = times.reduce((a, b) => a + b, 0);
      return (sum / times.length).toFixed(0) || 0;
    },
    parseDateTime(dateTime) {
      let date = new Date(dateTime)
      return ('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear() + ' ' + ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2);
    }
  },
  computed: {
    logs() {

      if (!this.$store.getters.getServerState.map_timers) {
        return []
      }

      let logs = this.$store.getters.getServerState.map_timers[this.map_id]

      return logs.sort(function (a, b) {
        return new Date(b.start_time) - new Date(a.start_time);
      });
    },
    tabs() {
      let tabs = {};

      for (let i in this.logs) {
        if (!tabs.hasOwnProperty(this.logs[i].func_name)) {
          tabs[this.logs[i].func_name] = this.getAvgFuncTime(this.logs[i].func_name)
        }
      }

      tabs = Object.fromEntries(
        Object.entries(tabs).sort(([, a], [, b]) => a - b)
      );

      return tabs
    }
  }
}
</script>

<style scoped>
body {
  padding: 0;
  margin: 0;
}

.main {
  width: 1000px;
  margin: auto;
  margin-top: 15px;
  height: calc(100vh - 25px);
  box-shadow: 0 0 2px black;
  border-radius: 5px;
  overflow-x: hidden;
  overflow-y: scroll;
}

#tabs {
  width: 100%;
}

.tab {
  float: left;
  margin: 3px;
  padding: 4px;
  border-radius: 5px 5px 0 0;
  text-align: center;
  box-shadow: 0 0 2px black;
  cursor: pointer;
}

.tab span {
  display: block;
  font-size: 11px;
  color: gray;
}

.tab:hover {
  background: aliceblue;
}

.tab.active {
  background: #bad8ef;
}

#log_table {
  clear: both;
  width: 100%;
}

#log_table td {
  text-align: center;
}

.war {
  background: #62cbe9;
}

.crit {
  background: #ee6d6d;
}
</style>
