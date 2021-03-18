<template>
  <div id="main" v-if="missions">

    <div id="MissionList">

      <div id="filters">
        <h4 class="filters_head">Фильтры:
          <input type="button" value="Даилоги" onclick="GetListDialogs()">
          <input type="button" value="Задания" onclick="GetListMissions()">
        </h4>

        <div id="createNewMissionBlock">
          <input type="text" placeholder="Имя новой миссии" v-model="newMission">
          <input type="button" value="Создать миссию" @click="AddMission">
        </div>

        <label>
          ИД: <input type="number" placeholder="ИД" v-model.number="filter.id" min="0" value="0"
                     style="width: 40px;">
        </label>

        <label>
          Имя: <input type="text" placeholder="Имя" v-model="filter.name">
        </label>
      </div>


      <table id="missionTable" v-if="!selectMission">
        <tr>
          <td>ID</td>
          <td>Name</td>
          <td>Fraction</td>
        </tr>
        <tr v-for="mission in filterMissions" @click="setSelectMission(mission)">
          <td>{{ mission.id }}</td>
          <td>{{ mission.name }}</td>
          <td>{{ mission.fraction }}</td>
        </tr>
      </table>

      <div id="MissionList2" v-if="selectMission">

        <div class="mission">
          <div class="missionProp">
            <input type="text" v-model="selectMission.name" style="display: block;width: 320px; margin-bottom: 5px;">
            <input type="button" value="Сохранить" @click="SaveMission()" style="width: 85px;">
            <input type="button" value="Удалить" onclick="DeleteMission(${mission.id})" style="width: 85px;">
            <label> ID:
              <input type="text" :value="selectMission.id" disabled>
            </label>

            <label> Доступно фракции:
              <select v-model="selectMission.fraction">
                <option value="All">Всем</option>
                <option value="Replics">Replics</option>
                <option value="Explores">Explores</option>
                <option value="Reverses">Reverses</option>
              </select>
            </label>

            <label> Тип:
              <select v-model="selectMission.type">
                <option value="">-</option>
                <option value="delivery">delivery</option>
              </select>
            </label>

            <label> Награда кредитов:
              <input type="number" v-model="selectMission.reward_cr">
            </label>

            <label> Награда предметы:
              <div class="rewardItems" id="rewardItems${mission.id}">
                <app-item-cell v-bind:size="40" v-bind:itemSlot="slot" v-for="slot in selectMission.rewardItems"/>
                <div class="addItemButton" @click="addItem={id: selectMission.id, need: false}">+</div>
              </div>
            </label>

            <label> Ид базы начала квеста (0 - на всех):
              <input type="number" v-model.number="selectMission.start_base_id">
            </label>

            <label> Ид диалога для старта задания:
              <input type="number" v-model.number="selectMission.start_dialog_id">
            </label>

            <label> Ид диалога не выполненого задания:
              <input type="number" v-model.number="selectMission.not_finished_dialog_id">
            </label>

            <input type="button" value="back" @click="selectMission= null">
          </div>

          <div class="actionsProp">
            <div class="rowAction" v-for="action in selectMission.actions">

              <input type="number" class="count" v-model.number="action.number" style="width: 40px;">
              <input type="button" value="Удалить" @click="RemoveAction(action.number)"
                     style="position: absolute;left: 9px;top: 45px;">

              <div style="text-align: left; float: left; padding-left: 20px;">
                <label> Описание:
                  <input type="text" v-model="action.description">
                </label>

                <label> Краткое:
                  <input type="text" v-model="action.short_description">
                </label>

                <label> Действие:
                  <select v-model="action.type_func_monitor">
                    <option value="to_base">Идти на базу</option>
                    <option value="delivery_item">Доставить предмет на базу</option>
                    <option value="get_item_on_base">Взять предмет на базе</option>
                    <option value="to_x_y">Достигнуть точки X Y</option>
                    <option value="talk_with_base">Поговорить с базой</option>
                    <option value="extract_item">Добыть предметы</option>
                    <option value="get_item_on_obj">Взять предмет из объекта</option>
                    <option value="place_item_in_obj">Положить предмет в обьект на карте</option>
                    <option value="attack_map_obj">Стрельнуть по объекту на карте</option>
                    <option value="to_sector">Отправится в сектор</option>
                    <option value="anomaly_generated">Создать номалияю (карта,х,у,радиус, прдметы в ней)</option>
                    <option value="to_anomaly">Найти созданую аномалию</option>
                    <option value="to_extract_anomaly">Извлечь аномалию</option>
                    <option value="get_items_anomaly_box">Извлечь предметы и ящика аномалии</option>
                    <option value="build_or_time">Построить строение или таймер</option>
                    <option value="respawn_npc">Создать НПС ботов</option>
                    <option value="target_npc">Цель для нпс (х,у, радиус)</option>
                    <option value="destroy_npc">Уничтожить нпс</option>
                    <option value="process_ore">Добыть предметы переработкой (в итемах указать результат)</option>
                    <option value="weapon_in_panel">Разместить оружие на панеле</option>
                    <option value="find_thorium_ore">Найти и подойти к ториевой руде</option>
                  </select>
                </label>

                <label>
                    Async:
                  <input type="checkbox" v-model="action.async">

                    Rubicon:
                  <input type="checkbox" v-model="action.rubicon">
                </label>

                <textarea placeholder="Сообщение по завершению" v-model="action.end_text"
                          style="position: absolute;right: 0;top: 0;width: 400px;height: 80px;"></textarea>
              </div>

              <div class="metaBlock">
                <h5>Мета информация действия</h5>

                <table>
                  <tr>
                    <td>Ид базы</td>
                    <td>Ид Карты</td>
                    <td>X</td>
                    <td>Y</td>
                    <td>Радиус</td>
                    <td>Секунды</td>
                    <td>Количество</td>
                    <td>Ид Диалога</td>
                    <td>Ид Алтернативного диалога</td>
                    <td>Необходимые предметы</td>
                    <td>Должен положить игрок</td>
                  </tr>
                  <tr>
                    <td><input type="number" v-model.number="action.base_id"></td>
                    <td><input type="number" v-model.number="action.map_id"></td>
                    <td><input type="number" v-model.number="action.x"></td>
                    <td><input type="number" v-model.number="action.y"></td>
                    <td><input type="number" v-model.number="action.radius"></td>
                    <td><input type="number" v-model.number="action.sec"></td>
                    <td><input type="number" v-model.number="action.count"></td>
                    <td><input type="number" v-model.number="action.dialog_id"></td>
                    <td><input type="number" v-model.number="action.alternative_dialog_id"></td>
                    <td>
                      <div class="needItems">
                        <app-item-cell
                          v-bind:size="40"
                          v-bind:itemSlot="slot"
                          v-for="slot in action.items"
                          @click.native="removeItem = {number: slot.number, id: action.id, need: true}"/>
                        <div class="addItemButton" @click="addItem={id: action.id, need: true}">+</div>
                      </div>
                    </td>
                    <td><input type="checkbox" v-model="action.owner_place"></td>
                  </tr>
                </table>
              </div>
            </div>

            <div class="rowAction"
                 style="font-size: 15px; font-weight: bold; color: darkred; text-shadow: 0 0 1px black;"
                 @click="AddAction()">
              Добавить действие +
            </div>
          </div>


        </div>

      </div>
    </div>

    <div id="AddItemDialog" v-if="addItem">
      <h4> Добавить предмет. </h4>

      <select v-model="addItem.item_type">
        <option value="weapon"> Оружие</option>
        <option value="ammo"> Патроны</option>
        <option value="equip"> Снаряжение</option>
        <option value="body"> Корпус</option>
        <option value="resource"> Ресурс</option>
        <option value="recycle"> Полуфабрикат</option>
        <option value="detail"> Деталь</option>
        <option value="boxes"> Ящик</option>
        <option value="blueprints"> Чертеж</option>
        <option value="trash"> Хлам</option>
      </select>
      <br>
      <input type="number" placeholder="ID" v-model.number="addItem.item_id">
      <br>
      <input type="number" placeholder="quantity" v-model.number="addItem.item_quantity">
      <br>
      <input type="button" value="Да" @click="AddItem()">
      <input type="button" value="Нет" @click="addItem = null;">
    </div>

    <div id="RemoveItemDialog" v-if="removeItem">
      <h4> Удалить предмет? </h4>
      <input type="button" value="Да" @click="RemoveItem()">
      <input type="button" value="Нет" onclick="removeItem = null">
    </div>
  </div>
