import {Scene} from "../create";
import {GetGlobalPos} from "../map/gep_global_pos";
import {MoveSprite} from "../utils/move_sprite";

function damageText(data) {
  let text;

  let pos = GetGlobalPos(data.x, data.y, data.m);
  text = Scene.make.sprite({
    x: pos.x,
    y: pos.y,
    key: "number_" + data.d,
    add: true
  });

  if (data.t === "shield") {
    text.setTint(0x00d3ff)
  }

  text.setDepth(1001);
  text.setOrigin(0.5);
  text.setScale(0.3);

  MoveSprite(text, text.x, text.y - 100, 1000, null);
  setTimeout(function () {
    text.destroy();
  }, 1000)
}

export {damageText}
