import {gameStore} from "../store";
import {ClearBars} from "../interface/status_layer";

function DestroyBox(id) {
  let box = gameStore.boxes[id];
  if (box) {
    box.sprite.destroy();
    if (box.shadow) {
      box.shadow.destroy();
    }
    ClearBars('box', box.id, 'hp');
    delete gameStore.boxes[id]
  }
}

export {DestroyBox}
