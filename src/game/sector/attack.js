import {Scene} from "../create";
import {gameStore} from "../store";

let closeTime;
let captureCircle;
let initGraphics;

function SectorAttack(base, circleTime) {

  if (!gameStore.unitReady) return;

  closeTime = circleTime;

  if (circleTime > 0 && !captureCircle) {
    createBaseCaptureCircle(base);
    setInterval(function () {
      if (captureCircle && closeTime <= 0) {
        captureCircle.destroy();
        captureCircle = null;
      }

      closeTime--
    }, 1000)
  }
}

function createBaseCaptureCircle(base) {

  if (captureCircle) captureCircle.destroy();

  if (!initGraphics) {
    initGraphics = true;

    let graphics = Scene.add.graphics();
    graphics.setDefaultStyles({
      lineStyle: {
        width: 4,
        color: 0xFFFFFF,
        alpha: 0.5
      },
      fillStyle: {
        color: 0xFFFFFF,
        alpha: 0.1
      }
    });

    let circle = {x: base.gravity_radius + 2, y: base.gravity_radius + 2, radius: base.gravity_radius};
    graphics.fillCircleShape(circle);
    graphics.strokeCircleShape(circle);
    graphics.generateTexture("circle_capture", base.gravity_radius * 2 + 4 * 2, base.gravity_radius * 2 + 4 * 2);
    graphics.destroy();
  }

  captureCircle = Scene.make.sprite({
    x: base.x,
    y: base.y,
    key: "circle_capture",
    add: true
  });
  captureCircle.setOrigin(0.5);
}

export {SectorAttack}
