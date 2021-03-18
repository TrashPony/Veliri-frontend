<template>
  <div id="map_editor">

    <app-mini-map/>
    <div id="MousePosition" :style="mousePosition">
      {{ mousePosition.x }} : {{ mousePosition.y }} <br>
      {{ mousePosition.placeObj ? 'scale: ' + mousePosition.placeObjScale : '' }} <br>
      {{ mousePosition.placeObj ? 'rotate: ' + mousePosition.placeObjRotate : '' }}
    </div>

    <div id="container">
      <div id="head">
        <select title="mapSelector" id="mapSelector" v-model="mp_id" @change="selectMap()" v-if="state.maps">
          <option value="0" disabled selected>Выберите карту</option>
          <option v-for="map in state.maps" :value="map.id">
            {{ map.Name }} ID: {{ map.id }}
          </option>
        </select>

        <!--        <div id="hideMeta" onclick="HideMeta()"> Скрыть мето данные</div>-->
        <div class="HeightCoordinates">
          <h4>Random</h4>
          <div @click="random('randomTerrain')">Terrain</div>
          <div @click="saveTerrain">Save</div>
        </div>

        <div class="HeightCoordinates">
          <h4>Изменить обьект</h4>
          <div @click="optionSprite()"> Opt</div>
          <div @click="removeObject()"> Del</div>
        </div>

        <div id="Emitters">
          <h4> Излучатели </h4>
          <!--          <div onclick="RemoveEmitter()"-->
          <!--               style='background: url("/assets/removeIcon.png") center center / 115% no-repeat;'></div>-->
          <!--          <div onclick="ChangeEmitter()"-->
          <!--               style='background: url("/assets/changeIcon.png") center center / 115% no-repeat;'></div>-->
          <!--          <div onclick="AddEmitter()"-->
          <!--               style='background: url("") center center / 115% no-repeat;'></div>-->
        </div>

        <div id="transportBlock">
          <h4> Эвакуатор хедлер </h4>
          <div @click="removeTransport()"
               :style="{background: 'url(' + require('../../assets/icons/removeIcon.png') + ') center center / 115% no-repeat'}"></div>
          <div @click="addTransport()"><img src="https://img.icons8.com/color/40/000000/drone.png"></div>
        </div>

        <div id="handlerBlock">
          <h4> Переходы </h4>
          <div @click="removeHandler()"
               :style="{background: 'url(' + require('../../assets/icons/removeIcon.png') + ') center center / 115% no-repeat'}"></div>
          <div @click="addHandler()">add</div>
          <div @click="editPos()">editPos</div>
        </div>

        <div id="geoPoint">
          <h4> Гео дата </h4>
          <div @click="removeGeoData()"
               :style="{background: 'url(' + require('../../assets/icons/removeIcon.png') + ') center center / 115% no-repeat'}"></div>
          <div @click="cancelGeoData()">cancel</div>
          <div @click="addGeoData()">add</div>
        </div>

        <div id="Lvl_Map" style="clear: both">
          <h4> высоты ¯\_(ツ)_/¯ </h4>
          <div @click="editLvlMap()" style="height: 25px;width: 25px;background: darkred;"></div>
          <input type="number" value="0" id="lvlMapEdit">
        </div>

      </div>

      <div id="coordinates">
        <h3>Типы Координат</h3>

        <div id="coordinateBlock">
          <div id="navBar">
            <div id="oneMenu" :class="{active: type_object === 'static'}" @click="type_object = 'static'"> Статичные
            </div>
            <div id="twoMenu" :class="{active: type_object === 'dynamic'}" @click="type_object = 'dynamic'">
              Динамичные
            </div>
          </div>

          <div v-for="type in coordinateTypes"
               v-if="type.typeType === type_object"
               @click="placeObject(type.type)"
               class="coordinateType"
               :style="{background: type.background}">

            <div class="editType" @click.stop="editCoordinate(type.type)"></div>
          </div>
        </div>

        <h3>Типы Земли</h3>
        <div id="texturesBlock">
          <div id="textures">
            <div @click="removeTexture()"
                 :style="{background: 'url(' + require('../../assets/icons/removeIcon.png') + ') center center / 115% no-repeat'}"></div>
            <div @click="placeTexture('soil')"
                 :style="{background: 'url(' + require('../../assets/terrainTextures/icon/soil.jpg') + ') center center / 115% no-repeat'}"></div>
            <div @click="placeTexture('soil_2')"
                 :style="{background: 'url(' + require('../../assets/terrainTextures/icon/soil_2.jpg') + ') center center / 115% no-repeat'}"></div>
            <div @click="placeTexture('desertDunes')"
                 :style="{background: 'url(' + require('../../assets/terrainTextures/icon/desertDunes.jpg') + ') center center / 115% no-repeat'}"></div>
            <div @click="placeTexture('desertDunes_2')"
                 :style="{background: 'url(' + require('../../assets/terrainTextures/icon/desertDunes_2.jpg') + ') center center / 115% no-repeat'}"></div>
            <div @click="placeTexture('grass_1')"
                 :style="{background: 'url(' + require('../../assets/terrainTextures/icon/grass_1.jpg') + ') center center / 115% no-repeat'}"></div>
            <div @click="placeTexture('grass_2')"
                 :style="{background: 'url(' + require('../../assets/terrainTextures/icon/grass_2.jpg') + ') center center / 115% no-repeat'}"></div>
            <div @click="placeTexture('grass_3')"
                 :style="{background: 'url(' + require('../../assets/terrainTextures/icon/grass_3.jpg') + ') center center / 115% no-repeat'}"></div>
            <div @click="placeTexture('xenos')"
                 :style="{background: 'url(' + require('../../assets/terrainTextures/icon/xenos.jpg') + ') center center / 115% no-repeat'}"></div>
            <div @click="placeTexture('xenos_2')"
                 :style="{background: 'url(' + require('../../assets/terrainTextures/icon/xenos_2.jpg') + ') center center / 115% no-repeat'}"></div>
            <div @click="placeTexture('arctic')"
                 :style="{background: 'url(' + require('../../assets/terrainTextures/icon/arctic.jpg') + ') center center / 115% no-repeat'}"></div>
            <div @click="placeTexture('arctic_2')"
                 :style="{background: 'url(' + require('../../assets/terrainTextures/icon/arctic_2.jpg') + ') center center / 115% no-repeat'}"></div>
            <div @click="placeTexture('tundra')"
                 :style="{background: 'url(' + require('../../assets/terrainTextures/icon/tundra.jpg') + ') center center / 115% no-repeat'}"></div>
            <div @click="placeTexture('tundra_2')"
                 :style="{background: 'url(' + require('../../assets/terrainTextures/icon/tundra_2.jpg') + ') center center / 115% no-repeat'}"></div>
            <div @click="placeTexture('water_1')"
                 :style="{background: 'url(' + require('../../assets/terrainTextures/icon/water_1.png') + ') center center / 115% no-repeat'}"></div>
            <div @click="placeTexture('ravine_1')"
                 :style="{background: 'url(' + require('../../assets/terrainTextures/icon/ravine_1.png') + ') center center / 115% no-repeat'}"></div>
            <div @click="placeTexture('ravine_2')"
                 :style="{background: 'url(' + require('../../assets/terrainTextures/icon/ravine_2.png') + ') center center / 115% no-repeat'}"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MiniMap from '../MiniMap/MiniMap'
