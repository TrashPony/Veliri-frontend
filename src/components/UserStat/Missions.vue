<template>
  <div class="missions_block">
    <div class="mission_block" v-if="missions.data" v-for="mission in missions.data.missions">
      <h3 class="mission_block_head" @click="toggleMission(mission.uuid)">
        <div class="mission_block_head_arrow" :class="{close_row: !openMission[mission.uuid]}"/>
        {{ mission.name }}
        <label class="trackLabel" :for="'track' + mission.uuid">
          отслеживать:
          <input type="checkbox"
                 :name="'track' + mission.uuid"
                 v-model="mission.track"
                 @click.stop="trackMission(mission.uuid)">
        </label>
      </h3>

      <template v-if="openMission[mission.uuid]">
        <div class="content">

          <h3 class="mission_block_head_content" @click="toggleLog(mission.uuid)">
            <div class="mission_block_head_arrow_sub" :class="{close_row: !openLog[mission.uuid]}"/>
            Журнал
          </h3>

          <template v-if="openLog[mission.uuid]"
                    v-for="location in  getLogSections(JSON.parse(missions.data.logs[mission.uuid]))">

            <div class="locationName">{{ location[0].location_name }}</div>

            <template v-for="logRow in location">
              <div v-if="logRow.type === 'page'" class="log_page">
                <div class="notify_time">{{ getDateTime(logRow.time) }}</div>
                <div class="log_row_text" v-html="logRow.text"></div>
              </div>

              <div v-if="logRow.type === 'ask'" class="log_ask">
                <div class="notify_time">{{ getDateTime(logRow.time) }}</div>
                <div class="log_row_text" v-html="logRow.text"></div>
              </div>

              <div v-if="logRow.type === 'modal'" class="log_modal">
                <div class="notify_time">{{ getDateTime(logRow.time) }}</div>
                <div class="log_row_text" v-html="logRow.text"></div>
              </div>
            </template>

          </template>

          <h3 class="mission_block_head_content" style="margin-bottom: 0" @click="toggleTasks(mission.uuid)">
            <div class="mission_block_head_arrow_sub" :class="{close_row: !openTasks[mission.uuid]}"/>
            Задачи
          </h3>

          <app-points v-if="openTasks[mission.uuid]"
                      v-bind:mission="getFullMission(mission.uuid)"
                      v-bind:set-current-action="false"/>

        </div>
      </template>
    </div>
  </div>
</template>

<script>
import Points from '../Missions/Points';

export default {
  name: "Missions",
  data() {
    return {
      openMission: {},
      openLog: {},
      openTasks: {},
    }
  },
  created() {
    this.$store.getters.getWSByService('chat').socket.send(JSON.stringify({
      event: "GetAllFullMission",
    }));
  },
  mounted() {
    this.$parent.resize(null, null, $(this.$parent.$el))
  },
  methods: {
    toggleMission(uuid) {
      if (!this.openMission[uuid]) {
        this.$set(this.openMission, uuid, true)
        this.$set(this.openLog, uuid, false)
        this.$set(this.openTasks, uuid, false)
      } else {
        this.$set(this.openMission, uuid, false)
      }
    },
    toggleLog(uuid) {
      if (!this.openLog[uuid]) {
        this.$set(this.openLog, uuid, true)
      } else {
        this.$set(this.openLog, uuid, false)
      }
    },
    toggleTasks(uuid) {
      if (!this.openTasks[uuid]) {
        this.$set(this.openTasks, uuid, true)
      } else {
        this.$set(this.openTasks, uuid, false)
      }
    },
    getFullMission(uuid) {
      let mission = this.missions.data.missions[uuid];
      mission.actions = JSON.parse(this.missions.data.actions[uuid]);

      for (let i in mission.actions) {
        for (let number in this.missions.data.need_items_slots[uuid]) {
          if (Number(mission.actions[i].number) === Number(number)) {
            mission.actions[i].need_items_slots = this.missions.data.need_items_slots[uuid][number];
          }
        }
      }

      return mission
    },
    getDateTime(time) {
      let now = new Date(time);
      let year = now.getFullYear();
      let month = now.getMonth() + 1;
      let day = now.getDate();
      let hour = now.getHours();
      let minute = now.getMinutes();
      let second = now.getSeconds();
      if (month.toString().length === 1) {
        month = '0' + month;
      }
      if (day.toString().length === 1) {
        day = '0' + day;
      }
      if (hour.toString().length === 1) {
        hour = '0' + hour;
      }
      if (minute.toString().length === 1) {
        minute = '0' + minute;
      }
      if (second.toString().length === 1) {
        second = '0' + second;
      }

      return year + '/' + month + '/' + day + ' ' + hour + ':' + minute + ':' + second;
    },
    getLogSections(logs) {

      let locations = [];

      for (let i = 0; i < logs.length; i++) {
        if (locations.length === 0 || locations[locations.length - 1][0].location_name !== logs[i].location_name) {
          locations.push([logs[i]])
        } else {
          locations[locations.length - 1].push(logs[i])
        }
      }

      return locations;
    },
    trackMission(uuid) {
      this.$store.getters.getWSByService('chat').socket.send(JSON.stringify({
        event: "TrackMission",
        uuid: uuid,
      }));
    }
  },
  computed: {
    missions() {
      return this.$store.getters.getFullAllMissions;
    },
  },
  components: {
    AppPoints: Points,
  }
}
</script>

