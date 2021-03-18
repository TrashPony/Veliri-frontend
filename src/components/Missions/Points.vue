<template>
  <div class="MissionPoints">
    <table class="MissionPointsTable">
      <template v-if="missionPoints && point" v-for="(point, number) in missionPoints">
        <tr class="missionActions">
          <td class="actionNumber">{{ number }}</td>
          <td class="actionShortDescription" v-html="point.short_description"/>
          <td>
            <div :class="'actionComplete' + point.complete"></div>
          </td>
        </tr>

        <tr v-if="point.current_sec > 0 && !point.complete" style="font-size: 9px">
          <td colspan="2">{{ point.time_msg }}</td>
          <td>{{ getTimeString(point.current_sec) }}</td>
        </tr>

        <tr v-if="point.type_func_monitor === 'destroy_npc' && point.count > 0">
          <td colspan="3">{{ point.current_count }} / {{ point.count }}</td>
        </tr>

        <template v-if="point.type_func_monitor !== 'get_item_on_base' && !point.complete">
          <tr v-for="slot in point.need_items_slots">
            <td class="missionItemCount" colspan="3">
              <app-item-cell v-bind:itemSlot="slot" v-bind:size="35" v-bind:noQuantity="true"/>
              <span>{{ slot.find_count }}/{{ slot.quantity }}</span>
            </td>
          </tr>
        </template>
      </template>
    </table>
  </div>
</template>

<script>
import ItemCell from '../Inventory/ItemCell';

export default {
  name: "Points",
  props: ["mission", "setCurrentAction"],
  methods: {
    getTimeString(sec) {
      let date = new Date(0);
      date.setSeconds(sec);
      return date.toISOString().substr(11, 8);
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

      if (this.$props.setCurrentAction) {
        this.$store.commit({
          type: 'setCurrentAction',
          currentAction: currentAction,
        });
      }
    },
  },
  computed: {
    missionPoints() {
      if (this.$props.mission) {
        let actionSort = {};
        let userMission = this.$props.mission;

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
    AppItemCell: ItemCell,
  }
}
</script>

<style scoped>

.MissionPoints {
  height: calc(100% - 21px);
  width: 100%;
  margin: 0 auto;
  overflow-y: scroll;
  overflow-x: hidden;
}

.missionActions {
  width: 100%;
  font-size: 10px;
  clear: both;
}

.actionShortDescription {
  text-align: left;
}

.missionActions div {
  float: left;
}

.actionNumber {
  color: yellow;
  vertical-align: top;
}

.MissionPoints .InventoryCell {
  height: 35px;
  width: 35px;
}

.MissionPoints .QuantityItems {
  display: none;
}

.MissionPoints .missionItemCount {
  padding-left: 20px;
  text-align: left;
  line-height: 39px;
}

.MissionPoints .missionItemCount span {
  margin-left: 10px;
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

.MissionPointsTable {
  width: 100%;
}
</style>
