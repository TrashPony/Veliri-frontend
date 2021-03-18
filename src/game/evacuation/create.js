import {Scene} from "../create";
import {gameStore} from "../store";
import {GetOffsetShadowByMapLvl, GetSpriteSizeByMapLvl} from "../map/height_offset";
import {GetGlobalPos} from "../map/gep_global_pos";

const evacuationSpriteScale = 20;

function CreateEvacuation(transport) {

  if (gameStore.evacuations.hasOwnProperty(transport.id)) {
    return;
  }

  let sprite;

  let pos = GetGlobalPos(transport.x, transport.y, transport.map_id);
  transport.x = pos.x;
  transport.y = pos.y;

  if (transport.fraction === 'Replics') sprite = 'evacuation_replics';
  if (transport.fraction === 'Explores') sprite = 'evacuation_explores';
  if (transport.fraction === 'Reverses') sprite = 'evacuation_reverses';

  let shadow = Scene.make.sprite({
    x: GetOffsetShadowByMapLvl(transport.z, transport.x, transport.y, 0, 2.5, transport.map_id).x,
    y: GetOffsetShadowByMapLvl(transport.z, transport.x, transport.y, 0, 2.5, transport.map_id).y,
    key: sprite,
    add: true
  });
  shadow.setOrigin(0.5);
  shadow.setScale(GetSpriteSizeByMapLvl(transport.z, transport.scale / 100, 0.02).x);
  shadow.setAlpha(0);
  shadow.setTint(0x000000);
  shadow.setAngle(transport.rotate);
  Scene.flyObjectsLayer.add(shadow);

  let evacuation = Scene.make.sprite({
    x: transport.x,
    y: transport.y,
    key: sprite,
    add: true
  });
  evacuation.setOrigin(0.5);
  evacuation.setScale(GetSpriteSizeByMapLvl(transport.z, transport.scale / 100, 0.02).x);
  evacuation.setAlpha(1);
  evacuation.setAngle(transport.rotate);

  Scene.flyObjectsLayer.add(evacuation);
  evacuation.shadow = shadow;

  evacuation.setDepth(transport.z);
  evacuation.shadow.setDepth(transport.z - 1);
  evacuation.transportState = transport;

  gameStore.evacuations[transport.id] = evacuation;

  Scene.tweens.add({
    targets: evacuation.shadow,
    alpha: {from: 0, to: 0.1},
    ease: 'Linear',
    duration: 700,
    repeat: 0,
  });

  Scene.tweens.add({
    targets: evacuation,
    alpha: {from: 0, to: 1},
    ease: 'Linear',
    duration: 700,
    repeat: 0,
  });

  return evacuation
}

export {CreateEvacuation, evacuationSpriteScale}
