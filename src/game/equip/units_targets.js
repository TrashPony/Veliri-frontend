import {gameStore} from "../store";
import {SelectSprite} from "../utils/select_sprite";

let initUnitsRemoveTarget = false;

function UnitsTargets(data) {

  if (!initUnitsRemoveTarget) {
    let closeTarget = setInterval(function () {
      if (initUnitsRemoveTarget < 0) {
        clearInterval(closeTarget);
        RemoveAllSelectSpriteUnits();
        initUnitsRemoveTarget = false;
      } else {
        initUnitsRemoveTarget -= 10
      }
    }, 10)
  }

  initUnitsRemoveTarget = 100;

  for (let id in data.object_targets) {
    if (!data.object_targets.hasOwnProperty(id)) continue;

    let unit = gameStore.units[id];
    if (!unit) continue;

    if (data.object_targets[id]) {

      if (unit.sprite.noPassUnitSelectSprite) {
        unit.sprite.noPassUnitSelectSprite.setVisible(false);
      }

      if (unit.sprite.passUnitSelectSprite) {
        unit.sprite.passUnitSelectSprite.setVisible(true);
        continue
      }

      unit.sprite.passUnitSelectSprite = SelectSprite(unit.sprite.x, unit.sprite.y, null, 0xffffff, 0x00ff00, unit.body.radius * 2 + 15);
    } else {

      if (unit.sprite.passUnitSelectSprite) {
        unit.sprite.passUnitSelectSprite.setVisible(false);
      }

      if (unit.sprite.noPassUnitSelectSprite) {
        unit.sprite.noPassUnitSelectSprite.setVisible(true);
        continue
      }

      unit.sprite.noPassUnitSelectSprite = SelectSprite(unit.sprite.x, unit.sprite.y, null, 0xff0000, 0xff0000, unit.body.radius * 2 + 15);
    }
  }
}

function RemoveAllSelectSpriteUnits() {
  for (let i in gameStore.units) {
    if (!gameStore.units.hasOwnProperty(i) || !gameStore.units[i]) continue;
    RemoveSelectSpriteUnit(gameStore.units[i].sprite);
  }
}

function RemoveSelectSpriteUnit(unit) {
  if (unit.noPassUnitSelectSprite) {
    unit.noPassUnitSelectSprite.setVisible(false);
  }

  if (unit.passUnitSelectSprite) {
    unit.passUnitSelectSprite.setVisible(false);
  }
}

export {UnitsTargets}
