import store from "../../store/store";
import {gameStore} from "../store";
import {Scene} from "../create";
import {CreateSelectSprite} from "./create_select_sprite";
import {MapSize} from "../map/createMap";

function PlaceCoordinate(event, type) {

  let structures = ['turret', 'beacon', 'storage', 'shield', 'generator', 'missile_defense', 'turret', 'turret', 'jammer', 'radar', 'meteorite_defense', 'extractor'];

  let atlasName = type.type;
  if (structures.includes(type.type)) {
    atlasName = 'structures';
  }

  let placeObj = Scene.make.sprite({
    x: 0,
    y: 0,
    frame: type.texture,
    add: true,
    key: atlasName,
  });

  gameStore.mapEditorState.placeObj = placeObj;

  placeObj.setOrigin(0.5);
  placeObj.setScale(0.5);
  placeObj.setDepth(1000);
  placeObj.setInteractive();

  let placeInterval = setInterval(function () {

    if (!placeObj) {
      clearInterval(placeInterval);
      return;
    }

    placeObj.x = Math.round(Scene.input.mousePointer.worldX);
    placeObj.y = Math.round(Scene.input.mousePointer.worldY);

  }, 10);

  placeObj.on('pointerdown', function (pointer) {
    if (pointer.leftButtonDown()) {
      store.getters.getWSByService('map_editor').socket.send(JSON.stringify({
        event: event,
        id: gameStore.mapEditorState.mpID,
        id_type: Number(type.type_id),
        x: Math.round(Number(placeObj.x)) - MapSize,
        y: Math.round(Number(placeObj.y)) - MapSize,
        scale: Math.round(placeObj.scale * 100),
        rotate: Math.round(placeObj.angle)
      }));
    }
    placeObj.destroy();
    placeObj = null;
    gameStore.mapEditorState.placeObj = null;
  });
}

function RemoveCoordinate() {

  let callBack = function (x, y) {
    store.getters.getWSByService('map_editor').socket.send(JSON.stringify({
      event: "removeObject",
      id: gameStore.mapEditorState.mpID,
      x: Number(x),
      y: Number(y)
    }));
  };

  selectObjects(callBack)
}

function selectObjects(callBack) {
  if (gameStore.gameReady) {
    let map = gameStore.map;

    for (let id in gameStore.mapsState[map.id].staticObjects) {
      if (!gameStore.mapsState[map.id].staticObjects[id].texture && gameStore.mapsState[map.id].staticObjects[id].texture === "" && gameStore.mapsState[map.id].staticObjects[id].animate_sprite_sheets === "") {
        continue
      }

      CreateSelectSprite(gameStore.mapsState[map.id].staticObjects[id].x, gameStore.mapsState[map.id].staticObjects[id].y, callBack, true);
    }

    for (let id in gameStore.objects) {
      if (!gameStore.objects[id].texture && gameStore.objects.texture === "" && gameStore.objects[id].animate_sprite_sheets === "") {
        continue
      }

      CreateSelectSprite(gameStore.objects[id].x, gameStore.objects[id].y, callBack, true);
    }
  }
}

export {PlaceCoordinate, RemoveCoordinate, selectObjects}
