import {CreateObject} from "../map/objects";
import {Scene} from "../create";
import {gameStore} from "../store";
import store from "../../store/store"
import {SelectSprite} from "../utils/select_sprite";
import {MapSize} from "../map/createMap";
import {GetGlobalPos} from "../map/gep_global_pos";

let placeGraphics;

function SelectPlaceBuild(structureState, bpID) {

  $('.nameItemInCell').remove();
  store.commit({
    type: 'toggleWindow',
    id: 'buildDialogWrapper',
    forceClose: true,
  });

  let structure = CreateObject(structureState, 0, 0, true, Scene);
  structure.objectSprite.removeInteractive();

  structure.objectSprite.alpha = 0.6;
  if (structure.objectSprite.top) structure.objectSprite.top.alpha = 0.6;
  if (structure.objectSprite.weapon) structure.objectSprite.weapon.alpha = 0.6;

  if (structure.objectSprite.top && structure.objectSprite.top.tween) {
    structure.objectSprite.top.tween.stop();
  }

  if (structure.objectSprite.shadowTop && structure.objectSprite.shadowTop.tween) {
    structure.objectSprite.shadowTop.tween.stop();
  }

  placeGraphics = Scene.add.graphics(0, 0);
  placeGraphics.setDepth(901);

  let userUnit = gameStore.units[gameStore.user_squad_id];
  let placeUpdate = setInterval(function () {

    let x = Scene.input.mousePointer.x / Scene.cameras.main.zoom + Scene.cameras.main.worldView.x;
    let y = Scene.input.mousePointer.y / Scene.cameras.main.zoom + Scene.cameras.main.worldView.y;

    structure.objectSprite.x = x;
    structure.objectSprite.y = y;

    if (structure.objectSprite.top) {
      structure.objectSprite.top.x = x;
      structure.objectSprite.top.y = y;
    }

    if (structure.objectSprite.weaponBox) {
      structure.objectSprite.weaponBox.x = x;
      structure.objectSprite.weaponBox.y = y;
    }

    CheckPlace(structureState, structure.objectSprite);
  }, 20);

  gameStore.HoldAttackMouse = true;

  for (let i in gameStore.mapsState) {
    gameStore.mapsState[i].bmdTerrain.bmd.addListener('pointerdown', function (pointer, x, y) {
      clearInterval(placeUpdate);

      for (let i in gameStore.mapsState) {
        gameStore.mapsState[i].bmdTerrain.bmd.removeListener('pointerdown');
      }

      placeGraphics.destroy();
      placeGraphics = null;

      for (let i in AllowPointsSprites) {
        AllowPointsSprites[i].destroy();
        delete AllowPointsSprites[i];
      }

      if (pointer.leftButtonDown()) {

        store.getters.getWSByService('global').socket.send(JSON.stringify({
          event: "placeObject",
          x: Math.round(structure.objectSprite.x - MapSize),
          y: Math.round(structure.objectSprite.y - MapSize),
          rotate: structure.objectSprite.angle,
          id: bpID,
        }));

        setTimeout(function () {
          gameStore.HoldAttackMouse = false;
        }, 200)
      }

      structure.objectSprite.destroy();
      if (structure.objectSprite.top) structure.objectSprite.top.destroy();
      if (structure.objectSprite.weaponBox) structure.objectSprite.weaponBox.destroy();
    });
  }
}

function CheckPlace(structureState, structureSprite) {
  store.getters.getWSByService('global').socket.send(JSON.stringify({
    event: "getPlaceGeoData",
    rotate: structureSprite.angle,
    x: Math.round(structureSprite.x - MapSize),
    y: Math.round(structureSprite.y - MapSize),
    id: structureState.type_id,
  }))
}

function ResponsePlace(obj, place, buildRadius, allowPoints, mapID) {

  if (!placeGraphics) {
    return;
  } else {
    placeGraphics.clear();
  }

  placeGraphics.lineStyle(3, 0x0000ff, 0.5);

  let userUnit = gameStore.units[gameStore.user_squad_id];

  let circle = {x: userUnit.sprite.x, y: userUnit.sprite.y, radius: buildRadius};
  placeGraphics.strokeCircleShape(circle);

  if (obj && obj.geo_data && obj.geo_data.length > 0) {
    for (let i = 0; i < obj.geo_data.length; i++) {

      let pos = GetGlobalPos(obj.geo_data[i].x, obj.geo_data[i].y, mapID);

      let centerX = pos.x;
      let centerY = pos.y;

      if (place) {
        placeGraphics.fillStyle(0x00ff00, 0.5);
      } else {
        placeGraphics.fillStyle(0xff0000, 0.5);
      }

      let circle = {x: centerX, y: centerY, radius: obj.geo_data[i].radius};
      placeGraphics.fillCircleShape(circle);
    }
  }

  if (allowPoints) {
    drawAllowPoints(allowPoints)
  }
}

let AllowPointsSprites = {};

function drawAllowPoints(allowPoints) {

  for (let i in AllowPointsSprites) {

    let find = false;

    for (let j in allowPoints) {
      let point = allowPoints[j];
      if (i === point.x + ':' + point.y) {
        find = true;
        break;
      }
    }

    if (!find) {
      AllowPointsSprites[i].destroy();
      delete AllowPointsSprites[i];
    }
  }

  for (let i in allowPoints) {
    let point = allowPoints[i];
    if (!AllowPointsSprites[point.x + ':' + point.y]) {
      AllowPointsSprites[point.x + ':' + point.y] = SelectSprite(point.x, point.y, null, 0xffffff, 0x00ff00, point.state);
    }
  }
}

export {SelectPlaceBuild, ResponsePlace}
