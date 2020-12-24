import {gameStore} from "../store";
import {GetMapLvl, GetOffsetShadowByMapLvl, GetSpriteSizeByMapLvl} from "../map/height_offset";
import {Scene} from "../create";
import {ShortDirectionRotateTween} from "../utils/utils";
import {evacuationSpriteScale} from "../evacuation/create";
import {GetGlobalPos} from "../map/gep_global_pos";
import {MoveSprite} from "../utils/move_sprite";

function AddDroneMoveBufferData(data) {
  if (!gameStore.unitReady) return;

  let sprite = gameStore.drones[data.id];

  if (sprite) {

    if (!sprite.bufferMoveTick) {
      sprite.bufferMoveTick = [];
    }

    while (sprite.bufferMoveTick.length > 5) {
      sprite.bufferMoveTick.shift();
    }

    sprite.bufferMoveTick.push(data);

    // показываем прошлый тик что бы компенсировать сетевые лаги
    if (!sprite.updaterPos && sprite.bufferMoveTick.length > 0) {
      sprite.updaterPos = true;
    }
  }
}

function DroneTo(drone) {

  if (!drone || !drone.sprite) return;

  let data = drone.bufferMoveTick.shift();
  if (!data) {
    return;
  }

  let path = data.path_unit;
  let pos = GetGlobalPos(path.x, path.y, data.map_id);
  path.x = pos.x;
  path.y = pos.y;

  let size = GetSpriteSizeByMapLvl(path.z, GetSpriteSizeByMapLvl(GetMapLvl(path.x, path.y, data.map_id), evacuationSpriteScale / 100, 0.02).x, 0.02);
  MoveSprite(drone.sprite, path.x, path.y, path.millisecond, size.x);
  let shadowPos = GetOffsetShadowByMapLvl(path.z, path.x, path.y, 0.5, 2.5, data.map_id);
  MoveSprite(drone.sprite.shadow, shadowPos.x, shadowPos.y, path.millisecond, size.x);

  drone.sprite.setDepth(path.z);
  drone.sprite.shadow.setDepth(path.z - 1);

  ShortDirectionRotateTween(drone.sprite, path.rotate, path.millisecond);
  ShortDirectionRotateTween(drone.sprite.shadow, path.rotate, path.millisecond);
}

export {DroneTo, AddDroneMoveBufferData}