import {gameStore} from "../../game/store";
import {Scene} from "../../game/create";
import {PlaceCoordinate, RemoveCoordinate} from "../../game/map_editor/place_coordinate";
import {PlaceTexture, RemoveTexture} from "../../game/map_editor/place_texture";
import {OptionSprite} from "../../game/map_editor/option_sprite";
import {AddTransport, RemoveTransport} from "../../game/map_editor/tranasport_handler";
import {AddHandler, EditPos, RemoveHandler} from "../../game/map_editor/handlers";
import {AddGeoData} from "../../game/map_editor/geo_data";
import {EditLvlMap, radiusLvl} from "../../game/map_editor/lvl_map";
import {EditCoordinate} from "../../game/map_editor/edit_coordinate";
import {MapSize} from "../../game/map/createMap";

export default {
  name: "MapEditor",
  data() {
    return {
      mp_id: 0,
      mousePosition: {
        left: 0,
        top: 0,
        x: 0,
        y: 0,
        placeObj: false,
        placeObjScale: '',
        placeObjRotate: '',
      },
      type_object: "static"
    }
  },
  created() {
    let app = this;

    app.$store.commit({
      type: 'reconnectWS',
      service: 'map_editor',
      force: false,
    });

    // todo костыль
    $('body').mousemove(function (e) {
      app.updatePos(e);
    });

    let wait = setInterval(function () {
      if (document.getElementById("game-container")) {
        document.getElementById("game-container").addEventListener("wheel", function (e) {
          app.onWheel(e)
        });
        clearInterval(wait)
      }
    }, 100);
  },
  methods: {
    selectMap() {
      gameStore.mapEditorState.mpID = Number(this.mp_id);
      this.$store.getters.getWSByService('map_editor').socket.send(JSON.stringify({
        event: "SelectMap",
        id: Number(this.mp_id)
      }));
    },
    updatePos(e) {
      this.mousePosition.left = (e.pageX + 30) + "px";
      this.mousePosition.top = (e.pageY + 3) + "px";

      if (gameStore.gameReady) {
        this.mousePosition.x = Math.round(Scene.input.mousePointer.worldX) - MapSize;
        this.mousePosition.y = Math.round(Scene.input.mousePointer.worldY) - MapSize;

        if (gameStore.mapEditorState.placeObj) {
          this.mousePosition.placeObj = true;
          this.mousePosition.placeObjScale = Math.round(gameStore.mapEditorState.placeObj.scale * 100) + '%';
          this.mousePosition.placeObjRotate = Math.round(gameStore.mapEditorState.placeObj.angle)
        } else {
          this.mousePosition.placeObj = false;
        }

        if (gameStore.mapEditorState.objSpriteNewGeoData) {
          gameStore.mapEditorState.objSpriteNewGeoData.x = Math.round(Scene.input.mousePointer.worldX);
          gameStore.mapEditorState.objSpriteNewGeoData.y = Math.round(Scene.input.mousePointer.worldY);
        }
      }
    },
    onWheel(e) {
      e = e || window.event;
      let delta = e.deltaY || e.detail || e.wheelDelta;
      e.preventDefault ? e.preventDefault() : (e.returnValue = false);
      this.updatePos(e);

      if (gameStore.mapEditorState.placeObj) {
        if (delta > 0) {
          gameStore.mapEditorState.placeObj.setScale(gameStore.mapEditorState.placeObj.scale + 0.01);
        } else {
          gameStore.mapEditorState.placeObj.setScale(gameStore.mapEditorState.placeObj.scale - 0.01);
        }
      } else {
        if (Scene.wasd && Scene.wasd.ctrl && Scene.wasd.ctrl.isDown) {
          if (delta > 0) {
            document.getElementById("lvlMapEdit").value = Number(document.getElementById("lvlMapEdit").value) - 1
          } else {
            document.getElementById("lvlMapEdit").value = Number(document.getElementById("lvlMapEdit").value) + 1
          }

          if (Number(document.getElementById("lvlMapEdit").value) <= 0) {
            document.getElementById("lvlMapEdit").value = 0
          }
        } else {
          if (delta > 0) {
            gameStore.mapEditorState.radiusLvl++;
          } else {
            gameStore.mapEditorState.radiusLvl--;
          }
        }
      }

      if (gameStore.mapEditorState.objSpriteNewGeoData) {
        if (delta > 0) {
          gameStore.mapEditorState.objSpriteNewGeoData.displayHeight++;
          gameStore.mapEditorState.objSpriteNewGeoData.displayWidth++;
        } else {
          gameStore.mapEditorState.objSpriteNewGeoData.displayHeight--;
          gameStore.mapEditorState.objSpriteNewGeoData.displayWidth--;
        }
      }
    },
    placeObject(type) {
      PlaceCoordinate("placeObject", type);
    },
    removeObject() {
      RemoveCoordinate();
    },
    placeTexture(name) {
      PlaceTexture(name);
    },
    removeTexture() {
      RemoveTexture();
    },
    optionSprite() {
      OptionSprite();
    },
    removeTransport() {
      RemoveTransport();
    },
    addTransport() {
      AddTransport();
    },
    addHandler() {
      AddHandler();
    },
    removeHandler() {
      RemoveHandler();
    },
    editPos() {
      EditPos();
    },
    addGeoData() {
      AddGeoData();
    },
    removeGeoData() {
      // todo
    },
    cancelGeoData() {
      // todo
    },
    editLvlMap() {
      EditLvlMap();
    },
    editCoordinate(type) {
      EditCoordinate(type)
    },
    random(type) {
      this.$store.getters.getWSByService('map_editor').socket.send(JSON.stringify({
        event: type,
        id: gameStore.mapEditorState.mpID,
      }));
    },
    saveTerrain() {
      this.$store.getters.getWSByService('map_editor').socket.send(JSON.stringify({
        event: 'saveFlore',
        id: gameStore.mapEditorState.mpID,
      }));
    }
  },
  computed: {
    state() {
      return this.$store.getters.getMapEditorData
    },
    coordinateTypes() {
      let typesState = this.$store.getters.getMapEditorData.typeCoordinates;
      let types = [];

      if (!typesState) {
        return types;
      }

      let createRequireString = function (path) {
        return "url(" + require('../../assets/' + path) + ")  center center / contain no-repeat"
      };

      for (let i = 0; i < typesState.length; i++) {
        let type = typesState[i];

        let typeType = 'static' // мне было лень думать
        if (type.build) {
          typeType = 'dynamic'
        }

        if (type.animate_sprite_sheets === "" && type.texture === "") {
          continue;
        }

        let background = "";

        if (type.build) {
          try {

            let noFractionStructures = ['replic_gauss_gun', 'unknown_civilization_jammer', 'explores_antenna', 'explores_observatory']

            if (noFractionStructures.includes(type.texture)) {
              background = createRequireString("map/structures/" + type.texture + '/' + type.texture + ".png")
            } else {
              background = createRequireString("map/structures/" + type.texture + '/' + type.texture + "_Replics.png")
            }

          } catch (e) {
            //console.log(e)
          }
        } else {
          if (type.animate_sprite_sheets !== "") {
            background = createRequireString('map/animate/' + type.animate_sprite_sheets + '.png')
          } else if (type.texture.includes("mountain")) {
            background = createRequireString('map/objects/mountains/' + type.texture + '.png')
          } else if (type.type === 'plants') {
            background = createRequireString('map/objects/plants/' + type.texture + '.png')
          } else if (type.texture.includes("ravine")) {
            background = createRequireString("map/objects/ravines/" + type.texture + ".png")
          } else if (type.texture.includes("road")) {
            background = createRequireString("map/objects/roads/" + type.texture + ".png")
          } else if (type.texture.includes("base") && type.type === "") {
            background = createRequireString("map/objects/bases/" + type.texture + ".png")
          } else if (type.texture.includes("crater")) {
            background = createRequireString("map/objects/craters/" + type.texture + ".png")
          } else if (type.texture.includes("elevation")) {
            background = createRequireString("map/objects/elevations/" + type.texture + ".png")
          } else if (type.texture.includes("shore")) {
            background = createRequireString("map/objects/shores/" + type.texture + ".png")
          } else if (type.type === "sector_structure") {
            let struct = type.texture.replace("_bottom", "");
            background = createRequireString("map/objects/sector_structure/" + type.texture + ".png")
          } else if (type.type === "other") {
            background = createRequireString("map/objects/other/" + type.texture + ".png")
          } else if (type.type === "unknown_civilization") {
            background = createRequireString("map/objects/unknown_civilization/" + type.texture + ".png")
          } else if (type.type === 'unit_wreckage') {
            background = createRequireString("map/objects/unit_wreckage/" + type.texture + ".png")
          } else if (type.type === 'structure_wreckage') {
            background = createRequireString("map/objects/structure_wreckage/" + type.texture + ".png")
          } else {
            background = createRequireString("map/objects/" + type.texture + ".png")
          }
        }

        types.push({type: type, background: background, typeType: typeType})
      }

      return types
    }
  },
  components: {
    AppMiniMap: MiniMap,
  },
}
</script>

