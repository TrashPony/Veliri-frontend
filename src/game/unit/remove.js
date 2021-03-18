import {gameStore} from "../store";
import {ClearBars} from "../interface/status_layer";
import {unitRemoveInfo} from "./mouse_body_over";

function removeUnit(unit) {
  if (unit.oldPoint) {
    while (0 < unit.oldPoint.length) {
      let label = unit.oldPoint.shift();
      if (label) label.destroy();
    }
  }

  if (unit.sprite.shield) {
    unit.sprite.shield.sprite.border.destroy();
    unit.sprite.shield.sprite.destroy();
  }

  if (unit.sprite) {
    unit.sprite.destroy();
  }
  if (unit.colision) {
    unit.colision.destroy();
  }

  if (unit.userLabel) {
    unit.userLabel.remove();
  }

  if (unit.sprite.passUnitSelectSprite) {
    unit.sprite.passUnitSelectSprite.destroy()
  }

  if (unit.sprite.noPassUnitSelectSprite) {
    unit.sprite.noPassUnitSelectSprite.destroy()
  }

  ClearBars('unit', unit.id, 'hp');
  ClearBars('unit', unit.id, 'shield');

  let gameUnit = gameStore.units[unit.id];
  if (gameUnit) {
    clearInterval(gameUnit.updaterPos);
    if (gameUnit.sprite.userName) {
      if (gameUnit.sprite.userName.login) unit.sprite.userName.login.destroy();
      if (gameUnit.sprite.userName.pointer) unit.sprite.userName.pointer.destroy();
      if (gameUnit.sprite.userName.detail) unit.sprite.userName.detail.destroy();
      if (unit.sprite.userName.pk) unit.sprite.userName.pk.destroy();
    }
  }

  unitRemoveInfo(unit, unit.sprite, true);
  delete gameStore.units[unit.id]
}

export {removeUnit}
