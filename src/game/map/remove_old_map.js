import {gameStore} from "../store";
import {removeAllObj, removeDrone, removeReservoir} from "../radar/object";
import {deleteBullet} from "../bullet/remove";
import {RemoveAllMark} from "../radar/marks";
import {destroyAllSelectedSprite} from "../map_editor/create_select_sprite";
import store from "../../store/store";
import {RemoveShield} from "../shield/shield";

function RemoveOldMap() {

  // if (Scene) {
  //   Scene.scene.restart();
  // }

  for (let i in gameStore.mapsState) {
    removeMap(gameStore.mapsState[i])
  }

  for (let i in gameStore.clouds) {
    gameStore.clouds[i].destroy();
    delete gameStore.clouds[i];
  }

  for (let i in gameStore.bullets) {
    deleteBullet(gameStore.bullets[i], i)
  }

  for (let i in gameStore.shields) {
    RemoveShield(gameStore.shields[i].uuid)
  }

  for (let i in gameStore.mapEditorState.labels) {
    if (gameStore.mapEditorState.labels.hasOwnProperty(i)) {
      gameStore.mapEditorState.labels[i].destroy();
      delete gameStore.mapEditorState.labels[i];
    }
  }

  for (let i in gameStore.spawns) {
    if (gameStore.spawns.hasOwnProperty(i)) {
      gameStore.spawns[i].destroy();
      delete gameStore.spawns[i];
    }
  }

  for (let i in gameStore.reservoirs) {
    removeReservoir(gameStore.reservoirs[i])
  }

  for (let i in gameStore.drones) {
    if (gameStore.drones.hasOwnProperty(i)) {
      removeDrone(gameStore.drones[i], i)
    }
  }

  store.commit({
    type: 'removeAllWindowsByComponentName',
    component: 'reservoirTip',
  });

  store.commit({
    type: 'setViolators',
    violators: {},
    distressSignals: {},
  });

  destroyAllSelectedSprite();
  RemoveAllMark();
}

function removeMap(mapState) {
  if (mapState.bmdTerrain) {
    mapState.bmdTerrain.bmd.clear();
    mapState.bmdTerrain.bmd.destroy();
  }

  removeAllObj();
  for (let obj of mapState.staticObjects) {
    if (obj.objectSprite) {
      if (obj.objectSprite.shadow) obj.objectSprite.shadow.destroy();
      obj.objectSprite.destroy();
    }
  }
  mapState.staticObjects = [];
}

export {RemoveOldMap}
