import {Scene} from "../../create";
import {GetGlobalPos} from "../gep_global_pos";

function createShield(x, y, texture, scale, needShadow, rotate, group, xShadowOffset, yShadowOffset, shadowIntensity, sprite, height, scene, mapID) {

  sprite.setDepth(1); // todo костыль из за тог очто обьект состоиз из 2х частей, а в фазер 3 нет детей у спрайтов

  let pos = GetGlobalPos(x, y, mapID);

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
  sprite.shadowTop = shadow;

  sprite.light = Scene.add.pointlight(pos.x, pos.y, 0, 15, 0.3);
  sprite.light.color.setTo(0, 255, 255);
  sprite.light.setDepth(height - 1);
}

function initTweenShield(sprite) {
  sprite.initTween = true;
  sprite.top.tween = Scene.tweens.add({
    targets: sprite.top,
    props: {
      angle: {value: 360, duration: 3000, ease: 'Linear'},
    },
    repeat: -1,
  });

  sprite.shadowTop.tween = Scene.tweens.add({
    targets: sprite.shadowTop,
    props: {
      angle: {value: 360, duration: 3000, ease: 'Linear'},
    },
    repeat: -1,
  });

  sprite.shadowTop.lightTween = Scene.tweens.add({
    targets: sprite.light,
    attenuation: 0.2,
    intensity: 0,
    ease: 'Quad.easeOut',
    duration: 2000,
    yoyo: true,
    repeat: -1,
  });
}

export {createShield, initTweenShield}
