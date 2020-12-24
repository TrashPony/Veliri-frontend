import {Scene} from "../../create";
import {GetGlobalPos} from "../gep_global_pos";
import Phaser from "phaser";

function createRadar(x, y, texture, scale, needShadow, rotate, group, xShadowOffset, yShadowOffset, shadowIntensity, sprite, height, scene, mapID) {

  sprite.setDepth(1); // todo костыль из за тог очто обьект состоиз из 2х частей, а в фазер 3 нет детей у спрайтов
  let pos = GetGlobalPos(x, y, mapID);

  if (texture !== 'explores_observatory') {
    let shadow = scene.make.sprite({
      x: pos.x + 5,
      y: pos.y + 5,
      key: 'structures',
      add: true,
      frame: texture + "_top",
    });
    shadow.setOrigin(0.5);
    shadow.setScale(scale / 100);
    shadow.setAlpha(shadowIntensity / 100);
    shadow.setTint(0x000000);
    shadow.setDepth(height - 1);

    sprite.shadowTop = shadow;
  }

  let object = scene.make.sprite({
    x: pos.x,
    y: pos.y,
    key: 'structures',
    add: true,
    frame: texture + "_top",
  });
  object.setOrigin(0.5);
  object.setScale(scale / 100);
  object.setDepth(height);

  sprite.top = object;
}

function initTweenRadar(sprite) {
  sprite.initTween = true;

  let speed = 6000
  let ease = 'Linear'
  if (sprite.frame.name === 'explores_antenna' || sprite.frame.name === 'explores_observatory') {
    speed = 30000
  }

  if (sprite.frame.name === 'explores_observatory') ease = 'Back.easeInOut'

  sprite.top.tween = Scene.tweens.add({
    targets: sprite.top,
    props: {
      angle: {value: 360, duration: speed, ease: ease},
    },
    repeat: -1,
  });

  if (sprite.shadowTop) {
    sprite.shadowTop.tween = Scene.tweens.add({
      targets: sprite.shadowTop,
      props: {
        angle: {value: 360, duration: speed, ease: ease},
      },
      repeat: -1,
    });
  }
}

export {createRadar, initTweenRadar}
