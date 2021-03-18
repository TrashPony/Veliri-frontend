import {gameStore} from "../store";
import {Scene} from "../create";
import {ShortDirectionRotateTween} from "../utils/utils";
import {UpdatePosBars} from "../interface/status_layer";
import {GetGlobalPos} from "../map/gep_global_pos";
import {MoveSprite} from "../utils/move_sprite";

function BoxMove(path, boxId, mapID) {

  let box = gameStore.boxes[boxId];
  if (box) {
    
    let pos = GetGlobalPos(path.x, path.y, mapID);
    path.x = pos.x;
    path.y = pos.y;

    MoveSprite(box.sprite, path.x, path.y, path.millisecond, null);
    if (box.sprite.shadow) MoveSprite(box.sprite.shadow, path.x + Scene.shadowXOffset / 2, path.y + Scene.shadowYOffset / 2, path.millisecond, null);

    UpdatePosBars(box.sprite, box.max_hp, box.hp, 0, null, Scene, 'box', box.id, 'hp', 50);

    ShortDirectionRotateTween(box.sprite, path.rotate, path.millisecond);
    if (box.sprite.shadow) ShortDirectionRotateTween(box.sprite.shadow, path.rotate, path.millisecond);
  }
}

export {BoxMove}
