<template>
  <div id="SquadHead">

    <div id="squadName">
      <span v-if="inventory.stateMS">Транспорт: </span>
      <span style="color: rgb(0, 255, 253);">{{inventory.squadName}}</span>
    </div>

    <div class="deleteButton" v-if="inventory.stateMS" @click="dialogRemoveSquad"/>
    <div class="renameButton" v-if="inventory.stateMS" @click="dialogRenameSquad"/>

    <div class="mask" v-if="dialogRemove || dialogRename"/>

    <div class="dialog" v-if="dialogRemove" ref="removeSquadDialog">

      <app-control v-bind:head="'Удалить отряд?'"
                   v-bind:move="false"
                   v-bind:close="false"
                   v-bind:refWindow="'removeSquadDialog'"/>

      <div class="msg">Удалить отряд?</div>

      <input type="button" value="Отмена" @click="dialogRemoveSquad">
      <input type="button" value="Удалить" style="float: right" @click="removeSquad">
    </div>

    <div class="dialog" v-if="dialogRename" id="renameSquadDialog" ref="renameSquadDialog">

      <app-control v-bind:head="'Изменить имя'"
                   v-bind:move="false"
                   v-bind:close="false"
                   v-bind:refWindow="'renameSquadDialog'"/>

      <input type="text" placeholder="новое имя" v-model="newName">

      <input type="button" value="Отмена" @click="dialogRenameSquad">
      <input type="button" value="Изменить" @click="renameSquad" style="float: right">

    </div>
  </div>
</template>

<script>
  import Control from '../Window/Control';

  export default {
    name: "HangarHead",
    components: {
      AppControl: Control,
    },
    data() {
      return {
        dialogRemove: false,
        dialogRename: false,
        newName: '',
      }
    },
    methods: {
      dialogRemoveSquad() {
        this.dialogRemove = !this.dialogRemove
      },
      dialogRenameSquad() {
        this.dialogRename = !this.dialogRename
      },
      removeSquad() {
        this.$store.getters.getWSByService('inventory').socket.send(JSON.stringify({
          event: "RemoveMotherShipBody",
          destination: "storage",
        }));
        this.dialogRemove = false
      },
      renameSquad() {
        this.$store.getters.getWSByService('inventory').socket.send(JSON.stringify({
          event: "RenameSquad",
          name: this.newName,
        }));
        this.dialogRename = false
      }
    },
    computed: {
      inventory() {
        return this.$store.getters.getInventory
      },
    },
  }
</script>

<style scoped>
  #SquadHead {
    height: 20px;
    width: calc(100% - 23px);
    margin: 0 0 4px 0;
    border-radius: 10px 100px 10px 10px;
    background-size: 100% 4px;
    background-image: linear-gradient(0deg, rgba(7, 41, 60, 0.6) 87%, rgba(0, 62, 95, 0.5) 30%);
    border: 1px solid rgba(0, 0, 0, 0.5);
    line-height: 21px;
    text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
  }

  #SquadHead #squadName {
    float: left;
    margin-left: 10px;
    color: #ff7800;
    line-height: 23px;
  }

  #SquadHead .deleteButton, #SquadHead .renameButton {
    height: 20px;
    width: 25px;
    background: url(../../assets/indexImg/throw.png) left center / contain no-repeat, linear-gradient(1deg, rgb(255, 105, 0), rgb(255, 0, 28) 6px);
    box-shadow: 0 0 5px rgba(0, 0, 0, 1);
    float: right;
    margin-right: 0;
    margin-top: 0;
    border-radius: 5px 100% 3px 5px;
    transition: 0.1s;
  }

  #SquadHead .renameButton {
    width: 20px;
    background: url(../../assets/indexImg/rename.png) left center / contain no-repeat, linear-gradient(1deg, rgb(255, 200, 0), rgb(255, 161, 0) 6px);
    border-radius: 5px;
    margin-right: 3px;
  }

  .dialog {
    position: absolute;
    z-index: 13;
    border-radius: 5px;
    width: 160px;
    height: 51px;
    border: 1px solid #25a0e1;
    background: rgb(8, 138, 210);
    padding: 20px 3px 3px 3px;
    box-shadow: 0 0 2px black;
    left: calc(50% - 80px);
    top: 30%;
  }

  .dialog input[type=button] {
    float: left;
    margin: 1px;
  }

  .dialog input[type=text] {
    float: left;
    margin: 4px;
  }

  .dialog .msg {
    background: #89969c;
    height: 22px;
    border-radius: 5px;
    box-shadow: inset 0 0 3px 0 black;
    padding: 5px;
    color: #ff7800;
  }

  .mask {
    position: absolute;
    background: rgba(0, 0, 0, 0.6);
    height: 100%;
    width: 100%;
    z-index: 3;
    left: 0;
    top: 0;
    border-radius: 5px;
  }

  #SquadHead .deleteButton:active {
    transform: scale(0.9);
  }

  #SquadHead .deleteButton:hover {
    background: url(../../assets/indexImg/throw.png) left center / contain no-repeat, linear-gradient(1deg, rgb(255, 207, 0), rgb(255, 150, 1) 6px);
  }

  #SquadHead .renameButton:active {
    transform: scale(0.9);
  }

  #SquadHead .renameButton:hover {
    background: url(../../assets/indexImg/rename.png) left center / contain no-repeat, linear-gradient(1deg, rgb(255, 222, 0), rgb(254, 255, 8) 6px);
  }

  #renameSquadDialog {
    height: 47px;
  }
</style>