<style scoped>

#map_editor {

}

#changeType {
  position: absolute;
  top: 0;
  left: -210px;
  background: linear-gradient(22deg, rgb(221, 112, 52), #ffa50f);
  height: 170px;
  border-radius: 10px;
  text-shadow: 0 0 2px black;
  padding-top: 10px;
  text-align: left;
  width: 195px;
}

#changeType span {
  display: inline-block;
  width: 60px;
  margin-left: 10px;
  margin-right: 15px;
}

#changeType input[type=submit] {
  margin: 10px;
}

#changeType input[type=number] {
  width: 80px;
}

#coordinateBlock {
  border: 1px solid #a2b6ca;
  width: 450px;
  margin: auto;
  height: 533px;
  border-radius: 5px;
  overflow-y: scroll;
  background: rgb(132 132 132);
}

#coordinateBlock .coordinateType {
  position: relative;
  width: 100px;
  height: 100px;
  margin-left: 9px;
  margin-top: 10px;
  float: left;
}

#coordinateBlock .coordinateType:hover {
  outline: 1px solid #f1ff08;
}

#coordinateBlock .coordinateType:active {
  outline: 1px solid #ffffff;
}

#typeTip {
  border: 1px solid;
  border-radius: 5px;
  position: absolute;
  width: 150px;
  height: 100px;
  background-size: 10px 2px;
  background-image: linear-gradient(1deg, rgba(33, 176, 255, 0.8), rgba(37, 160, 225, 0.6) 6px);
}

