import {gameStore} from "../store";
import {Scene} from "../create";
import {GetMapLvl, GetSpriteSizeByMapLvl} from "../map/height_offset";
import {mouseBodyOver} from "./mouse_body_over"
import {RotateGun, SetShadowAngle} from "./rotate"
import {CreateMapBar} from "../interface/status_layer";
import {GetGlobalPos} from "../map/gep_global_pos";
import store from "../../store/store";

let UnitHeight = 35

function CreateNewUnit(newUnit) {

  if (!newUnit.hasOwnProperty('id')) {
    newUnit = JSON.parse(newUnit);
  }

  if (!gameStore.gameReady) return;

  let unit = gameStore.units[newUnit.id];
  if (!unit || !unit.sprite) {

    let pos = GetGlobalPos(newUnit.x, newUnit.y, newUnit.map_id);

    gameStore.units[newUnit.id] = createUnit(
      newUnit,
      pos.x,
      pos.y,
      newUnit.rotate,
      newUnit.body_color_1,
      newUnit.body_color_2,
      newUnit.weapon_color_1,
      newUnit.weapon_color_2,
    );

    unit = gameStore.units[newUnit.id];
    CreateMapBar(unit.sprite, unit.body.max_hp, unit.hp, 10, null, Scene, 'unit', unit.id, 'hp', 50);
  }
}

