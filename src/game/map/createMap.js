import {initFog} from "../interface/fog_of_war";
import {gameStore} from "../store";
import {CreateAnimate, CreateObject} from "./objects";
import {initGunDesignator} from "../interface/server_gun_designator";
import {GetGlobalPos} from "./gep_global_pos";

let MapSize = 4096;

function CreateAllMaps(scene) {

  if (Object.keys(gameStore.maps).length === 1) {
    for (let i in gameStore.maps) {
      MapSize = gameStore.maps[i].map.XSize;
    }
  }

  // наращивание размера карты не влияет на производительность
  scene.cameras.main.setBounds(-600, -600, (MapSize * 3) + 1200, (MapSize * 3) + 1200);

  if (!gameStore.mapEditor && !gameStore.FogOfWar.back) {
    gameStore.FogOfWar = initFog(scene);
    scene.cameras.main.setZoom(1.25);
  }

  initGunDesignator(scene);

  if (!gameStore.mouseInGameChecker.updater) {
    // todo запасной вариант
    // gameStore.mouseInGameChecker.updater = setInterval(function () {
    //   gameStore.HoldAttackMouse = gameStore.mouseInGameChecker.time <= 0;
    //   if (gameStore.mouseInGameChecker.time > 0) {
    //     gameStore.mouseInGameChecker.time--;
    //   }
    // }, 50);
    // scene.input.enabled = true;
    // scene.input.on('pointerdown', function (pointer) {
    //   // setInterval(function () {
    //   //   gameStore.mouseInGameChecker.time = 2;
    //   // }, 100)
    // });

    gameStore.mouseInGameChecker.updater = true;
    scene.input.on('pointermove', function (pointer) {
      gameStore.HoldAttackMouse = false;
    });

    scene.input.on('gameout', function (pointer) {
      gameStore.HoldAttackMouse = true;
    });

    scene.input.on('gameover', function (pointer) {
      gameStore.HoldAttackMouse = false;
    });
  }

  for (let i in gameStore.maps) {
    if (gameStore.maps.hasOwnProperty(i) && gameStore.maps[i].map) {

      gameStore.mapsState[i] = {
        bmdTerrain: {},
        staticObjects: [],
      };

      if (gameStore.maps[i].x === 0 && gameStore.maps[i].y === 0) {
        gameStore.map = gameStore.maps[i].map
      }

      CreateMap(scene, gameStore.maps[i].map)
    }
  }
}

function CreateMap(scene, map) {
  CreateFlore(map, scene);
  CreateObjects(map, scene);
}

function CreateFlore(map, scene) {
  let pos = GetGlobalPos(0, 0, map.id);
  //bitmapData для отрисовки статичного нижнего слоя
  let bmdTerrain = scene.add.renderTexture(pos.x, pos.y, MapSize, MapSize);
  bmdTerrain.fill(0x2d2d2d);
  bmdTerrain.setInteractive();
  bmdTerrain.setInteractive();
  gameStore.mapsState[map.id].bmdTerrain = {
    bmd: bmdTerrain,
  };

  // сортировка по приоритету отрисовки текстур
  let flores = [];

  for (let x in map.flore) {
    for (let y in map.flore[x]) {
      flores.push(map.flore[x][y]);
    }
  }

  flores.sort(function (a, b) {
    return a.texture_priority - b.texture_priority;
  });

  let brush = scene.textures.get('brush').getSourceImage();
  let brush128 = scene.textures.get('brush_128').getSourceImage();

  for (let i in flores) {

    if (!flores.hasOwnProperty(i)) continue;

    let flore = flores[i];

    if (flore.texture_over_flore !== '') {

      let textureKey = "terrain_" + flore.texture_over_flore + "_brush";

      if (!gameStore.cashTextures.hasOwnProperty(textureKey)) {
        gameStore.cashTextures[textureKey] = true;
        let texture = scene.textures.get(flore.texture_over_flore).getSourceImage();

        if (flore.texture_over_flore === "water_1") {
          let bmd = scene.textures.createCanvas(textureKey, 128, 128);
          bmd.draw(0, 0, brush128);
          bmd.context.globalCompositeOperation = 'source-in';
          bmd.draw(0, 0, texture);
        } else {
          let bmd = scene.textures.createCanvas(textureKey, 512, 512);
          bmd.draw(0, 0, brush);
          bmd.context.globalCompositeOperation = 'source-in';
          bmd.draw(0, 0, texture);
        }
      }

      // Scene.make.sprite({
      //     x: flore.x,
      //     y: flore.y,
      //     key: textureKey,
      //     add: true
      // }).setDepth(-1);

      if (flore.texture_over_flore === "water_1") {
        gameStore.mapsState[map.id].bmdTerrain.bmd.drawFrame(textureKey, undefined, flore.x - 64, flore.y - 64);
      } else {
        gameStore.mapsState[map.id].bmdTerrain.bmd.drawFrame(textureKey, undefined, flore.x - 256, flore.y - 256);
      }
    }
  }
}

function CreateObjects(map, scene) {
  for (let i in map.static_objects_json) {
    gameStore.mapsState[map.id].staticObjects.push(ParseObject(map.static_objects_json[i]));
  }

  // сортировка по приоритету отрисовки обьектов
  gameStore.mapsState[map.id].staticObjects.sort(function (a, b) {
    return a.priority - b.priority;
  });

  for (let i in gameStore.mapsState[map.id].staticObjects) {

    if (!gameStore.mapsState[map.id].staticObjects.hasOwnProperty(i)) {
      continue
    }

    let obj = gameStore.mapsState[map.id].staticObjects[i];

    if (obj.texture !== '') {
      CreateObject(obj, obj.x, obj.y, false, scene);
    }

    if (obj.animate_sprite_sheets !== '') {
      CreateAnimate(obj, obj.x, obj.y, scene);
    }
  }
}

function ParseObject(jsonObj) {
  let objectData = JSON.parse(jsonObj)
  objectData.obj.geo_data = objectData.geo_data

  for (let i in objectData.obj.geo_data) {
    objectData.obj.geo_data[i] = JSON.parse(objectData.obj.geo_data[i])
  }

  return objectData.obj
}

export {CreateMap, CreateAllMaps, MapSize, ParseObject}
