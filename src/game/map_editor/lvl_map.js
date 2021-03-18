import {Scene} from "../create";
import {gameStore} from "../store";
import {GetGlobalPos} from "../map/gep_global_pos";
import {MapSize} from "../map/createMap";
import store from "../../store/store";

let grid = null;
let resultGrid = null;
let init = false;

function initNumbers() {
  if (init) return;
  init = true;

  for (let i = 0; i < 300; i++) {

    let text = Scene.add.text(0, 0, i, {
      font: "24px Arial Black",
      fill: "#fff"
    });
    text.setStroke('#000', 8);

    let rt = Scene.add.renderTexture(0, 0, 128, 128);
    rt.draw(text, 0, 0);
    rt.saveTexture("lvl_number_" + i);

    rt.destroy();
    text.destroy();
  }
}

function EditLvlMap() {

  initNumbers();

  if (!grid) {
    resultGrid = Scene.add.graphics(0, 0);
    grid = Scene.add.graphics(0, 0);
  }

  let intervalUpdate = setInterval(function () {

    if (!resultGrid) {
      clearInterval(intervalUpdate);
      return;
    }

    let ringDist = 200;
    resultGrid.clear();
    resultGrid.lineStyle(3, 0x000FFF, 0.8);
    resultGrid.strokeCircleShape({
      x: Scene.cameras.main.worldView.centerX,
      y: Scene.cameras.main.worldView.centerY,
      radius: ringDist
    });
    resultGrid.setDepth(900);

    resultGrid.lineStyle(1, 0xff9200, 1);
    for (let i in gameStore.map.level_map) {

      let pos = GetGlobalPos(gameStore.map.level_map[i].x * 16, gameStore.map.level_map[i].y * 16, gameStore.map.id);

      let dist = Phaser.Math.Distance.Between(Scene.cameras.main.worldView.centerX, Scene.cameras.main.worldView.centerY, pos.x, pos.y);

      if (dist < ringDist) {

        resultGrid.strokeRect(pos.x, pos.y, 16, 16);

        let text = Scene.make.sprite({
          x: pos.x + 17,
          y: pos.y + 20,
          key: "lvl_number_" + gameStore.map.level_map[i].level,
          add: true
        });
        text.setTint(0x00d3ff);
        text.setOrigin(0.5);
        text.setScale(0.27);
        setTimeout(function () {
          text.destroy()
        }, 200)
      }
    }
  }, 200);

  let placeInterval = setInterval(function () {

    if (!grid) {
      clearInterval(placeInterval);
      return;
    }

    let centerX = Math.round(Scene.input.mousePointer.worldX);
    let centerY = Math.round(Scene.input.mousePointer.worldY);

    grid.clear();
    grid.lineStyle(1, 0x0000FF, 0.8);
    grid.setDepth(901);
    //resultGrid.strokeCircleShape({x: centerX, y: centerY, radius: radiusLvl});

    let leftX = Math.round((centerX - gameStore.mapEditorState.radiusLvl) / 16);
    let topY = Math.round((centerY - gameStore.mapEditorState.radiusLvl) / 16);
    let rightX = Math.round((centerX + gameStore.mapEditorState.radiusLvl) / 16);
    let bottomY = Math.round((centerY + gameStore.mapEditorState.radiusLvl) / 16);

    grid.lineStyle(1, 0x0000ff, 1);
    for (let x = leftX; x < rightX; x++) {
      for (let y = topY; y < bottomY; y++) {
        grid.strokeRect(x * 16, y * 16, 16, 16);
      }
    }
  }, 25);

  gameStore.mapsState[gameStore.map.id].bmdTerrain.bmd.setInteractive();
  gameStore.mapsState[gameStore.map.id].bmdTerrain.bmd.on('pointerup', function (pointer) {
    //console.log(pointer.upTime, pointer.downTime, pointer.leftButtonReleased(), pointer.rightButtonReleased())
    if (pointer.leftButtonReleased()) {

      let centerX = Math.round(Scene.input.mousePointer.worldX) - MapSize;
      let centerY = Math.round(Scene.input.mousePointer.worldY) - MapSize;

      let leftX = Math.round((centerX - gameStore.mapEditorState.radiusLvl) / 16);
      let topY = Math.round((centerY - gameStore.mapEditorState.radiusLvl) / 16);
      let rightX = Math.round((centerX + gameStore.mapEditorState.radiusLvl) / 16);
      let bottomY = Math.round((centerY + gameStore.mapEditorState.radiusLvl) / 16);

      let coordinates = [];
      for (let x = leftX; x < rightX; x++) {
        for (let y = topY; y < bottomY; y++) {
          coordinates.push({x: x, y: y});
        }
      }

      store.getters.getWSByService('map_editor').socket.send(JSON.stringify({
        event: "addLvl",
        id: gameStore.mapEditorState.mpID,
        coordinates: coordinates,
        level: Number(document.getElementById("lvlMapEdit").value),
      }))
    }
    if (pointer.rightButtonDown()) {
      // game.bmdTerrain.bmd.removeInteractive();
      //
      // grid.destroy();
      // resultGrid.destroy();
      //
      // grid = null;
      // resultGrid = null;
    }
  });

  // game.input.onUp.add(function (pointer) {
  //
  //     if (game.input.activePointer.leftButton.isDown) {
  //
  //         let centerX = ((game.input.mousePointer.x + game.camera.x) / game.camera.scale.x);
  //         let centerY = ((game.input.mousePointer.y + game.camera.y) / game.camera.scale.y);
  //         let leftX = Math.round((centerX - gameStore.mapEditorState.radiusLvl) / 16);
  //         let topY = Math.round((centerY - gameStore.mapEditorState.radiusLvl) / 16);
  //         let rightX = Math.round((centerX + gameStore.mapEditorState.radiusLvl) / 16);
  //         let bottomY = Math.round((centerY + gameStore.mapEditorState.radiusLvl) / 16);
  //
  //         let coordinates = [];
  //         for (let x = leftX; x < rightX; x++) {
  //             for (let y = topY; y < bottomY; y++) {
  //                 coordinates.push({x: x, y: y});
  //             }
  //         }
  //
  //         mapEditor.send(JSON.stringify({
  //             event: "addLvl",
  //             id: Number(document.getElementById("mapSelector").options[document.getElementById("mapSelector").selectedIndex].value),
  //             coordinates: coordinates,
  //             level: Number(document.getElementById("lvlMapEdit").value),
  //         }))
  //     } else if (pointer.duration <= 200) {
  //         grid.destroy();
  //         resultGrid.destroy();
  //         game.input.onUp.removeAll();
  //         grid = null;
  //         resultGrid = null;
  //     }
  // })
}

export {EditLvlMap}
