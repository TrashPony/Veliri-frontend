import {gameStore} from "../store";
import {Scene} from "../create";

function showMessage(msg) {

  if (!gameStore.unitReady) {
    return
  }

  let unit;
  for (let i in gameStore.units) {
    if (gameStore.units[i].owner_id === Number(msg.user_id)) {
      unit = gameStore.units[i];
    }
  }

  if (!unit) {
    return;
  }

  let text = msg.message;
  if (text.length > 20) {
    text = text.substring(0, 20) + "...";
  }

  if (!unit.sprite.userMessage) unit.sprite.userMessage = {}

  if (unit.sprite.userMessage.text) {
    unit.sprite.userMessage.text.destroy();
  }

  unit.sprite.userMessage.text = Scene.add.bitmapText(unit.sprite.x, unit.sprite.y - 45, 'bit_text', text, 22)
  unit.sprite.userMessage.text.setOrigin(0.5, 0);
  unit.sprite.userMessage.text.setScale(0.5)
  unit.sprite.userMessage.text.setDepth(1001);

  let textSprite = unit.sprite.userMessage.text;
  setTimeout(function () {
    textSprite.destroy();
  }, 3500)
}

export {showMessage}
