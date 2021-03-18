<template>
  <div id="MissionInfoBlock" ref="MissionInfoBlock"
       v-if="missions && missions.missions && Object.keys(missions.missions).length !== 0" @mousedown="toUp"
       style="height: unset">
    <div class="wrapper">
      <app-control v-bind:head="'Активные задания'"
                   v-bind:move="true"
                   v-bind:refWindow="'MissionInfoBlock'"
                   v-bind:resizeFunc="resize"
                   v-bind:minSize="{height: 120, width: 150}"/>

      <select v-model="missions.currentMissionUUID" id="SelectMission" @change="updateCurrentMission">
        <option value="">Выбраное задание</option>
        <option v-for="(mission, uuid) in missions.missions" :value="uuid">{{ mission.name }}</option>
      </select>

      <app-points v-if="missions.currentMissionUUID"
                  v-bind:mission="missions.missions[missions.currentMissionUUID]"
                  v-bind:set-current-action="true"/>

      <div id="MissionStory">
      </div>
    </div>
  </div>
</template>

<script>
import Control from '../Window/Control';
import Points from './Points';
import {gameStore} from "../../game/store";
import {MissionHelpers} from "../../game/mission/helpers";

export default {
  name: "Missions",
  data() {
    return {
      updater: null
    }
  },
  destroyed() {
    if (this.updater) clearInterval(this.updater);
  },
  created() {
    let app = this;
    app.updater = setInterval(function () {
      if (app.missions.currentAction) app.helpers(app.missions.currentAction);
    }, 1000);
  },
  methods: {
    resize(event, ui, el) {
      if (this.missions.currentMissionUUID === "") {
        $(el).css("height", 21)
      }
    },
    toUp() {
      this.$store.commit({
        type: 'setWindowZIndex',
        id: this.$el.id,
      });
    },
    updateCurrentMission(e) {
      this.$store.getters.getWSByService('chat').socket.send(JSON.stringify({
        event: "SelectMission",
        mission_uuid: e.target.value,
      }));
    },
    helpers(currentAction) {

      if (!currentAction || !gameStore.unitReady) return;

      MissionHelpers(currentAction);
      /** тут заполняются помошники только которые будут показыватся на мини карте, для игры смотри контроллер chat метод GetMissions **/
      if (currentAction.type_func_monitor === "to_sector" || currentAction.map_id !== gameStore.map.id) {

        // запрашиваем у сервера координату тунеля куда надо двигатся, отрисуется на мине карте
        if (this.$store.getters.getWSByService('global').connect) {
          this.$store.getters.getWSByService('global').socket.send(JSON.stringify({
            event: "GetPortalPointToGlobalPath",
            name: "mission",
            map_id: currentAction.map_id,
          }));
        }

      } else if (currentAction.type_func_monitor === "to_x_y" ||
        currentAction.type_func_monitor === "to_anomaly" ||
        currentAction.type_func_monitor === "build_or_time") {

        this.$store.commit({
          type: 'setHelper',
          helper: {x: currentAction.x, y: currentAction.y, radius: currentAction.radius},
        });

      } else if (gameStore.bases &&
        (currentAction.type_func_monitor === 'talk_with_base' ||
          currentAction.type_func_monitor === 'to_base' ||
          currentAction.type_func_monitor === 'delivery_item')) {

        if (gameStore.bases[currentAction.base_id]) {
          let base = gameStore.bases[currentAction.base_id];
          this.$store.commit({
            type: 'setHelper',
            helper: {x: base.x, y: base.y, radius: 30},
          });
        }

      } else if (currentAction.type_func_monitor === 'extract_item') {
        this.$store.getters.getWSByService('global').socket.send(JSON.stringify({
          event: "GetMissionPoints",
          id: currentAction.id,
        }));
      } else {
        this.$store.commit({
          type: 'setHelper',
          helper: null,
        });
        this.$store.commit({
          type: 'setPoints',
          points: null,
        });
      }
    },
  },
  computed: {
    missions() {
      return this.$store.getters.getMissions;
    },
  },
  components: {
    AppControl: Control,
    AppPoints: Points,
  }
}
</script>

<style scoped>
.wrapper {
  float: left;
  height: 100%;
  width: 100%;
  box-shadow: inset 0 0 2px black;
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.2);
}

#MissionInfoBlock {
  min-height: 21px;
  width: 220px;
  position: absolute;
  left: 15px;
  top: 280px;
  border-radius: 5px;
  color: white;
  display: block;
  border: 1px solid #25a0e1;
  background: rgb(8, 138, 210);
  z-index: 11;
  padding: 20px 3px 3px 3px;
  box-shadow: 0 0 2px black;
}

#MissionInfoBlock:hover {
  opacity: 1;
}

#MissionInfoBlock input {
  color: white;
  text-shadow: none;
  background: rgba(101, 165, 195, 0.7);
  border: 0;
  position: absolute;
  bottom: 0;
  right: 0;
  border-radius: 5px 0 0 0;
}

#SelectMission {
  width: 100%;
  border-radius: 5px 5px 0 0;
  border: 0;
  display: block;
  background: rgba(101, 165, 195, 0.3);
  height: 21px;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 900;
  transition: 200ms;
  font-family: 'Comfortaa', cursive;
}

#SelectMission option {
  background: rgba(0, 0, 0, 0.7);
}

#moveMissionButton {
  background: url(https://img.icons8.com/dotty/80/000000/expand.png) center center / contain no-repeat;
  height: 22px;
  width: 22px;
  position: absolute;
  right: 19px;
  top: 0;
}


#MissionStory {
  position: absolute;
  top: 21px;
  right: -159px;
  background: rgba(0, 0, 0, 0.5);
  height: 179px;
  width: 160px;
  overflow-y: scroll;
  box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.6);
  display: none;
}


</style>