#mapSelector {
  float: left;
  margin-top: 16px;
  margin-left: 20px;
}

#effectZonePanel, #effectDetailZonePanel {
  position: absolute;
  border: 1px solid #25a0e1;
  transition-property: background-image;
  text-shadow: #28a5e4 0 0 4px;
  box-shadow: 0 0 30px 4px rgb(0, 195, 255);
  display: inline-block;
  border-radius: 5px;
  background-size: 10px 2px;
  background-image: linear-gradient(1deg, rgba(33, 176, 255, 1), rgba(37, 160, 225, 0.6) 6px);
}

#cancelTipEffectsButton {
  float: right;
  border: 1px solid #b3ddff;
  height: 10px;
  width: 10px;
  border-radius: 5px;
  margin-top: 2px;
  margin-right: 2px;
  line-height: 5px;
  color: red;
}

#cancelTipEffectsButton:hover {
  color: #fff91e;
}

#cancelTipEffectsButton:active {
  position: relative;
  top: 1px;
  left: 1px;
}

#cancelTipEffectsButton:after {
  content: '\2716';
  font-size: 9px;
}

.cell {
  pointer-events: visible;
  width: 17px;
  height: 17px;
  border-radius: 5px;
  border: 1px solid #959595;
  background-color: #4c4c4c;
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.cell:hover {
  box-shadow: 0 0 5px 3px rgb(255, 149, 32);
  color: #00fffd;
  cursor: pointer;
}

#TipEffect {
  pointer-events: none;
  position: absolute;
  display: inline-block;
  z-index: 901;
  background-size: 10px 2px;
  border: 1px solid #25a0e1;
  border-radius: 10px;
  transition-property: background-image;
  width: 90px;
  padding: 5px;
  background-image: linear-gradient(1deg, rgba(33, 176, 255, 1), rgba(37, 160, 225, 0.6) 6px);
}

