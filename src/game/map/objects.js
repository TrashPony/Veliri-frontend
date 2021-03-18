import {gameStore} from "../store";
import {createJammer} from "./structures/jammer";
import {createShield} from "./structures/shield";
import {createRadar} from "./structures/radar";
import {CreateSpriteTurret} from "./structures/turret"
import {createExtractor} from "./structures/extractor";
import {NoCompleteStructure} from "./structures/no_complete_structure"
import {Scene} from "../create";
import store from "../../store/store";
import {GetGlobalPos} from "./gep_global_pos";
import {CreateRepairStation} from "./structures/repair_station";

function CreateObject(coordinate, x, y, noBmd, scene) {

  if (coordinate.type === "mission") {
    noBmd = true
  }

  let structures = ['unknown_civilization_jammer', 'repair_station', 'turret', 'beacon', 'storage', 'shield',
    'generator', 'missile_defense', 'turret', 'turret', 'jammer', 'radar', 'meteorite_defense', 'extractor',
    'explores_antenna', 'expensive_tower'];

  let atlasName = coordinate.type;
  if (structures.includes(coordinate.type)) {
    atlasName = 'structures';
  }

  coordinate.objectSprite = gameObjectCreate(x, y, coordinate.texture, coordinate.scale, coordinate.shadow, coordinate.rotate,
    scene.floorObjectLayer, coordinate.x_shadow_offset, coordinate.y_shadow_offset, coordinate.shadow_intensity,
    noBmd || coordinate.build, null, atlasName, scene, coordinate.map_id);

  if (coordinate.objectSprite) {
    coordinate.objectSprite.setDepth(coordinate.height);
    if (coordinate.objectSprite.shadow) {
      coordinate.objectSprite.shadow.setDepth(coordinate.height - 1);
    }
  }

  // todo костыль
  if (coordinate.texture === "bones_3") {
    coordinate.objectSprite.setDepth(2);
    coordinate.objectSprite.shadow.setDepth(1);
  }

  ObjectEvents(coordinate, coordinate.objectSprite, x, y);

  if (coordinate.type === "turret") {
    CreateSpriteTurret(coordinate, coordinate.objectSprite, scene)
  }

  if (coordinate.type === "repair_station") {
    CreateRepairStation(coordinate, coordinate.objectSprite, scene)
  }

  if (coordinate.type === "shield") {
    // todo #555 одинаковый код
    createShield(x, y, coordinate.texture, coordinate.scale, coordinate.shadow, coordinate.rotate, Scene.floorOverObjectLayer,
      coordinate.x_shadow_offset, coordinate.y_shadow_offset, coordinate.shadow_intensity, coordinate.objectSprite, coordinate.height, scene, coordinate.map_id)
  }

  if (coordinate.type === "jammer") {
    // todo #555 одинаковый код
    createJammer(x, y, coordinate.texture, coordinate.scale, coordinate.shadow, coordinate.rotate, Scene.floorOverObjectLayer,
      coordinate.x_shadow_offset, coordinate.y_shadow_offset, coordinate.shadow_intensity, coordinate.objectSprite, coordinate.height, scene, coordinate.map_id)
  }

  if (coordinate.type === "radar" || coordinate.type === "expensive_tower") {
    // todo #555 одинаковый код
    createRadar(x, y, coordinate.texture, coordinate.scale, coordinate.shadow, coordinate.rotate, Scene.floorOverObjectLayer,
      coordinate.x_shadow_offset, coordinate.y_shadow_offset, coordinate.shadow_intensity, coordinate.objectSprite, coordinate.height, scene, coordinate.map_id)
  }

  if (coordinate.type === "extractor") {
    createExtractor(x, y, coordinate.texture, coordinate.scale, coordinate.shadow, coordinate.rotate, Scene.floorOverObjectLayer,
      coordinate.x_shadow_offset, coordinate.y_shadow_offset, coordinate.shadow_intensity, coordinate.objectSprite, coordinate.height, scene, coordinate.map_id)
  }


  NoCompleteStructure(coordinate);

  return coordinate
}

function gameObjectCreate(x, y, texture, scale, needShadow, rotate, group, xShadowOffset, yShadowOffset, shadowIntensity, noBmd, shadowGroup, atlasName, scene, mapID) {
  let shadow;

  let pos = GetGlobalPos(x, y, mapID);
  if (needShadow) {
    shadow = scene.make.image({
      x: pos.x + xShadowOffset,
      y: pos.y + yShadowOffset,
      frame: texture,
      add: true,
      key: atlasName,
    });

    shadow.setOrigin(0.5);
    shadow.setScale(scale / 100);
    shadow.setAngle(rotate);
    shadow.setAlpha(shadowIntensity / 100);
    shadow.setTint(0x000000);
    if (!shadowGroup) {
      group.add(shadow);
    } else {
      shadowGroup.add(shadow);
    }
  }

  let object = scene.make.image({
    x: pos.x,
    y: pos.y,
    frame: texture,
    add: true,
    key: atlasName,
  });
  object.setOrigin(0.5);
  object.setScale(scale / 100);
  object.setAngle(rotate);
  group.add(object);

  object.shadow = shadow;

  // if (!gameStore.mapEditor && !needShadow && scene.floorObjectLayer && !noBmd) {
  //   object.setPosition(x, y);
  //   gameStore.mapsState[mapID].bmdTerrain.bmd.draw(object);
  //   object.destroy();
  //   object = null;
  // }

  return object
}