</template>

<script>
import ItemCell from '../Inventory/ItemCell'
import Vue from 'vue'
import Input from "../Chat/Input";

export default {
  name: "MissionEditor",
  data() {
    return {
      newMission: "",
      filterMissions: [],
      selectMission: null,
      removeItem: null,
      addItem: null,
      filter: {
        id: 0,
        name: "",
      },
    }
  },
  created() {
    let app = this;

    app.$store.commit({
      type: 'reconnectWS',
      service: 'dialog_editor',
      force: false,
    });
  },
  methods: {
    GetListMissions() {
      this.selectDialog = null;
      this.$store.getters.getWSByService('dialog_editor').socket.send(JSON.stringify({
        event: "GetAllMissions"
      }));
    },
    getSortActions(mission) {

      if (!this.editorData.actions[mission.id]) return [];

      let actions = JSON.parse(this.editorData.actions[mission.id]);

      let sortItems = [];

      for (let i in actions) {

        actions[i].items = this.editorData.items[mission.id][actions[i].number]

        sortItems.push(actions[i])
      }

      return sortItems.sort(function (a, b) {
        return a.number - b.number;
      });
    },
    SaveMission() {
      console.log(123)
      let n = this.$store.getters.getWSByService('dialog_editor').socket.send(JSON.stringify({
        event: "SaveMissions",
        mission: this.selectMission,
        actions: this.selectMission.actions,
      }));
      console.log(n)
    },
    DeleteMission() {
      // this.$store.getters.getWSByService('dialog_editor').socket.send(JSON.stringify({
      //   event: "DeleteMission",
      //   mission: this.selectMission,
      // }));
    },
    AddMission() {
      if (this.newMission === "") {
        alert("Укажите имя");
        return
      }

      this.$store.getters.getWSByService('dialog_editor').socket.send(JSON.stringify({
        event: "AddMission",
        name: this.newMission,
      }));
      this.newMission = "";
    },
    AddAction() {
      let number = 1;
      if (!this.selectMission.actions) this.selectMission.actions = [];

      for (let i in this.selectMission.actions) {
        if (this.selectMission.actions[i].number > number) {
          number = this.selectMission.actions[i].number
        }
      }
      number++;
      this.selectMission.actions.push({
        alternative_dialog_id: 0,
        async: false,
        count: 0,
        current_count: 0,
        description: "",
        dialog: null,
        dialog_id: 0,
        need_items: null,
        number: number,
        player_id: 0,
        q: 0,
        r: 0,
        radius: 0,
        sec: 0,
        short_description: "",
        type_func_monitor: "",
      });

      // костыль ради реактивности
      let mission = this.selectMission;
      this.selectMission = null;
      this.setSelectMission(mission);
    },
    RemoveAction(actNumber) {
      for (let i in this.selectMission.actions) {
        if (this.selectMission.actions[i].number === actNumber) {
          this.selectMission.actions.splice(i, 1);
        }
      }

      // костыль ради реактивности
      let mission = this.selectMission;
      this.selectMission = null;
      this.setSelectMission(mission);
    },
    setSelectMission(mission) {
      this.selectMission = mission
    },
    AddItem() {
      //если need то это needItems иначе это награда миссии
      if (this.addItem.need) {
        this.$store.getters.getWSByService('dialog_editor').socket.send(JSON.stringify({
          event: "AddActionItem",
          id: Number(this.addItem.id),
          item_type: this.addItem.item_type,
          item_id: Number(this.addItem.item_id),
          item_quantity: Number(this.addItem.item_quantity),
        }));
      } else {
        this.$store.getters.getWSByService('dialog_editor').socket.send(JSON.stringify({
          event: "AddMissionRewardItem",
          id: Number(this.addItem.id),
          item_type: this.addItem.item_type,
          item_id: Number(this.addItem.item_id),
          item_quantity: Number(this.addItem.item_quantity),
        }));
      }

      this.addItem = null;
    },
    RemoveItem() {
      //если need то это needItems иначе это награда миссии
      if (this.removeItem.need) {
        this.$store.getters.getWSByService('dialog_editor').socket.send(JSON.stringify({
          event: "RemoveActionItem",
          slot: Number(this.removeItem.number),
          id: Number(this.removeItem.id),
        }));
      } else {
        this.$store.getters.getWSByService('dialog_editor').socket.send(JSON.stringify({
          event: "RemoveMissionRewardItem",
          slot: Number(this.removeItem.number),
          id: Number(this.removeItem.id),
        }));
      }

      this.removeItem = null;
    }
  },
  computed: {
    editorData() {
      return this.$store.getters.getMissionEditorData
    },
    missions() {
      this.filterMissions = [];

      let missionData = this.editorData;

      for (let i in missionData.missions) {
        // проверка на фильтры
        let mission = missionData.missions[i]

        if (!(mission.id === Number(this.filter.id) || Number(this.filter.id) === 0)) {
          continue
        }

        if (!(mission.name.indexOf(this.filter.name) + 1 || this.filter.name === '')) {
          continue
        }

        mission.actions = this.getSortActions(mission);
        mission.rewardItems = this.editorData.rewardItems[mission.id];

        this.filterMissions.push(mission)
      }

      for (let mission of this.filterMissions) {
        if (this.selectMission && mission.id === this.selectMission.id) {
          this.selectMission = mission;
        }
      }

      return true
    },
  },
  components: {
    Input,
    AppItemCell: ItemCell,
  }
}
</script>

