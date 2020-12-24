import {Scene} from "../create";
import store from "../../store/store";
import {gameStore} from "../store";
import {CreateSelectSprite} from "./create_select_sprite";
import {MapSize} from "../map/createMap";

function AddTransport() {
  let transportIcon = Scene.make.sprite({
    x: 0,
    y: 0,
    key: 'transportIcon',
    add: true
  });
  transportIcon.setOrigin(0.5);
  transportIcon.setScale(0.5);
  transportIcon.setDepth(1000);
  transportIcon.setInteractive();

  let posUpdater = setInterval(function () {

    if (!transportIcon) {
      clearInterval(posUpdater)
    }

    transportIcon.x = Math.round(Scene.input.mousePointer.worldX);
    transportIcon.y = Math.round(Scene.input.mousePointer.worldY);
  }, 10);

  transportIcon.on('pointerdown', function (pointer) {
    if (pointer.leftButtonDown()) {
      store.getters.getWSByService('map_editor').socket.send(JSON.stringify({
        event: "addTransport",
        id: gameStore.mapEditorState.mpID,
        x: Math.round(Number(transportIcon.x)) - MapSize,
        y: Math.round(Number(transportIcon.y)) - MapSize,
      }));
    }
    transportIcon.destroy();
    transportIcon = null;
  });
}

function RemoveTransport() {
  let callBack = function (x, y) {
    store.getters.getWSByService('map_editor').socket.send(JSON.stringify({
      event: "removeTransport",
      id: gameStore.mapEditorState.mpID,
      x: Number(x),
      y: Number(y)
    }));
  };
  SelectedTransport(callBack)
}

function SelectedTransport(callBack) {
  if (gameStore.map) {
    let map = gameStore.map;
    for (let x in map.OneLayerMap) {
      for (let y in map.OneLayerMap[x]) {
        if (map.OneLayerMap[x][y].transport) {
          CreateSelectSprite(x, y, callBack, true);
        }
      }
    }
  }
}

export {AddTransport, RemoveTransport}
