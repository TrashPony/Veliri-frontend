import {Scene} from "../create";
import {GetGlobalPos} from "../map/gep_global_pos";

let targetCircle = null;

function initGunDesignator(scene) {

  if (!targetCircle) {
    let graphics = scene.add.graphics();
    graphics.setDefaultStyles({
      lineStyle: {
        width: 12,
        color: 0xFF0000,
        alpha: 0.5
      },
      fillStyle: {
        color: 0xFF4444,
        alpha: 0.2
      }
    });

    let circle = {x: 312, y: 312, radius: 300};
    graphics.fillCircleShape(circle);
    graphics.strokeCircleShape(circle);
    graphics.generateTexture("GunDesignator", 624, 624);
    graphics.destroy();

    targetCircle = scene.make.sprite({
      x: 0,
      y: 0,
      key: "GunDesignator",
      add: true
    });
    targetCircle.setOrigin(0.5);
    targetCircle.setVisible(false);
    targetCircle.setDepth(900);
  }
}

let initGunRemoveTarget;

function ServerGunDesignator(data) {
  if (!targetCircle) {
    return
  }

  if (!initGunRemoveTarget) {
    let closeTarget = setInterval(function () {
      if (initGunRemoveTarget < 0) {
        targetCircle.setVisible(false);
        initGunRemoveTarget = false;
        clearInterval(closeTarget);
      } else {
        initGunRemoveTarget -= 10
      }
    }, 10)
  }

  initGunRemoveTarget = 100;

  let pos = GetGlobalPos(data.x, data.y, data.m);
  data.x = pos.x;
  data.y = pos.y;

  if (data.x === 0 && data.y === 0) {
    targetCircle.setVisible(false);
    return;
  } else {
    targetCircle.setVisible(true);
  }

  Scene.tweens.add({
    targets: targetCircle,
    props: {
      x: {value: data.x, duration: 64, ease: 'Linear'},
      y: {value: data.y, duration: 64, ease: 'Linear'},
      displayHeight: {value: data.rd * 2, duration: 64, ease: 'Linear'},
      displayWidth: {value: data.rd * 2, duration: 64, ease: 'Linear'},
    },
    repeat: 0,
  });
}

export {initGunDesignator, ServerGunDesignator}
