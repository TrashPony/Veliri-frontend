<template>
  <div>
    <app-map-pin v-if="subMenuProps" v-bind:subMenuProps="subMenuProps"/>
    <div id="GlobalViewMap" ref="GlobalViewMap" v-if="worldMap.maps">

      <app-control v-bind:head="'Карта мира'"
                   v-bind:move="true"
                   v-bind:close="true"
                   v-bind:resizeFunc="resize"
                   v-bind:minSize="{height: 300, width: 400}"
                   v-bind:refWindow="'GlobalViewMap'"/>


      <div id="GlobalMapWrapper" ref="GlobalMapWrapper" v-dragscroll @wheel.stop="wheelZoom">

        <div class="buttons">
          <div @mousedown="scaling(1)" @mouseup="zoomChange = false"
               style="background-image: url('https://img.icons8.com/material-sharp/24/000000/plus-math.png')"></div>
          <div @mousedown="scaling(-1)" @mouseup="zoomChange = false"
               style="background-image: url('https://img.icons8.com/material-sharp/24/000000/minus-math.png')"></div>
        </div>

        <canvas id="GlobalMapCanvas" ref="GlobalMapCanvas"/>
        <canvas id="GlobalMapPathCanvas" ref="GlobalMapPathCanvas"/>

        <div class="GridBox" :style="{height: (sizeMap.y * gridSize) + 'px', width: (sizeMap.x * gridSize) + 'px'}">

          <div class="MapPoint" v-for="mapsPoint in mapsPoints"
               :style="{left: mapsPoint.x + 'px', top: mapsPoint.y + 'px'}"
               @mousemove="openSubMenu($event, mapsPoint.map, false)"
               @mouseout="mapPointMouseOut()"
               @mouseover="previewPath(mapsPoint.map.id)"
               @mousedown="openSubMenu($event, mapsPoint.map, true)"
               v-bind:class="{User: mapsPoint.map.id === worldMap.userMapID}"
               :ref="'map' + mapsPoint.map.id">

            <div class="count_defenders" v-if="!mapsPoint.map.possible_battle && !mapsPoint.map.free_land">
              {{ defenders[mapsPoint.map.id] ? defenders[mapsPoint.map.id] : "" }}
            </div>

            <div class="animateAura"
                 v-bind:class="{animate: mapsPoint.map.id === worldMap.userMapID, battleMap: mapsPoint.map.possible_battle}"
                 @mouseout="clearPath('GlobalMapPathCanvas')"></div>

            <div class="fractionIcon" v-if="!mapsPoint.map.free_land"
                 :style="{backgroundImage: 'url(' + require('../../assets/' + fractionLogo(mapsPoint.map.fraction)) + ')'}"/>

            <div class="fractionIcon" v-if="mapsPoint.map.free_land"
                 style="background-image: url('https://img.icons8.com/flat_round/64/000000/self-destruct-button--v1.png')"/>


            <div class="sectorName">{{ mapsPoint.map.Name }}</div>

            <div class="battle" v-if="mapsPoint.map.battle"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Control from '../Window/Control';
import MapPin from './MapPin';
import {dragscroll} from 'vue-dragscroll'

