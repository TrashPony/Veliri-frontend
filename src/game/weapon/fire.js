import {BlueExplosion, FireExplosion, SmokeExplosion} from "./explosion";
import {GetGlobalPos} from "../map/gep_global_pos";
import {PlayPositionSound} from "../sound/play_sound";

function FireWeapon(data) {

  let pos = GetGlobalPos(data.x, data.y, data.m);

  if (data.wn === "explores_weapon_1" || data.wn.includes('laser_turret_weapon') || data.wn === "explores_transport_1" || data.wn === "big_laser") {
    PlayPositionSound(['big_laser_1_fire', 'big_laser_2_fire', 'big_laser_3_fire'], null, pos.x, pos.y);
    BlueExplosion(pos.x, pos.y, 250, 15, 20, 250, data.r - 15, data.r + 15, data.z);
  }

  if (data.wn === "explores_weapon_2" || data.wn === "explores_weapon_3" || data.wn === "explores_weapon_4" || data.wn === "explores_transport_2" || data.wn === "small_laser") {
    if (data.wn === "explores_weapon_2" || data.wn === "small_laser") {
      PlayPositionSound(['laser_1_fire_1', 'laser_1_fire_2', 'laser_1_fire_3'], null, pos.x, pos.y);
    } else {
      PlayPositionSound(['laser_2_fire_1', 'laser_2_fire_2', 'laser_2_fire_3', 'laser_2_fire_4'], null, pos.x, pos.y);
    }
    FireExplosion(pos.x, pos.y, 700, 15, 10, 10, data.r - 5, data.r + 5, data.z);
  }

  if (data.wn === "replic_weapon_1" || data.wn === "artillery") {
    PlayPositionSound(['firearms_6', 'firearms_4'], null, pos.x, pos.y);
    SmokeExplosion(pos.x, pos.y, 1000, 15, 20, 30, data.r - 15, data.r + 15, data.z);
    FireExplosion(pos.x, pos.y, 200, 10, 20, 300, data.r - 5, data.r + 5, data.z);
  }

  if (data.wn.includes('tank_turret_weapon')) {
    PlayPositionSound(['firearms_3'], null, pos.x, pos.y);
    SmokeExplosion(pos.x, pos.y, 500, 35, 20, 15, data.r - 65, data.r + 65, data.z);
    FireExplosion(pos.x, pos.y, 200, 35, 20, 100, data.r - 35, data.r + 35, data.z);
  }

  if (data.wn.includes('artillery_turret_weapon')) {
    PlayPositionSound(['firearms_6', 'firearms_4'], null, pos.x, pos.y);
    SmokeExplosion(pos.x, pos.y, 500, 35, 20, 15, data.r - 65, data.r + 65, data.z);
    FireExplosion(pos.x, pos.y, 200, 35, 20, 100, data.r - 35, data.r + 35, data.z);
  }

  if (data.wn === "replic_weapon_2" || data.wn === "replic_transport") {
    PlayPositionSound(['firearms_1', 'firearms_2'], null, pos.x, pos.y);
    FireExplosion(pos.x, pos.y, 150, 5, 20, 15, data.r - 25, data.r + 25, data.z);
  }

  if (data.wn === "replic_weapon_3" || data.wn === "replic_weapon_4" || data.wn === "tank_gun") {
    if (data.wn === "replic_weapon_4") {
      PlayPositionSound(['firearms_5'], null, pos.x, pos.y);
    } else {
      PlayPositionSound(['firearms_3'], null, pos.x, pos.y);
    }

    SmokeExplosion(pos.x, pos.y, 300, 5, 20, 30, data.r - 15, data.r + 15, data.z);
    FireExplosion(pos.x, pos.y, 200, 5, 20, 300, data.r - 5, data.r + 5, data.z);
  }

  if (data.wn.includes('replic_gauss_gun_weapon')) {
    PlayPositionSound(['structure_4', 'structure_5'], {seek: 1}, pos.x, pos.y);
    BlueExplosion(pos.x, pos.y, 450, 45, 20, 550, data.r - 5, data.r + 5, data.z);
    SmokeExplosion(pos.x, pos.y, 1500, 35, 20, 200, data.r - 15, data.r + 15, data.z);
  }

  if (data.wn === 'reverses_weapon_1' || data.wn === 'reverses_weapon_2' || data.wn === 'reverses_weapon_3' || data.wn === 'reverses_weapon_4') {
    PlayPositionSound(['missile_1', 'missile_2', 'missile_3'], null, pos.x, pos.y);
  }
}

export {FireWeapon}
