import {RedExplosion} from "../weapon/explosion";
import {FlyLaser} from "../bullet/fly";
import {gameStore} from "../store";
import {GetGlobalPos} from "../map/gep_global_pos";

function TransportBlock(data) {
  let path = data.msg.path_unit;
  let pos = GetGlobalPos(path.x, path.y, data.msg.map_id);
  path.x = pos.x;
  path.y = pos.y;

  RedExplosion(path.x, path.y, 400, 50, 30, 300,
    path.rotate - 5, path.rotate + 5, path.z - 10);

  let unit = gameStore.units[data.id];

  if (unit) {
    data.msg.name = "transport_block";
    data.msg.target = {
      x: data.msg.x,
      y: data.msg.y,
    };

    FlyLaser(data)
  }
}

export {TransportBlock}
