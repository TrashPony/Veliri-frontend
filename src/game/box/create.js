import {gameStore} from "../store";
import {Scene} from "../create";
import store from '../../store/store'
import {CreateMapBar} from "../interface/status_layer";
import {GetGlobalPos} from "../map/gep_global_pos";

function CreateBox(mapBox) {

  if (!gameStore.gameReady) return;

  let oldBox = gameStore.boxes[mapBox.id];
  if (oldBox) return;

  let pos = GetGlobalPos(mapBox.x, mapBox.y, mapBox.map_id);
  mapBox.x = pos.x;
  mapBox.y = pos.y;

  let boxShadow;
  if (!mapBox.underground) {

    boxShadow = Scene.make.sprite({
      x: mapBox.x + Scene.shadowXOffset / 2,
      y: mapBox.y + Scene.shadowYOffset / 2,
      key: mapBox.type,
      add: true
    });

    boxShadow.setOrigin(0.5);
    boxShadow.setScale(0.1);
    boxShadow.setAngle(mapBox.rotate);
    boxShadow.setAlpha(0.4);
    boxShadow.setTint(0x000000);
    mapBox.shadow = boxShadow;
    boxShadow.setDepth(24);
  }

  let box = Scene.make.sprite({
    x: mapBox.x,
    y: mapBox.y,
    key: mapBox.type,
    add: true
  });

  box.setOrigin(0.5);
  box.setScale(0.1);
  box.setAngle(mapBox.rotate);
  box.setDepth(25);
  mapBox.sprite = box;

  if (boxShadow) {
    box.shadow = boxShadow;
  }

  box.setInteractive({
    pixelPerfect: true,
    alphaTolerance: 1
  });

  box.on('pointerover', function (event) {
    box.setPipeline("outline");
  });

  box.on('pointerout', function (event) {
    box.resetPipeline();
  });

  box.on('pointerdown', function (pointer, gameObject) {
    store.getters.getWSByService('global').socket.send(JSON.stringify({
      event: "openBox",
      box_id: mapBox.id,
    }));
  });

  gameStore.boxes[mapBox.id] = mapBox;
  CreateMapBar(mapBox.sprite, mapBox.max_hp, mapBox.hp, 0, null, Scene, 'box', mapBox.id, 'hp', 50);
}

export {CreateBox}
