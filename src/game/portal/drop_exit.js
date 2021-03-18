import {GreenExplosion} from "../weapon/explosion";
import {GetGlobalPos} from "../map/gep_global_pos";
import {gameStore} from "../store";

function DropExit(data) {

  let pos = GetGlobalPos(data.x, data.y, gameStore.map.id);

  GreenExplosion(pos.x, pos.y, 400, 40, 40, 500,
    data.msg.angle - 5, data.msg.angle + 5, 50);
}

export {DropExit}
