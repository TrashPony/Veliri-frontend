import {gameStore} from "../store";
import {FlyLaser} from "../bullet/fly";
import {GetGlobalPos} from "../map/gep_global_pos";

function BuildAnimate(data) {
  let unit = gameStore.units[data.id];
  if (unit) {

    //data.x, data.y
    data.msg.name = "build";
    data.msg.target = {
      x: data.x,
      y: data.y,
    };

    data.x = data.msg.path_unit.x;
    data.y = data.msg.path_unit.y;

    FlyLaser(data)
  }
}

export {BuildAnimate}