function createUnit(unit, x, y, rotate, bColor, b2Color, wColor, w2Color) {

  let weaponSlot = unit.weapon;

  let unitBox = Scene.add.container(x, y);
  unitBox.setDepth(UnitHeight);
  unitBox.setScale(GetSpriteSizeByMapLvl(GetMapLvl(unitBox.x, unitBox.y, unit.map_id), unit.body.scale / 100, 0.02).x);

  if (!gameStore.cacheAnimate.hasOwnProperty(unit.body.name)) {
    gameStore.cacheAnimate[unit.body.name] = true;

    Scene.textures.addSpriteSheetFromAtlas(unit.body.name + "_bottom_animate_left", {
      atlas: unit.body.name,
      frame: unit.body.name + "_bottom_animate_left",
      frameWidth: 256,
      frameHeight: 256
    });

    Scene.textures.addSpriteSheetFromAtlas(unit.body.name + "_bottom_animate_right", {
      atlas: unit.body.name,
      frame: unit.body.name + "_bottom_animate_right",
      frameWidth: 256,
      frameHeight: 256
    });


    Scene.anims.create({
      key: unit.body.name + "_bottom_animate_left",
      frames: Scene.anims.generateFrameNumbers(unit.body.name + "_bottom_animate_left"),
      frameRate: 16,
      repeat: -1
    });

    Scene.anims.create({
      key: unit.body.name + "_bottom_animate_right",
      frames: Scene.anims.generateFrameNumbers(unit.body.name + "_bottom_animate_right"),
      frameRate: 16,
      repeat: -1
    });
  }

  let bodyBottomShadow = Scene.make.sprite({
    key: unit.body.name,
    x: Scene.shadowXOffset / 2,
    y: Scene.shadowYOffset / 2,
    frame: unit.body.name + "_bottom",
    add: true
  });

  bodyBottomShadow.setOrigin(0.5);
  bodyBottomShadow.setAlpha(0.2);
  bodyBottomShadow.setTint(0x000000);

  let bodyBottomLeft = Scene.make.sprite({
    x: 0,
    y: 0,
    key: unit.body.name + "_bottom_animate_left",
    add: true
  });
  bodyBottomLeft.setOrigin(0.5);
  bodyBottomLeft.play(unit.body.name + "_bottom_animate_left");
  bodyBottomLeft.anims.pause();

  let bodyBottomRight = Scene.make.sprite({
    x: 0,
    y: 0,
    key: unit.body.name + "_bottom_animate_right",
    add: true
  });
  bodyBottomRight.setOrigin(0.5);
  bodyBottomRight.play(unit.body.name + "_bottom_animate_right");
  bodyBottomRight.anims.pause();

  let bodyBox = Scene.add.container(0, 0);
  let bodyShadow = Scene.make.sprite({
    key: unit.body.name,
    x: Scene.shadowXOffset / 2,
    y: Scene.shadowYOffset / 2,
    frame: unit.body.name + unit.body_texture,
    add: true
  });
  bodyShadow.setOrigin(0.5);
  bodyShadow.setAlpha(0.2);
  bodyShadow.setTint(0x000000);

  let body = Scene.make.sprite({
    key: unit.body.name,
    x: 0,
    y: 0,
    frame: unit.body.name + unit.body_texture,
    add: true
  });
  body.setOrigin(0.5);
  body.setInteractive({
    pixelPerfect: true,
    alphaTolerance: 1
  });

  mouseBodyOver(body, unit, unitBox);

  bodyBox.add(bodyBottomShadow);
  bodyBox.add(bodyBottomLeft);
  bodyBox.add(bodyBottomRight);
  bodyBox.add(bodyShadow);
  bodyBox.add(body);

  if (unit.body_texture === '') {

    let bodyMask = Scene.make.sprite({
      x: 0,
      y: 0,
      frame: unit.body.name + '_mask',
      add: true,
      key: unit.body.name,
    });
    bodyMask.setOrigin(0.5);

    let bodyMask2 = Scene.make.sprite({
      x: 0,
      y: 0,
      frame: unit.body.name + '_mask2',
      add: true,
      key: unit.body.name,
    });
    bodyMask2.setOrigin(0.5);

    bodyMask.setTint(bColor);
    bodyMask2.setTint(b2Color);

    bodyBox.add(bodyMask2);
    bodyBox.add(bodyMask);
  }

  let weapon;
  let weaponShadow;
  let weaponBox;

  if (weaponSlot && weaponSlot.weapon) {

    weaponBox = Scene.add.container(0, 0);

    weapon = Scene.make.sprite({
      x: weaponSlot.real_x_attach,
      y: weaponSlot.real_y_attach,
      frame: weaponSlot.weapon.name + unit.weapon_texture,
      add: true,
      key: "weapons",
    });
    weapon.xAttach = weaponSlot.real_x_attach;
    weapon.yAttach = weaponSlot.real_y_attach;
    weapon.setOrigin(weaponSlot.x_anchor, weaponSlot.y_anchor);

    weaponShadow = Scene.make.sprite({
      x: weaponSlot.real_x_attach + Scene.shadowXOffset / 2,
      y: weaponSlot.real_y_attach + Scene.shadowYOffset / 2,
      frame: weaponSlot.weapon.name,
      add: true,
      key: "weapons",
    });
    weaponShadow.setAlpha(0.5);
    weaponShadow.setTint(0x000000);
    weaponShadow.setOrigin(weaponSlot.x_anchor, weaponSlot.y_anchor);

    weaponBox.add(weaponShadow);
    weaponBox.add(weapon);

    if (unit.weapon_texture === '') {
      let weaponColorMask = Scene.make.sprite({
        x: weaponSlot.real_x_attach,
        y: weaponSlot.real_y_attach,
        frame: weaponSlot.weapon.name + '_mask',
        add: true,
        key: "weapons",
      });
      weaponColorMask.setOrigin(weaponSlot.x_anchor, weaponSlot.y_anchor);

      let weaponColorMask2 = Scene.make.sprite({
        x: weaponSlot.real_x_attach,
        y: weaponSlot.real_y_attach,
        frame: weaponSlot.weapon.name + '_mask2',
        add: true,
        key: "weapons",
      });
      weaponColorMask2.setOrigin(weaponSlot.x_anchor, weaponSlot.y_anchor);

      weaponColorMask.setTint(wColor);
      weaponColorMask2.setTint(w2Color);

      // накладываем цветовые маски на спрайт
      weaponBox.add(weaponColorMask2);
      weaponBox.add(weaponColorMask);

      weapon.mask1 = weaponColorMask;
      weapon.mask2 = weaponColorMask2;
    }
  }

  unit.sprite = unitBox;
  unit.sprite.unitBody = body;
  unit.sprite.bodyShadow = bodyShadow;
  unit.sprite.bodyBottomLeft = bodyBottomLeft;
  unit.sprite.bodyBottomRight = bodyBottomRight;
  unit.sprite.bodyBottomShadow = bodyBottomShadow;

  unit.sprite.setAngle(rotate);
  unitBox.add(bodyBox);

  createUnitName(unit);
  CreateEquip(unit);

  if (weapon) {
    unit.sprite.weapon = weapon;
    unit.sprite.weaponShadow = weaponShadow;
    unitBox.add(weaponBox);

    if (weaponSlot && weaponSlot.weapon) {
      RotateGun(unit, unit.gun_rotate, 10);
    }
  }

  SetShadowAngle(unit, rotate, Scene.shadowXOffset * 3);
  return unit
}

function createUnitName(unit) {

  unit.sprite.userName = {login: null, loginShadow: null, pointer: null};
  unit.sprite.userName.login = Scene.add.bitmapText(unit.sprite.x, unit.sprite.y, 'bit_text', unit.owner, 32)
  unit.sprite.userName.login.setDepth(900);
  unit.sprite.userName.login.setOrigin(0.5);
  unit.sprite.userName.login.setScale(0.35);

  unit.sprite.userName.pointer = Scene.add.bitmapText(unit.sprite.x, unit.sprite.y, 'bit_text', 'v', 32)
  unit.sprite.userName.pointer.setDepth(900);
  unit.sprite.userName.pointer.setOrigin(0.5);
  unit.sprite.userName.pointer.setScale(0.35);

  unit.sprite.userName.detail = Scene.add.bitmapText(unit.sprite.x, unit.sprite.y, 'bit_text', 'подробно', 32)
  unit.sprite.userName.detail.setDepth(900);
  unit.sprite.userName.detail.setOrigin(0.5);
  unit.sprite.userName.detail.setScale(0.27);
  unit.sprite.userName.detail.setVisible(false);

  unit.sprite.userName.pk = Scene.add.bitmapText(unit.sprite.x, unit.sprite.y, 'bit_text', 'преступник', 32)
  unit.sprite.userName.pk.setDepth(900);
  unit.sprite.userName.pk.setOrigin(0.5);
  unit.sprite.userName.pk.setScale(0.27);
  unit.sprite.userName.pk.setVisible(false);
  unit.sprite.userName.pk.setTint(0xff0000);
}

