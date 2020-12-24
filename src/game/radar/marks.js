import {gameStore} from "../../game/store"
import {Scene} from "../../game/create"
import {GetGlobalPos} from "../map/gep_global_pos";
import {MoveSprite} from "../utils/move_sprite";

function CreateMark(markUUID, markType, x, y) {
  let oldMark = gameStore.radar_marks[markUUID];
  if (oldMark) {
    RemoveMark(markUUID)
  }

  let mark = {uuid: markUUID, type: markType};

  let pos = GetGlobalPos(x, y, gameStore.map.id);
  mark.sprite = Scene.make.sprite({
    x: pos.x,
    y: pos.y,
    key: markType + "_radar_icon",
    add: true
  });
  mark.sprite.setOrigin(0.5);
  mark.sprite.setScale(0.2);
  mark.sprite.setDepth(999);

  gameStore.radar_marks[markUUID] = mark;

  return mark
}

function RemoveAllMark() {
  for (let uuid in gameStore.radar_marks) {
    RemoveMark(uuid);
  }
}

function HideMarkByTypeAndID(type, id) {
  for (let uuid in gameStore.radar_marks) {
    if (gameStore.radar_marks[uuid].type_object === type && gameStore.radar_marks[uuid].id_object === id) {
      HideMark(uuid)
    }
  }
}

function RemoveMark(uuid) {
  let mark = gameStore.radar_marks[uuid];
  if (mark) {
    mark.sprite.destroy();
    delete gameStore.radar_marks[uuid];
  }
}

function HideMark(uuid) {
  let mark = gameStore.radar_marks[uuid];
  if (mark) {
    mark.sprite.setVisible(false);
  }
}

function UnhideMark(markUUID, markType, x, y) {
  let oldMark = gameStore.radar_marks[markUUID];
  if (oldMark) {

    let pos = GetGlobalPos(x, y, gameStore.map.id);

    oldMark.sprite.x = pos.x;
    oldMark.sprite.y = pos.y;
    oldMark.sprite.setVisible(true);
  } else {
    CreateMark(markUUID, markType, x, y)
  }
}

function MoveMark(data) {
  let path = data;

  let mark = gameStore.radar_marks[data.mu];
  if (!mark) {
    mark = CreateMark(data.mu, data.mt, path.x, path.y)
  }

  if (!mark.sprite.visible) {
    UnhideMark(data.mu, data.mt, path.x, path.y);
    return;
  }

  let pos = GetGlobalPos(path.x, path.y, gameStore.map.id);

  MoveSprite(mark.sprite, pos.x, pos.y, path.ms, null);
}

export {CreateMark, RemoveMark, MoveMark, HideMark, UnhideMark, RemoveAllMark, HideMarkByTypeAndID}
