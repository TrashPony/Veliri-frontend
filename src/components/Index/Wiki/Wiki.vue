<template>
  <div id="wiki">
    <div id="mainWrapper">

      <app-control v-bind:head="'Wiki'" v-bind:move="false" v-bind:close="false"/>

      <div class="main_menu">
        <div v-bind:class="{active: tab===''}" @click="toPath('')">Содержание</div>
      </div>

      <section class="section">
        <router-view/>
      </section>
    </div>
  </div>
</template>

<script>
import Control from '../../Window/Control';

export default {
  name: "Wiki",
  data() {
    return {
      tab: '',
    }
  },
  methods: {
    toPath(path) {
      this.tab = path;
      this.$router.push({path: `/wiki/${path}`});
    },
    getUrlImg(imgName, format) {
      return require('../../../assets/indexImg/index_detail/' + imgName + '.' + format)
    }
  },
  components: {
    AppControl: Control,
  }
}
</script>

<style scoped>
#wiki {
  padding: 0;
  margin: 0 0 40px 0;
  text-align: justify;
  text-shadow: 0 0 2px #343434, 2px 1px 0 hsl(0, 0%, 27%), 2px 1px 1px hsl(0, 0%, 23%), 1px 1px 2px hsl(80, 10%, 15%);
  color: white;
  font-size: 12px;
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

.section {
  box-shadow: inset 0 0 3px rgb(0, 0, 0);
  border-radius: 0 0 5px 5px;
  padding: 1px 10px 10px;
  text-indent: 1.5em; /* Отступ первой строки */
  background: rgba(111, 111, 111, 0.70);
  position: relative;
  transition: 200ms;
}
</style>

<style>
#wiki .headSection {
  color: #ffc588;
  font-size: 14px;
}

#wiki .features p {
  margin: 0;
}

#wiki .head {
  margin: 0 0 7px;
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
  margin-top: 10px;
}

#wiki .content_button {
  text-indent: 5px;
  pointer-events: auto;
  text-align: left;
  transition: .1s;
  box-shadow: 0 0 2px #000;
  height: 15px;
  width: 200px;
  background: rgba(255, 129, 0, .75);
  border-radius: 5px;
  color: #fff;
  cursor: pointer;
  font-size: 10px;
  line-height: 16px;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

#wiki .content_button.sub {
  background: rgba(243, 129, 11, 0.5);
}

#wiki .content_button:active {
  transform: scale(.98);
}

#wiki .content_button:hover {
  background: #ff8100;
}

#wiki .content_list li {
  margin-bottom: 5px;
}

#wiki .detailImg {
  border-radius: 3px;
  background-size: cover;
  filter: drop-shadow(0 0 3px black);
}

#wiki .content_section {
  position: relative;
  clear: both;
}

#wiki .content_section:after {
  content: ' ';
  clear: both;
  display: block;
}

#wiki .imageLi:after {
  content: ' ';
  clear: both;
  display: block;
}

#wiki .imageLi {
  clear: both;
  margin-bottom: 5px;
}

#wiki a {
  color: #0cfdff;
  text-decoration: none;
}

#wiki a:hover {
  text-decoration: underline;
  color: #ffc588;
}
</style>
