import {gameStore} from "../../store";
import {ShortDirectionRotateTween} from "../../utils/utils";
import {GetGlobalPos} from "../gep_global_pos";

function CreateSpriteTurret(turretState, turretBase, scene) {

  turretBase.setDepth(1); // todo костыль из за тог очто обьект состоиз из 2х частей, а в фазер 3 нет детей у спрайтов

  let weaponState = turretState.weapon.weapon;

  let pos = GetGlobalPos(turretState.x, turretState.y, turretState.map_id);

  let weaponBox = scene.add.container(pos.x, pos.y);
  weaponBox.setScale(turretState.scale / 100);
  weaponBox.setDepth(turretState.height);

  let weapon = scene.make.sprite({
    x: turretState.weapon.real_x_attach,
    y: turretState.weapon.real_y_attach,
    key: 'structures',
    add: true,
    frame: weaponState.name,
  });
  weapon.setOrigin(turretState.weapon.x_anchor, turretState.weapon.y_anchor);

  let weaponShadow = scene.make.sprite({
    x: turretState.weapon.real_x_attach + scene.shadowXOffset * 1.5,
    y: turretState.weapon.real_y_attach + scene.shadowYOffset * 1.5,
    key: 'structures',
    add: true,
    frame: weaponState.name,
  });
  weaponShadow.setOrigin(turretState.weapon.x_anchor, turretState.weapon.y_anchor);
  weaponShadow.setAlpha(0.4);
  weaponShadow.setTint(0x000000);

  weapon.angle = turretState.weapon.gun_rotate;
  weaponShadow.angle = turretState.weapon.gun_rotate;

  weaponBox.add(weaponShadow);
  weaponBox.add(weapon);

  turretBase.weapon = weapon;
  turretBase.weaponShadow = weaponShadow;
  turretBase.weaponBox = weaponBox;

  return turretBase
}

function RotateTurretGun(path) {
  if (gameStore.objects[path.id]) {
    let turret = gameStore.objects[path.id].objectSprite;

    ShortDirectionRotateTween(turret.weapon, path.r - turret.angle, path.ms);
    ShortDirectionRotateTween(turret.weaponShadow, path.r - turret.angle, path.ms);
  }
}

export {CreateSpriteTurret, RotateTurretGun}
