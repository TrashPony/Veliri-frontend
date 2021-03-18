import {Scene} from "../create";
import {GetGlobalPos} from "../map/gep_global_pos";

let cacheNumber = {};

function damageText(data) {
  let text;

  if (!cacheNumber[data.d]) {
    let text = Scene.add.bitmapText(0, 0, 'bit_text', data.d, 32);

    let rt = Scene.add.renderTexture(0, 0, 36, 36);
    rt.draw(text, 2, 2);
    rt.saveTexture("number_" + data.d);

    rt.destroy();
    text.destroy();

    cacheNumber[data.d] = true;
  }

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
  text.setScale(0.55);

  Scene.tweens.add({
    targets: text,
    x: text.x,
    y: text.y - 100,
    ease: 'Linear',
    duration: 1000,
    onComplete: function () {
      text.destroy();
    }
  });
}

export {damageText}
