<template>
  <div id="MissionInfoBlock" ref="MissionInfoBlock" v-if="missions && missions.missions && Object.keys(missions.missions).length !== 0" @mousedown="toUp" style="height: unset">
    <div class="wrapper">
      <app-control v-bind:head="'Активные задания'" v-bind:move="true" v-bind:refWindow="'MissionInfoBlock'"
                   v-bind:noHeight="true"/>

      <select v-model="missions.currentMissionUUID" id="SelectMission" @change="updateCurrentMission">
        <option value="">Выбраное задание</option>
        <option v-for="(mission, uuid) in missions.missions" :value="uuid">{{mission.name}}</option>
      </select>

      <div id="MissionPoints" v-if="missions.currentMissionUUID">
        <table>
          <template v-if="missionPoints && point" v-for="(point, number) in missionPoints">
            <tr class="missionActions">
              <td class="actionNumber">{{number}}</td>
              <td class="actionShortDescription">{{point.short_description}}</td>
              <td>
                <div :class="'actionComplete' + point.complete"></div>
              </td>
            </tr>

            <tr v-if="point.current_sec > 0 && !point.complete" style="font-size: 9px">
              <td colspan="2">{{point.time_msg}}</td>
              <td>{{getTimeString(point.current_sec)}}</td>
            </tr>

            <tr v-if="point.type_func_monitor === 'destroy_npc' && point.count > 0">
              <td colspan="3">{{point.current_count}} / {{point.count}}</td>
            </tr>

            <template v-if="point.type_func_monitor !== 'get_item_on_base' && !point.complete">
              <tr v-for="slot in point.need_items_slots">
                <td class="missionItemCount" colspan="3">
                  <app-item-cell v-bind:itemSlot="slot" v-bind:size="35" v-bind:noQuantity="true"/>
                  <span>{{slot.find_count}}/{{slot.quantity}}</span>
                </td>
              </tr>
            </template>
          </template>
        </table>
      </div>

      <div id="MissionStory">
      </div>
    </div>
  </div>
</template>

<script>
  import Control from '../Window/Control';
  import ItemCell from '../Inventory/ItemCell';
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
      getTimeString(sec) {
        let date = new Date(0);
        date.setSeconds(sec);
        return date.toISOString().substr(11, 8);
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
      findCurrentAction(actionSort) {
        let currentAction;

        for (let i in actionSort) {
          if (actionSort[i]) {
            if (!actionSort[i].complete && !currentAction) {
              currentAction = actionSort[i];
            }
          }
        }

        this.$store.commit({
          type: 'setCurrentAction',
          currentAction: currentAction,
        });

        //this.helpers(currentAction)
      },
      helpers(currentAction) {

        if (!currentAction || !gameStore.unitReady) return;

        MissionHelpers(currentAction);

        /** тут заполняются помошники только которые будут показыватся на мини карте, для игры смотри контроллер chat метод GetMissions **/
        if (currentAction.type_func_monitor === "to_sector") {

          // запрашиваем у сервера координату тунеля куда надо двигатся, отрисуется на мине карте
          if (this.$store.getters.getWSByService('global').connect) {
            this.$store.getters.getWSByService('global').socket.send(JSON.stringify({
              event: "GetPortalPointToGlobalPath",
              name: "mission",
              map_id: currentAction.map_id,
            }));
          }

        } else if (currentAction.type_func_monitor === "to_x_y" || currentAction.type_func_monitor === "to_anomaly" ||
          currentAction.type_func_monitor === "build_or_time") {

          this.$store.commit({
            type: 'setHelper',
            helper: {x: currentAction.x, y: currentAction.y, radius: currentAction.radius},
          });

        } else if (gameStore.bases && currentAction.type_func_monitor === 'talk_with_base' ||
          currentAction.type_func_monitor === 'to_base' || currentAction.type_func_monitor === 'delivery_item') {

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
      missionPoints() {
        if (this.missions.missions[this.missions.currentMissionUUID]) {
          let actionSort = {};
          let userMission = this.missions.missions[this.missions.currentMissionUUID];

          let sortActions = [];

          for (let i in userMission.actions) {
            sortActions[userMission.actions[i].number] = userMission.actions[i];
          }

          let realActions = {};
          let number = 1;
          for (let i in sortActions) {
            if (!sortActions[i].description.includes('server_hidden')) {
              realActions[number] = sortActions[i];
              number++;
            }
          }

          for (let i in realActions) {
            // сортируем так что бы в масив не попали не открытые участки задания
            let append = false;

            if (Number(i) === 1 || realActions[i].complete) {
              actionSort[i] = realActions[i];
            } else {
              for (let j in realActions) {
                // если впереди есть выполненые таски то прошлые даже не выполненые можно добавить
                if (i > i && realActions[j].complete) {
                  append = true
                }

                // если текущая не выполнена, а позади да, то добавляем
                if (Number(j) === Number(i - 1) && realActions[j].complete) {
                  append = true
                }
              }
            }

            if (append) {
              actionSort[i] = realActions[i];
            }
          }

          this.findCurrentAction(actionSort);
          return actionSort
        }
      },
    },
    components: {
      AppControl: Control,
      AppItemCell: ItemCell,
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

  #MissionPoints {
    height: 179px;
    width: 220px;
    margin: 0 auto;
    overflow-y: scroll;
    overflow-x: hidden;
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

  .missionActions {
    width: 100%;
    font-size: 10px;
    clear: both;
  }

  .missionActions div {
    float: left;
  }

  .actionShortDescription {
    text-align: left;
  }

  .actionCompletefalse, .actionCompletetrue {
    float: left;
    height: 15px;
    width: 15px;
  }

  .actionCompletefalse {
    height: 10px;
    width: 10px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.5);
  }

  .actionCompletetrue {
    background: url(https://img.icons8.com/flat_round/64/000000/checkmark.png) center center / contain no-repeat;
  }

  .actionNumber {
    color: yellow;
  }

  #MissionPoints .InventoryCell {
    height: 35px;
    width: 35px;
  }

  #MissionPoints .QuantityItems {
    display: none;
  }

  #MissionPoints .missionItemCount {
    padding-left: 20px;
    text-align: left;
    line-height: 39px;
  }

  #MissionPoints .missionItemCount span {
    margin-left: 10px;
  }
</style>
