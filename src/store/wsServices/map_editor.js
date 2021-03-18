import {RemoveOldMap} from "../../game/map/remove_old_map";
import {gameStore} from "../../game/store";
import {CreateGame, Scene} from "../../game/create";
import {CreateLabelBase, CreateMapLabels} from "../../game/map_editor/labels";
import {MapSize} from "../../game/map/createMap";
import {CreateSpawn, CreateSpawnZone} from "../../game/map_editor/spawn";
import {CreateDynamicObjects} from "../../game/radar/object";

export default function createMapEditorPlugin(WS) {
  return store => {

    WS.onopen = function () {
      console.log("Connection map_editor opened..." + this.readyState);

      store.commit({
        type: 'setWSConnectState',
        service: 'map_editor',
        connect: true,
        error: false,
        reconnect: false,
        ws: WS,
      });

      store.commit({
        type: 'setEndLoadServices',
        service: 'map_editor',
      });

      WS.send(JSON.stringify({
        event: "getMapList"
      }));

      WS.send(JSON.stringify({
        event: "getAllTypeCoordinate"
      }));

      gameStore.mapEditor = true
    };

    WS.onclose = function (i) {
      store.commit({
        type: 'setWSConnectState',
        service: 'map_editor',
        connect: false,
        error: true,
        ws: WS,
      });
      console.log(i, 'map_editor закрыл');
    };

    WS.onmessage = function (msg) {
      if (msg.data) MapEditorReader(JSON.parse(msg.data), store)
    };
  };
}

let init = false;

function MapEditorReader(data, store) {

  if (data.event === "MapList") {
    store.commit({
      type: 'setMapsInMapEditor',
      maps: data.maps,
    });
  }

  if (data.event === "getAllTypeCoordinate") {
    store.commit({
      type: 'setTypeCoordinates',
      typeCoordinates: data.type_coordinates,
    });
  }

  if (data.event === "MapSelect") {
    RemoveOldMap();

    gameStore.maps = data.full_maps;
    gameStore.bases = data.bases;
    gameStore.gameDataInit.data = true;


    CreateGame(true);

    let wait = setInterval(function () {
      if (gameStore.gameReady) {

        CreateDynamicObjects(data.dynamic_objects)
        CreateMapLabels(gameStore.map, false);
        CreateLabelBase(gameStore.bases);
        clearInterval(wait);
        CreateSpawnZone(gameStore.map.spawns);
        CreateSpawnZone(gameStore.map.bases);

        for (let i in gameStore.map.predefined_dynamic_objects) {
          if (gameStore.map.predefined_dynamic_objects.hasOwnProperty(i)) {
            let obj = gameStore.map.predefined_dynamic_objects[i];
            CreateSpawn({x: obj.x, y: obj.y, radius: 25});
          }
        }

        if (!init) {
          init = true;
          Scene.cameras.main.centerOn(MapSize, MapSize);
        }
      }
    }, 100);
  }

  if (data.event === "updateLvl") {
    console.log(data.map.level_map)
    gameStore.map.level_map = data.map.level_map;
  }

  if (data.event === "updateTypeCoordinate") {
    if (gameStore.mapEditorState.typeCoordinateEdit) {
      gameStore.mapEditorState.typeCoordinateEdit = data.dynamic_object;
      gameStore.mapEditorState.typeCoordinateEdit.type_geo_data = data.type_geo_data;
    }
  }
}