<style scoped>
.missions_block {
  width: calc(100% - 14px);
  background: #89969c;
  float: left;
  box-shadow: inset 0 0 2px black;
  overflow-y: scroll;
  overflow-x: hidden;
  border-radius: 5px;
  height: calc(100% - 29px);
  padding: 7px;
  font-size: 12px;
}

.mission_block, .log_page, .log_ask, .log_modal {
  position: relative;
  float: left;
  bottom: unset;
  width: calc(100% - 8px);
  background-color: rgba(7, 41, 60, 0.4);
  border-radius: 5px;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
  z-index: 1;
  color: white;
  font-size: 12px;
  padding: 3px;
  overflow: hidden;
  min-height: 20px;
  box-shadow: 0 0 2px black;
  margin-bottom: 4px;
}

.mission_block_head, .mission_block_head_content, .locationName {
  margin: 0 0 4px;
  background: #dd7034;
  color: hsla(0, 0%, 100%, .8);
  border-radius: 4px;
  font-size: 13px;
  line-height: 19px;
  height: 17px;
  user-select: none;
  text-shadow: 1px 1px 1px #000;
  font-weight: 700;
  box-shadow: 0 0 2px #000;
  text-indent: 5px;
  position: relative;
  clear: both;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.mission_block_head:hover {
  background: #f37e3c;
}

.mission_block_head:active {
  transform: scale(0.99);
}

.mission_block_head_content, .locationName {
  background: #3486dd;
  font-size: 10px;
  line-height: 11px;
  height: 12px;
  margin: 0 0 3px;
}

.mission_block_head_content:hover {
  background: #3a95f6;
}

.mission_block_head_content:active {
  transform: scale(0.99);
}

.locationName {
  background: #e58122;
  text-align: center;
  margin: 4px auto;
  width: 50%;
}


.trackLabel {
  display: inline-block;
  white-space: nowrap;
  position: absolute;
  right: 0;
  top: -1px;
  border-radius: 5px;
  z-index: 1;
  background: #6e381a;
  padding: 0 1px;
}

.trackLabel input {
  vertical-align: middle;
}

.mission_block_head_arrow, .mission_block_head_arrow_sub {
  height: 17px;
  width: 17px;
  float: left;
  background-image: url(https://img.icons8.com/material-outlined/48/000000/expand-arrow--v1.png);
  background-size: contain;
  transition: 200ms;
}

.mission_block_head_arrow_sub {
  height: 12px;
  width: 12px;
}

.notify_time {
  font-size: 8px;
  font-family: 'Audiowide', cursive;
  color: #adacac;
  position: absolute;
  top: 2px;
  left: 4px;
}

.log_page, .log_ask, .log_modal {
  padding: 3px;
  padding-top: 15px;
  position: relative;
}

.log_page {
  background: #548d9a;
  float: left;
  width: 80%;
}

.log_ask {
  background: #65a048;
  float: right;
  width: 80%;
}

.log_row_text {
  text-align: justify;
  text-indent: 1.5em;
  font-size: 10px;
}

.close_row {
  transform: rotate(270deg);
}
</style>

<style>
.missions_block .MissionPoints {
  margin-top: 10px;
  overflow: hidden;
  padding-left: 15px;
  width: calc(100% - 15px);
}
</style>
