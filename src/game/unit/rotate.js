import {gameStore} from "../store";
import {Scene} from "../create";
import {PositionAttachSprite, ShortDirectionRotateTween} from "../utils/utils";
import {GetSpriteEquip} from './equip'

function SetBodyAngle(unit, angle, time, ignoreOldTween, shadowDist) {
  SetShadowAngle(unit, time, shadowDist);
  if (angle > 180) {
    angle -= 360
  }

  ShortDirectionRotateTween(unit.sprite, angle, time);
}

function RotateGun(data) {
  if (!gameStore.gameReady) return;

  let unit = gameStore.units[data.id];

  if (!unit || !unit.sprite) return;

  ShortDirectionRotateTween(unit.sprite.weapon, data.r - unit.sprite.angle, data.ms);
  ShortDirectionRotateTween(unit.sprite.weaponShadow, data.r - unit.sprite.angle, data.ms);
  if (unit.sprite.weapon.mask1) ShortDirectionRotateTween(unit.sprite.weapon.mask1, data.r - unit.sprite.angle, data.ms);
  if (unit.sprite.weapon.mask2) ShortDirectionRotateTween(unit.sprite.weapon.mask2, data.r - unit.sprite.angle, data.ms);

  let connectWeapons = PositionAttachSprite(45 - unit.sprite.angle, Scene.shadowXOffset * 2);
  shadowTime(unit.sprite.weaponShadow, connectWeapons.x + unit.sprite.weapon.xAttach, connectWeapons.y + unit.sprite.weapon.yAttach, data.ms);
}

function RotateEquip(data) {

  if (!gameStore.gameReady) return;

  let unit = gameStore.units[data.id];

  if (!unit) return;

  let equipSprite = GetSpriteEquip(unit.id, data.ts, data.s).sprite;
  ShortDirectionRotateTween(equipSprite, data.r - unit.sprite.angle, data.ms);

  if (equipSprite.shadow) ShortDirectionRotateTween(equipSprite.shadow, data.r - unit.sprite.angle, data.ms);
}

function SetShadowAngle(unit, time, shadowDist) {

  // поворачиваем тени относительно поворота главного спрайта unit.sprite.angle
  // выставляем положение каждые 100мс
  //let rotateShadow = setInterval(function () {

    let shadowAngle = 45 - unit.sprite.angle;
    let connectPoints = PositionAttachSprite(shadowAngle, shadowDist);
    shadowTime(unit.sprite.bodyShadow, connectPoints.x, connectPoints.y);
    shadowTime(unit.sprite.bodyBottomShadow, connectPoints.x, connectPoints.y);

    for (let i = 0; i < unit.sprite.equipSprites.length; i++) {
      let slot = unit.sprite.equipSprites[i];
      let connectWeapons = PositionAttachSprite(shadowAngle, Scene.shadowXOffset * 2);
      shadowTime(slot.shadow, connectWeapons.x + slot.xAttach, connectWeapons.y + slot.yAttach);
      slot.shadow.angle = slot.sprite.angle;
    }
  //}, 10);

  // когда кончается общее время данное на поворот time, останавливаем проверку положения тени
  // setTimeout(function () {
  //   clearInterval(rotateShadow);
  // }, time)
}

function shadowTime(sprite, newX, newY, rotateTime = 10) {
  Scene.tweens.add({
    targets: sprite,
    props: {
      x: {value: newX, duration: rotateTime, ease: 'Linear'},
      y: {value: newY, duration: rotateTime, ease: 'Linear'}
    },
    repeat: 0,
  });
}

export {SetBodyAngle, RotateGun, RotateEquip, SetShadowAngle}
