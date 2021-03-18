import {Scene} from "../create";
import {GetGlobalPos} from "../map/gep_global_pos";
import {MoveSprite} from "../utils/move_sprite";

let cacheNumber = {};

function HitItem(count, item, x, y, uuid, mapID) {

  function randomInt(min, max) {
    return min + Math.floor((max - min) * Math.random());
  }

  let allTime = 1250
  let pos = GetGlobalPos(x, y, mapID);
  x = pos.x;
  y = pos.y;

  x += randomInt(-15, 15);
  y += randomInt(-15, 15);

  if (!cacheNumber[count]) {

    if (count > 0) {
      count = "+" + count
    }

    let text = Scene.add.text(0, 0, count, {
      font: "36px Arial Black",
      fill: "#fff"
    });
    text.setStroke('#000', 8);

    let rt = Scene.add.renderTexture(0, 0, 128, 64);
    rt.draw(text, 0, 0);
    rt.saveTexture("number_" + count);

    rt.destroy();
    text.destroy();

    cacheNumber[count] = true;
  }

  let itemIcon = Scene.make.sprite({
    x: x + 13,
    y: y,
    key: "items",
    frame: item.item.name,
    add: true
  });
  itemIcon.setDepth(1001);
  itemIcon.setOrigin(0.5);
  itemIcon.setScale(0.3);

  MoveSprite(itemIcon, itemIcon.x, itemIcon.y - 100, allTime, null);
  Scene.tweens.add({
    targets: itemIcon,
    alpha: 0,
    ease: 'Linear',
    duration: allTime / 2,
    delay: allTime / 2,
  });

  let text = Scene.make.sprite({
    x: x,
    y: y,
    key: "number_" + count,
    add: true
  });

  text.setDepth(1001);
  text.setOrigin(0.5);
  text.setScale(0.22);

  MoveSprite(text, text.x, text.y - 100, allTime, null);
  Scene.tweens.add({
    targets: text,
    alpha: 0,
    ease: 'Linear',
    duration: allTime / 2,
    delay: allTime / 2,
  });

  setTimeout(function () {
    text.destroy();
    itemIcon.destroy();
  }, allTime)
}

export {HitItem}
