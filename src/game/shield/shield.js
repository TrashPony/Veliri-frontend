import {gameStore} from "../store";
import {Scene} from "../create";
import {ClearBars, CreateMapBar, UpdatePosBars} from "../interface/status_layer";

function CreateShield(shield) {
  CreateShieldSprite(shield);
}

function CreateShieldSprite(shield) {

  let oldShield = getShieldByUUID(shield.uuid);
  if (oldShield) {
    return oldShield
  }

  Scene.anims.create({
    key: 'shield_1',
    frames: Scene.anims.generateFrameNumbers('shield_1'),
    frameRate: 20,
    repeat: -1
  });

  let sprite = Scene.make.sprite({
    x: shield.x + Math.random(),
    y: shield.y + Math.random(),
    key: 'shield_1',
    add: true
  });
  sprite.setOrigin(0.5);
  sprite.displayWidth = (shield.radius * 2) + 15;
  sprite.displayHeight = (shield.radius * 2) + 15;
  sprite.setDepth(shield.radius + 15);

  let border = Scene.make.sprite({
    x: shield.x,
    y: shield.y,
    key: 'shield_1_border',
    add: true
  });
  border.setOrigin(0.5);
  border.displayWidth = (shield.radius * 2) + 15;
  border.displayHeight = (shield.radius * 2) + 15;
  border.setDepth(0);

  sprite.anims.play('shield_1');

  shield.sprite = sprite;
  shield.border = border;

  if (shield.block) {
    shield.sprite.setTint(0x00ff00);
    shield.border.setTint(0x00ff00);
  }
  shield.sprite.setAlpha(0.5)

  gameStore.shields[shield.uuid] = shield;
  return shield;
}

function UpdateShieldUnitPos(unit) {

  let startOffset = 7;

  for (let i in gameStore.shields) {
    if (gameStore.shields[i].owner_type === "unit" && gameStore.shields[i].owner_id === unit.id) {

      let shield = gameStore.shields[i];
      shield.sprite.x = unit.sprite.x;
      shield.sprite.y = unit.sprite.y;
      shield.border.x = unit.sprite.x;
      shield.border.y = unit.sprite.y;

      let needDepth = shield.radius + 15 + (unit.sprite.depth - 35)
      if (shield.sprite.depth !== needDepth) {
        shield.sprite.setDepth(needDepth);
      }

      UpdatePosBars(unit.sprite, shield.max_hp, shield.current_hp, startOffset, 0x0070ff, Scene, 'unit', shield.uuid, 'shield', 50);

      startOffset *= 2
    }
  }
}

function UpdateShieldObjectPos(obj) {
  for (let i in gameStore.shields) {
    if (gameStore.shields[i].owner_type === "object" && gameStore.shields[i].owner_id === obj.id) {
      let shield = gameStore.shields[i];

      if (obj.objectSprite) {
        shield.sprite.x = obj.objectSprite.x;
        shield.sprite.y = obj.objectSprite.y;
        shield.border.x = obj.objectSprite.x;
        shield.border.y = obj.objectSprite.y;

        UpdatePosBars(obj.objectSprite, shield.max_hp, shield.current_hp, 14, 0x0070ff, Scene, 'object', obj.id, 'shield', 50);
      }

      return shield
    }
  }
}

function UpdateShield(id, update) {
  let shield = getShieldByUUID(update.uuid);
  if (shield) {
    shield.current_hp = update.hp;

    if (shield.owner_type === "unit") {
      let unit = gameStore.units[shield.owner_id]
      if (unit) CreateMapBar(unit.sprite, shield.max_hp, shield.current_hp, 7, 0x0070ff, Scene, shield.owner_type, shield.uuid, 'shield', 50);
    }

    if (shield.owner_type === "object") {
      let obj = gameStore.objects[shield.owner_id]
      if (obj) CreateMapBar(obj.objectSprite, shield.max_hp, shield.current_hp, 14, 0x0070ff, Scene, shield.owner_type, shield.owner_id, 'shield', 50);
    }
  }
}

function RemoveShield(uuid) {

  let shield = gameStore.shields[uuid]

  ClearBars('unit', uuid, 'shield');
  ClearBars('object', uuid, 'shield');

  shield.border.destroy();
  shield.sprite.destroy();

  delete gameStore.shields[uuid];
}

function getShieldByUUID(uuid) {
  for (let i in gameStore.shields) {
    if (gameStore.shields[i].uuid === uuid) {
      return gameStore.shields[i]
    }
  }
}

export {CreateShield, UpdateShieldUnitPos, UpdateShieldObjectPos, UpdateShield, RemoveShield}
