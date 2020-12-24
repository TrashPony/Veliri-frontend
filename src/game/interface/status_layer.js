import {gameStore} from "../store";
import {Scene} from "../create";

function createBox(scene, sizeBox, boxKey, x, y, color) {

  if (!gameStore.StatusLayer.healBoxes.hasOwnProperty(boxKey)) {
    let graphics = scene.add.graphics();
    graphics.setDefaultStyles({
      lineStyle: {
        width: 4,
        color: 0x000000,
        alpha: 1
      },
      fillStyle: {
        color: color,
        alpha: 1
      }
    });

    graphics.fillRect(0, 0, sizeBox * 2, sizeBox * 2);
    graphics.strokeRect(0, 0, sizeBox * 2, sizeBox * 2);
    graphics.generateTexture(boxKey, sizeBox * 2, sizeBox * 2);
    graphics.destroy();
  }

  gameStore.StatusLayer.healBoxes[boxKey] = scene.make.sprite({
    x: x,
    y: y,
    key: boxKey,
    add: true
  });

  gameStore.StatusLayer.healBoxes[boxKey].setDepth(900);
  gameStore.StatusLayer.healBoxes[boxKey].setOrigin(0.5);
  gameStore.StatusLayer.healBoxes[boxKey].displayHeight = sizeBox;
  gameStore.StatusLayer.healBoxes[boxKey].displayWidth = sizeBox;

  return gameStore.StatusLayer.healBoxes[boxKey]
}

function ClearBars(type, id, typeBar) {
  let oldCells = gameStore.StatusLayer.bars[type + id + typeBar];
  if (oldCells && oldCells.length > 0) {
    for (let cell of oldCells) {
      cell.destroy();
    }
  }
}

function CreateMapBar(sprite, maxHP, hp, offsetY, color, scene, type, id, typeBar, hpInBox) {

  let oldCells = gameStore.StatusLayer.bars[type + id + typeBar];
  if (oldCells) {
    ClearBars(type, id, typeBar);
  }
  gameStore.StatusLayer.bars[type + id + typeBar] = [];

  let sizeBox = 6;
  let interval = 1; // промеж уток между квадратиками

  let centerX = sprite.x;
  let centerY = sprite.y;

  let countBoxes = Math.ceil(maxHP / hpInBox);
  // для особо жирных
  if (countBoxes > 10) {
    countBoxes = 10;
    hpInBox = Math.ceil(maxHP / countBoxes);
  }

  let displayHeight = sprite.displayHeight;
  if (displayHeight === 0 && sprite.hasOwnProperty('unitBody')) {
    displayHeight = sprite.unitBody.displayHeight * sprite.scale;
  }

  let startX = Math.round(centerX - ((countBoxes / 2) * (sizeBox + interval)) + sizeBox / 2);
  let boxY = Math.round(offsetY + centerY + displayHeight * sprite.originY);
  let percentHP = 100 / (maxHP / hp);

  for (let i = 0; i < countBoxes; i++) {

    if (hp > 0) {
      if (!color) {
        color = Phaser.Display.Color.HexStringToColor(GetColorDamage(percentHP)).color;
      }
    } else {
      color = 0x999b9f;
    }

    let boxKey = 'box_' + color + "" + sizeBox;
    gameStore.StatusLayer.bars[type + id + typeBar].push(createBox(scene, sizeBox, boxKey, startX, boxY, color));

    hp -= hpInBox;
    startX += sizeBox + interval
  }
}

function UpdatePosBars(sprite, maxHP, hp, offsetY, color, scene, type, id, typeBar, hpInBox) {
  let oldCells = gameStore.StatusLayer.bars[type + id + typeBar];
  if (oldCells) {

    let sizeBox = 6;
    let interval = 1; // промеж уток между квадратиками

    let centerX = sprite.x;
    let centerY = sprite.y;

    let countBoxes = Math.ceil(maxHP / hpInBox);
    // для особо жирных
    if (countBoxes > 10) {
      countBoxes = 10;
      hpInBox = Math.ceil(maxHP / countBoxes);
    }

    let displayHeight = sprite.displayHeight;
    if (displayHeight === 0 && sprite.hasOwnProperty('unitBody')) {
      displayHeight = sprite.unitBody.displayHeight * sprite.scale;
    }

    let startX = Math.round(centerX - ((countBoxes / 2) * (sizeBox + interval)) + sizeBox / 2);
    let boxY = Math.round(offsetY + centerY + displayHeight * sprite.originY);

    for (let box of oldCells) {
      box.setPosition(startX, boxY);
      startX += sizeBox + interval
    }
  }
}

function createObjectBars(id) {

  let obj = gameStore.objects[id];
  if (obj && obj.hp > -2) {
    if ((obj.build && obj.complete >= 100) || !obj.build) {

      ClearBars('object', obj.id, 'build');

      if (obj.hp >= 0) {
        CreateMapBar(obj.objectSprite, obj.max_hp, obj.hp, 0, null, Scene, 'object', obj.id, 'hp', 50);
      } else {
        CreateMapBar(obj.objectSprite, 100, 100, 0, null, Scene, 'object', obj.id, 'hp', 50);
      }

      CreateMapBar(obj.objectSprite, obj.max_energy / 100, obj.current_energy / 100, 7,
        0x00ffd6, Scene, 'object', obj.id, 'energy', 5);

    } else if (obj.build && obj.complete < 100) {
      CreateMapBar(obj.objectSprite, obj.max_hp, obj.hp, 0, null, Scene, 'object', obj.id, 'hp', 50);
      CreateMapBar(obj.objectSprite, 100, obj.complete, 7, 0xff00e1, Scene, 'object', obj.id, 'build', 5);
    }
  }
}

function GetColorDamage(percentHP) {
  if (percentHP >= 80) {
    return "#00ff0f"
  } else if (percentHP < 80 && percentHP >= 75) {
    return "#fff326"
  } else if (percentHP < 75 && percentHP >= 50) {
    return "#fac227"
  } else if (percentHP < 50 && percentHP >= 25) {
    return "#fa7b31"
  } else if (percentHP < 25) {
    return "#ff2615"
  }
}

export {CreateMapBar, ClearBars, createObjectBars, UpdatePosBars}