function colorName(unit) {

  let violator = gameStore.violators[unit.owner_id];
  let user = store.getters.getUser;

  if (violator && violator.type === "pvp") {
    if (violator.time < 3000 && violator.time % 400 === 0) {
    } else {
      unit.sprite.userName.login.setTint(0xcc5ffd);
      unit.sprite.userName.pointer.setTint(0xcc5ffd);
      return
    }
  }

  if (violator && violator.type === "pk") {
    unit.sprite.userName.login.setTint(0xff0000);
    unit.sprite.userName.pointer.setTint(0xff0000);
    unit.sprite.userName.pk.setVisible(true);
    return
  } else {
    unit.sprite.userName.pk.setVisible(false);
  }

  if (unit.sprite.userName.detail.visible) {
    unit.sprite.userName.login.setTint(0x00E1FF);
    unit.sprite.userName.pointer.setTint(0x00E1FF);
    unit.sprite.userName.detail.setTint(0x00E1FF);
    return
  }

  if (user && user.user_id === unit.owner_id) {
    unit.sprite.userName.login.setTint(0x15FF19);
    unit.sprite.userName.pointer.setTint(0x15FF19);
    return
  }

  if (user && user.game_mode === 'open_world') {

    if (unit.of === 'Replics') {
      unit.sprite.userName.login.setTint(0xee7015);
      unit.sprite.userName.pointer.setTint(0xee7015);
      return
    }

    if (unit.of === 'Reverses') {
      unit.sprite.userName.login.setTint(0x659DFF);
      unit.sprite.userName.pointer.setTint(0x659DFF);
      return
    }

    if (unit.of === 'Explores') {
      unit.sprite.userName.login.setTint(0x7aba00);
      unit.sprite.userName.pointer.setTint(0x7aba00);
      return
    }

    if (unit.of === 'APD') {
      unit.sprite.userName.login.setTint(0xd7bc09);
      unit.sprite.userName.pointer.setTint(0xd7bc09);
      return
    }

    unit.sprite.userName.login.setTint(0xffffff);
    unit.sprite.userName.pointer.setTint(0xffffff);
    unit.sprite.userName.detail.setTint(0xffffff);
  } else {
    if (getMyTeam()) {
      if (!getMyTeam().players.includes(unit.owner_id)) {
        unit.sprite.userName.login.setTint(0xFF3922);
        unit.sprite.userName.pointer.setTint(0xFF3922);
      } else {
        unit.sprite.userName.login.setTint(0x659DFF);
        unit.sprite.userName.pointer.setTint(0x659DFF);
      }
    }
  }
}

function getMyTeam() {
  if (!store.getters.getBattleState) return null;

  let teams = store.getters.getBattleState.teams;
  for (let i in teams) {
    if (teams.hasOwnProperty(i) && teams[i].players.includes(store.getters.getUser.user_id)) {
      return teams[i]
    }
  }
}

function CreateEquip(unit) {

  unit.sprite.equipSprites = [];

  let createSprite = function (slot) {

    if (!slot.equip) return;

    let slotShadow = Scene.make.sprite({
      x: slot.real_x_attach + Scene.shadowXOffset / 4,
      y: slot.real_y_attach + Scene.shadowYOffset / 4,
      key: 'equips',
      add: true,
      frame: slot.equip.name,
    });

    slotShadow.setAlpha(0.5);
    slotShadow.setTint(0x000000);
    slotShadow.setOrigin(slot.x_anchor, slot.y_anchor);

    let slotSprite = Scene.make.sprite({
      x: slot.real_x_attach,
      y: slot.real_y_attach,
      key: 'equips',
      add: true,
      frame: slot.equip.name,
    });
    slotSprite.setOrigin(slot.x_anchor, slot.y_anchor);
    slotSprite.shadow = slotShadow;

    unit.sprite.add(slotShadow);
    unit.sprite.add(slotSprite);

    unit.sprite.equipSprites.push({
      sprite: slotSprite,
      shadow: slotShadow,
      xAttach: slot.real_x_attach,
      yAttach: slot.real_y_attach,
      slot: slot,
    });
  };

  let createSlots = function (slots) {
    for (let slot in slots) {
      createSprite(slots[slot])
    }
  };

  createSlots(unit.equip_slots);
}

export {CreateNewUnit, colorName, UnitHeight}
