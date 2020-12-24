import {gameStore} from "../store";
import {FlyLaser} from "../bullet/fly";

function MissileDefense(data) {
  if (!gameStore.unitReady) return;

  data.msg.name = "missile_defense";
  data.msg.target = {
    x: data.msg.path_unit.x,
    y: data.msg.path_unit.y,
  };
  data.msg.path_unit.millisecond = 50;

  FlyLaser(data)
}

export {MissileDefense}
