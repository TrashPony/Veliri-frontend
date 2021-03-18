<template>
  <div id="server_state" ref="server_state" class="server_state">
    <div class="server_state_block">
      <app-control v-bind:head="'Состояние сервера'" v-bind:move="false" v-bind:close="false"
                   v-bind:refWindow="'server_state'"/>
      <div class="server_state_main">

        <div class="server_state_common">
          <h4>Общнее</h4>

          <table class="top_table">
            <tr>
              <td>Ботов:</td>
              <td><span class="value">{{ serverState.count_bots }}</span></td>

              <td>Игроков:</td>
              <td><span class="value">{{ serverState.count_players }}</span></td>

              <td>Боевые группы:</td>
              <td><span class="value">{{ serverState.count_battle_groups }}</span></td>

              <td>Пуль:</td>
              <td><span class="value">{{ serverState.count_bullets }}</span></td>

              <td>Обьектов:</td>
              <td><span class="value">{{ serverState.count_objects }}</span></td>

              <td>Транспортов:</td>
              <td><span class="value">{{ serverState.count_transports }}</span></td>

              <td>Ресурсов:</td>
              <td><span class="value">{{ serverState.count_reservoirs }}</span></td>

              <td>Ящиков:</td>
              <td><span class="value">{{ serverState.count_boxes }}</span></td>

              <td>Сигналов:</td>
              <td><span class="value">{{ serverState.count_signals }}</span></td>
            </tr>
          </table>

          <table class="func_table">
            <tr>
              <th colspan="6">Функции:</th>
            </tr>
            <tr>
              <td>Calc Move:</td>
              <td><span class="value">{{ serverState.count_calc_move }}</span></td>
              <td>AI Move:</td>
              <td><span class="value">{{ serverState.ai_move }}</span></td>
              <td>Meteorite wait end:</td>
              <td><span class="value">{{ serverState.meteorite_wait_end }}</span></td>
            </tr>
          </table>

          <table class="func_table">
            <tr>
              <th colspan="6">Очереди сообщений:</th>
            </tr>
            <tr v-for="(count, server) in serverState.messages_count">
              <td>{{ server }}:</td>
              <td><span class="value">{{ count }}</span></td>
            </tr>
          </table>

        </div>

        <div class="preview">
          <label class="select_map"> Сектор:
            <select title="карта" v-model="map_id">
              <option value="0">выберите сектор</option>
              <option v-for="map in serverState.short_info_map" :value="map.id">id: {{ map.id }}, {{
                  map.Name
                }}
              </option>
            </select>
          </label>

          <div class="map_state">
            <div class="map_wrapper" v-for="map in serverState.maps">
              <app-mini-map
                v-bind:map="map"
                v-bind:staticObjects="map.static_objects"
                v-bind:userID="0"
                v-bind:userSquadID="0"
                v-bind:bullets="serverState.maps_bullets[map.id]"
                v-bind:GeoZones="serverState.maps_geo_zones[map.id]"
                v-bind:objects="serverState.maps_dynamic_objects[map.id]"
                v-bind:reservoirs="serverState.maps_reservoirs[map.id]"
                v-bind:boxes="serverState.maps_boxes[map.id]"
                v-bind:units="serverState.maps_units[map.id]"
                v-bind:evacuations="serverState.maps_evacuations[map.id]"
                v-bind:signals="serverState.maps_signals[map.id]"/>
            </div>
          </div>
        </div>

        <div class="map_info" v-if="serverState.maps[map_id]">
          <h4>Информация</h4>

          <table style="float: unset; clear: both" class="top_table">
            <tr>
              <td>Ботов:</td>
              <td><span class="value">{{ 0 }}</span></td>

              <td>Игроков:</td>
              <td><span class="value">{{ 0 }}</span></td>

              <td>Пуль:</td>
              <td><span class="value">{{ Object.keys(serverState.maps_bullets[map_id]).length }}</span></td>

              <td>Обьектов:</td>
              <td><span class="value">{{ Object.keys(serverState.maps_dynamic_objects[map_id]).length }}</span></td>

              <td>Транспортов:</td>
              <td><span class="value">{{ Object.keys(serverState.maps_evacuations[map_id]).length }}</span></td>

              <td>Ресурсов:</td>
              <td><span class="value">{{ Object.keys(serverState.maps_reservoirs[map_id]).length }}</span></td>

              <td>Ящиков:</td>
              <td><span class="value">{{ Object.keys(serverState.maps_boxes[map_id]).length }}</span></td>

              <td>Сигналов:</td>
              <td><span class="value">{{ Object.keys(serverState.maps_signals[map_id]).length }}</span></td>
            </tr>
          </table>

          <div class="server_tick">
            <div class="last_tick"> server tick:
              <span>{{ serverTick }}</span> ms
            </div>

            <canvas class="server_tick_canvas" height="128" width="990" ref="server_tick_canvas">
            </canvas>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Control from '../Window/Control';
import MiniMap from './MiniMap';