function CreateAnimate(coordinate, x, y, scene) {

  if (coordinate.unit_overlap) {
    coordinate.objectSprite = gameAnimateObjectCreate(x, y, coordinate.animate_sprite_sheets, coordinate.scale, coordinate.shadow,
      coordinate.rotate, coordinate.animation_speed, scene.floorOverObjectLayer, coordinate.animate_loop, scene, coordinate.map_id);
  } else {
    coordinate.objectSprite = gameAnimateObjectCreate(x, y, coordinate.animate_sprite_sheets, coordinate.scale, coordinate.shadow,
      coordinate.rotate, coordinate.animation_speed, scene.floorObjectLayer, coordinate.animate_loop, scene, coordinate.map_id);
  }

  ObjectEvents(coordinate, coordinate.objectSprite, x, y);

  if (coordinate.objectSprite) {
    coordinate.objectSprite.setDepth(coordinate.height);
    if (coordinate.objectSprite.shadow) coordinate.objectSprite.shadow.setDepth(coordinate.height - 1);
  }
}

function gameAnimateObjectCreate(x, y, texture, scale, needShadow, rotate, speed, group, needAnimate, scene, mapID) {
  let shadow;

  let pos = GetGlobalPos(x, y, mapID);

  scene.anims.create({
    key: texture,
    frames: scene.anims.generateFrameNumbers(texture),
    frameRate: speed,
    repeat: -1
  });

  if (needShadow) {

    shadow = scene.make.sprite({
      x: pos.x + scene.shadowXOffset,
      y: pos.y + scene.shadowYOffset,
      key: texture,
      add: true
    });

    shadow.setOrigin(0.5);
    shadow.setScale(scale / 100);
    shadow.setAngle(rotate);
    //shadow.setAlpha(shadowIntensity / 100);
    shadow.setTint(0x000000);
    group.add(shadow);

    if (needAnimate) {
      shadow.anims.play(texture);
    }
  }

  let object = scene.make.sprite({
    x: pos.x,
    y: pos.y,
    key: texture,
    add: true
  });
  object.setOrigin(0.5);
  object.setScale(scale / 100);
  object.setAngle(rotate);
  group.add(object);

  if (needAnimate) {
    object.anims.play(texture);
  }

  object.shadow = shadow;

  return object
}

function ObjectEvents(coordinate, object, x, y) {

  if (!object) return;

  object.setInteractive({
    pixelPerfect: true,
    alphaTolerance: 1
  });

  if (coordinate.name !== "") {

    let posInterval;

    object.on('pointerover', function () {

      if (!coordinate.build) {

        if (!coordinate.build || coordinate.complete > 99) {
          //object.setPostPipeline([ 10, 10 ]);
        }

        // todo костыль
        if (coordinate.name === "Телепорт" || coordinate.name === "Выход из телепорта") {
          return
        }

        store.commit({
          type: 'toggleWindow',
          id: 'reservoirTip' + object.x + "" + object.y,
          component: 'reservoirTip',
          meta: {
            name: coordinate.name,
            description: coordinate.description,
            pos: {
              left: Scene.cameras.main.zoom * (object.x - Scene.cameras.main.worldView.x + object.displayWidth / 4 * object.scale) + "px",
              top: Scene.cameras.main.zoom * (object.y - Scene.cameras.main.worldView.y - object.displayHeight / 4 * object.scale) + "px",
            }
          },
          forceOpen: true,
        });
      }
    });

    object.on('pointerout', function () {
      store.commit({
        type: 'toggleWindow',
        id: 'reservoirTip' + object.x + "" + object.y,
        component: 'reservoirTip',
      });
      //object.resetPipeline();
    });
  }

  object.on('pointerdown', function (pointer) {
    if (!gameStore.mapEditor && pointer.leftButtonDown() && gameStore.unitReady) {
      store.getters.getWSByService('global').socket.send(JSON.stringify({
        event: "openObject",
        id: coordinate.id,
        open: true,
      }));
    }
  });
}

export {CreateObject, CreateAnimate, gameObjectCreate, gameAnimateObjectCreate}