#TipEffect td {
  text-shadow: #28a5e4 0 0 4px;
  font-family: sans-serif;
  font-size: 6pt;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  color: #a5d5ef;
}

#handlerBlock {

}

#handlerBlock h4, #geoPoint h4, #Beams h4, #Emitters h4 {
  background: linear-gradient(22deg, rgb(221, 112, 52), #6c6c6c);
  color: aliceblue;
  text-shadow: 0 0 2px black;
  margin: 10px 0 0 8px;
  border-radius: 5px;
  float: left;
  width: 100%;
}

#handlerBlock div, #geoPoint div, #Beams div, #Emitters div {
  border-radius: 5px;
  width: 39px;
  height: 39px;
  display: inline-block;
  border: 1px solid #959595;
  background-color: #4c4c4c;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  vertical-align: top;
  margin: 1px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 1);
  transition: 0.2s;
  margin-top: 10px;
}

#handlerBlock div:active, #geoPoint div:active, #Beams div:active, #Emitters div:active {
  transform: scale(0.95);
}

#container {
  width: 100%;
  margin: 0 auto;
}

#miniMap {
  left: 1215px;
  top: 12px;
}

#head {
  width: 150px;
  background-size: 5px 2px;
  background-image: linear-gradient(1deg, rgba(33, 176, 255, 1), rgba(37, 160, 225, 0.6) 6px);
  border-radius: 10px;
  float: left;
  padding-right: 15px;
  height: 670px;
  font-size: 12px;
  top: 15px;
  left: 15px;
  position: absolute;
  opacity: 0.5;
}

