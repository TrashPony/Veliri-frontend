<template>
  <div id="main">
    <div id="dialogList" v-if="!selectDialog">
      <div id="filtersEditor" v-if="editorData">

        <h4>Фильтры:</h4>

        <div id="filtersLine">

          <label>
            ИД: <input type="number" placeholder="ИД" v-model="filter.id" min="0" style="width: 40px;">
          </label>

          <!--          <label>-->
          <!--            ИД задания: <input type="number" placeholder="ИД задания" v-model="filter.id"-->
          <!--                               style="width: 40px;" min="0" value="0">-->
          <!--          </label>-->

          <label>
            Имя: <input type="text" placeholder="Имя диалога" v-model="filter.name">
          </label>

          <label>Кому доступен:
            <select id="fraction" v-model="filter.fraction">
              <option value=""> Выкл.</option>
              <option value="All">Всем</option>
              <option value="Replics">Replics</option>
              <option value="Explores">Explores</option>
              <option value="Reverses">Reverses</option>
            </select>
          </label>

          <label> Тип:
            <select id="dialogType" v-model="filter.type">
              <option value="">Выкл.</option>
              <option value="greeting">Приветсвие базы</option>
              <option value="greeting_mining_installation">Приветсвие добывающей установки</option>
              <option value="greeting_mining_processing_plant">Приветсвие переработчика</option>
              <option value="greeting_prefabricated_plant">Приветсвие завода полуфабрикатов</option>
              <option value="greeting_fraction_special_base">Фракционной реликвии</option>
              <option value="greeting_capitol_fraction">Фракционная столицо</option>
              <option value="mission">Задание</option>
            </select>
          </label>

          <label> Где доступен:
            <select id="access_type" v-model="filter.access">
              <option value="">Выкл.</option>
              <option value="base">На базе</option>
              <option value="world">Везде</option>
            </select>
          </label>

        </div>

        <div id="createNewDialogBlock">
          <input type="text" placeholder="Имя нового диалога" v-model="newDialogName">
          <input type="button" value="Создать диалог" @click="CreateDialog()">
        </div>
      </div>

      <div id="dialogList2">
        <div class="DepartmentOfEmployment" v-for="dialog in dialogs">

          <h3 style="position: absolute;right: 7px;top: -17px;color: red;">
            ID: {{ dialog.id }}
          </h3>

          <h3 class="missionHead" style="width: 315px;">
            {{ dialog.name }} ({{ dialog.fraction + "-" + dialog.to_fraction }}, {{ dialog.access_type }})
          </h3>

          <div class="infoBlock">
            <div class="missionText">{{ dialog.pages && dialog.pages[1] ? dialog.pages[1].text : '' }}</div>
            <div id="rewardBlock">

              <template v-if="dialog.pages && dialog.pages[1] && getPictures(dialog.pages[1])">
                <div class="missionFace" v-for="(avatar, key) in avatars[dialog.pages[1].id]"
                     v-bind:style="{backgroundImage: 'url(\'' + avatar + '\')'}">
                  {{ key }}
                </div>
              </template>
            </div>
          </div>

          <div class="missionAsc" v-if="dialog.pages && dialog.pages[1]">
            <div class="asks" v-for="asc in dialog.pages[1].asc">
              <div class="wrapperAsk" v-html="asc.text"/>
            </div>
          </div>

          <div class="actions">
            <input type="button" value="Изменить" style="margin-left: 5px; float: left"
                   @click="selectDialog = dialog">
            <input type="button" value="Удалить" style="margin-right: 5px; float: right"
                   @click="DeleteDialog(dialog.id)">
          </div>
        </div>
      </div>
    </div>

    <div id="selectDialog" v-if="selectDialog && editorData">
      <div id="headSelectDialog">

        <input type="button" value="Назад" style="float: left; margin-left: 20px" @click="GetListDialogs()">
        <label> Название диалога:
          <input type="text" v-model="selectDialog.name">
        </label>

        <label> Где доступен:
          <select v-model="selectDialog.access_type">
            <option value="base">На базе</option>
            <option value="world">Везде</option>
          </select>
        </label>

        <label> Фракция:
          <select v-model="selectDialog.fraction">
            <option value="All">Всем</option>
            <option value="Replics">Replics</option>
            <option value="Explores">Explores</option>
            <option value="Reverses">Reverses</option>
          </select>
        </label>

        <label> для фракции:
          <select v-model="selectDialog.to_fraction">
            <option value="">-</option>
            <option value="Replics">Replics</option>
            <option value="Explores">Explores</option>
            <option value="Reverses">Reverses</option>
          </select>
        </label>

        <label> Тип:
          <select id="dialogType2" v-model="selectDialog.type">
            <option value="greeting">Приветсвие базы</option>
            <option value="greeting_mining_installation">Приветсвие добывающей установки</option>
            <option value="greeting_mining_processing_plant">Приветсвие переработчика</option>
            <option value="greeting_prefabricated_plant">Приветсвие завода полуфабрикатов</option>
            <option value="greeting_fraction_special_base">Фракционной реликвии</option>
            <option value="greeting_capitol_fraction">Фракционная столицо</option>
            <option value="mission">Задание</option>
          </select>
        </label>

        <input type="button" value="Сохранить" style="float: right; margin-right: 20px" @click="SaveDialog()">
      </div>

      <div id="pagesSelectDialog">
        <div class="page" v-for="page in selectDialog.pages"
             :style="{background: ascToPageID === page.number ? '#ffb700' : 'cadetblue'}">

          <span style="float: left">
            Одна картинка для всех:
            <input type="checkbox" title="onePicture" onclick="ChangePicOption(${page.id})">
          </span>

          <span style="float: right; line-height: 22px;">
            Номер страницы: <span style="color: #ecb416">{{ page.number }}</span><br>
            <input type="button" value="Удалить" @click="RemovePage(page.id)">
          </span>

          <input type="text" v-model="page.name" style="float: left; margin-top: 1px;">

          <input type="text" v-model="page.type" style="float: right; margin-top: 1px; width: 80px;">

          <input type="text" :value="page.id">
          <textarea class="pageText" v-model="page.text"></textarea>

          <div class="pictures">

            <template v-if="getPictures(page) && avatars[page.id]">

              <div class="missionFace" v-for="(ava, key) in avatars[page.id] "
                   v-bind:style="{backgroundImage: avatars[page.id] ? 'url(\'' + ava + '\')' : ''}">
                {{ key }}

                <label class="fileLoadLabel" :for="'pic' + key + page.id"> Загр.</label>
                <input style="visibility: hidden" type="file" :id="'pic' + key + page.id"
                       @change="SelectDialogFile($event, key, page.id)">
                <input type="button" value="del" @click="removePicDialog(key, page.id)">

              </div>

            </template>
          </div>

          <div class="ascs">
            <div class="asc" v-for="asc in page.asc" @mouseover="ascToPageID=asc.to_page" @mouseout="ascToPageID=-1">

              <input type="text" v-model="asc.text">
              <input type="number" v-model.number="asc.to_page">

              <select v-model="asc.type_action">
                <option value="">Ничего</option>
                <option value="close">Закрыть диалог</option>
                <option value="start_training">Начать обучение</option>
                <option value="miss_training">Пропустить обучение</option>
                <option value="get_base_greeting"> Взять диалог привествия</option>
                <option value="accept_mission"> Принять задание</option>
                <option value="get_reward"> Получить награду</option>
                <option value="get_base_mission"> Запросить задание на базе</option>
                <option value="end_action"> Завершить экшон</option>
              </select>
              <input type="button" value="Удалить" style=" float: right; margin-top: 2px;"
                     @click="RemoveAsc(page.id, asc.id)">
            </div>

            <div class="asc" @click="AddAsc(page.id)">Добавить ответ +</div>
          </div>
        </div>

        <div class="page" style="height: 18px; margin-bottom: 70px;" @click="AddPage()"> Добавить страницу</div>

      </div>
    </div>
  </div>
