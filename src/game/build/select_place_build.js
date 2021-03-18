import {CreateObject} from "../map/objects";
import {Scene} from "../create";
import {gameStore} from "../store";
import store from "../../store/store"
import {SelectSprite} from "../utils/select_sprite";
import {MapSize} from "../map/createMap";

let placeGraphics;
let placeStructure;

function SelectPlaceBuild(structureState, bpID) {

  $('.nameItemInCell').remove();
  store.commit({
    type: 'toggleWindow',
    id: 'buildDialogWrapper',
    forceClose: true,
  });

  placeStructure = CreateObject(structureState, 0, 0, true, Scene);
  placeStructure.objectSprite.removeInteractive();

  placeStructure.objectSprite.alpha = 0.6;
  if (placeStructure.objectSprite.top) placeStructure.objectSprite.top.alpha = 0.6;
  if (placeStructure.objectSprite.weapon) placeStructure.objectSprite.weapon.alpha = 0.6;

  if (placeStructure.objectSprite.top && placeStructure.objectSprite.top.tween) {
    placeStructure.objectSprite.top.tween.stop();
  }

  if (placeStructure.objectSprite.shadowTop && placeStructure.objectSprite.shadowTop.tween) {
    placeStructure.objectSprite.shadowTop.tween.stop();
  }

  placeGraphics = Scene.add.graphics(0, 0);
  placeGraphics.setDepth(901);

  let userUnit = gameStore.units[gameStore.user_squad_id];
  let placeUpdate = setInterval(function () {

    let x = Scene.input.mousePointer.x / Scene.cameras.main.zoom + Scene.cameras.main.worldView.x;
    let y = Scene.input.mousePointer.y / Scene.cameras.main.zoom + Scene.cameras.main.worldView.y;

    placeStructure.objectSprite.x = x;
    placeStructure.objectSprite.y = y;

    if (placeStructure.objectSprite.top) {
      placeStructure.objectSprite.top.x = x;
      placeStructure.objectSprite.top.y = y;
    }

    if (placeStructure.objectSprite.weaponBox) {
      placeStructure.objectSprite.weaponBox.x = x;
      placeStructure.objectSprite.weaponBox.y = y;
    }

    CheckPlace(structureState, placeStructure.objectSprite);
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
          x: Math.round(placeStructure.objectSprite.x - MapSize),
          y: Math.round(placeStructure.objectSprite.y - MapSize),
          rotate: placeStructure.objectSprite.angle,
          id: bpID,
        }));

        setTimeout(function () {
          gameStore.HoldAttackMouse = false;
        }, 200)
      }

      placeStructure.objectSprite.destroy();
      if (placeStructure.objectSprite.top) placeStructure.objectSprite.top.destroy();
      if (placeStructure.objectSprite.weaponBox) placeStructure.objectSprite.weaponBox.destroy();

      placeStructure = null;
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

  let circle = {
    x: userUnit.sprite.x,
    y: userUnit.sprite.y,
    radius: buildRadius,
  };
  placeGraphics.strokeCircleShape(circle);

  if (place) {
    placeStructure.objectSprite.setTint(0x00ff00);
    if (placeStructure.objectSprite.top) placeStructure.objectSprite.setTint(0x00ff00);
    if (placeStructure.objectSprite.weapon) placeStructure.objectSprite.setTint(0x00ff00);
  } else {
    placeStructure.objectSprite.setTint(0xff0000);
    if (placeStructure.objectSprite.top) placeStructure.objectSprite.setTint(0xff0000);
    if (placeStructure.objectSprite.weapon) placeStructure.objectSprite.setTint(0xff0000);
  }

  // if (obj && obj.geo_data && obj.geo_data.length > 0) {
  //   for (let i = 0; i < obj.geo_data.length; i++) {
  //
  //     let pos = GetGlobalPos(obj.geo_data[i].x, obj.geo_data[i].y, mapID);
  //
  //     let centerX = pos.x;
  //     let centerY = pos.y;
  //
  //     if (place) {
  //       placeGraphics.fillStyle(0x00ff00, 0.5);
  //     } else {
  //       placeGraphics.fillStyle(0xff0000, 0.5);
  //     }
  //
  //     let circle = {x: centerX, y: centerY, radius: obj.geo_data[i].radius};
  //     placeGraphics.fillCircleShape(circle);
  //   }
  // }

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
