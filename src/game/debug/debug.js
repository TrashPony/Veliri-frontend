import {gameStore} from "../store";
import {Scene} from "../create";
import {GetGlobalPos} from "../map/gep_global_pos";
import {MapSize} from "../map/createMap";

let moveDebug = null;

let findPath = null;
let polygonCanvas = null;
let circleCanvas = null;

let polygonCanvasInit = false;
let findPathInit = false;

function debugMessage(jsonData) {

  if (jsonData.event === "CreateUnitCircle") {
    let UserUnit = gameStore.units[gameStore.user_squad_id];
    ArcDraw(jsonData.radius, UserUnit.sprite.x - MapSize, UserUnit.sprite.y - MapSize)
  }

  if (jsonData.event === "CreateRect") {
    FindPathDebug(jsonData)
  }

  if (jsonData.event === "CreateLine") {
    FindPathDebug(jsonData)
  }

  if (jsonData.event === "ClearPath") {
    if (findPath) {
      findPath.clear();
      moveDebug.clear();
    }
  }

  if (jsonData.event === "CreatePolygon") {
    PolygonDraw(jsonData.msg.side_polygon)
  }

  if (jsonData.event === "CreateArc") {
    ArcDraw(jsonData.msg.radius, jsonData.msg.x, jsonData.msg.y)
  }

  if (jsonData.event === "ClearPolygon") {
    if (polygonCanvas) polygonCanvas.clear();
  }
}

function PolygonDraw(polygonSides) {
  if (!gameStore.unitReady) return;

  if (!polygonCanvas) {
    polygonCanvas = Scene.add.graphics({
      lineStyle: {
        width: 1,
        color: 0xFF0000,
        alpha: 0.8
      },
    });

    polygonCanvas.setDepth(1000);
  }

  for (let i in polygonSides) {
    let side = polygonSides[i];

    let pos1 = GetGlobalPos(side.xy_1.X, side.xy_1.Y, gameStore.map.id);
    let pos2 = GetGlobalPos(side.xy_2.X, side.xy_2.Y, gameStore.map.id);

    polygonCanvas.lineBetween(pos1.x, pos1.y, pos2.x, pos2.y);
  }
}

function ArcDraw(radius, x, y) {
  if (!gameStore.unitReady) return;

  if (!circleCanvas) {
    circleCanvas = Scene.add.graphics({
      lineStyle: {
        width: 1,
        color: 0x0000FF,
        alpha: 0.8
      },
    });

    circleCanvas.setDepth(1000);
  }

  let pos = GetGlobalPos(x, y, gameStore.map.id);

  if (!circleCanvas) return;

  circleCanvas.clear();
  circleCanvas.strokeCircle(pos.x, pos.y, radius);
}

function FindPathDebug(jsonData) {
  if (!gameStore.unitReady) return;

  if (!findPathInit) {
    findPathInit = true;
    moveDebug = Scene.add.graphics({
      lineStyle: {
        width: 1,
        color: 0xFF0000,
        alpha: 0.8
      },
    });
    findPath = Scene.add.graphics({
      lineStyle: {
        width: 1,
        color: 0xFF0000,
        alpha: 0.8
      },
    });

    findPath.setDepth(1000);
    moveDebug.setDepth(1000);
  }

  if (!moveDebug || !findPath) return;

  let color = 0xFFFFFF;
  if (jsonData.color === "green") color = 0x00FF00;
  if (jsonData.color === "red") color = 0xFF0000;
  if (jsonData.color === "blue") color = 0x0000FF;
  if (jsonData.color === "orange") color = 0xff9200;
  if (jsonData.color === "black") color = 0x000000;

  moveDebug.lineStyle(1, color, 1);
  findPath.lineStyle(1, color, 1);

  if (jsonData.event === "CreateRect") {
    if (jsonData.color === "white" || jsonData.color === "red") {
      let pos = GetGlobalPos(jsonData.x, jsonData.y, gameStore.map.id);
      findPath.strokeRect(pos.x, pos.y, jsonData.rect_size, jsonData.rect_size);
    } else {
      let pos = GetGlobalPos(jsonData.x, jsonData.y, gameStore.map.id);
      moveDebug.strokeRect(pos.x, pos.y, jsonData.rect_size, jsonData.rect_size);
    }
  }

  if (jsonData.text !== '') {
    let style = {font: "9px", fill: "#0070ff", align: "center"};
    let pos = GetGlobalPos(jsonData.x, jsonData.y, gameStore.map.id);
    let t = Scene.add.text(pos.x + 10, pos.y + 10, jsonData.text, style);
    t.anchor.set(0.5);
  }

  if (jsonData.event === "CreateLine") {

    jsonData = jsonData.msg

    let pos = GetGlobalPos(jsonData.x, jsonData.y, gameStore.map.id);
    let to_pos = GetGlobalPos(jsonData.to_x, jsonData.to_y, gameStore.map.id);
    moveDebug.moveTo(pos.x, pos.y);
    moveDebug.lineTo(to_pos.x, to_pos.y);
  }
}

export {debugMessage}