</template>

<script>
import urls from "../../const";
import Input from "../Chat/Input";

export default {
  name: "DialogsEditor",
  data() {
    return {
      selectDialog: null,
      avatars: {},
      avatarsReq: {},
      ascToPageID: 0,
      newDialogName: "",
      filter: {
        id: 0,
        name: "",
        fraction: "",
        type: "",
        access: "",
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
    GetListDialogs() {
      this.selectDialog = null;
      this.$store.getters.getWSByService('dialog_editor').socket.send(JSON.stringify({
        event: "OpenEditor"
      }));
    },
    CreateDialog() {
      if (this.newDialogName === "") {
        alert("Имя не может быть пустым");
        return
      }

      this.$store.getters.getWSByService('dialog_editor').socket.send(JSON.stringify({
        event: "CreateDialog",
        name: this.newDialogName,
      }));

      this.newDialogName = ""
    },
    DeleteDialog(dialogId) {
      this.$store.getters.getWSByService('dialog_editor').socket.send(JSON.stringify({
        event: "DeleteDialog",
        id: Number(dialogId),
      }));
    },
    getPictures(page) {
      let app = this;

      if (app.avatars[page.id] || app.avatarsReq[page.id]) {
        return true
      }

      app.avatarsReq[page.id] = true;
      app.$api.get(urls.dialogPicURL + '?dialog_page_id=' + page.id + "&user_id=" + '-1').then(function (response) {
        app.$set(app.avatars, page.id, response.data);
      });

      return true
    },
    SaveDialog() {
      this.$store.getters.getWSByService('dialog_editor').socket.send(JSON.stringify({
        event: "SaveDialog",
        dialog_json: JSON.stringify(this.selectDialog),
        pages_json: JSON.stringify(this.selectDialog.pages),
      }));
    },
    AddPage() {
      this.$store.getters.getWSByService('dialog_editor').socket.send(JSON.stringify({
        event: "AddPage",
        id: Number(this.selectDialog.id),
      }));
    },
    RemovePage(pageID) {

      for (let i in this.selectDialog.pages) {
        if (this.selectDialog.pages[i].id === pageID) {
          delete this.selectDialog.pages[i];
        }
      }

      this.SaveDialog();
    },
    AddAsc(pageID) {
      for (let i in this.selectDialog.pages) {
        if (this.selectDialog.pages[i].id === pageID) {

          if (!this.selectDialog.pages[i].asc) this.selectDialog.pages[i].asc = [];

          this.selectDialog.pages[i].asc.push({
            id: 0,
            name: "",
            text: "",
            to_page: 0,
            type_action: "",
          });
        }
      }

      this.SaveDialog();
    },
    RemoveAsc(pageID, ascID) {
      for (let i in this.selectDialog.pages) {
        if (this.selectDialog.pages[i].id === pageID) {
          let page = this.selectDialog.pages[i];
          for (let i in page.asc) {
            if (page.asc[i].id === Number(ascID)) {
              page.asc.splice(i, 1);
            }
          }
        }
      }

      this.SaveDialog();
    },
    removePicDialog(type, id_page) {
      let app = this;

      app.$store.getters.getWSByService('dialog_editor').socket.send(JSON.stringify({
        event: "SetPicture",
        file: "",
        fraction: type,
        id_page: id_page,
        id: app.selectDialog.id,
      }));

      setTimeout(function () {
        delete app.avatars[id_page]
        delete app.avatarsReq[id_page]
        app.getPictures({id: id_page})
      }, 500);
    },
    SelectDialogFile(e, type, id_page) {
      let app = this;
      if (e) {
        let file_reader = new FileReader(e.target.files[0]);
        file_reader.readAsDataURL(e.target.files[0]);
        file_reader.onload = function (evt) {
          app.$store.getters.getWSByService('dialog_editor').socket.send(JSON.stringify({
            event: "SetPicture",
            file: evt.target.result,
            fraction: type,
            id_page: id_page,
            id: app.selectDialog.id,
          }));
        };
      }

      setTimeout(function () {
        delete app.avatars[id_page]
        delete app.avatarsReq[id_page]
        app.getPictures({id: id_page})
      }, 500);
    }
  },
  computed: {
    editorData() {
      let dialogs = this.$store.getters.getDialogEditorData.dialogs;

      if (this.selectDialog) {
        this.selectDialog = dialogs[this.selectDialog.id]
      }

      return dialogs
    },
    dialogs() {
      let filterDialogs = [];

      let nooFilterDialogs = this.editorData;

      for (let i in nooFilterDialogs) {
        // проверка на фильтры
        let dialog = nooFilterDialogs[i]

        if (!(dialog.id === Number(this.filter.id) || Number(this.filter.id) === 0)) {
          continue
        }

        if (!(dialog.name.indexOf(this.filter.name) + 1 || this.filter.name === '')) {
          continue
        }

        if (!(dialog.fraction === this.filter.fraction || this.filter.fraction === '')) {
          continue
        }

        if (!(dialog.type === this.filter.type || this.filter.type === '')) {
          continue
        }

        if (!(dialog.access_type === this.filter.access || this.filter.access === '')) {
          continue
        }

        filterDialogs.push(dialog)
      }

      //console.log(filterDialogs)
      return filterDialogs
    },
  }
}
</script>

<style scoped>

body select {
  color: #ffc03d;
  font-weight: 900;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
}

#main {
  margin: auto;
  width: 1520px;
}

#dialogList2, #pagesSelectDialog {
  height: 100vh;
  overflow: scroll;
}

