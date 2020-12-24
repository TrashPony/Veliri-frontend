import {gameStore} from "../store";
import {HideMarkByTypeAndID} from "../radar/marks";
import {GetGlobalPos} from "../map/gep_global_pos";
import {MoveSprite} from "../utils/move_sprite";
import {GetMapLvl, GetOffsetShadowByMapLvl, GetSpriteSizeByMapLvl} from "../map/height_offset";
import {evacuationSpriteScale} from "./create";
import {ShortDirectionRotateTween} from "../utils/utils";

function AddTransportMoveBufferData(data) {
  if (!gameStore.unitReady) return;

  let sprite = gameStore.evacuations[data.id];

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

function FreeMoveEvacuation(transport, ms, id) {

  if (!gameStore.evacuations.hasOwnProperty(id)) return;

  let path = transport.bufferMoveTick.shift();
  if (!path) {
    return;
  }

  HideMarkByTypeAndID("transport", path.id);

  let pos = GetGlobalPos(path.x, path.y, path.m);

  let scale = GetSpriteSizeByMapLvl(path.z, GetSpriteSizeByMapLvl(GetMapLvl(pos.x, pos.y, path.m), evacuationSpriteScale / 100, 0.02).x, 0.02).x;
  MoveSprite(transport, pos.x, pos.y, ms, scale);

  let offsetShadow = GetOffsetShadowByMapLvl(path.z, pos.x, pos.y, 0, 2.5, path.m);
  MoveSprite(transport.shadow, offsetShadow.x, offsetShadow.y, ms, scale);

  if (path.z !== transport.depth) {
    transport.setDepth(path.z);
    transport.shadow.setDepth(path.z - 1);
  }

   ShortDirectionRotateTween(transport, path.r, ms);
   ShortDirectionRotateTween(transport.shadow, path.r, ms);
}


export {FreeMoveEvacuation, AddTransportMoveBufferData}
