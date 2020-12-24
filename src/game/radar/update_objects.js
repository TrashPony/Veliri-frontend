import {gameStore} from "../store";
import {NoCompleteStructure} from "../map/structures/no_complete_structure";
import {Scene} from "../create";
import {UpdateShield} from "../shield/shield";
import {CreateMapBar, createObjectBars} from "../interface/status_layer";
import {MoveSprite} from "../utils/move_sprite";

function UpdateObject(mark, updateMsg) {

  if (mark.to === "transport") {

  }

  if (mark.to === "box") {
    UpdateBox(mark.id, updateMsg);
  }

  if (mark.to === "unit") {
    UpdateUnit(mark.id, updateMsg);
  }

  if (mark.to === "reservoir") {
  }

  if (mark.to === "dynamic_objects") {
    UpdateDynamicObject(mark, updateMsg);
    createObjectBars(mark.id);
  }

  if (mark.to === "shield") {
    UpdateShield(mark.uo, updateMsg)
  }
}

function UpdateBox(id, update) {
  // у ящика может поменяется только хп
  let box = gameStore.boxes[id];
  box.hp = update.hp;
  CreateMapBar(box.sprite, box.max_hp, box.hp, 0, null, Scene, 'box', box.id, 'hp', 50);
}

function UpdateUnit(id, update) {
  // у юнита может поменяется только хп, но это не точно
  let unit = gameStore.units[id];
  if (unit) {
    unit.hp = update.hp;
    CreateMapBar(unit.sprite, unit.body.max_hp, unit.hp, 10, null, Scene, 'unit', unit.id, 'hp', 50);
  }
}

function UpdateDynamicObject(mark, object) {

  if (gameStore.objects[mark.id]) {

    let obj = gameStore.objects[mark.id];

    if (object.gd) {
      for (let i in object.gd) {
        object.gd[i] = JSON.parse(object.gd[i])
      }
      obj.geo_data = object.gd;
    }

    if (object.s) obj.scale = object.s;
    if (object.hp) obj.hp = object.hp;
    if (object.mhp) obj.max_hp = object.mhp;
    if (object.c) obj.complete = object.c;
    if (object.rr) obj.range_radar = object.rr;
    if (object.ce) obj.current_energy = object.ce;
    if (object.me) obj.max_energy = object.me;
    if (object.ow) obj.owner_id = object.ow;
    if (object.w) obj.work = object.w

    NoCompleteStructure(obj);


    if (!obj.build) {
      let setScale = function (sprite) {

        if (object.s && object.gt) {
          let tween = Scene.tweens.add({
            targets: sprite,
            scale: object.s / 100,
            ease: 'Linear',
            duration: object.gt,
            onComplete: function () {
              tween.remove();
            }
          });
        }
      };


      if (!obj.build) {
        if (object.h) obj.objectSprite.setDepth(object.h);
      }
      setScale(obj.objectSprite);

      if (obj.objectSprite.shadow) {

        if (!obj.build) {
          if (object.h) obj.objectSprite.shadow.setDepth(object.h - 2);
        }

        if (object.xs && object.ys && object.gt && object.s) {
          MoveSprite(obj.objectSprite.shadow, obj.objectSprite.x + object.xs, obj.objectSprite.y + object.ys, object.gt, object.s / 100);
        }
      }
    }
  }
}

export {UpdateObject}
