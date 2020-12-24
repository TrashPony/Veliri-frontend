import {gameStore} from "../store";
import {SelectSprite} from "../utils/select_sprite";

let initBuilderRemoveTarget = false;

function BuilderTargets(data) {

  for (let i in gameStore.objects) {
    if (!gameStore.objects.hasOwnProperty(i)) continue;
    if (gameStore.objects[i] && !data.object_targets.hasOwnProperty(String(i))) {
      RemoveSelectSprite(gameStore.objects[i].objectSprite);
    }
  }

  if (!initBuilderRemoveTarget) {
    let closeTarget = setInterval(function () {
      if (initBuilderRemoveTarget < 0) {
        clearInterval(closeTarget);
        RemoveAllSelectSprite();
        initBuilderRemoveTarget = false;
      } else {
        initBuilderRemoveTarget -= 10
      }
    }, 10)
  }

  initBuilderRemoveTarget = 100;

  for (let id in data.object_targets) {
    if (!data.object_targets.hasOwnProperty(id)) continue;

    let obj = gameStore.objects[id];
    if (!obj) continue;

    if (data.object_targets[id]) {

      if (obj.objectSprite.noPassbuildSelectSprite) {
        obj.objectSprite.noPassbuildSelectSprite.setVisible(false);
      }

      if (obj.objectSprite.passBuildSelectSprite) {
        obj.objectSprite.passBuildSelectSprite.setVisible(true);
        continue
      }

      obj.objectSprite.passBuildSelectSprite = SelectSprite(obj.objectSprite.x, obj.objectSprite.y, null, 0xffffff, 0x00ff00, obj.objectSprite.displayHeight + 5);
    } else {

      if (obj.objectSprite.passBuildSelectSprite) {
        obj.objectSprite.passBuildSelectSprite.setVisible(false);
      }

      if (obj.objectSprite.noPassbuildSelectSprite) {
        obj.objectSprite.noPassbuildSelectSprite.setVisible(true);
        continue
      }

      obj.objectSprite.noPassbuildSelectSprite = SelectSprite(obj.objectSprite.x, obj.objectSprite.y, null, 0xff0000, 0xff0000, obj.objectSprite.displayHeight + 5);
    }
  }
}

function RemoveAllSelectSprite() {
  for (let i in gameStore.objects) {
    if (!gameStore.objects.hasOwnProperty(i) || !gameStore.objects[i]) continue;
    RemoveSelectSprite(gameStore.objects[i].objectSprite);
  }
}

function RemoveSelectSprite(obj) {
  if (obj.passBuildSelectSprite) {
    obj.passBuildSelectSprite.setVisible(false);
  }

  if (obj.noPassbuildSelectSprite) {
    obj.noPassbuildSelectSprite.setVisible(false);
  }
}

export {BuilderTargets}
