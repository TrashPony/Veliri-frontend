import {CreateAnimate, CreateObject} from "../map/objects";
import {CreateNewUnit} from "../unit/unit";
import {removeUnit} from "../unit/remove";
import {gameStore} from "../store";
import {Scene} from "../create";
import {CreateShield, RemoveShield} from "../shield/shield";
import {CreateReservoir} from "../map/reservoir";
import {RemoveSelectSpriteReservoir} from "../equip/mining_targets";
import {CreateEvacuation} from "../evacuation/create";
import {CreateBox} from "../box/create";
import {DestroyBox} from "../box/remove";
import {CreateDrone} from "../drone/create";
import {GetSpriteEquip} from "../unit/equip";
import {deleteBullet} from "../bullet/remove";
import store from "../../store/store";
import {ClearBars, createObjectBars} from "../interface/status_layer";
import {ParseObject} from "../map/createMap";
import {CreateMapItems, DestroyItem} from "../map_items/map_items";

function CreateRadarObject(mark, object) {
  if (mark.to === "transport") {
    CreateEvacuation(JSON.parse(object));
  }

  if (mark.to === "box") {
    CreateBox(JSON.parse(object))
  }

  if (mark.to === "unit") {
    CreateNewUnit(object)
  }

  if (mark.to === "drone") {
    CreateDrone(JSON.parse(object))
  }

  if (mark.to === "reservoir") {
    CreateReservoir(JSON.parse(object));
  }

  if (mark.to === "dynamic_objects") {
    createDynamicObject(ParseObject(object));
  }

  if (mark.to === "shield") {
    CreateShield(JSON.parse(object));
  }

  if (mark.to === "item") {
    CreateMapItems(JSON.parse(object))
  }
}

function RemoveRadarObject(mark) {
  if (mark.to === "transport") {
    removeEvacuation(mark.id);
  }

  if (mark.to === "box") {
    DestroyBox(Number(mark.id))
  }

  if (mark.to === "unit") {
    let unit = gameStore.units[mark.id];
    if (unit) removeUnit(unit);
  }

  if (mark.to === "drone") {
    let drone = gameStore.drones[mark.id];
    if (drone) {
      removeDrone(drone, mark.id)
    }
  }

  if (mark.to === "reservoir") {
    if (gameStore.reservoirs.hasOwnProperty(mark.id)) {
      removeReservoir(gameStore.reservoirs[mark.id]);
      delete gameStore.reservoirs[mark.id];
    }
  }

  if (mark.to === "dynamic_objects") {
    removeDynamicObject(mark.id)
  }

  if (mark.to === "bullet") {
    let bullet = gameStore.bullets[mark.id];
    if (bullet) {
      deleteBullet(bullet, mark.id);
    }
  }

  if (mark.to === "shield") {
    RemoveShield(mark.uo);
  }

  if (mark.to === "item") {
    DestroyItem(Number(mark.id))
  }
}

function removeDrone(drone, id) {

  if (!drone) drone = gameStore.drones[id];

  if (!drone) {
    return
  }

  let equipSprite = GetSpriteEquip(drone.owner_id, drone.equip_slot.type_slot, drone.equip_slot.number_slot).sprite;
  if (equipSprite) {
    equipSprite.setVisible(true);
    equipSprite.shadow.setVisible(true);
  }

  drone.sprite.shadow.destroy();
  drone.sprite.destroy();
  delete gameStore.drones[id];
}

function removeReservoir(reservoir) {

  RemoveSelectSpriteReservoir(reservoir.sprite);

  Scene.tweens.add({
    targets: [reservoir.sprite, reservoir.sprite.shadow],
    alpha: 0,
    ease: 'Linear',
    duration: 250,
    onComplete: function () {
      if (reservoir.sprite.shadow) {
        reservoir.sprite.shadow.destroy();
      }
      reservoir.sprite.destroy();
    }
  });

  store.commit({
    type: 'toggleWindow',
    id: 'reservoirTip' + reservoir.x + "" + reservoir.y,
    component: 'reservoirTip',
    forceClose: true,
  });

  ClearBars('reservoir', reservoir.id, 'progress');
  delete gameStore.reservoirs[reservoir.id];
}

