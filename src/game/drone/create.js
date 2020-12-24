import {Scene} from "../create";
import {gameStore} from "../store";
import {evacuationSpriteScale} from "../evacuation/create";
import {GetOffsetShadowByMapLvl, GetSpriteSizeByMapLvl} from "../map/height_offset";
import {GetSpriteEquip} from "../unit/equip";

function CreateDrone(droneState) {

  if (!gameStore.gameReady) return;

  // TODO если дрон уже на карте а игрок ток загружается то писос
  let equipSprite = GetSpriteEquip(droneState.owner_id, droneState.equip_slot.type_slot, droneState.equip_slot.number_slot).sprite;
  equipSprite.setVisible(false);
  equipSprite.shadow.setVisible(false);

  let shadow = Scene.make.sprite({
    x: GetOffsetShadowByMapLvl(droneState.z, droneState.x, droneState.y, 0.5, 2.5, droneState.map_id).x,
    y: GetOffsetShadowByMapLvl(droneState.z, droneState.x, droneState.y, 0.5, 2.5, droneState.map_id).y,
    key: droneState.sprite,
    add: true
  });
  shadow.setOrigin(0.5);
  shadow.setScale(GetSpriteSizeByMapLvl(droneState.z, evacuationSpriteScale / 100, 0.02).x);
  shadow.setAlpha(0.2);
  shadow.setTint(0x000000);

  let drone = Scene.make.sprite({
    x: droneState.x,
    y: droneState.y,
    key: droneState.sprite,
    add: true
  });
  drone.setOrigin(0.5);
  drone.setScale(GetSpriteSizeByMapLvl(droneState.z, evacuationSpriteScale / 100, 0.02).x);
  drone.setAlpha(1);
  drone.shadow = shadow;

  drone.setDepth(droneState.z);
  drone.shadow.setDepth(droneState.z - 1);

  droneState.sprite = drone;
  gameStore.drones[droneState.id] = droneState
}

export {CreateDrone}
