import store from "../../store/store";
import {gameStore} from "../store";
import {Scene} from "../create";
import {RemoveOldMap} from "../map/remove_old_map";
import {gameAnimateObjectCreate, gameObjectCreate} from "../map/objects";

let editObject = null;
let objGrid = null;
let objNewGeoData = null;
let objNewGeoDataRadius = 500;
let moveGeoData = false;

function EditCoordinate(typeCoordinate) {

  let noFractionStructures = ['replic_gauss_gun', 'unknown_civilization_jammer', 'explores_antenna', 'explores_observatory']
  if (typeCoordinate.build) {
    if (!noFractionStructures.includes(typeCoordinate.texture)) {
      typeCoordinate.texture += "_Replics";
    }
  }

  let structures = ['unknown_civilization_jammer', 'repair_station', 'turret', 'beacon', 'storage', 'shield',
    'generator', 'missile_defense', 'turret', 'turret', 'jammer', 'radar', 'meteorite_defense', 'extractor',
    'explores_antenna', 'expensive_tower'];

  let atlasName = typeCoordinate.type;
  if (structures.includes(typeCoordinate.type)) {
    atlasName = 'structures';
  }

  Scene.cameras.main.centerOn(0, 0);

  if (gameStore.mapEditorState.typeCoordinateEdit) {
    editObject.destroy();
    objGrid.destroy();
    objNewGeoData.destroy();
    gameStore.mapEditorState.objSpriteNewGeoData.destroy();
  }

  gameStore.mapEditorState.typeCoordinateEdit = typeCoordinate;

  if (!objGrid) {
    objGrid = Scene.add.graphics(0, 0);
    objNewGeoData = Scene.add.graphics(0, 0);
  }

  RemoveOldMap();

  if (typeCoordinate.texture !== '') {
    editObject = gameObjectCreate(0, 0, gameStore.mapEditorState.typeCoordinateEdit.texture, 100, false, 0,
      Scene.floorObjectLayer, 0, 0, 0, true, null, atlasName, Scene);
  } else {
    editObject = gameAnimateObjectCreate(0, 0, gameStore.mapEditorState.typeCoordinateEdit.animate_sprite_sheets, 100, false,
      0, 0, Scene.floorOverObjectLayer, false, Scene);
  }

  objGrid.lineStyle(3, 0x000FFF, 0.8);
  objGrid.fillStyle(0x000FFF, 0.5);
  objGrid.fillCircleShape({x: editObject.x, y: editObject.y, radius: 6});

  objNewGeoData.fillStyle(0xFFFFFF, 0.5);
  objNewGeoData.fillCircleShape({x: objNewGeoDataRadius, y: objNewGeoDataRadius, radius: objNewGeoDataRadius});

  objNewGeoData.generateTexture("objNewGeoData", objNewGeoDataRadius * 2, objNewGeoDataRadius * 2);

  gameStore.mapEditorState.objSpriteNewGeoData = Scene.make.sprite({
    x: 0,
    y: 0,
    key: "objNewGeoData",
    add: true
  });
  gameStore.mapEditorState.objSpriteNewGeoData.setOrigin(0.5);
  gameStore.mapEditorState.objSpriteNewGeoData.setDepth(900);
  gameStore.mapEditorState.objSpriteNewGeoData.displayHeight = 50;
  gameStore.mapEditorState.objSpriteNewGeoData.displayWidth = 50;
  gameStore.mapEditorState.objSpriteNewGeoData.setInteractive();
  gameStore.mapEditorState.objSpriteNewGeoData.setTint(0xFF0000);

  gameStore.mapEditorState.objSpriteNewGeoData.on('pointerdown', function (pointer) {
    if (pointer.leftButtonDown()) {
      store.getters.getWSByService('map_editor').socket.send(JSON.stringify({
        event: "addGeoDataInObject",
        x: Math.round(gameStore.mapEditorState.objSpriteNewGeoData.x),
        y: Math.round(gameStore.mapEditorState.objSpriteNewGeoData.y),
        radius: Math.round(gameStore.mapEditorState.objSpriteNewGeoData.displayHeight / 2),
        id_type: gameStore.mapEditorState.typeCoordinateEdit.type_id,
        move: moveGeoData,
      }));
    } else {
      moveGeoData = !moveGeoData;
      if (moveGeoData) {
        gameStore.mapEditorState.objSpriteNewGeoData.setTint(0x0000FF)
      } else {
        gameStore.mapEditorState.objSpriteNewGeoData.setTint(0xFF0000)
      }
    }
  });

  setInterval(function () {
    objNewGeoData.clear();
    for (let geoPoint of gameStore.mapEditorState.typeCoordinateEdit.type_geo_data) {
      if (geoPoint.move) {
        objNewGeoData.fillStyle(0x0000FF, 0.5);
      } else {
        objNewGeoData.fillStyle(0xFF0000, 0.5);
      }
      objNewGeoData.fillCircleShape({x: geoPoint.x, y: geoPoint.y, radius: geoPoint.radius});
    }
    objNewGeoData.setDepth(901);
  }, 100)
}

export {EditCoordinate}
