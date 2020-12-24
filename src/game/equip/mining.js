import {gameStore} from "../store";
import {Scene} from "../create";
import {GetGlobalPos} from "../map/gep_global_pos";
import {SmokeExplosion} from "../weapon/explosion";

function Mining(data) {
  let unit = gameStore.units[data.id];
  if (unit) {

    if (!unit.destroyMiningLaserTime || unit.destroyMiningLaserTime === 0) {
      unit.destroyMiningLaserTime = data.msg.seconds;
      let destroyLaser = setInterval(function () {

        unit.destroyMiningLaserTime -= 10;

        if (unit.destroyMiningLaserTime <= 0) {
          clearInterval(destroyLaser);
          unit.destroyMiningLaserTime = 0;
          unit.miningLaser.laser.destroy();
          unit.miningLaser.out.destroy();
          unit.miningLaser = null;
        }

      }, 10);
    }

    unit.destroyMiningLaserTime = data.msg.seconds;

    if (!unit.miningLaser) {
      let laser = Scene.add.graphics({
        lineStyle: {
          width: 2,
          color: 0x00fffd,
          alpha: 0.6
        },
      });

      laser.setDepth(45);
      let laserOut = Scene.add.graphics({
        lineStyle: {
          width: 5,
          color: 0x00fffd,
          alpha: 0.2
        },
      });
      laserOut.setDepth(45);

      unit.miningLaser = {laser: laser, out: laserOut}
    }


    let path = data.msg.path_unit;

    unit.miningLaser.laser.clear();
    unit.miningLaser.out.clear();

    let pos = GetGlobalPos(path.x, path.y, data.msg.map_id);
    path.x = pos.x;
    path.y = pos.y;

    let pos2 = GetGlobalPos(data.x, data.y, data.msg.map_id);
    data.x = pos2.x;
    data.y = pos2.y;

    unit.miningLaser.laser.lineBetween(path.x, path.y, data.x, data.y);
    unit.miningLaser.out.lineBetween(path.x, path.y, data.x, data.y);

    SmokeExplosion(data.x, data.y, 500, 10, 5, 25, 0, 360, 45);
  }
}

export {Mining}
