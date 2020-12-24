import {logMsg} from "./log";

export default function createInventoryPlugin(WS) {
  return store => {

    WS.onopen = function () {
      console.log("Connection inventory opened..." + this.readyState);

      WS.send(JSON.stringify({
        event: "openInventory"
      }));

      store.commit({
        type: 'setWSConnectState',
        service: 'inventory',
        connect: true,
        error: false,
        reconnect: false,
        ws: WS,
      });

      store.commit({
        type: 'setEndLoadServices',
        service: 'inventory',
      });
    };

    WS.onclose = function (i) {
      store.commit({
        type: 'setWSConnectState',
        service: 'inventory',
        connect: false,
        error: true,
        ws: WS,
      });
      console.log(i, 'inventory закрыл');
    };

    WS.onmessage = function (msg) {
      if (msg.data) InventoryReader(JSON.parse(msg.data), store, WS)
    };
  };
}

function InventoryReader(data, store, ws) {

  if (data.event) logMsg(data.event, data);
  if (data.e) logMsg(data.e, data);

  if (data.error !== "") {
    addError(data.error, store);
    return;
  }

  if (data.event === "UpdateSquad") {

    let activeTab = '';

    let unit = fillUnit(data);

    if (data.unit !== '') {

      activeTab = 'squadInventory';
      store.commit({
        type: 'updateWarehouse',
        warehouse: 'squadInventory',
        capacity: data.state_ms.capacity_size,
        size: data.inventory_size,
        inventory: data.inventory,
        title: "Hold",
      });
    } else {
      store.commit({
        type: 'removeWarehouse',
        warehouse: 'squadInventory',
      });
    }

    if (data.in_base) {
      activeTab = 'storage';
    } else {
      store.commit({
        type: 'removeWarehouse',
        warehouse: 'storage',
      });
    }

    store.commit({
      type: 'setInventoryState',
      warehouse: activeTab, // squadInventory, storage, box:ID
      equipPanel: data.equip_panel,
      inBase: data.in_base,
      unit: unit,
      squadName: data.name,
      stateMS: data.state_ms,
      baseSquads: data.base_squads,
      stateSkill: data.state_skill,
      stateEquip: data.state_equip,
      stateBodyBonus: data.state_body_bonus,
      fine: data.fine,
    });
  }

  if (data.event === "UpdateStorage") {
    store.commit({
      type: 'updateWarehouse',
      warehouse: 'storage',
      capacity: 9999,
      size: data.inventory_size,
      inventory: data.inventory,
      title: "Storage",
    });
  }

  if (data.event === "deleteBox") {
    store.commit({
      type: 'removeWarehouse',
      warehouse: 'box:' + data.id,
    });
  }

  if (data.event === "UpdateBox") {
    store.commit({
      type: 'updateWarehouse',
      warehouse: 'box:' + data.id,
      capacity: data.capacity_size,
      size: data.inventory_size,
      inventory: data.inventory,
      title: "Box",
      meta: {
        type: 'box',
        id: data.id,
      }
    });
  }
}

function addError(error, store) {
  store.commit({
    type: 'addNotification',
    id: error,
    removeSec: 5,
    html: `<span class="importantly">${error}</span>`,
  });
}

function fillUnit(data) {
  let unit = null;

  if (data.unit !== '') {
    unit = JSON.parse(data.unit);
    unit.body = JSON.parse(data.body);
    unit.equip_slots = [];
    unit.weapon_slots = [];
    unit.thorium_slots = [];

    for (let equipSlot of data.equips) {
      unit.equip_slots.push(JSON.parse(equipSlot))
    }

    for (let weaponSlot of data.weapons) {
      unit.weapon_slots.push(JSON.parse(weaponSlot))
    }

    for (let thoriumSlot of data.thorium) {
      unit.thorium_slots.push(JSON.parse(thoriumSlot))
    }
  }

  return unit
}

export {addError}
