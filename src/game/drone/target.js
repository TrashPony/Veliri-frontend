import {Scene} from "../create";
import {gameStore} from "../store";
import {GetGlobalPos} from "../map/gep_global_pos";

let droneTarget = {
  radiusControlSprite: null,
  targetSprite: null,
  destroyTime: 0,
};

function DroneTarget(data) {
  let drone = gameStore.drones[data.id];
  if (!drone || !drone.sprite) return;

  let pos = GetGlobalPos(data.x, data.y, data.msg.map_id);
  data.x = pos.x;
  data.y = pos.y;

  if (drone.equip_slot.equip.applicable === "digger") {

    if (droneTarget.destroyTime <= 0) {

      // дрон копатель
      droneTarget.radiusControlSprite = Scene.make.sprite({
        x: data.x,
        y: data.y,
        key: "select_sprite",
        add: true
      });

      droneTarget.radiusControlSprite.setDepth(0);
      droneTarget.radiusControlSprite.setOrigin(0.5);
      droneTarget.radiusControlSprite.setDisplaySize(data.msg.radius, data.msg.radius);
      droneTarget.radiusControlSprite.setTint(0xffffff);

      droneTarget.targetSprite = Scene.make.sprite({
        x: 0,
        y: 0,
        key: "GunDesignator",
        add: true
      });
      droneTarget.targetSprite.setOrigin(0.5);
      droneTarget.targetSprite.setDisplaySize(data.msg.count, data.msg.count);
      droneTarget.targetSprite.setDepth(900);

      let closeTarget = setInterval(function () {
        if (droneTarget.destroyTime < 0) {
          clearInterval(closeTarget);
          droneTarget.radiusControlSprite.destroy();
          droneTarget.targetSprite.destroy();
        } else {
          droneTarget.destroyTime -= 10
        }
      }, 10)
    }
    droneTarget.destroyTime = 100;

    if (droneTarget.radiusControlSprite) {
      droneTarget.targetSprite.setVisible(data.msg.successful);

      Scene.tweens.add({
        targets: droneTarget.radiusControlSprite,
        props: {
          x: {value: data.x, duration: 64, ease: 'Linear'},
          y: {value: data.y, duration: 64, ease: 'Linear'},
          displayHeight: {value: data.msg.radius * 2, duration: 64, ease: 'Linear'},
          displayWidth: {value: data.msg.radius * 2, duration: 64, ease: 'Linear'},
        },
        repeat: 0,
      });

      let pos2 = GetGlobalPos(data.msg.target.x, data.msg.target.y, data.msg.map_id);
      data.msg.target.x = pos2.x;
      data.msg.target.y = pos2.y;

      Scene.tweens.add({
        targets: droneTarget.targetSprite,
        props: {
          x: {value: data.msg.target.x, duration: 64, ease: 'Linear'},
          y: {value: data.msg.target.y, duration: 64, ease: 'Linear'},
          displayHeight: {value: data.msg.count * 2, duration: 64, ease: 'Linear'},
          displayWidth: {value: data.msg.count * 2, duration: 64, ease: 'Linear'},
        },
        repeat: 0,
      });
    }
  }
}

export {DroneTarget}