export default {
  name: "GlobalMap",
  directives: {
    'dragscroll': dragscroll
  },
  data() {
    return {
      gridSize: 35,
      initUser: false,
      zoomChange: false,
      whellTimeOut: false,
      subMenuProps: null,
      updater: null,
      actialPath: null,
      sizeMap: {
        x: 0,
        y: 0,
      }
    }
  },
  destroyed() {
    if (this.updater) clearInterval(this.updater);
  },
  created() {
    let app = this;
    app.updater = setInterval(function () {
      app.$store.getters.getWSByService('chat').socket.send(JSON.stringify({
        event: "openMapMenu",
      }));
    }, 1000);
  },
  methods: {
    toUp() {
      this.$store.commit({
        type: 'setWindowZIndex',
        id: this.$el.id,
      });
    },
    resize(event, ui, el) {
      let GlobalMapWrapper = $('#GlobalMapWrapper');
      GlobalMapWrapper.css("height", el.height());
      GlobalMapWrapper.css("width", el.width());
    },
    mapPointMouseOut() {
      this.$store.commit({
        type: 'setPreviewPath',
        previewPath: null,
      });

      this.actialPath = null;

      if (this.subMenuProps && this.subMenuProps.active) {
        return
      }

      this.subMenuProps = null;
    },
    openSubMenu(event, map, active) {
      let app = this;

      if (app.subMenuProps && app.subMenuProps.active) {
        return
      }

      app.subMenuProps = {
        x: event.pageX + 20,
        y: event.pageY + 20,
        map: map,
        active: active,
      };

      this.$store.getters.getWSByService('chat').socket.send(JSON.stringify({
        event: "getMapInfo",
        id: Number(map.id)
      }));
    },
    previewPath(mapID) {
      this.clearPath('GlobalMapPathCanvas')
      this.$store.getters.getWSByService('chat').socket.send(JSON.stringify({
        event: "previewPath",
        id: Number(mapID)
      }));
    },
    wheelZoom(e, cancel) {
      let app = this;
      e.preventDefault();
      if (cancel) return;

      if (app.whellTimeOut) return;
      app.whellTimeOut = true;

      let updater = setInterval(function () {
        if (!app.whellTimeOut) clearInterval(updater);
        app.scaleAndScroll((e.deltaY / 50) * -1);
      }, 16);

      setTimeout(function () {
        app.whellTimeOut = false;
      }, 320)
    },
    scaling(change) {
      let app = this;
      app.zoomChange = true;
      let zoomer = setInterval(function () {
        if (app.zoomChange) {
          app.scaleAndScroll(change);
        } else {
          clearInterval(zoomer);
        }
      });
    },
    scaleAndScroll(change) {
      let app = this;

      if (app.gridSize + change < 15) {
        return
      } else if (app.gridSize + change > 150) {
        return
      } else {
        app.gridSize += change;
      }

      app.actialPath = null;
      app.DrawMaps('GlobalMapCanvas', app.maps, true);

      let scrollWidth = app.$refs['GlobalMapWrapper'].scrollWidth;
      let scrollHeight = app.$refs['GlobalMapWrapper'].scrollHeight;
      let oldScrollX = app.$refs['GlobalMapWrapper'].scrollLeft;
      let oldScrollY = app.$refs['GlobalMapWrapper'].scrollTop;

      setTimeout(function () {
        app.setMapPosition(oldScrollX, oldScrollY, scrollWidth, scrollHeight)
      })
    },
    setMapPosition(oldScrollX, oldScrollY, oldScrollWidth, oldScrollHeight) {
      // функция сохраняет положение x, y на текущем положение
      let scrollWidth = this.$refs['GlobalMapWrapper'].scrollWidth;
      let scrollHeight = this.$refs['GlobalMapWrapper'].scrollHeight;

      let differentWidth = scrollWidth - oldScrollWidth;
      let percentXScroll = oldScrollX / oldScrollWidth * 100;
      let xScrollOffset = percentXScroll * differentWidth / 100;

      let differentHeight = scrollHeight - oldScrollHeight;
      let percentYScroll = oldScrollY / oldScrollHeight * 100;
      let yScrollOffset = percentYScroll * differentHeight / 100;

      if (differentWidth > 0) {
        this.$refs['GlobalMapWrapper'].scrollLeft = oldScrollX + xScrollOffset + 4;
        this.$refs['GlobalMapWrapper'].scrollTop = oldScrollY + yScrollOffset + 4;
      } else {
        this.$refs['GlobalMapWrapper'].scrollLeft = oldScrollX + xScrollOffset - 4;
        this.$refs['GlobalMapWrapper'].scrollTop = oldScrollY + yScrollOffset - 4;
      }
    },
    fractionLogo(fraction) {
      if (fraction === '') {
        fraction = 'Free'
      }
      return 'logo/' + fraction + '.png'
    },
    setCanvasSize(ref, pathSize) {
      let app = this;

      app.$refs[ref].width = 0;
      app.$refs[ref].height = 0;

      if (pathSize) {
        app.$refs['GlobalMapPathCanvas'].width = 0;
        app.$refs['GlobalMapPathCanvas'].height = 0;
      }

      app.$refs[ref].width = app.$refs['GlobalMapWrapper'].scrollWidth;
      app.$refs[ref].height = app.$refs['GlobalMapWrapper'].scrollHeight;

      if (pathSize) {
        app.$refs['GlobalMapPathCanvas'].width = app.$refs['GlobalMapWrapper'].scrollWidth;
        app.$refs['GlobalMapPathCanvas'].height = app.$refs['GlobalMapWrapper'].scrollHeight;
      }
    },
    DrawMaps(ref, maps, pathSize) {
      let app = this;
      if (!maps) return;

      let wait = setInterval(function () {
        if (app.$refs && app.$refs.hasOwnProperty(ref)) {
          clearInterval(wait);

          app.setCanvasSize(ref, pathSize || !app.initUser);

          if (app.$refs['map' + app.worldMap.userMapID] && app.$refs['map' + app.worldMap.userMapID][0]) {
            if (!app.initUser) {
              app.initUser = true;
              app.$refs['map' + app.worldMap.userMapID][0].scrollIntoView({block: "center", behavior: "smooth"});
            }
          }

          app.CanvasGrid(ref);
          app.CanvasGlobalLine(ref, maps);
          app.CanvasGlobalArrow(ref, maps);
        }
      });
    },
    CanvasGrid(ref) {
      let app = this;
      let canvas = app.$refs[ref];
      const ctx = canvas.getContext('2d');

      ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";
      ctx.lineWidth = 1;

      for (let cell of app.grid) {
        ctx.strokeRect(cell.left, cell.top, cell.width, cell.height);
      }
    },
    CanvasGlobalLine(ref, maps) {
      for (let i in maps) {
        for (let j in maps[i].handlers_coordinates) {
          if (maps[i].handlers_coordinates[j].handler === 'sector') {

            let mp = this.getMapByID(maps, maps[i].handlers_coordinates[j].to_map_id);
            if (!mp) continue;

            let xCell = (maps[i].x_global * this.gridSize) + this.gridSize / 2;
            let yCell = (maps[i].y_global * this.gridSize) + this.gridSize / 2;

            let toX = (mp.x_global * this.gridSize) + this.gridSize / 2;
            let toY = (mp.y_global * this.gridSize) + this.gridSize / 2;

            this.CanvasGlobalLineXY_To_XY(ref, xCell, yCell, toX, toY);
          }
        }
      }
    },
    CanvasGlobalArrow(ref, maps) {
      for (let i in maps) {
        let xCell = (maps[i].x_global * this.gridSize) + this.gridSize / 2;
        let yCell = (maps[i].y_global * this.gridSize) + this.gridSize / 2;

        for (let j in maps[i].handlers_coordinates) {
          if (maps[i].handlers_coordinates[j].handler === 'sector') {

            let mp = this.getMapByID(maps, maps[i].handlers_coordinates[j].to_map_id);
            if (!mp) continue;

            let toX = (mp.x_global * this.gridSize) + this.gridSize / 2;
            let toY = (mp.y_global * this.gridSize) + this.gridSize / 2;
            this.CanvasArrowPath(ref, xCell, yCell, toX, toY);
          }
        }
      }
    },
    CanvasArrowPath(ref, startX, startY, endX, endY, headLength = 7) {
      let canvas = this.$refs[ref];
      const ctx = canvas.getContext('2d');

      let points = [];

      let time = Math.max(Math.abs(startX - endX), Math.abs(startY - endY));//для повышения точности выбираем что сильнее изменилось, для ускорения выбор наоборот min
      for (let i = 0; i <= time; i++) {
        let delta = i / time;
        let a = delta * (endX - startX) + startX;
        let b = delta * (endY - startY) + startY;
        points.push({x: a, y: b});
      }

      let pointNumber = Math.round((points.length / 100) * 40);
      let centerPathX = points[pointNumber].x;
      let centerPathY = points[pointNumber].y;

      ctx.strokeStyle = "#02ff0e";
      ctx.lineWidth = 3;
      ctx.shadowColor = 'black';
      ctx.shadowBlur = 2;

      // constants (could be declared as globals outside this function)
      let PI = Math.PI;
      let degreesInRadians225 = 225 * PI / 180;
      let degreesInRadians135 = 135 * PI / 180;

      // calc the angle of the line
      let dx = endX - startX;
      let dy = endY - startY;
      let angle = Math.atan2(dy, dx);

      // calc arrowhead points
      let x225 = centerPathX + headLength * Math.cos(angle + degreesInRadians225);
      let y225 = centerPathY + headLength * Math.sin(angle + degreesInRadians225);
      let x135 = centerPathX + headLength * Math.cos(angle + degreesInRadians135);
      let y135 = centerPathY + headLength * Math.sin(angle + degreesInRadians135);

      ctx.beginPath();

      ctx.moveTo(points[pointNumber + 1].x, points[pointNumber + 1].y);
      ctx.lineTo(centerPathX, centerPathY);

      ctx.moveTo(centerPathX, centerPathY);
      ctx.lineTo(x225, y225);
      // draw partial arrowhead at 135 degrees
      ctx.moveTo(centerPathX, centerPathY);
      ctx.lineTo(x135, y135);
      // stroke the line and arrowhead
      ctx.stroke();
    },
    CanvasGlobalLineXY_To_XY(ref, startX, startY, endX, endY) {
      let canvas = this.$refs[ref];
      const ctx = canvas.getContext('2d');

      ctx.strokeStyle = "rgba(127, 127, 127, 0.1)";
      ctx.lineWidth = 3;
      ctx.shadowBlur = 1;
      ctx.shadowColor = 'white';

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    },
    getMapByID(maps, id) {
      for (let i in maps) {
        if (maps[i].id === id) {
          return maps[i]
        }
      }
    },
    PreviewMapPath(path) {
      let app = this;
      let wait = setInterval(function () {
        if (app.$refs && app.$refs.hasOwnProperty('GlobalMapPathCanvas')) {

          clearInterval(wait);
          for (let i in path) {
            let xCell = (path[i].Map.x_global * app.gridSize) + app.gridSize / 2;
            let yCell = (path[i].Map.y_global * app.gridSize) + app.gridSize / 2;

            if (path.hasOwnProperty(Number(i) + 1)) {
              let toX = (path[Number(i) + 1].Map.x_global * app.gridSize) + app.gridSize / 2;
              let toY = (path[Number(i) + 1].Map.y_global * app.gridSize) + app.gridSize / 2;
              app.CanvasGlobalPathXY_To_XY(xCell, yCell, toX, toY)
            }
          }
        }
      }, 100);
    },
    CanvasGlobalPathXY_To_XY(startX, startY, endX, endY) {
      let canvas = this.$refs['GlobalMapPathCanvas'];
      const ctx = canvas.getContext('2d');

      ctx.strokeStyle = "rgb(227,152,22)";
      ctx.lineWidth = 5;
      ctx.shadowBlur = 1;
      ctx.shadowColor = 'black';

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    },
    clearPath(ref) {
      let app = this;
      let wait = setInterval(function () {
        if (app.$refs && app.$refs.hasOwnProperty(ref)) {
          clearInterval(wait);

          let canvas = app.$refs[ref];
          const ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }, 100)
    },
    equalsPath(newPath) {
      if (this.actialPath === null || this.actialPath.length !== newPath.length) {
        return false
      }

      for (let i in this.actialPath) {
        if (this.actialPath.hasOwnProperty(i)) {
          if (!newPath.hasOwnProperty(i) || newPath[i].ID !== this.actialPath[i].ID) {
            return false
          }
        }
      }

      return true
    },
  },
  computed: {
    worldMap() {
      let state = this.$store.getters.getWorldMapState;
      this.DrawMaps('GlobalMapCanvas', this.maps);

      if (state.previewPath !== null) {
        if (!this.equalsPath(state.previewPath)) {
          this.actialPath = state.previewPath;
          this.PreviewMapPath(state.previewPath)
        }
      } else {
        this.clearPath('GlobalMapPathCanvas')
      }

      return state
    },
    maps() {
      return this.$store.getters.getWorldMapState.maps
    },
    defenders() {
      return this.$store.getters.getWorldMapState.defenders
    },
    mapsPoints() {
      let points = [];

      for (let i in this.worldMap.maps) {
        if (this.worldMap.maps.hasOwnProperty(i)) {
          let map = this.worldMap.maps[i];
          points.push({
            x: (map.x_global * this.gridSize) + this.gridSize / 2,
            y: (map.y_global * this.gridSize) + this.gridSize / 2,
            map: map,
          })
        }
      }

      return points
    },
    grid() {
      let cells = [];

      this.sizeMap.x = 0;
      this.sizeMap.y = 0;

      let maps = this.$store.getters.getWorldMapState.maps;

      for (let i in maps) {
        if (this.sizeMap.x < maps[i].x_global) this.sizeMap.x = maps[i].x_global;
        if (this.sizeMap.y < maps[i].y_global) this.sizeMap.y = maps[i].y_global;
      }

      this.sizeMap.x += 4;
      this.sizeMap.y += 4;

      for (let i = 0; i <= this.sizeMap.x; i++) {
        for (let j = 0; j <= this.sizeMap.y; j++) {

          let xCell = (i * this.gridSize);
          let yCell = (j * this.gridSize);

          cells.push({
            left: xCell,
            top: yCell,
            x: i,
            y: j,
            height: this.gridSize,
            width: this.gridSize,
          })
        }
      }

      return cells
    }
  },
  components: {
    AppControl: Control,
    AppMapPin: MapPin,
  },
}
</script>

<style scoped>
#GlobalViewMap {
  top: 50px;
  left: calc(50% - 200px);
  height: 370px;
  width: 482px;
  position: absolute;
  border-radius: 5px;
  padding: 22px 5px 5px;
  z-index: 11;
  border: 1px solid #25a0e1;
  background: rgb(8, 138, 210);
  box-shadow: 0 0 2px black;
}

