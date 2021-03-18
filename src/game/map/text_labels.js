import {GetGlobalPos} from "./gep_global_pos";
import {gameStore} from "../store";
import store from "../../store/store";
import {Scene} from "../create";

let cacheTextures = {};

const width = 75;
const maxHeight = 16;

function CreateTextLabels(map) {
  if (gameStore.mapEditor) {
    return
  }

  for (let i of map.handlers_coordinates) {
    let pos = GetGlobalPos(i.x, i.y, map.id);
    createTextLabels(i, pos.x, pos.y)
  }

  createTextLabelEntry(map.entry_points)
}

function CreateTextBaseLabels() {
  if (gameStore.mapEditor) {
    return
  }

  for (let i in gameStore.bases) {
    let base = gameStore.bases[i]
    let pos = GetGlobalPos(base.x, base.y, base.map_id);

    let test = document.createElement("div");
    document.body.appendChild(test);
    test.style.visibility = "hidden";
    test.innerText = base.name;
    test.style.fontSize = "18px";
    test.style.fontFamily = "Arial";
    test.style.fontWeight = "bold";
    test.style.width = "auto";
    test.style.position = "absolute";
    test.style.whiteSpace = "nowrap";
    let testWidth = ((test.clientWidth + 1) / 2 + 12);
    test.remove();

    pos.y -= maxHeight / 2
    let key = "base_block_" + testWidth + ":" + maxHeight;
    checkTexture(key, null, testWidth)

    let block = Scene.make.image({
      x: pos.x,
      y: pos.y,
      add: true,
      key: key,
    });
    block.setOrigin(0.5, 0);
    block.setDepth(1001);

    gameStore.mapEditorState.labels['baseBlock' + pos.x + ":" + pos.y] = block;
    gameStore.mapEditorState.labels['baseText' + pos.x + ":" + pos.y] = createText(base.name, pos.x, pos.y, testWidth);
  }
}

function createTextLabels(coordinate, x, y) {
  if (coordinate.handler === 'sector') {

    y -= maxHeight / 2
    let key = "out_sector_block_" + width + ":" + maxHeight;
    checkTexture(key)

    let block = Scene.make.image({
      x: x,
      y: y,
      add: true,
      key: key,
    });
    block.setOrigin(0.5, 0);
    block.setDepth(1001);

    let arrowKey = "out_sector_arrow_" + width + ":" + maxHeight;
    createArrowSprite(arrowKey, 0x0b9af6)

    let arrow = Scene.make.image({
      x: x - 10,
      y: y,
      add: true,
      key: arrowKey,
    });
    arrow.setOrigin(0.5, 0);
    arrow.setDepth(1000);
    arrow.setAngle(arrow.angle + 180);
    arrow.setScale(0.3)

    gameStore.mapEditorState.labels['sectorOutBlock' + x + ":" + y] = block;
    gameStore.mapEditorState.labels['sectorOutText' + x + ":" + y] = createText(getNameMapByID(coordinate.to_map_id), x, y);
    gameStore.mapEditorState.labels['sectorOutArrow' + x + ":" + y] = arrow;
  }
}

function createTextLabelEntry(entryPoints) {
  for (let position of entryPoints) {
    let pos = GetGlobalPos(position.x, position.y, gameStore.map.id);

    pos.y -= maxHeight / 2
    let key = "in_sector_block_" + width + ":" + maxHeight;
    checkTexture(key)

    let block = Scene.make.image({
      x: pos.x,
      y: pos.y,
      add: true,
      key: key,
    });
    block.setOrigin(0.5, 0);
    block.setDepth(1001);

    let arrowKey = "in_sector_arrow_" + width + ":" + maxHeight;
    createArrowSprite(arrowKey, 0x35cf12)

    let arrow = Scene.make.image({
      x: pos.x + 10,
      y: pos.y + maxHeight,
      add: true,
      key: arrowKey,
    });
    arrow.setOrigin(0.5, 0);
    arrow.setDepth(1000);
    arrow.setScale(0.3)

    gameStore.mapEditorState.labels['sectorInBlock' + pos.x + ":" + pos.y] = block;
    gameStore.mapEditorState.labels['sectorInText' + pos.x + ":" + pos.y] = createText(getNameMapByID(position.to_map_id), pos.x, pos.y);
    gameStore.mapEditorState.labels['sectorInArrow' + pos.x + ":" + pos.y] = arrow;
  }
}

function getNameMapByID(id) {
  let language = store.getters.getSettings.Language;
  let handbook = store.getters.getHandBook;

  for (let name in handbook['sector'][language]) {
    if (handbook['sector'][language].hasOwnProperty(name) && handbook['sector'][language][name].id === id) {
      return name
    }
  }

  return ""
}

function checkTexture(key, height, w, color) {

  if (!height) {
    height = maxHeight
  }

  if (!w) {
    w = width
  }

  if (!color) {
    color = 0x999999
  }

  if (!cacheTextures[key]) {
    cacheTextures[key] = true
    let graphics = Scene.add.graphics({
      lineStyle: {
        width: 1,
        color: 0x000000,
        alpha: 1
      },

      fillStyle: {
        color: color,
        alpha: 0.75
      },
      add: false,
    });

    graphics.fillRoundedRect(0, 0, w, height, 5);
    graphics.strokeRoundedRect(0, 0, w, height, 5);

    graphics.generateTexture(key, w + 2, height + 2)
    graphics.destroy();
  }
}

function createText(text, x, y, w) {

  if (!w) {
    w = width
  }

  let textBlock = Scene.add.text(x, y, text, {
    font: "bold 18px Arial",
    fill: "#ffffff",
    align: "center",
    stroke: '#000',
    strokeThickness: 1,
    shadow: {
      offsetX: 1,
      offsetY: 1,
      color: '#000',
      blur: 1,
      stroke: true,
      fill: true
    },
    padding: {
      left: 6,
      right: 6,
      top: 6,
      bottom: 6,
    },
    wordWrap: {width: (w * 2) - 12, useAdvancedWrap: true}
  });
  textBlock.setFixedSize(w * 2, maxHeight * 2)
  textBlock.setOrigin(0.5, 0);
  textBlock.setScale(0.5);
  textBlock.setDepth(1002);

  return textBlock
}

function createArrowSprite(key, color) {
  if (!cacheTextures[key]) {
    cacheTextures[key] = true
    let graphics = Scene.add.graphics({
      lineStyle: {
        width: 3,
        color: 0x000000,
        alpha: 1
      },

      fillStyle: {
        color: color,
        alpha: 0.85
      },
      add: false,
    });

    graphics.strokeTriangle(0, 0, 20, 30, 40, 0);
    graphics.fillTriangle(0, 0, 20, 30, 40, 0);

    graphics.generateTexture(key, 100, 100)
    graphics.destroy();
  }
}

export {CreateTextLabels, CreateTextBaseLabels}
