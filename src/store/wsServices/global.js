import {CreateGame, Scene} from "../../game/create"
import {gameStore} from "../../game/store"
import {ServerGunDesignator} from "../../game/interface/server_gun_designator"
import {RadarWork} from "../../game/radar/work"
import {CreateDynamicObjects, removeAllObj} from "../../game/radar/object"
import {MoveMark, RemoveAllMark} from "../../game/radar/marks"
import {RotateEquip, RotateGun} from "../../game/unit/rotate"
import {AddUnitMoveBufferData} from "../../game/unit/move";
import {AddTransportMoveBufferData} from "../../game/evacuation/move";
import router from "../../router/router";
import {AddDroneMoveBufferData, DroneTo} from "../../game/drone/fly";
import {CreateCloud, removeCloud} from "../../game/cloud/cloud";
import {FocusUnit} from "../../game/interface/focus_unit";
import {FireWeapon} from "../../game/weapon/fire";
import {AddBulletMoveBufferData, FlyLaser} from "../../game/bullet/fly";
import {ExplosionBullet} from "../../game/weapon/explosion";
import {BoxMove} from "../../game/box/move";
import {damageText} from "../../game/text/damage";
import {ObjectDead} from "../../game/map/object_dead";
import {DroneTarget} from "../../game/drone/target";
import {MiningTargets} from "../../game/equip/mining_targets";
import {Mining} from "../../game/equip/mining";
import {OpenBox} from "../../game/box/open";
import {CreateMapBar} from "../../game/interface/status_layer";
import {ResponsePlace, SelectPlaceBuild} from "../../game/build/select_place_build";
import {BuilderTargets} from "../../game/build/builder_targets";
import {BuildAnimate} from "../../game/build/build_animate";
import {RotateTurretGun} from "../../game/map/structures/turret";
import {SectorAttack} from "../../game/sector/attack";
import {MissileDefense} from "../../game/equip/missile_defense";
import {UnitsTargets} from "../../game/equip/units_targets";
import {RepairLine} from "../../game/equip/repair";
import {RemoveOldMap} from "../../game/map/remove_old_map";
import {TransportBlock} from "../../game/evacuation/transport_block";
import {extractorExtracted} from "../../game/map/structures/extractor";
import {HitItem} from "../../game/interface/hit_item";
import {showMessage} from "../../game/text/message";
import {RotateObjectEquip} from "../../game/map/structures/repair_station";
import {logMsg} from "./log";
import {debugMessage} from "../../game/debug/debug";
import {addError} from "./inventory";

export default function createGlobalPlugin(WS) {
  return store => {

    WS.onopen = function () {
      console.log("Connection global opened..." + this.readyState);

      WS.send(JSON.stringify({
        event: "InitGame"
      }));

      store.commit({
        type: 'setWSConnectState',
        service: 'global',
        connect: true,
        error: false,
        reconnect: false,
        ws: WS,
      });
    };

    WS.onclose = function (i) {

      store.commit({
        type: 'setWSConnectState',
        service: 'global',
        connect: false,
        error: true,
        ws: WS,
      });

      console.log("global закрыт" + i);
    };

    WS.onmessage = function (msg) {
      GlobalRead(JSON.parse(msg.data), store, WS);
    };
  };
}

let oldTime = 0;

