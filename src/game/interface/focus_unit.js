import {gameStore} from "../store";
import {Scene} from "../create";

function FocusUnit(id) {
  let unit = gameStore.units[id];

  if (unit && unit.sprite) {
    //game.camera.focusOnXY(unit.sprite.x * game.camera.scale.x, unit.sprite.y * game.camera.scale.y);
    Scene.cameras.main.startFollow(unit.sprite);
  }
}

function FocusMS() {
  if (!gameStore.gameReady) return;

  FocusUnit(gameStore.user_squad_id)
}

export {FocusUnit, FocusMS}
