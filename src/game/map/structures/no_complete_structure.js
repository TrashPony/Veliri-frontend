import {initTweenJammer} from "./jammer";
import {initTweenRadar} from "./radar";
import {initTweenShield} from "./shield";
import {gameStore} from "../../store";

function NoCompleteStructure(obj) {

  if (!obj.build) {
    return
  }

  if (obj.work) {
    // todo костыль из за того что твины при загрузке игры сразу не работают
    // todo еще если код с инитом твинов будет выше их включения то небудет ошибки но и работать не будет хз почему
    if (obj.objectSprite.top && obj.objectSprite.top.tween) {
      obj.objectSprite.top.tween.play();
    }

    if (obj.objectSprite.shadowTop && obj.objectSprite.shadowTop.tween) {
      obj.objectSprite.shadowTop.tween.play(); // todo resume() но чето не работает
    }

    if (!obj.objectSprite.initTween) {
      if (obj.type === "shield") initTweenShield(obj.objectSprite);
      if (obj.type === "jammer") initTweenJammer(obj.objectSprite);
      if (obj.type === "radar" || obj.type === "expensive_tower") initTweenRadar(obj.objectSprite);
    }
  } else {
    DisableObj(obj)
  }

  if (obj.complete < 100) {

    // обьект находится на стадии разработки
    if (obj.objectSprite.shadow) obj.objectSprite.shadow.visible = false;
    if (obj.objectSprite.shadowTop) obj.objectSprite.shadowTop.visible = false;
    if (obj.objectSprite.weaponShadow) obj.objectSprite.weaponShadow.visible = false;
    if (obj.objectSprite.equipShadow) obj.objectSprite.equipShadow.visible = false;

    if (obj.complete < 10) {
      obj.objectSprite.setAlpha(0.1);
      if (obj.objectSprite.top) obj.objectSprite.top.setAlpha(0.1);
      if (obj.objectSprite.weapon) obj.objectSprite.weapon.setAlpha(0.1);
      if (obj.objectSprite.equip) obj.objectSprite.equip.setAlpha(0.1);
    } else {
      obj.objectSprite.setAlpha(obj.complete / 100);
      if (obj.objectSprite.equip) obj.objectSprite.equip.setAlpha(obj.complete / 100);
      if (obj.objectSprite.top) obj.objectSprite.top.setAlpha(obj.complete / 100);
      if (obj.objectSprite.weapon) obj.objectSprite.weapon.setAlpha(obj.complete / 100);
    }

  } else {

    if (obj.objectSprite.alpha !== 1) obj.objectSprite.setAlpha(1);
    if (obj.objectSprite.top && obj.objectSprite.top.alpha !== 1) obj.objectSprite.top.setAlpha(1);
    if (obj.objectSprite.equip && obj.objectSprite.equip.alpha !== 1) obj.objectSprite.equip.setAlpha(1);
    if (obj.objectSprite.weapon && obj.objectSprite.weapon.alpha !== 1) obj.objectSprite.weapon.setAlpha(1);

    if (obj.objectSprite.shadow && !obj.objectSprite.shadow.visible) obj.objectSprite.shadow.setVisible(true);
    if (obj.objectSprite.shadowTop && !obj.objectSprite.shadowTop.visible) obj.objectSprite.shadowTop.setVisible(true);
    if (obj.objectSprite.weaponShadow && !obj.objectSprite.weaponShadow.visible) obj.objectSprite.weaponShadow.setVisible(true);
    if (obj.objectSprite.equipShadow && !obj.objectSprite.equipShadow.visible) obj.objectSprite.equipShadow.setVisible(true);
  }
}

function DisableObj(obj) {
  if (obj.objectSprite.top && obj.objectSprite.top.tween) {
    obj.objectSprite.top.tween.pause();
  }

  if (obj.objectSprite.shadowTop && obj.objectSprite.shadowTop.tween) {
    obj.objectSprite.shadowTop.tween.pause();
  }

  if (obj.objectSprite.equip && obj.objectSprite.equip.tween) {
    obj.objectSprite.equip.tween.pause();
  }

  if (obj.objectSprite.equipShadow && obj.objectSprite.equipShadow.tween) {
    obj.objectSprite.equipShadow.tween.pause();
  }

  if (gameStore.FogOfWar.objBrush.object[obj.id]) {
    gameStore.FogOfWar.objBrush.object[obj.id].destroy();
    delete gameStore.FogOfWar.objBrush.object[obj.id];
  }
}

export {NoCompleteStructure, DisableObj}
