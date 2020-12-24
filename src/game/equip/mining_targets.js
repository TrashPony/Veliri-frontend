import {gameStore} from "../store";
import {SelectSprite} from "../utils/select_sprite";

let initMiningRemoveTarget = false;

function MiningTargets(data) {

  if (!initMiningRemoveTarget) {
    let closeTarget = setInterval(function () {
      if (initMiningRemoveTarget < 0) {
        clearInterval(closeTarget);
        RemoveAllSelectSpriteReservoirs();
        initMiningRemoveTarget = false;
      } else {
        initMiningRemoveTarget -= 10
      }
    }, 10)
  }

  initMiningRemoveTarget = 100;

  for (let id in data.object_targets) {
    if (!data.object_targets.hasOwnProperty(id)) continue;

    let obj = gameStore.reservoirs[id];
    if (!obj) continue;

    if (data.object_targets[id]) {

      if (obj.sprite.noPassMiningSelectSprite) {
        obj.sprite.noPassMiningSelectSprite.setVisible(false);
      }

      if (obj.sprite.passMiningSelectSprite) {
        obj.sprite.passMiningSelectSprite.setVisible(true);
        continue
      }

      obj.sprite.passMiningSelectSprite = SelectSprite(obj.sprite.x, obj.sprite.y, null, 0xffffff, 0x00ff00, obj.sprite.displayHeight + 5);
    } else {

      if (obj.sprite.passMiningSelectSprite) {
        obj.sprite.passMiningSelectSprite.setVisible(false);
      }

      if (obj.sprite.noPassMiningSelectSprite) {
        obj.sprite.noPassMiningSelectSprite.setVisible(true);
        continue
      }

      obj.sprite.noPassMiningSelectSprite = SelectSprite(obj.sprite.x, obj.sprite.y, null, 0xff0000, 0xff0000, obj.sprite.displayHeight + 5);
    }
  }
}

function RemoveAllSelectSpriteReservoirs() {
  for (let i in gameStore.reservoirs) {
    if (!gameStore.reservoirs.hasOwnProperty(i) || !gameStore.reservoirs[i]) continue;
    RemoveSelectSpriteReservoir(gameStore.reservoirs[i].sprite);
  }
}

function RemoveSelectSpriteReservoir(obj) {
  if (obj.noPassMiningSelectSprite) {
    obj.noPassMiningSelectSprite.setVisible(false);
  }

  if (obj.passMiningSelectSprite) {
    obj.passMiningSelectSprite.setVisible(false);
  }
}

export {MiningTargets, RemoveAllSelectSpriteReservoirs, RemoveSelectSpriteReservoir}
