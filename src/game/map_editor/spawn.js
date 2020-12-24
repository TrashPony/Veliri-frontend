import {Scene} from "../create";
import {GetGlobalPos} from "../map/gep_global_pos";
import {gameStore} from "../store";

let texture = false;

function CreateSpawnTexture() {
  texture = true;
  let graphics = Scene.add.graphics();
  graphics.setDefaultStyles({
    fillStyle: {
      color: 0xFFFFFF,
      alpha: 0.1
    },
    lineStyle: {
      width: 4,
      color: 0xFFFFFF,
      alpha: 0.3
    },
  });

  let circle = {x: 304, y: 304, radius: 300};
  graphics.fillCircleShape(circle);
  graphics.strokeCircleShape(circle);
  graphics.generateTexture("circle_spawn", 300 * 2 + 8, 300 * 2 + 8);
  graphics.destroy();
}

function CreateSpawnZone(spawns) {
  for (let spawn of spawns) {
    CreateSpawn(spawn);
  }
}

function CreateSpawn(spawn) {

  if (!texture) {
    CreateSpawnTexture()
  }

  let pos = GetGlobalPos(spawn.x, spawn.y, gameStore.map.id);

  let captureCircle = Scene.make.sprite({
    x: pos.x,
    y: pos.y,
    key: "circle_spawn",
    add: true
  });
  captureCircle.setOrigin(0.5);
  captureCircle.setDisplaySize(spawn.radius * 2, spawn.radius * 2);
  captureCircle.setDepth(10);

  gameStore.spawns[spawn.x + ':' + spawn.y + ':' + gameStore.map.id] = captureCircle;
}

export {CreateSpawnZone, CreateSpawn}