function removeAllObj() {
  for (let id in gameStore.boxes) {
    DestroyBox(Number(id), false)
  }

  for (let id in gameStore.mapItems) {
    DestroyItem(Number(id), false)
  }

  for (let i in gameStore.units) {
    removeUnit(gameStore.units[i]);
  }

  for (let id in gameStore.reservoirs) {
    let reservoir = gameStore.reservoirs[id];
    if (reservoir && reservoir.sprite) {
      removeReservoir(reservoir);
      delete gameStore.reservoirs[id]
    }
  }

  for (let id in gameStore.evacuations) {
    removeEvacuation(id)
  }

  removeDynamicObjects();
}

function removeEvacuation(id) {
  let evacuation = gameStore.evacuations[id];
  if (evacuation) {
    if (evacuation.shadow) {
      evacuation.shadow.destroy();
    }
    evacuation.destroy();
  }

  if (gameStore.evacuations[id]) {
    clearInterval(gameStore.evacuations[id].bufferMoveTick)
  }

  delete gameStore.evacuations[id];
}

function removeDynamicObjects() {
  for (let i in gameStore.objects) {
    if (gameStore.objects[i] && gameStore.objects[i].objectSprite) {
      removeDynamicObject(i)
    }
  }
}

function createDynamicObject(object) {
  if (gameStore.objects[object.id]) return;

  if (object.texture !== '') {
    CreateObject(object, object.x, object.y, true, Scene);
  }

  if (object.animate_sprite_sheets !== '') {
    CreateAnimate(object, object.x, object.y, Scene);
  }

  gameStore.objects[object.id] = object;
  createObjectBars(object.id)
}

function removeDynamicObject(id) {
  if (gameStore.objects[id]) {
    let obj = gameStore.objects[id];

    store.commit({
      type: 'toggleWindow',
      id: 'reservoirTip' + obj.x + "" + obj.y,
      component: 'reservoirTip',
      forceClose: true,
    });

    store.commit({
      type: 'toggleWindow',
      id: 'ObjectDialog' + obj.id,
      component: 'ObjectDialog',
      forceClose: true,
    });

    Scene.tweens.add({
      targets: [obj.objectSprite, obj.objectSprite.weapon, obj.objectSprite.top, obj.objectSprite.equip,
        obj.objectSprite.weaponShadow, obj.objectSprite.weaponBox, obj.objectSprite.equip, obj.objectSprite.equipShadow,
        obj.objectSprite.equipBox, obj.objectSprite.shadowTop, obj.objectSprite.shadow, obj.objectSprite.light],
      alpha: 0,
      ease: 'Linear',
      duration: 150,
      onComplete: function () {

        obj.objectSprite.destroy();

        if (obj.objectSprite.weapon) obj.objectSprite.weapon.destroy();
        if (obj.objectSprite.weaponShadow) obj.objectSprite.weaponShadow.destroy();
        if (obj.objectSprite.weaponBox) obj.objectSprite.weaponBox.destroy();
        if (obj.objectSprite.equip) obj.objectSprite.equip.destroy();
        if (obj.objectSprite.equipShadow) obj.objectSprite.equipShadow.destroy();
        if (obj.objectSprite.equipBox) obj.objectSprite.equipBox.destroy();
        if (obj.objectSprite.top) obj.objectSprite.top.destroy();
        if (obj.objectSprite.shadowTop) obj.objectSprite.shadowTop.destroy();
        if (obj.objectSprite.shadow) obj.objectSprite.shadow.destroy();
        if (obj.objectSprite.passBuildSelectSprite) obj.objectSprite.passBuildSelectSprite.destroy();
        if (obj.objectSprite.noPassbuildSelectSprite) obj.objectSprite.noPassbuildSelectSprite.destroy();
        if (obj.objectSprite.light) obj.objectSprite.light.destroy();

        if (obj.placeSprite) obj.placeSprite.destroy();
        if (obj.objectSprite.lights) {
          for (let i of obj.objectSprite.lights) {
            i.green.destroy();
            i.red.destroy();
          }
        }
      }
    });

    ClearBars('object', obj.id, 'hp');
    ClearBars('object', obj.id, 'build');
    ClearBars('object', obj.id, 'energy');
    ClearBars('object', obj.id, 'shield');
    ClearBars('object', obj.id, 'progress');

    gameStore.objects[id] = null;
  }
}

function CreateDynamicObjects(dynamicObjects) {
  removeDynamicObjects();

  for (let id in dynamicObjects) {
    createDynamicObject(ParseObject(dynamicObjects[id]));
  }
}

export {CreateRadarObject, RemoveRadarObject, removeAllObj, CreateDynamicObjects, removeReservoir, removeDrone}
