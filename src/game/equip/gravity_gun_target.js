import {Scene} from "../create";
import {GetGlobalPos} from "../map/gep_global_pos";
import {gameStore} from "../store";
import {MoveSprite} from "../utils/move_sprite";
import {ShortDirectionRotateTween} from "../utils/utils";
import {BlueExplosion, BlueExplosionSCREEN} from "../weapon/explosion";

let targetCanvas = null;
let targetsKey = {};
let targetSprite = {};
let initRemoveTarget = false;

function GravityGunTarget(data) {
  if (!gameStore.unitReady) return;

  let dataKey = data.rd + ":" + data.ma + ":" + data.crd

  if (!initRemoveTarget) {
    let closeTarget = setInterval(function () {
      if (initRemoveTarget < 0) {
        clearInterval(closeTarget);
        targetSprite[dataKey].setVisible(false);
        initRemoveTarget = false;
      } else {
        initRemoveTarget -= 10
      }
    }, 10)
  }

  initRemoveTarget = 200;


  if (!targetCanvas) {
    targetCanvas = Scene.add.graphics({
      lineStyle: {
        width: 3,
        color: 0xff0000,
        alpha: 1
      },
    });
  }

  if (!targetsKey[dataKey]) {
    targetsKey[dataKey] = true;

    let radRotate1 = data.ma * Math.PI / 180
    let endX1 = data.rd * Math.cos(radRotate1)
    let endY1 = data.rd * Math.sin(radRotate1)

    let radRotate2 = (-1 * data.ma) * Math.PI / 180
    let endX2 = data.rd * Math.cos(radRotate2)
    let endY2 = data.rd * Math.sin(radRotate2)

    targetCanvas.lineBetween(0, endY1, endX1, endY1 + endY1);
    targetCanvas.lineBetween(0, endY1, endX2, endY2 + endY1);

    let x = Phaser.Math.Distance.Between(data.x, data.y, data.cx, data.cy)
    targetCanvas.lineStyle(1, 0x0000FF, 1);
    targetCanvas.strokeCircle(x, endY1, data.crd);

    targetCanvas.lineStyle(2, 0x0000FF, 1);
    let curve = new Phaser.Curves.Spline();
    curve.addPoint(endX1, endY1 + endY1)
    curve.addPoint(data.rd, endY1)
    curve.addPoint(endX2, endY2 + endY1)
    curve.draw(targetCanvas, 128);

    targetCanvas.generateTexture(dataKey, data.rd + 2, endY1 * 2);
    targetCanvas.clear();
  }

  let pos = GetGlobalPos(data.x, data.y, gameStore.map.id);
  if (!targetSprite[dataKey]) {
    targetSprite[dataKey] = Scene.make.sprite({
      x: pos.x,
      y: pos.y,
      key: dataKey,
      add: true
    });
    targetSprite[dataKey].setOrigin(0, 0.5);
    targetSprite[dataKey].setDepth(3);
    targetSprite[dataKey].setAlpha(0.3);
  } else {
    targetSprite[dataKey].setVisible(true);
    MoveSprite(targetSprite[dataKey], pos.x, pos.y, 64)
    ShortDirectionRotateTween(targetSprite[dataKey], data.r, 0)
  }
}

function GravityGunRun(data) {
  let pos = GetGlobalPos(data.x, data.y, gameStore.map.id);

  let radRotate1 = data.r * Math.PI / 180
  let endX1 = pos.x + ((data.rd / 1.2) * Math.cos(radRotate1))
  let endY1 = pos.y + ((data.rd / 1.2) * Math.sin(radRotate1))

  let endX2 = pos.x + (25 * Math.cos(radRotate1))
  let endY2 = pos.y + (25 * Math.sin(radRotate1))

  BlueExplosion(endX2, endY2, 512, 25, 3, 75, 0, 360, 50)

  let particle = Scene.add.particles('flares');
  particle.setPosition(endX1, endY1);
  particle.setDepth(50);
  particle.angle = data.r;
  particle.emitter = particle.createEmitter({
    frame: ["blue"],
    x: 0,
    y: 0,
    gravityY: 0,
    speed: {min: 0, max: 120},
    scale: {start: 40 / 50, end: 40 / 100},
    angle: {min: 175, max: 185},
    alpha: {start: 0.05, end: 0, ease: 'Quad.easeIn'},
    lifespan: {min: 2000 / 2, max: 2000},
    quantity: 3,
  }).setBlendMode('SCREEN');

  setTimeout(function () {
    particle.emitter.stop();
    setTimeout(function () {
      particle.destroy();
    }, 2000)
  }, 64)
}

function GravityGunDrop(data) {

  let pos = GetGlobalPos(data.x, data.y, gameStore.map.id);

  let radRotate1 = data.r * Math.PI / 180
  let x = pos.x + (25 * Math.cos(radRotate1))
  let y = pos.y + (25 * Math.sin(radRotate1))

  BlueExplosionSCREEN(x, y, 200, 80, 15, 500,
    data.r - 5, data.r + 5, 50, true);
}

export {GravityGunTarget, GravityGunRun, GravityGunDrop}
