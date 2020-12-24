import {SmokeExplosion} from "../../weapon/explosion";
import {Scene} from "../../create";
import {gameStore} from "../../store";
import {CreateMapBar} from "../../interface/status_layer";
import {GetGlobalPos} from "../gep_global_pos";

function createExtractor(x, y, texture, scale, needShadow, rotate, group, xShadowOffset, yShadowOffset, shadowIntensity, sprite, height, scene, mapID) {

  sprite.lights = [];
  let pos = GetGlobalPos(x, y, mapID);

  for (let i = 0; i < 3; i++) {
    let light = sprite.lights.push({
      green: scene.make.sprite({
        key: 'flares',
        x: pos.x - (9 - i * 9),
        y: pos.y - 24,
        frame: 'green',
        add: true
      }),
      red: scene.make.sprite({
        key: 'flares',
        x: pos.x - (9 - i * 9),
        y: pos.y - 24,
        frame: 'red',
        add: true
      })
    }) - 1;

    sprite.lights[light].green.setOrigin(0.5);
    sprite.lights[light].green.setDepth(height + 1);
    sprite.lights[light].green.setScale(0.15);

    sprite.lights[light].red.setOrigin(0.5);
    sprite.lights[light].red.setDepth(height + 1);
    sprite.lights[light].red.setScale(0.15);
  }

  offAllLight(sprite.lights);

  // let time = 4000;
  // setInterval(function () {
  //   OilDerrickStartAnim(sprite, time, height)
  // }, time * 2)
}

// function ExtractorStartAnim(sprite, time, height) {
//
//   let lights = sprite.lights;
//
//   setTimeout(function () {
//     offAllLight(lights);
//   }, time - 50);
//
//   for (let i in lights) {
//     setTimeout(function () {
//       offAllLight(lights);
//       lights[i].red.visible = true;
//     }, i * time / 8);
//
//     if (i === "2") {
//
//       setTimeout(function () {
//         offAllLight(lights);
//       }, i * time / 8 + time / 8);
//
//       setTimeout(function () {
//         for (let j in lights) {
//           lights[j].green.visible = true;
//         }
//       }, i * time / 8 + time / 8 + 50)
//     }
//   }
//
//   SmokeExplosion(sprite.x, sprite.y, time / 2, 20, 7, 15, 0, 360, height + 3);
//   setTimeout(function () {
//     SmokeExplosion(sprite.x, sprite.y, time / 2, 20, 7, 15, 0, 360, height + 3);
//   }, time / 8)
// }

function offAllLight(lights) {
  for (let j in lights) {
    lights[j].red.visible = false;
    lights[j].green.visible = false;
  }
}

function createExtractorPlaceSprite(extractor, x, y) {

  let pos = GetGlobalPos(x, y, extractor.map_id);

  extractor.placeSprite = Scene.make.sprite({
    x: pos.x,
    y: pos.y,
    key: "select_rect",
    add: true
  });
  extractor.placeSprite.setDepth(1);
  extractor.placeSprite.setOrigin(0.5);
  extractor.placeSprite.displayHeight = 30;
  extractor.placeSprite.displayWidth = 30;
  extractor.placeSprite.setTint(0xff0000);
}

function createNotWorkSprite(sprite) {
  sprite.denied = Scene.make.sprite({
    x: sprite.x,
    y: sprite.y,
    key: "denied_rect",
    add: true
  });
  sprite.denied.setDepth(999);
  sprite.denied.setOrigin(0.5);
  sprite.denied.displayHeight = 25;
  sprite.denied.displayWidth = 25;
}

function extractorExtracted(extractorID, progress, extract_x, extract_y, cargo_place, work) {
  let extractor = gameStore.objects[extractorID];
  if (extractor) {
    if (!work) {
      createNotWorkSprite(extractor.objectSprite);
      offAllLight(extractor.objectSprite.lights);
      for (let i of extractor.objectSprite.lights) {
        i.red.visible = true;
      }
      return;
    }

    if (!extractor.placeSprite) {
      createExtractorPlaceSprite(extractor, extract_x, extract_y)
    }

    if (cargo_place) {
      extractor.placeSprite.setTint(0x00ff00);
    } else {
      extractor.placeSprite.setTint(0xff0000);
    }

    CreateMapBar(extractor.objectSprite, 100, progress, 14, 0xffa009, Scene, 'object', extractor.id, 'progress', 5);

    if (progress === 0) {
      offAllLight(extractor.objectSprite.lights);
      for (let i of extractor.objectSprite.lights) {
        i.green.visible = true;
      }
    }

    if (progress > 0 && progress < 33) {
      offAllLight(extractor.objectSprite.lights);
      extractor.objectSprite.lights[0].red.visible = true;
    }

    if (progress > 33 && progress < 66) extractor.objectSprite.lights[1].red.visible = true;
    if (progress > 66) extractor.objectSprite.lights[2].red.visible = true;
    if (progress > 80) {
      SmokeExplosion(extractor.x, extractor.y, 2000, 20, 7, 15, 0, 360, extractor.height + 3);
      setTimeout(function () {
        SmokeExplosion(extractor.x, extractor.y, 2000, 20, 7, 15, 0, 360, extractor.height + 3);
      }, 250)
    }
  }
}

export {createExtractor, extractorExtracted}