function GlobalRead(data, store, ws) {

  if (data.event) logMsg(data.event, data);
  if (data.e) logMsg(data.e, data);

  if (!data || !(data.event || data.e)) return;

  if (data.event === "ping") {
    ws.send(JSON.stringify({
      event: "pong"
    }));
  }

  if (data.event === "IntoToBase") {
    store.commit({
      type: 'removeNotification',
      id: 'softTransition',
    });

    store.commit({
      type: 'removeNotification',
      id: 'setFreeCoordinate',
    });

    if (!document.getElementById("end_status") && location.href !== 'http://' + window.location.host + '/#/lobby') {
      store.commit({
        type: 'setVisibleLoader',
        visible: true,
        text: 'Входим на базу...'
      });

      console.log(data)
      router.push('/lobby');
    }
  }

  if (data.event === "InitGame") {

    RemoveOldMap();

    gameStore.maps = data.msg.maps;
    gameStore.user = data.msg.user;
    gameStore.bases = data.msg.bases;
    gameStore.user_squad_id = data.msg.unit_id;

    store.commit({
      type: 'setUser',
      user: data.msg.user,
    });

    store.commit({
      type: 'setSector',
      base: data.msg.base,
      capture_time: data.msg.seconds,
    });

    store.commit({
      type: 'setPlayerRole',
      role: data.msg.spectrum ? 'Spectrum' : '',
    });

    store.getters.getWSByService('inventory').socket.send(JSON.stringify({
      event: "openInventory"
    }));

    CreateGame();
  }

  if (!gameStore.gameReady) {
    return
  }

  if (data.e === "rw") {
    RadarWork(data.ev)
  }

  if (data.event === "RefreshRadar") {
    RemoveAllMark();
    removeAllObj();
  }

  if (data.event === "RefreshDynamicObj") {
    CreateDynamicObjects(data.msg);
  }

  if (data.event === "Spectrum") {
    store.commit({
      type: 'setPlayerRole',
      role: 'Spectrum',
    });
  }

  if (data.event === "SectorAttack") {
    SectorAttack(data.base, data.seconds);
    store.commit({
      type: 'setSector',
      base: data.base,
      capture_time: data.seconds,
    });
  }

  if (data.e === "fs") {
    if (data.eq) {
      store.commit({
        type: 'setEquipPanel',
        equipPanel: data.eq.equip_panel,
      });
      store.commit({
        type: 'setSelectEquip',
        selectEquip: data.eq.select_mouse_equip,
      });
    }

    if (data.s) {
      store.commit({
        type: 'setUnitHP',
        hp: data.s.h,
      });

      store.commit({
        type: 'setUnitEnergy',
        energy: data.s.e,
      });
    }

    if (data.state) {
      store.commit({
        type: 'setStateUnit',
        stateMS: data.state.state_ms,
      });
    }

    if (data.thorium) {
      store.commit({
        type: 'setThoriumSlots',
        thorium_slots: data.thorium.slots,
      });
    }
  }

  if (data.event === "UpdateInventory") { // говорит клиенту обновлить инвентарь
    store.getters.getWSByService('inventory').socket.send(JSON.stringify({
      event: "openInventory",
    }))
  }

  if (data.e === "mt") {
    ServerGunDesignator(data);
  }

  if (data.e === "rg") {
    RotateGun(data);
  }

  if (data.e === "re") {
    RotateEquip(data);
  }

  if (data.e === "TransportMove" || data.e === "usm" || data.e === "DroneMove" || data.e === "BoxMove") {
    //if (data.e === "usm") console.log(JSON.stringify(data))
    for (let msg of data.msg) {
      if (msg.e === "um") {
        AddUnitMoveBufferData(msg);
        continue
      }
      if (msg.e === "mm") {
        MoveMark(msg);
        continue
      }
      if (msg.e === "tm") {
        AddTransportMoveBufferData(msg)
        continue
      }
      if (msg.type === "drone") {
        AddDroneMoveBufferData(msg);
        continue
      }
      if (msg.type === "box") {
        BoxMove(msg.path_unit, msg.id, msg.map_id)
      }
    }
  }

  if (data.e === "fb") {
    for (let msg of data.m) {
      if (msg.e === "fb") {
        AddBulletMoveBufferData(msg);
        continue
      }

      if (msg.e === "eb") {
        ExplosionBullet(msg);
        continue
      }

      if (msg.e === "mm") {
        MoveMark(msg);
      }
    }
  }

  if (data.e === "eb") {
    ExplosionBullet(data);
  }

  if (data.e === "um") {
    AddUnitMoveBufferData(data);
  }

  if (data.e === "tm") {
    AddTransportMoveBufferData(data)
  }

  if (data.event === "DroneTo") {
    AddDroneMoveBufferData(data.msg)
  }

  if (data.e === "mm") {
    MoveMark(data);
  }

  if (data.event === "boxTo") {
    BoxMove(data.msg.path_unit, data.msg.id, data.msg.map_id)
  }

  if (data.e === "cm") {
    for (let event of data.cm) {
      if (event.e === "mc") {
        CreateCloud(JSON.parse(event.cl))
      }
      if (event.e === "rm") {
        removeCloud(JSON.parse(event.cl).uuid)
      }
    }
  }

  if (data.event === "focusMS") {
    FocusUnit(data.short_unit.id);
  }

  if (data.event === "Error") {
    addError(data.error, store)
  }

  if (data.e === "fw") {
    FireWeapon(data)
  }

  if (data.event === "FlyLaser") {
    FlyLaser(data);
  }

  if (data.event === "ExplosionBullet") {
    ExplosionBullet(data);
  }

  if (data.e === "dt") {
    damageText(data)
  }

  if (data.e === "od") {
    ObjectDead(data)
  }

  if (data.event === "diggerDroneTarget") {
    DroneTarget(data)
  }

  if (data.event === "oreTargets") {
    // todo #556 одинаковый код
    MiningTargets(data)
  }

  if (data.event === "OreMiningTarget") {
    Mining(data)
  }

  if (data.event === "progressMining") {

    store.commit({
      type: 'updateReservoir',
      id: 'reservoirTip' + data.msg.reservoir.x + "" + data.msg.reservoir.y,
      count: data.msg.reservoir.count,
    });

    let reservoir = gameStore.reservoirs[data.msg.reservoir.id];
    reservoir.progress = data.msg.count;
    CreateMapBar(reservoir.sprite, 100, reservoir.progress, 7, 0xffa009, Scene, 'reservoir', reservoir.id, 'progress', 5);
  }

  if (data.event === "openBox") {
    OpenBox(data.inventory, data.box_id, data.size, data.error, true)
  }

  if (data.event === "UpdateBox") {
    OpenBox(data.inventory, data.box_id, data.size, null, false)
  }

  if (data.event === "InitBuild") {
    store.commit({
      type: 'setBuildMenuBps',
      blueprints: data.inventory_slots,
    });
  }

  if (data.event === "GetStructureNeedItems") {
    store.commit({
      type: 'setNeedItemsBP',
      id_blueprint: data.id,
      structure: {
        slots: data.inventory_slots,
        structure: data.object
      },
    });
  }

  if (data.event === "getPlaceGeoData") {
    ResponsePlace(data.msg.dynamic_object, data.msg.successful, data.msg.radius, data.msg.allow_points, data.msg.map_id)
  }

  if (data.event === "PlaceStructure") {
    SelectPlaceBuild(data.dynamic_object, data.id)
  }

  if (data.event === "builderTargets") {
    // todo #556 одинаковый код
    BuilderTargets(data)
  }

  if (data.event === "BuildTarget") {
    BuildAnimate(data)
  }

  if (data.e === "rt") {
    RotateTurretGun(data)
  }

  if (data.e === "roe") {
    RotateObjectEquip(data)
  }

  if (data.event === "AnomalySignal") {
    store.commit({
      type: 'setAnomalies',
      anomalies: data.msg,
    });
  }

  if (data.event === "RemoveAnomalies") {
    store.commit({
      type: 'setAnomalies',
      anomalies: null,
    });
  }

  if (data.event === "MissileDefense") {
    MissileDefense(data)
  }

  if (data.event === "unitsTargets") {
    // todo #556 одинаковый код
    UnitsTargets(data)
  }

  // if (jsonData.event === "HealTargetNoDist") {
  //   // TODO юнит хилит сам себя
  // }
  //
  // if (jsonData.event === "AfterburnerToggle") {
  //   Afterburner(jsonData.msg)
  // }

  if (data.event === "changeSector") {
    store.commit({
      type: 'setVisibleLoader',
      visible: true,
      text: 'Обновляем карту...'
    });
  }

  if (data.event === "HealTarget") {
    RepairLine(data)
  }

  if (data.event === "TransportBlock") {
    TransportBlock(data)
  }

  if (data.event === "setFreeCoordinate") {
    store.commit({
      type: 'addNotification',
      id: 'setFreeCoordinate',
      removeSec: data.seconds,
      html: `<p class="importantly">Внимание!</p>
             Освободите выход с базы. <span class="importantly">(time_place)</span><br><br>
             <span class="importantly">Иначе будете отбуксированы!</span>`,
    });
  }

  if (data.event === "removeNoticeFreeCoordinate") {
    store.commit({
      type: 'removeNotification',
      id: 'setFreeCoordinate',
    });
  }

  if (data.event === "softTransition") {
    store.commit({
      type: 'addNotification',
      id: 'softTransition',
      removeSec: 5,
      html: `<p class="importantly">Внимание!</p>
             Перемещениече через: <span class="importantly">(time_place)</span>`,
    });
  }

  if (data.event === "removeSoftTransition") {
    store.commit({
      type: 'removeNotification',
      id: 'softTransition',
    });
  }

  if (data.event === "MeteorRain") {
    store.commit({
      type: 'addNotification',
      id: 'softTransition',
      removeSec: 4,
      html: `<p class="importantly">Внимание!</p>
             В секторе Метеоритный дождь!`,
    });
  }

  if (data.event === "OpenObject") {
    // OpenObjects(data)
    if (data.error === '') {
      store.commit({
        type: 'toggleWindow',
        id: 'ObjectDialog' + data.dynamic_object.id,
        component: 'ObjectDialog',
        meta: {
          id: data.dynamic_object.id
        },
        forceOpen: true,
      });

      store.commit({
        type: 'addOpenObjects',
        id: data.dynamic_object.id,
        dynamic_object: data.dynamic_object,
        other_user: data.other_user,
        box: data.box,
        inventory: data.inventory,
        size: data.size,
      });

    } else {
      store.commit({
        type: 'toggleWindow',
        id: 'ObjectDialog' + data.dynamic_object.id,
        forceClose: true,
      });

      addError(data.error, store)
    }
  }

  if (data.event === "GetPortalPointToGlobalPath") {
    if (data.name === "mission") {
      store.commit({
        type: 'setHelper',
        helper: {x: data.x, y: data.y, radius: 0},
      });
    }
  }

  if (data.event === "SetMissionPoints") {
    store.commit({
      type: 'setPoints',
      points: data.msg.points,
    });
  }

  if (data.event === "extractorExtracted") {
    if (data.msg.reservoir) {
      store.commit({
        type: 'updateReservoir',
        id: 'reservoirTip' + data.msg.reservoir.x + "" + data.msg.reservoir.y,
        count: data.msg.reservoir.count,
      });
    }
    extractorExtracted(data.id, data.msg.progress, data.msg.extract_x, data.msg.extract_y, data.msg.cargo_place, data.msg.work)
  }

  if (data.event === "HitItem") {
    HitItem(data.msg.count, data.msg.item, data.x, data.y, data.msg.uuid, data.msg.map_id)
  }

  if (data.event === "GetAvailableAmmo") {
    store.commit({
      type: 'setAvailableAmmo',
      availableAmmo: data.msg.ammo,
    });
  }

  if (data.event === "AiMessage") {
    showMessage(data.msg)
  }

  debugMessage(data)
}
