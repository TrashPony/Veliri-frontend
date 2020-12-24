import {GetGlobalPos} from "../gep_global_pos";
import {gameStore} from "../../store";
import {ShortDirectionRotateTween} from "../../utils/utils";

function CreateRepairStation(state, base, scene) {

  base.setDepth(state.height - 1);
  base.shadow.setDepth(state.height - 2);

  let pos = GetGlobalPos(state.x, state.y, state.map_id);

  let equipBox = scene.add.container(pos.x, pos.y);
  equipBox.setScale(state.scale / 100);
  equipBox.setDepth(state.height);

  let equip = scene.make.sprite({
    x: state.equip.real_x_attach,
    y: state.equip.real_y_attach,
    key: 'structures',
    add: true,
    frame: state.texture + '_equip',
  });
  equip.setOrigin(state.equip.x_anchor, state.equip.y_anchor);

  let equipShadow = scene.make.sprite({
    x: (state.equip.real_x_attach + scene.shadowXOffset * 1.5),
    y: (state.equip.real_y_attach + scene.shadowYOffset * 1.5),
    key: 'structures',
    add: true,
    frame: state.texture + '_equip',
  });
  equipShadow.setOrigin(state.equip.x_anchor, state.equip.y_anchor);
  equipShadow.setAlpha(0.4);
  equipShadow.setTint(0x000000);

  equip.angle = state.equip.rotate;
  equipShadow.angle = state.equip.rotate;

  equipBox.add(equipShadow);
  equipBox.add(equip);

  base.equip = equip;
  base.equipShadow = equipShadow;
  base.equipBox = equipBox;

  return base
}

function RotateObjectEquip(data) {
  if (gameStore.objects[data.id]) {
    let obj = gameStore.objects[data.id].objectSprite;

    ShortDirectionRotateTween(obj.equip, data.r - obj.angle, data.ms);
    ShortDirectionRotateTween(obj.equipShadow, data.r - obj.angle, data.ms);
  }
}

export {CreateRepairStation, RotateObjectEquip}
