<template>
  <div class="modalBlock" :id="windowID" :ref="windowID" @mousedown="toUp" v-if="notify">
    <app-control v-bind:head="'Наблюдение'" v-bind:move="true" v-bind:close="true" v-bind:refWindow="windowID"/>
    <div>
      <div class="notifyModalText">
        <v-runtime-template :template="notify.text"/>
      </div>
      <div>
        <input value="Закрыть" type="button" @click="closeWindow">
      </div>
    </div>
  </div>
</template>

<script>
  import Control from '../Window/Control';
  import VRuntimeTemplate from "v-runtime-template";

  export default {
    name: "ModalNotify",
    props: ['notify', 'windowID'],
    methods: {
      toUp() {
        this.$store.commit({
          type: 'setWindowZIndex',
          id: this.$el.id,
        });
      },
      closeWindow() {
        this.$store.getters.getWSByService('chat').socket.send(JSON.stringify({
          event: "DeleteNotify",
          uuid: this.$props.notify.uuid,
        }));

        this.$store.commit({
          type: 'toggleWindow',
          id: this.$el.id,
          component: '',
        });
      },
      openHelpPageByName(name) {
        this.$store.commit({
          type: 'toggleWindow',
          id: 'helpWrapper',
          meta: {name: name},
          forceOpen: true,
        });
      }
    },
    components: {
      AppControl: Control,
      VRuntimeTemplate,
    }
  }
</script>

<style scoped>
  .modalBlock {
    position: absolute;
    display: block;
    border-radius: 5px;
    width: 300px;
    height: 200px;
    border: 1px solid #25a0e1;
    background: rgb(8, 138, 210);
    top: 15%;
    left: calc(50% - 150px);
    z-index: 11;
    padding: 20px 1px 1px 1px;
    box-shadow: 0 0 3px black;
  }

  .notifyModalText {
    padding: 5px 10px;
    word-wrap: break-word;
    overflow-y: scroll;
    border-radius: 5px;
    width: calc(100% - 20px);
    height: 165px;
    box-shadow: inset 0 0 3px black;
    background: linear-gradient(0deg, transparent 60%, rgba(0, 0, 0, 0.05) 21%), #adc6cd;
    background-size: 100% 3px;
    text-align: justify;
    font-size: 12px;
    font-weight: 900;
    text-indent: 1.5em;
  }

  .modalBlock input {
    margin: 3px auto;
    width: calc(100% - 6px);
    background: rgb(221, 112, 52);
    box-shadow: inset 0 0 4px 0 white;
    color: rgba(255, 255, 255, 0.8);
    display: block;
  }

  .modalBlock input:hover {
    background: rgb(255, 143, 53);
    box-shadow: inset 0 0 4px 0 #ffe3ad;
  }

  .modalBlock input:active {
    transform: scale(0.98);
  }


</style>
<style>
  .notifyModalText a {
    color: #32f2ff;
    font-weight: 900;
    text-indent: 15px;
    text-align: justify;
    margin: 4px 0;
    text-decoration: none;
    cursor: pointer;
    text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
  }
</style>