#GlobalMapWrapper {
  box-shadow: inset 0 0 5px black;
  background: #8cb3c7;
  border-radius: 5px;
  height: 100%;
  position: relative;
  width: 100%;
  background: url("../../assets/logo/mapBackground.jpg");
  background-size: cover;
  overflow: scroll;
  cursor: grab;
}

.MapPoint {
  position: absolute;
  height: 40px;
  width: 40px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.3);
  pointer-events: all;
  cursor: pointer;
  transform: translate(-50%, -50%);
}

.animateAura {
  position: absolute;
  left: -1px;
  top: -1px;
  height: 40px;
  width: 40px;
  border-radius: 50%;
  border: 1px dashed rgb(255, 255, 255);
}

.animateAura.animate {
  animation: rotate 8s infinite ease-in-out;
}

.animateAura:hover {
  animation-play-state: paused;
  box-shadow: inset 0 0 10px 3px white, 0 0 8px 1px #84ffdc;
}

.MapPoint.User .animateAura {
  animation: userSector 2s infinite ease-in-out, rotate 8s infinite ease-in-out;
}

.MapPoint.User .animateAura:hover {
  animation: none;
}

@keyframes userSector {
  0% {
    -moz-box-shadow: inset 0 0 5px 0 rgb(255, 249, 30);
    box-shadow: inset 0 0 5px 0 rgb(255, 249, 30);
  }
  50% {
    -moz-box-shadow: inset 0 0 10px 10px rgba(204, 169, 44, 0);
    box-shadow: inset 0 0 10px 10px rgba(204, 169, 44, 0);
  }
  100% {
    -moz-box-shadow: inset 0 0 10px 0 rgba(204, 169, 44, 0);
    box-shadow: inset 0 0 0 10px rgba(204, 169, 44, 0);
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0deg) scale(1);
  }
  50% {
    transform: rotate(180deg) scale(0.9);
  }
  100% {
    transform: rotate(360deg) scale(1);
  }
}