#dialogList .DepartmentOfEmployment {
  float: left;
  position: relative;
  left: unset;
  top: unset;
  margin-right: 10px;
  /* margin-top: 10px; */
  height: 390px;
  width: 480px;
  display: block;
  border-radius: 5px;
  z-index: 11;
  min-height: 100px;
  padding: 1px;
  color: #0cc2fb;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
  border: 1px solid #25a0e1;
  background: rgb(8, 138, 210);
  box-shadow: 0 0 2px black;
  margin-bottom: 50px;
}

#dialogList .DepartmentOfEmployment .actions {
  position: absolute;
  bottom: 2px;
  width: 100%;
}

.innerPicture {
  height: 60px;
  width: 62px;
  float: left;
  background-size: contain;
}

.Explores {
  box-shadow: inset 0 0 2px 3px greenyellow;
}

.Replics {
  box-shadow: inset 0 0 2px 3px red;
}

.Reverses {
  box-shadow: inset 0 0 2px 3px blue;
}

#selectDialog {
  font-size: 12px;
}

#pagesSelectDialog > div {
  padding: 9px;
  float: left;
  position: relative;
  left: unset;
  top: unset;
  margin-right: 10px;
  margin-top: 10px;
  display: block;
  border-radius: 5px;
  z-index: 11;
  width: 420px;
  height: 500px;
  border: 1px solid #25a0e1;
  background: cadetblue;
  color: #0cc2fb;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
}