#head:hover {
  opacity: 1;
}

#head table {
  float: left;
  margin-left: 20px;
  margin-top: 5px;
  text-align: left;
  width: 130px;
}

#head table tr:first-child {
  background: linear-gradient(22deg, rgb(221, 112, 52), #6c6c6c);
}

#head table tr:first-child td:first-child {
  border-radius: 10px;
  text-align: center;
  color: aliceblue;
  text-shadow: 0 0 2px black;
}

#head table td {
  position: relative;
}

#head table input {
  padding: 0;
  height: 20px;
  width: 20px;
}

#head table input:active {
  position: absolute;
  top: 2px;
  left: 2px;
}

#coordinates {
  position: relative;
  float: right;
  height: 753px;
  margin-top: 10px;
  background-size: 5px 2px;
  background-image: linear-gradient(1deg, rgba(33, 176, 255, 1), rgba(37, 160, 225, 0.6) 6px);
  border-radius: 10px;
  right: 15px;
  top: 15px;
}

#coordinates h3 {
  background: linear-gradient(22deg, rgb(221, 112, 52), #6c6c6c);
  color: aliceblue;
  width: 260px;
  margin: 5px auto;
  text-shadow: 0 0 2px black;
  border-radius: 10px;
}

#hideMeta {
  float: left;
  width: 100%;
  height: 20px;
  margin-left: 8px;
  margin-top: 10px;
  border-radius: 10px;
  border: 1px solid #25a0e1;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 1);
  background-size: 5px 2px;
  background-image: linear-gradient(1deg, rgba(33, 176, 255, 0.61), rgba(37, 160, 225, 0.14) 6px);
  user-select: none;
}

#hideMeta:hover {
  background-size: 5px 2px;
  background-image: linear-gradient(1deg, rgba(21, 108, 159, 0.61), rgba(37, 160, 225, 0.14) 6px);
}

#hideMeta:active {
  position: relative;
  top: 2px;
}

#MousePosition {
  position: absolute;
  min-height: 20px;
  line-height: 20px;
  min-width: 20px;
  background: rgba(71, 71, 71, 0.6);
  color: greenyellow;
  pointer-events: none;
  opacity: 0.4;
}

.HeightCoordinates {
  width: 100%;
}

.HeightCoordinates h4 {
  width: 100%;
  background: linear-gradient(22deg, rgb(221, 112, 52), #6c6c6c);
  color: aliceblue;
  text-shadow: 0 0 2px black;
  margin: 10px 0 0 7px;
  border-radius: 5px;
  float: left;
}

.HeightCoordinates div {
  outline: none;
  border-radius: 10px;
  border: 1px solid #25a0e1;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 1);
  background-size: 5px 2px;
  background-image: linear-gradient(1deg, rgba(33, 176, 255, 0.611764705882353), rgba(37, 160, 225, 0.1411764705882353) 6px);
  float: left;
  height: 25px;
  width: 25px;
  margin-left: 21px;
  margin-top: 8px;
  transition: 0.2ms;
}

.HeightCoordinates div:hover {
  background-size: 5px 2px;
  background-image: linear-gradient(1deg, rgba(92, 255, 158, 0.61), rgba(20, 225, 30, 0.14) 6px);
}

.HeightCoordinates div:active {
  transform: scale(0.9);
}

#navBar {
  height: 20px;
  width: 100%;
  border-bottom: 0;
  border-radius: 4px;
}

#navBar div {
  height: 18px;
  width: 107px;
  border: 1px solid #a2b6ca;
  border-top: 0;
  border-radius: 4px;
  float: left;
  user-select: none;
}

#navBar div:hover {
  background-color: #6c6c6c;
}

#navBar div:active {
  background-color: #88a9c5;
}

#navBar .active {
  border-bottom: 0;
  border-radius: 4px 4px 0 0;
  background-color: rgba(137, 68, 18, 0.55);
}

#coordinates #notification {
  position: absolute;
  top: 0;
  left: -255px;
  background: linear-gradient(22deg, rgb(221, 112, 52), #ffa50f);
  width: 250px;
  height: 100px;
  border-radius: 10px;
  text-shadow: 0 0 2px black;
  color: #ffffff;
}

#coordinates #notification h5 {
  color: #ff0202;
  font-size: 20px;
  background: linear-gradient(22deg, rgb(147, 147, 147), #a2b6ca);
  margin: 10px;
}