#GlobalMapCanvas, #GlobalMapPathCanvas {
  position: absolute;
  left: 0;
  top: 0;
}

.sectorName {
  color: rgba(255, 255, 255, 0.5);
  font-size: 13px;
  top: calc(100% + 5px);
  left: 50%;
  position: absolute;
  pointer-events: none;
  transform: translate(-50%, 0%);
  width: fit-content;
}

.MapPoint:hover .sectorName {
  color: rgba(255, 255, 255, 1) !important;
}

.fractionIcon {
  position: absolute;
  left: calc(50% - 13px);
  top: calc(50% - 14px);
  height: 26px;
  width: 26px;
  background-size: cover;
  pointer-events: none;
}

.GridBox {
  pointer-events: none;
}

.buttons {
  position: sticky;
  left: calc(100% - 56px);
  top: 10px;
  height: 24px;
  width: 46px;
  pointer-events: all;
  cursor: pointer;
  z-index: 2;
  border: 1px solid #25a0e1;
  background: rgb(8, 138, 210);
  box-shadow: 0 0 2px black;
  border-radius: 3px;
  transition: 100ms;
}

.buttons div {
  margin-top: 2px;
  float: left;
  border-radius: 2px;
  pointer-events: auto;
  margin-left: 2px;
  box-shadow: 0 0 2px black;
  background: #8ea6b2;
  width: 20px;
  height: 20px;
  background-size: contain;
  transition: 100ms;
}

.buttons div:hover {
  box-shadow: 0 0 2px 1px white;
}

.buttons div:active {
  transform: scale(0.97);
}

.battle {
  height: 20px;
  width: 20px;
  background-image: url('../../assets/indexImg/battle_icon.png');
  background-size: contain;
  position: absolute;
  z-index: 2;
  left: 10%;
  top: 10%;
  pointer-events: none;
}

.fractionIcon.shield {
  background-image: url('https://img.icons8.com/fluent/48/000000/shield.png');
  height: 40px;
  width: 40px;
  left: calc(50% - 20px);
  top: calc(50% - 20px);
}

.battleMap {
  border: 2px dashed rgb(251, 72, 72);
  left: -2px;
  top: -2px;
}

.count_defenders {
  background-image: url(https://img.icons8.com/cotton/64/000000/security-shield.png);
  height: 24px;
  width: 24px;
  right: -6px;
  top: -6px;
  background-size: contain;
  position: absolute;
  z-index: 1;
  background-repeat: no-repeat;
  font-size: 9px;
  text-align: center;
  line-height: 22px;
  font-family: 'Audiowide', cursive;
  color: #fff16f;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
}
</style>
