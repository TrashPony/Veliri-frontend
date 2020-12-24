<template>
  <div id="mainPageWrapper">

    <div class="dialog" id="dialog" v-if="dialog">
      <app-control v-bind:head="'Внимание!'" v-bind:move="true" v-bind:close="false" v-bind:refWindow="'dialog'"/>
      <p>Вы собираетесь открыть страницу которая весит 200мб, вы уверены?</p>
      <div class="button" @click="dialog=false">нет</div>
      <div class="button" @click="tab='detail'; dialog=false;">да</div>
    </div>

    <main>

      <div id="mainWrapper">

        <app-control v-bind:head="'Veliri'" v-bind:move="false" v-bind:close="false"/>

        <div class="main_menu">
          <div v-bind:class="{active: tab==='about_game'}" @click="tab='about_game'">О игре</div>
          <!--              <div v-bind:class="{active: tab==='gallery'}" @click="tab='gallery'">Галерея</div>-->
          <div v-bind:class="{active: tab==='prehistory'}" @click="tab='prehistory'">Предыстория</div>
          <div v-bind:class="{active: tab==='require'}" @click="tab='require'">Системные требования</div>
          <div v-bind:class="{active: tab==='authors'}" @click="tab='authors'">Авторы и ресурсы</div>
          <div v-bind:class="{active: tab==='detail'}" @click="dialog=true">Подробно (<span
            class="danger">ВНИМАНИЕ!</span> странице весит
            <span class="danger">200мб</span> ¯\_(ツ)_/¯)
          </div>
        </div>

        <section>
          <div class="wrapperSection">
            <app-about-game v-if="tab==='about_game'"/>
            <app-prehistory v-if="tab==='prehistory'"/>
            <app-gallery v-if="tab==='gallery'"/>
            <app-necessary-requirements v-if="tab==='require'"/>
            <app-authors v-if="tab==='authors'"/>
            <app-detail v-if="tab==='detail'"/>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script>
import Control from '../Window/Control';
import AboutGame from './AboutGame';
import Prehistory from './Prehistory';
import Gallery from './Gallery';
import NecessaryRequirements from './NecessaryRequirements';
import Authors from './Authors';
import Detail from './Detail';

export default {
  name: "Main",
  data() {
    return {
      tab: 'about_game',
      dialog: false,
    }
  },
  methods: {
    to(url) {
      this.$router.push(url)
    }
  },
  components: {
    AppControl: Control,
    AppAboutGame: AboutGame,
    AppPrehistory: Prehistory,
    AppNecessaryRequirements: NecessaryRequirements,
    AppAuthors: Authors,
    AppGallery: Gallery,
    AppDetail: Detail,
  }
}
</script>

<style scoped>
#mainPageWrapper {
  padding: 0;
  margin: 0 0 40px 0;
  text-align: justify;
  text-shadow: 0 0 2px #343434, 2px 1px 0 hsl(0, 0%, 27%), 2px 1px 1px hsl(0, 0%, 23%), 1px 1px 2px hsl(80, 10%, 15%);
  color: white;
  /*display: flex;*/
  /*flex-direction: column;*/
  /*height: 100%;*/
}

.danger {
  color: #bf4e4e;
  text-shadow: 0 -1px 1px #000, 0 -1px 1px #000, 0 1px 1px #000, 0 1px 1px #000, -1px 0 1px #000, 1px 0 1px #000, -1px 0 1px #000, 1px 0 1px #000, -1px -1px 1px #000, 1px -1px 1px #000, -1px 1px 1px #000, 1px 1px 1px #000, -1px -1px 1px #000, 1px -1px 1px #000, -1px 1px 1px #000, 1px 1px 1px #000;
}

.dialog {
  position: absolute;
  border-radius: 5px;
  width: 200px;
  z-index: 950;
  top: 30%;
  left: calc(50% - 100px);
  border: 1px solid #25a0e1;
  background: rgb(8, 138, 210);
  padding: 20px 3px 3px 3px;
  height: 90px;
  box-shadow: 0 0 2px 1px black;
}

.dialog p {
  font-size: 12px;
}

.dialog .button {
  display: block;
  width: 33%;
  margin: 2px auto 0;
  pointer-events: auto;
  font-size: 9px;
  text-align: center;
  transition: 100ms;
  background: rgba(255, 129, 0, 0.6);
  height: 16px;
  border-radius: 5px;
  color: #fff;
  line-height: 15px;
  box-shadow: 0 0 2px #000;
  float: left;
  margin-left: 15px;
}

.dialog .button:last-child {
  float: right;
  margin-right: 15px;
}

.dialog .button:hover {
  background: rgba(255, 129, 0, 1);
}

.dialog .button:active {
  transform: scale(0.98);
}

#mainWrapper {
  width: 1100px;
  margin: auto;
  margin-top: 50px;
  margin-bottom: 25px;
  padding: 5px;
  padding-top: 30px;
  border-radius: 5px;
  position: relative;
  border-bottom: 1px solid rgba(37, 160, 225, 0.75);
  background: rgba(8, 138, 210, 0.75);
  box-shadow: 0 0 2px #000;
}

.main_menu {
  min-height: 15px;
  width: calc(100%);
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px 3px 0 0;
  overflow: hidden;
}

.main_menu div {
  height: 15px;
  float: left;
  font-size: 9px;
  font-weight: 900;
  line-height: 15px;
  border-right: 1px solid rgba(191, 191, 191, 0.43);
  padding: 0 3px;
  color: #bfbfbf;
  text-shadow: 1px 1px black;
  cursor: pointer;
  transition: 200ms;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.main_menu .active {
  color: #fff200 !important;
  background: rgb(187, 93, 42) !important;
}

.main_menu div:hover {
  color: #fff200 !important;
}

.wrapperSection {
  box-shadow: inset 0 0 3px rgb(0, 0, 0);
  border-radius: 0 0 5px 5px;
  padding: 1px 10px;
  text-indent: 1.5em; /* Отступ первой строки */
  background: rgba(111, 111, 111, 0.70);
  position: relative;
  transition: 200ms;
}

@media (max-width: 1122px) {
  #mainWrapper {
    width: calc(100% - 14px);
  }
}

@media (max-width: 380px) {
  .main_menu div {
    float: none;
  }
}
</style>