<style scoped>
#main {
  margin: auto;
  width: 1520px;
}

#filters {
  height: 50px;
  background: antiquewhite;
  border-radius: 5px;
  box-shadow: 0 0 2px 1px black;
  position: relative;
}

#createNewMissionBlock {
  position: absolute;
  padding-right: 10px;
  padding-top: 5px;
  padding-left: 10px;
  padding-bottom: 5px;
  height: 40px;
  right: 10px;
  top: 0;
  background: darkgrey;
  border-radius: 6px;
  box-shadow: 0 0 4px 1px black;
  width: 140px;
}

.filters_head {
  margin: 0 0 4px;
}

#filtersLine {
  float: left;
  padding-left: 10px;
  margin-top: 3px;
}

.mission {
  background: #d2cdc7;
  box-shadow: 0 0 5px black;
  border-radius: 10px;
  margin: 10px 0;
  padding: 4px;
}

.missionProp {
  font-size: 15px;
  text-align: left;
  line-height: 30px;
  width: 330px;
  float: left;
  background: azure;
  padding: 8px;
  border-radius: 5px;
  box-shadow: 0 0 5px black;
}

.missionProp label {
  display: block;
  width: 330px;
  height: 35px;
  font-size: 12px;
}

.missionProp label input, .missionProp label select, .missionProp label .rewardItems {
  float: right;
  text-align: center;
}