#coordinates #notification h4 {
  margin: 10px;
}

#coordinates #notification input {
  margin-left: 10px;
}

.menuButton {
  height: 18px;
  width: 35px;
  border-radius: 10px;
  right: 10px;
  top: 5px;
  position: absolute;
  background-size: 10px 2px;
  background-image: linear-gradient(1deg, rgba(33, 176, 255, 0.8), rgba(37, 160, 225, 0.6) 6px);
}

.menuButton:hover {
  color: sandybrown;
  text-shadow: 0 0 1px black;
}

.menuButton:active {
  transform: scale(0.7);
}


.menuButton:after {
  font-size: 15px;
  content: 'Ред.';
}


#menuBlock {
  position: absolute;
  height: 68px;
  width: 220px;
  background-size: 10px 2px;
  background-image: linear-gradient(1deg, rgba(33, 176, 255, 0.8), rgba(37, 160, 225, 0.5) 6px);
  border-radius: 10px;
}

#menuBlock input {
  margin-top: 10px;
}

#texturesBlock {

}

#texturesBlock h4 {
  background: linear-gradient(22deg, rgb(221, 112, 52), #6c6c6c);
  color: aliceblue;
  text-shadow: 0 0 2px black;
  margin: 10px 0 0 8px;
  border-radius: 5px;
  float: left;
  width: 100%;
}

#texturesBlock > div {
  padding: 1px;
  word-wrap: break-word;
  overflow-y: scroll;
  border-radius: 5px;
  text-align: left;
  margin: 4px auto 2px 8px;
  width: 440px;
  height: 145px;
  text-shadow: #28a5e4 0 0 4px;
  font-family: sans-serif;
  font-size: 9pt;
  float: left;
  box-shadow: inset 0 0 5px black;
  background: #8cb3c7;
}

#texturesBlock > div div {
  border-radius: 5px;
  width: 39px;
  height: 39px;
  display: inline-block;
  border: 1px solid #959595;
  background-color: #4c4c4c;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  vertical-align: top;
  margin: 1px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 1);
  transition: 0.2s;
}

#texturesBlock > div div:hover {
  background-color: #808080;
}

#texturesBlock > div div:active {
  transform: scale(0.95);
}

#transportBlock {

}

#transportBlock h4 {
  background: linear-gradient(22deg, rgb(221, 112, 52), #6c6c6c);
  color: aliceblue;
  text-shadow: 0 0 2px black;
  margin: 10px 0 0 8px;
  border-radius: 5px;
  float: left;
  width: 100%;
}

#transportBlock div {
  border-radius: 5px;
  width: 39px;
  height: 39px;
  display: inline-block;
  border: 1px solid #959595;
  background-color: #4c4c4c;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  vertical-align: top;
  margin: 1px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 1);
  transition: 0.2s;
  margin-top: 10px;
}

#transportBlock div:active {
  transform: scale(0.95);
}

#navBar {
  font-size: 12px;
}

.editType {
  top: 5px;
  left: 5px;
  position: absolute;
  height: 25px;
  width: 25px;
  background: #0d8511;
}
</style>
<style>
#rotateBlock {
  position: absolute;
  top: 0;
  left: -275px;
  background: linear-gradient(22deg, rgb(221, 112, 52), #ffa50f);
  height: 224px;
  border-radius: 10px;
  text-shadow: 0 0 2px black;
  padding-top: 10px;
  text-align: left;
  width: 370px;
}

#rotateBlock input[type = range] {
  width: 354px;
}

#rotateBlock input[type = submit] {
  margin-top: 10px;
  margin-left: 35px;
}

#handlerBlockOption {
  position: absolute;
  top: 0;
  left: -275px;
  background: linear-gradient(22deg, rgb(221, 112, 52), #ffa50f);
  height: 275px;
  border-radius: 10px;
  text-shadow: 0 0 2px black;
  padding-top: 10px;
  text-align: left;
  width: 270px;
}

#handlerBlockOption select {
  width: 250px;
  margin: 10px;
  display: block;
}

#handlerBlockOption div {
  padding: 0 10px;
}

#handlerBlockOption div span {
  margin-right: 10px;
}

#handlerBlockOption input[type='submit'] {
  margin: 10px;
}

#posTable {

}

#posTable input {
  width: 70px;
}
</style>
