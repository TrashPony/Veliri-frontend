import {gameStore} from "../store";
import {FlyLaser} from "../bullet/fly";

function RepairLine(data) {

  if (!gameStore.unitReady) return;

  //data.x, data.y
  data.msg = {
    name: "heal",
    path_unit: data.msg.path_unit,
    target: {
      x: data.x,
      y: data.y,
    },
    map_id: data.msg.map_id,
  };

  data.x = data.msg.path_unit.x;
  data.y = data.msg.path_unit.y;

  FlyLaser(data)
}

export {RepairLine}
