import store from "../../store/store";
import {gameStore} from "../store";
import {Scene} from "../create";
import {CreateSelectSprite} from "./create_select_sprite";
import {GetGlobalPos} from "../map/gep_global_pos";
import {MapSize} from "../map/createMap";

function PlaceTexture(name) {

  let bmdSprite;

  let textureKey = "terrain_" + name + "_brush";

  let texture = Scene.textures.get(name).getSourceImage();
  let brush = Scene.textures.get('brush').getSourceImage();
  let brush128 = Scene.textures.get('brush_128').getSourceImage();

  if (!gameStore.cashTextures.hasOwnProperty(textureKey)) {
    gameStore.cashTextures[textureKey] = true;
    if (name === "water_1") {
      let bmd = Scene.textures.createCanvas(textureKey, 128, 128);
      bmd.draw(0, 0, brush128);
      bmd.context.globalCompositeOperation = 'source-in';
      bmd.draw(0, 0, texture);
    } else {
      let bmd = Scene.textures.createCanvas(textureKey, 512, 512);
      bmd.draw(0, 0, brush);
      bmd.context.globalCompositeOperation = 'source-in';
      bmd.draw(0, 0, texture);
    }
  }

  bmdSprite = Scene.make.sprite({
    x: 0,
    y: 0,
    key: textureKey,
    add: true
  }).setDepth(1000);
  bmdSprite.setOrigin(0);
  bmdSprite.setInteractive();
  gameStore.placeTerrain = bmdSprite;

  setInterval(function () {
    if (name === "water_1") {
      bmdSprite.x = Math.round(Scene.input.mousePointer.worldX) - 64;
      bmdSprite.y = Math.round(Scene.input.mousePointer.worldY) - 64;
    } else {
      bmdSprite.x = Math.round(Scene.input.mousePointer.worldX) - 256;
      bmdSprite.y = Math.round(Scene.input.mousePointer.worldY) - 256;
    }
  }, 10);

  bmdSprite.on('pointerdown', function (pointer) {
    if (pointer.leftButtonDown()) {
      let x = Math.round(Scene.input.mousePointer.worldX);
      let y = Math.round(Scene.input.mousePointer.worldY);

      if (name === "water_1") {
        gameStore.mapsState[gameStore.map.id].bmdTerrain.bmd.drawFrame(textureKey, undefined, x - 64, y - 64);
      } else {
        gameStore.mapsState[gameStore.map.id].bmdTerrain.bmd.drawFrame(textureKey, undefined, x - 256, y - 256);
      }

      store.getters.getWSByService('map_editor').socket.send(JSON.stringify({
        event: "addOverTexture",
        id: gameStore.mapEditorState.mpID,
        x: Number(x) - MapSize,
        y: Number(y) - MapSize,
        texture_name: name
      }));
    }

    bmdSprite.destroy();
    gameStore.placeTerrain = null;
  });
}

function RemoveTexture() {
  let callBack = function (x, y) {
    store.getters.getWSByService('map_editor').socket.send(JSON.stringify({
      event: "removeOverTexture",
      id: gameStore.mapEditorState.mpID,
      x: Number(x),
      y: Number(y)
    }));
  };
  selectFlore(callBack)
}

function selectFlore(callBack) {
  if (gameStore.gameReady) {
    let map = gameStore.map;

    for (let x in map.flore) {
      for (let y in map.flore[x]) {

        let pos = GetGlobalPos(Number(x), Number(y), map.id);

        let dist = Phaser.Math.Distance.Between(Scene.cameras.main.worldView.centerX, Scene.cameras.main.worldView.centerY, pos.x, pos.y);
        if (dist > 1024) {
          continue;
        }

        CreateSelectSprite(x, y, callBack, true);
        let flore = map.flore[x][y].texture_over_flore;
        let style = {font: "16px Arial", fill: "#ff0000", align: "center"};

        gameStore.mapEditorState.metaText[pos.x + ":" + pos.y] = Scene.add.text(pos.x - 50, pos.y - 15, flore, style);
      }
    }
  }
}

export {PlaceTexture, RemoveTexture}
