import {gameStore} from "../store";
import {Scene} from "../create";
import {GetGlobalPos} from "../map/gep_global_pos";
import {MoveSprite} from "../utils/move_sprite";

function CreateCloud(cloudState) {
  if (gameStore.gameReady) {

    let cloud = gameStore.clouds[cloudState.uuid];
    if (!cloud) cloud = createCloud(cloudState);

    let pos = GetGlobalPos(cloudState.x, cloudState.y, cloudState.m);

    MoveSprite(cloud, pos.x, pos.y, 1000, null);
  }
}

function createCloud(cloudState) {

  let pos = GetGlobalPos(cloudState.x, cloudState.y, cloudState.m);

  let cloud = Scene.make.sprite({
    x: pos.x,
    y: pos.y,
    key: cloudState.name,
    add: true
  });

  cloud.setOrigin(0.5);
  cloud.setAngle(cloudState.angle);
  cloud.setAlpha(cloudState.alpha);
  cloud.setDepth(1000);

  cloud.uuid = cloudState.uuid;

  gameStore.clouds[cloud.uuid] = cloud;

  Scene.cloudsLayer.add(cloud);

  return cloud
}

function removeCloud(cloudState) {
  let cloud = gameStore.clouds[cloudState.uuid];
  if (cloud) {
    cloud.destroy();
    delete delete gameStore.clouds.uuid;
  }
}

export {CreateCloud, removeCloud}