export default {
  name: "ServerState",
  data() {
    return {
      updater: null,
      map_id: 0,
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
        event: "get_server_state",
        id: Number(app.map_id),
      }));
    }, 200);
  },
  methods: {
    drawServerTick() {

      if (this.map_id === 0 || !this.serverState.maps[this.map_id] || !this.$refs['server_tick_canvas']) return;

      let canvas = this.$refs['server_tick_canvas'];
      let ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = 'rgb(255,0,0)';
      ctx.lineWidth = 1;

      let serverTicks = this.serverState.maps_ticks[this.map_id];

      if (!serverTicks) return;

      ctx.beginPath();
      for (let i = 0; i < canvas.width / 2; i++) {
        ctx.lineTo(i * 2, canvas.height - (serverTicks[serverTicks.length - i - 1]) * 2);
      }
      ctx.stroke();
      ctx.closePath();
    }
  },
  computed: {
    serverState: function () {
      return this.$store.getters.getServerState
    },
    serverTick() {
      this.drawServerTick();
      return this.serverState.maps_ticks[this.map_id][this.serverState.maps_ticks[this.map_id].length - 1]
    },
  },
  components: {
    AppControl: Control,
    AppMiniMap: MiniMap,
  }
}
</script>

<style scoped>
.server_state {
  height: 100vh;
  width: 100%;
  text-align: center;
  background-color: #7f7f7f;
  background-image: url('../../assets/bases/base.jpg');
  background-size: cover;
  background-attachment: fixed;
  background-position: center;
}

.server_state_block {
  position: absolute;
  left: 5%;
  top: 20px;
  display: block;
  border-radius: 5px;
  width: 90%;
  height: calc(100% - 60px);
  border: 1px solid #25a0e1;
  background: rgb(8, 138, 210);
  z-index: 11;
  padding: 20px 3px 3px 3px;
  box-shadow: 0 0 2px black;
}

.server_state_main {
  box-shadow: inset 0 0 5px black;
  background: #8cb3c7;
  border-radius: 5px;
  height: calc(100% - 20px);
  position: relative;
  width: calc(100% - 20px);
  overflow: scroll;
  padding: 10px;
}

.server_state_common {
  box-shadow: inset 0 0 5px black;
  background: #b3b3b3;
  width: calc(100% - 6px);
  min-height: 50px;
  padding: 3px;
}

.server_state_common h4 {
  margin: 4px 4px 7px;
  width: 100px;
  background: #dd7034;
  color: hsla(0, 0%, 100%, .8);
  border-radius: 4px;
  font-size: 16px;
  line-height: 26px;
  height: 24px;
  user-select: none;
  text-shadow: 1px 1px 1px #000;
  font-weight: 700;
  box-shadow: 0 0 2px #000;
  padding-left: 0;
  float: left;
}

.top_table, .func_table {
  float: left;
  color: white;
  font-size: 13px;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
  font-weight: 700;
  line-height: 18px;
  text-align: left;
}

.top_table {
  margin: 4px 4px 7px;
  background: #dd7034;
  border-radius: 4px;
  font-weight: 700;
  box-shadow: 0 0 2px #000;
}

.value {
  color: #f6d605;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
}

.func_table {
  clear: both;
  width: unset;
  float: unset;
  margin: 4px 4px 7px;
  background: #348edd;
  border-radius: 4px;
  font-weight: 700;
  box-shadow: 0 0 2px #000;
}

th {
  text-align: center;
}

.map_wrapper {
  position: relative;
  float: left;
  height: 400px;
  width: 400px;
  border-radius: 6px;
  user-select: none;
  padding: 2px;
  margin: 3px;
  box-shadow: 0 0 4px black;
}

.select_map {
  float: left;
  margin: 4px 4px 7px;
  background: #3486dd;
  border-radius: 4px;
  font-weight: 700;
  box-shadow: 0 0 2px #000;
  color: white;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
  padding: 3px;
}

.top_table td {
  min-width: 50px;
}

.map_state {
  clear: both;
}

.preview {
  clear: both;
  float: left;
  width: 430px;
}

.map_info {
  float: left;
}

.map_info h4 {
  margin: 4px 4px 7px;
  width: 150px;
  background: #dd7034;
  color: hsla(0, 0%, 100%, .8);
  border-radius: 4px;
  font-size: 16px;
  line-height: 26px;
  height: 24px;
  user-select: none;
  text-shadow: 1px 1px 1px #000;
  font-weight: 700;
  box-shadow: 0 0 2px #000;
  padding-left: 5px;
  float: left;
  text-align: left;
}

.server_tick {
  height: 155px;
  width: 1000px;
  background: #d9d9d9;
  box-shadow: inset 0 0 2px black;
  margin: 5px;
  position: relative;
}

.last_tick {
  position: absolute;
  top: 3px;
  left: 5px;
  text-shadow: 0 0 2px;
  font-weight: bold;
  font-size: 12px;
}

.last_tick span {
  color: #b82d2d;
}

.server_tick_canvas {
  height: 128px;
  width: 990px;
  position: absolute;
  left: 5px;
  bottom: 5px;
  border-bottom: 1px solid black;
  border-left: 1px solid black;
}
</style>