.mission h4 {
  margin: -5px 0 5px;
  padding: 0;
  text-align: left;
  color: white;
  text-shadow: 0 0 2px black;
  font-weight: 900;
  font-size: 20px;
}

.mission:after {
  content: '';
  clear: both;
  display: block;
}


.missionProp input {
  width: 40px;
}

.rewardItems {
  display: inline-block;
}

.rowAction {
  padding: 10px;
  background: bisque;
  box-shadow: 0 0 2px;
  margin-bottom: 10px;
  position: relative;
}

.rowAction textarea {
  border-radius: 5px;
  background: beige;
  box-shadow: 0 0 2px;
}

.rowAction h5 {
  margin: 10px 0 0;
}

.rowAction table input {
  width: 50px;
  text-align: center;
}

.rowAction table {
  width: 1115px;
}

.rowAction table td {
  text-align: center;
  border: 1px solid rgba(0, 0, 0, 0.2);
  font-weight: 900;
  font-size: 10px;
}

.rowAction label {
  margin: 2px;
  font-size: 12px;
  margin-bottom: 10px;
  display: block;
  width: 610px;
  clear: both;
  line-height: 20px;
}

.rowAction label input[type=text] {
  float: right;
  width: 515px;
}

.actionsProp {
  padding-left: 18px;
  float: right;
  width: 1135px;
}

.count {
  float: left;
  font-size: 20px;
  font-weight: 900;
  color: #ce3d3d;
  text-shadow: 0 0 1px black;
}

.addItemButton {
  border-radius: 5px;
  width: 25px;
  height: 25px;
  float: left;
  position: relative;
  box-shadow: 0 0 2px rgba(0, 0, 0, 1);
  border: 1px solid #959595;
  background-color: #4c4c4c;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  font-weight: 900;
  color: red;
  line-height: 27px;
  font-size: 25px;
}

.addItemButton:hover {
  color: yellow;
}

#RemoveItemDialog, #AddItemDialog {
  position: fixed;
  left: calc(50% - 100px);
  width: 200px;
  height: 100px;
  background: #8cb3c7;
  border-radius: 5px;
  box-shadow: 0 0 3px black;
  top: calc(50% - 50px);
}

#AddItemDialog {
  height: 153px;
}

#MissionList {
  height: 100vh;
  overflow-y: scroll;
  overflow-x: hidden;
}

.metaBlock {
  clear: both;
}

.rowAction {
  text-shadow: none;
  color: black;
  font-weight: bold;
}

#missionTable {
  width: 100%;
  border-spacing: 0;
}

#missionTable tr {
  background: grey;
}

#missionTable tr:hover {
  background: #a2a2a2;
}

#RemoveItemDialog, #AddItemDialog {
  position: fixed;
  left: calc(50% - 100px);
  width: 200px;
  height: 100px;
  background: #8cb3c7;
  border-radius: 5px;
  box-shadow: 0 0 3px black;
  top: calc(50% - 50px);
}

#AddItemDialog {
  height: 153px;
}
</style>