#pagesSelectDialog > div:hover {
  box-shadow: 0 0 3px 1px white;
}

#pagesSelectDialog textarea {
  width: 70%;
  float: left;
  height: 240px;
  border-radius: 5px;
  background: beige;
  box-shadow: 0 0 2px;
  margin: 4px 6px 6px;
}

#pagesSelectDialog .pictures {
  float: right;
  height: 248px;
  width: 92px;
  margin: 5px;
  border-radius: 5px;
  background: darkgray;
  box-shadow: 0 0 4px black;
}

.ascs {
  clear: both;
  overflow-y: scroll;
  background: beige;
  padding: 6px;
  border-radius: 5px;
  box-shadow: 0 0 5px black;
  height: 172px;
}

.ascs .asc {
  margin: 5px;
  background: grey;
  border-radius: 5px;
  box-shadow: inset 0 0 3px black;
  padding: 6px;
}

.ascs .asc:hover {
  box-shadow: inset 0 0 3px 1px white;
}

.ascs .asc:after {
  content: '';
  clear: both;
  display: block;
}

.ascs .asc input[type="text"] {
  float: left;
  width: 300px;
  margin-right: 5px;
}

.ascs .asc input[type="number"] {
  float: left;
  width: 25px;
  margin-right: 5px;
}

.ascs .asc select {
  margin-top: 3px;
  float: left;
}

.pic {
  height: 83px;
  width: 93px;
  position: relative;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.pic label {
  position: absolute;
  bottom: 10px;
  outline: none;
  padding-left: 5px;
  padding-right: 5px;
  line-height: 18px;
  box-shadow: inset 0 0 2px black;
  border: 0;
  font-size: 11px;
  background: #79a0b4;
  border-radius: 5px;
  color: #ff7800;
  left: 6px;
  opacity: 0.3;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
}

.pic label:hover {
  opacity: 1;
}

.pic input {
  display: none;
}

#headSelectDialog {
  padding-top: 15px;
  height: 35px;
  background: antiquewhite;
  border-radius: 5px;
  box-shadow: 0 0 2px 1px black;
  position: relative;
  color: #0cc2fb;
  margin-top: 4px;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
}

#filtersEditor {
  height: 50px;
  background: antiquewhite;
  border-radius: 5px;
  box-shadow: 0 0 2px 1px black;
  position: relative;
}

#createNewDialogBlock, #createNewMissionBlock {
  position: absolute;
  padding-right: 10px;
  padding-top: 5px;
  padding-left: 10px;
  padding-bottom: 5px;
  height: 40px;
  right: 0;
  top: 0;
  background: darkgrey;
  border-radius: 6px;
  box-shadow: 0 0 4px 1px black;
  width: 140px;
}

#filtersEditor h4 {
  padding: 4px 4px 0;
  text-align: left;
  margin: 4px 0 0;
}

#filtersLine {
  float: left;
  padding-left: 10px;
  margin-top: 3px;
}

.mission {
  background: #d2cdc7;
  padding: 10px;
  box-shadow: 0 0 5px black;
  border-radius: 10px;
  margin: 10px 0;
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
  font-size: 11px;
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
  border: 1px solid rgb(0, 0, 0);
  padding: 10px;
  background: bisque;
  box-shadow: 0 0 3px;
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
  font-size: 15px;
}

.actionsProp {
  padding-left: 18px;
  float: right;
  width: 1135px;
}

.count {
  float: left;
  font-size: 26px;
  font-weight: 900;
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

.missionText {
  padding: 5px;
  word-wrap: break-word;
  border-radius: 5px 5px 0 0;
  text-align: justify;
  margin: auto auto 2px 0;
  width: 343px;
  height: 260px;
  float: left;
  box-shadow: inset 0 0 3px black;
  background: linear-gradient(
    0deg, transparent 60%, rgba(0, 0, 0, 0.05) 21%), #adc6cd;
  background-size: 10px 3px;
  color: #000000;
  font-size: 13px;
  text-indent: 1.5em;
  overflow-y: scroll;
  text-shadow: none;
  font-weight: 900;
}

.missionAsc {
  padding: 5px;
  word-wrap: break-word;
  overflow-y: auto;
  border-radius: 0 0 5px 5px;
  text-align: center;
  margin: auto auto 0 0;
  width: calc(100% - 10px);
  height: 50px;
  text-shadow: #28a5e4 0 0 4px;
  font-family: sans-serif;
  font-size: 11pt;
  float: left;
  box-shadow: inset 0 0 3px black;
  background: linear-gradient(
    0deg, transparent 60%, rgba(0, 0, 0, 0.05) 21%), #adc6cd;
  background-size: 10px 3px;
}

.missionHead {
  font-size: 10px;
  color: white;
}

.missionFace {
  height: 60px;
  width: 60px;
  background: rgba(0, 0, 0, 0.3);
  box-shadow: inset 0 0 2px 2px black, 0 0 2px black;
  background-size: cover;
  border-radius: 5px;
  margin-left: 2px;
  float: left;
  font-size: 12px;
  color: white;
}

.wrapperAsk {
  color: black;
}

.fileLoadLabel {
  font-size: 8px;
}
</style>
