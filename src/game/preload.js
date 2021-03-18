import store from "../store/store";
import {gameStore} from "./store";

let loading = 0;

function preload() {

  this.load.on('progress', function (value) {
    loading = Math.round(value * 100);
  });

  if (!gameStore.mapEditor) {
    this.load.on('fileprogress', function (file) {
      store.commit({
        type: 'setVisibleLoader',
        visible: true,
        text: `загрузка текстур: <span style="font-size: 9px; color: yellow">${file.key}</span> (${loading} %)`,
      });
    });

    this.load.on('complete', function () {
      store.commit({
        type: 'setVisibleLoader',
        visible: true,
        text: `<span style="font-size: 9px; color: yellow">тут я обычно зависаю</span>`,
      });
    });
  }

  this.load.bitmapFont('bit_text',
    require("../assets/bit_map_text/bit_map_text.png"),
    require("../assets/bit_map_text/bit_map_text.xml"),
  );

  const atlases = [
    {
      key: 'items',
      textureURL: require("../assets/items/atlas/items.png"),
      atlasURL: require("../assets/items/atlas/items_atlas.json"),
    }, {
      key: 'equips',
      textureURL: require("../assets/units/equip/atlas/equips.png"),
      atlasURL: require("../assets/units/equip/atlas/equips_atlas.json"),
    }, {
      key: 'weapons',
      textureURL: require("../assets/units/weapon/atlas/weapons.png"),
      atlasURL: require("../assets/units/weapon/atlas/weapons_atlas.json"),
    }, {
      key: 'mountains',
      textureURL: require("../assets/map/objects/mountains/atlas/mountains.png"),
      atlasURL: require("../assets/map/objects/mountains/atlas/mountains_atlas.json"),
    }, {
      key: 'plants',
      textureURL: require("../assets/map/objects/plants/atlas/plants.png"),
      atlasURL: require("../assets/map/objects/plants/atlas/plants_atlas.json"),
    }, {
      key: 'ravines',
      textureURL: require("../assets/map/objects/ravines/atlas/ravines.png"),
      atlasURL: require("../assets/map/objects/ravines/atlas/ravines_atlas.json"),
    }, {
      key: 'roads',
      textureURL: require("../assets/map/objects/roads/atlas/roads.png"),
      atlasURL: require("../assets/map/objects/roads/atlas/roads_atlas.json"),
    }, {
      key: 'unknown_civilization',
      textureURL: require("../assets/map/objects/unknown_civilization/atlas/unknown_civilization.png"),
      atlasURL: require("../assets/map/objects/unknown_civilization/atlas/unknown_civilization_atlas.json"),
    }, {
      key: 'unit_wreckage',
      textureURL: require("../assets/map/objects/unit_wreckage/atlas/unit_wreckage.png"),
      atlasURL: require("../assets/map/objects/unit_wreckage/atlas/unit_wreckage_atlas.json"),
    }, {
      key: 'structure_wreckage',
      textureURL: require("../assets/map/objects/structure_wreckage/atlas/structure_wreckage.png"),
      atlasURL: require("../assets/map/objects/structure_wreckage/atlas/structure_wreckage_atlas.json"),
    }, {
      key: 'shores',
      textureURL: require("../assets/map/objects/shores/atlas/shores.png"),
      atlasURL: require("../assets/map/objects/shores/atlas/shores_atlas.json"),
    }, {
      key: 'sector_structure',
      textureURL: require("../assets/map/objects/sector_structure/atlas/sector_structure.png"),
      atlasURL: require("../assets/map/objects/sector_structure/atlas/sector_structure_atlas.json"),
    }, {
      key: 'other',
      textureURL: require("../assets/map/objects/other/atlas/other.png"),
      atlasURL: require("../assets/map/objects/other/atlas/other_atlas.json"),
    }, {
      key: 'elevations',
      textureURL: require("../assets/map/objects/elevations/atlas/elevations.png"),
      atlasURL: require("../assets/map/objects/elevations/atlas/elevations_atlas.json"),
    }, {
      key: 'craters',
      textureURL: require("../assets/map/objects/craters/atlas/craters.png"),
      atlasURL: require("../assets/map/objects/craters/atlas/craters_atlas.json"),
    }, {
      key: 'structures',
      textureURL: require("../assets/map/structures/atlas/structures.png"),
      atlasURL: require("../assets/map/structures/atlas/structures_atlas.json"),
    }, {
      key: 'resource',
      textureURL: require("../assets/map/resource/atlas/resource.png"),
      atlasURL: require("../assets/map/resource/atlas/resource_atlas.json"),
    }, {
      key: 'flares',
      textureURL: require("../assets/fire_effects/flares.png"),
      atlasURL: require("../assets/fire_effects/flares_atlas.json"),
    }, {
      key: 'bullets',
      textureURL: require("../assets/units/gameAmmo/atlas/bullets.png"),
      atlasURL: require("../assets/units/gameAmmo/atlas/bullets_atlas.json"),
    }, {
      key: 'MasherShip_1',
      textureURL: require("../assets/units/body/MasherShip_1/atlas/MasherShip_1.png"),
      atlasURL: require("../assets/units/body/MasherShip_1/atlas/MasherShip_1_atlas.json"),
    }, {
      key: 'MasherShip_2',
      textureURL: require("../assets/units/body/MasherShip_2/atlas/MasherShip_2.png"),
      atlasURL: require("../assets/units/body/MasherShip_2/atlas/MasherShip_2_atlas.json"),
    }, {
      key: 'MasherShip_3',
      textureURL: require("../assets/units/body/MasherShip_3/atlas/MasherShip_3.png"),
      atlasURL: require("../assets/units/body/MasherShip_3/atlas/MasherShip_3_atlas.json"),
    }, {
      key: 'replic_builder_body',
      textureURL: require("../assets/units/body/replic_builder_body/atlas/replic_builder_body.png"),
      atlasURL: require("../assets/units/body/replic_builder_body/atlas/replic_builder_body_atlas.json"),
    }, {
      key: 'replic_miner',
      textureURL: require("../assets/units/body/replic_miner/atlas/replic_miner.png"),
      atlasURL: require("../assets/units/body/replic_miner/atlas/replic_miner_atlas.json"),
    }, {
      key: 'replic_scout',
      textureURL: require("../assets/units/body/replic_scout/atlas/replic_scout.png"),
      atlasURL: require("../assets/units/body/replic_scout/atlas/replic_scout_atlas.json"),
    }, {
      key: 'replic_transport',
      textureURL: require("../assets/units/body/replic_transport/atlas/replic_transport.png"),
      atlasURL: require("../assets/units/body/replic_transport/atlas/replic_transport_atlas.json"),
    }, {
      key: 'replic_warrior',
      textureURL: require("../assets/units/body/replic_warrior/atlas/replic_warrior.png"),
      atlasURL: require("../assets/units/body/replic_warrior/atlas/replic_warrior_atlas.json"),
    }, {
      key: 'explores_builder_body',
      textureURL: require("../assets/units/body/explores_builder_body/atlas/explores_builder_body.png"),
      atlasURL: require("../assets/units/body/explores_builder_body/atlas/explores_builder_body_atlas.json"),
    }, {
      key: 'explores_miner',
      textureURL: require("../assets/units/body/explores_miner/atlas/explores_miner.png"),
      atlasURL: require("../assets/units/body/explores_miner/atlas/explores_miner_atlas.json"),
    }, {
      key: 'explores_scout',
      textureURL: require("../assets/units/body/explores_scout/atlas/explores_scout.png"),
      atlasURL: require("../assets/units/body/explores_scout/atlas/explores_scout_atlas.json"),
    }, {
      key: 'explores_transport',
      textureURL: require("../assets/units/body/explores_transport/atlas/explores_transport.png"),
      atlasURL: require("../assets/units/body/explores_transport/atlas/explores_transport_atlas.json"),
    }, {
      key: 'explores_warrior',
      textureURL: require("../assets/units/body/explores_warrior/atlas/explores_warrior.png"),
      atlasURL: require("../assets/units/body/explores_warrior/atlas/explores_warrior_atlas.json"),
    }, {
      key: 'reverses_builder_body',
      textureURL: require("../assets/units/body/reverses_builder_body/atlas/reverses_builder_body.png"),
      atlasURL: require("../assets/units/body/reverses_builder_body/atlas/reverses_builder_body_atlas.json"),
    }, {
      key: 'reverses_miner',
      textureURL: require("../assets/units/body/reverses_miner/atlas/reverses_miner.png"),
      atlasURL: require("../assets/units/body/reverses_miner/atlas/reverses_miner_atlas.json"),
    }, {
      key: 'reverses_scout',
      textureURL: require("../assets/units/body/reverses_scout/atlas/reverses_scout.png"),
      atlasURL: require("../assets/units/body/reverses_scout/atlas/reverses_scout_atlas.json"),
    }, {
      key: 'reverses_transport',
      textureURL: require("../assets/units/body/reverses_transport/atlas/reverses_transport.png"),
      atlasURL: require("../assets/units/body/reverses_transport/atlas/reverses_transport_atlas.json"),
    }, {
      key: 'reverses_warrior',
      textureURL: require("../assets/units/body/reverses_warrior/atlas/reverses_warrior.png"),
      atlasURL: require("../assets/units/body/reverses_warrior/atlas/reverses_warrior_atlas.json"),
    }, {
      key: 'apd_light',
      textureURL: require("../assets/units/body/apd_light/atlas/apd_light.png"),
      atlasURL: require("../assets/units/body/apd_light/atlas/apd_light_atlas.json"),
    }, {
      key: 'apd_medium',
      textureURL: require("../assets/units/body/apd_medium/atlas/apd_medium.png"),
      atlasURL: require("../assets/units/body/apd_medium/atlas/apd_medium_atlas.json"),
    }, {
      key: 'apd_heavy',
      textureURL: require("../assets/units/body/apd_heavy/atlas/apd_heavy.png"),
      atlasURL: require("../assets/units/body/apd_heavy/atlas/apd_heavy_atlas.json"),
    }, {
      key: 'apd_super_heavy_1',
      textureURL: require("../assets/units/body/apd_super_heavy_1/atlas/apd_super_heavy_1.png"),
      atlasURL: require("../assets/units/body/apd_super_heavy_1/atlas/apd_super_heavy_1_atlas.json"),
    }, {
      key: 'apd_super_heavy_2',
      textureURL: require("../assets/units/body/apd_super_heavy_2/atlas/apd_super_heavy_2.png"),
      atlasURL: require("../assets/units/body/apd_super_heavy_2/atlas/apd_super_heavy_2_atlas.json"),
    }
  ];

  for (let atlas of atlases) {
    this.load.atlas(atlas);
  }

  // TODO все что ниже этой линии надо затолкать в атлосы

  //Tunel
  this.load.spritesheet('tunel', require("../assets/map/animate/tunel.png"), {
    frameWidth: 512,
    frameHeight: 768
  });
  this.load.spritesheet('tunel_out', require("../assets/map/animate/tunel_out.png"), {
    frameWidth: 512,
    frameHeight: 512
  });

  // fire effects
  this.load.image('explosion_border', require("../assets/fire_effects/explosion_border.png"));

  // drones
  this.load.image('digger', require("../assets/units/drones/digger.png"));

  // evacuations
  this.load.image('evacuation_explores', require("../assets/map/evacuations/evacuation_explores.png"));
  this.load.image('evacuation_replics', require("../assets/map/evacuations/evacuation_replics.png"));
  this.load.image('evacuation_reverses', require("../assets/map/evacuations/evacuation_reverses.png"));

  // Boxes
  this.load.image('box', require("../assets/boxes/sprites/box.png"));
  this.load.image('secure_underground_box', require("../assets/boxes/sprites/secure_underground_box.png"));
  this.load.image('underground_box', require("../assets/boxes/sprites/underground_box.png"));

  //Brush
  this.load.image('water_1', require("../assets//terrainTextures/water_1.jpg"));
  this.load.image('brush_256', require("../assets/terrainTextures/brush_256.png"));
  this.load.image('brush_128', require("../assets/terrainTextures/brush_128.png"));

  this.load.image('brush', require("../assets/terrainTextures/brush.png"));
  this.load.image('desertDunes', require("../assets/terrainTextures/desertDunes.png"));
  this.load.image('desertDunes_2', require("../assets/terrainTextures/desertDunes_2.png"));
  this.load.image('xenos', require("../assets/terrainTextures/xenos.png"));
  this.load.image('xenos_2', require("../assets/terrainTextures/xenos_2.png"));
  this.load.image('arctic', require("../assets/terrainTextures/arctic.png"));
  this.load.image('arctic_2', require("../assets/terrainTextures/arctic_2.png"));
  this.load.image('tundra', require("../assets/terrainTextures/tundra.png"));
  this.load.image('tundra_2', require("../assets/terrainTextures/tundra_2.png"));
  this.load.image('grass_1', require("../assets/terrainTextures/grass_1.png"));
  this.load.image('grass_2', require("../assets/terrainTextures/grass_2.png"));
  this.load.image('grass_3', require("../assets/terrainTextures/grass_3.png"));
  this.load.image('soil', require("../assets/terrainTextures/soil.png"));
  this.load.image('soil_2', require("../assets/terrainTextures/soil_2.png"));
  this.load.image('ravine_1', require("../assets/terrainTextures/ravine_1.png"));
  this.load.image('ravine_2', require("../assets/terrainTextures/ravine_2.png"));
  //this.load.atlas('terrains', require("../assets/terrainTextures/atlas/terrains.png"), require("../assets/terrainTextures/atlas/terrains_atlas.json"));

  //Clouds
  this.load.image('cloud0', require("../assets/map/clouds/cloud13.png"));
  this.load.image('cloud1', require("../assets/map/clouds/cloud1.png"));
  this.load.image('cloud2', require("../assets/map/clouds/cloud2.png"));
  this.load.image('cloud3', require("../assets/map/clouds/cloud3.png"));
  this.load.image('cloud4', require("../assets/map/clouds/cloud4.png"));
  this.load.image('cloud5', require("../assets/map/clouds/cloud5.png"));
  this.load.image('cloud6', require("../assets/map/clouds/cloud6.png"));
  this.load.image('cloud7', require("../assets/map/clouds/cloud7.png"));
  this.load.image('cloud8', require("../assets/map/clouds/cloud8.png"));
  this.load.image('cloud9', require("../assets/map/clouds/cloud9.png"));
  this.load.image('cloud10', require("../assets/map/clouds/cloud10.png"));
  this.load.image('cloud11', require("../assets/map/clouds/cloud11.png"));
  this.load.image('cloud12', require("../assets/map/clouds/cloud12.png"));

  // Radar Icon
  this.load.image('fly_radar_icon', require("../assets/radar/fly.png"));
  this.load.image('structure_radar_icon', require("../assets/radar/structure.png"));
  this.load.image('ground_radar_icon', require("../assets/radar/ground.png"));
  this.load.image('resource_radar_icon', require("../assets/radar/resource.png"));
  this.load.image('meteorite_radar_icon', require("../assets/radar/meteorite.png"));
  this.load.image('bullet_radar_icon', require("../assets/radar/bullet.png"));

  // щиты
  this.load.spritesheet('shield_1', require("../assets/units/shields/shield_1.png"), {
    frameWidth: 128,
    frameHeight: 128,
    endFrame: 112
  });
  this.load.image('shield_1_border', require("../assets/units/shields/shield_1_border.png"));

  // if (TypeService !== 'global') {
  //     // zone
  //     this.load.spritesheet('selectEmpty', 'http://' + window.location.host + '/assets/select/empty.png', {
  //         frameWidth: 80,
  //         frameHeight: 100
  //     });
  this.load.spritesheet('mapEditor', require("../assets/select/mapEditor.png"), {
    frameWidth: 80,
    frameHeight: 100
  });
  //     // path
  //     this.load.spritesheet('pathCell', 'http://' + window.location.host + '/assets/select/pathSelect.png', {
  //         frameWidth: 80,
  //         frameHeight: 100
  //     });
  //
  //     // Buttons
  //     this.load.image('buttonPlus', 'http://' + window.location.host + '/assets/buttons/buttonPlus.png');
  //     this.load.image('buttonMinus', 'http://' + window.location.host + '/assets/buttons/buttonMinus.png');
  this.load.image('baseIcon', require("../assets/buttons/baseIcon.png"));
  this.load.image('baseResp', require("../assets/buttons/baseResp.png"));
  //
  //     // Buttons
  //     this.load.image('buttonRotate', 'http://' + window.location.host + '/assets/buttons/rotate.png');
  //
  //     // Icons
  this.load.image('transportIcon', require("../assets/icons/transport.png"));
  this.load.image('baseInIcon', require("../assets/icons/baseIcon.png"));
  this.load.image('sectorOutIcon', require("../assets/icons/sectorOutIcon.png"));
  //     this.load.image('cancelIcon', 'http://' + window.location.host + '/assets/icons/cancelIcon.png');
  //     this.load.image('ammoCoordinate', 'http://' + window.location.host + '/assets/icons/ammoCoordinate.png');
  // }

  this.load.audio('structure_4', require("../assets/audio/sound_effects/fire_weapon/structure_4.mp3"));
  this.load.audio('structure_5', require("../assets/audio/sound_effects/fire_weapon/structure_5.mp3"));

  // Weapon sound
  this.load.audio('big_laser_1_fire', require("../assets/audio/sound_effects/fire_weapon/big_laser_1_fire.mp3"));
  this.load.audio('big_laser_1_reload', require("../assets/audio/sound_effects/fire_weapon/big_laser_1_reload.mp3"));
  this.load.audio('big_laser_2_fire', require("../assets/audio/sound_effects/fire_weapon/big_laser_2_fire.mp3"));
  this.load.audio('big_laser_2_reload', require("../assets/audio/sound_effects/fire_weapon/big_laser_2_reload.mp3"));
  this.load.audio('big_laser_3_fire', require("../assets/audio/sound_effects/fire_weapon/big_laser_3_fire.mp3"));
  this.load.audio('big_laser_3_reload', require("../assets/audio/sound_effects/fire_weapon/big_laser_3_reload.mp3"));

  this.load.audio('laser_1_fire_1', require("../assets/audio/sound_effects/fire_weapon/laser_1_fire_1.mp3"));
  this.load.audio('laser_1_fire_2', require("../assets/audio/sound_effects/fire_weapon/laser_1_fire_2.mp3"));
  this.load.audio('laser_1_fire_3', require("../assets/audio/sound_effects/fire_weapon/laser_1_fire_3.mp3"));
  this.load.audio('laser_1_reload', require("../assets/audio/sound_effects/fire_weapon/laser_1_reload.mp3"));

  this.load.audio('laser_2_fire_1', require("../assets/audio/sound_effects/fire_weapon/laser_2_fire_1.mp3"));
  this.load.audio('laser_2_fire_2', require("../assets/audio/sound_effects/fire_weapon/laser_2_fire_2.mp3"));
  this.load.audio('laser_2_fire_3', require("../assets/audio/sound_effects/fire_weapon/laser_2_fire_3.mp3"));
  this.load.audio('laser_2_fire_4', require("../assets/audio/sound_effects/fire_weapon/laser_2_fire_4.mp3"));
  this.load.audio('laser_2_reload', require("../assets/audio/sound_effects/fire_weapon/laser_1_reload.mp3"));

  this.load.audio('firearms_1', require("../assets/audio/sound_effects/fire_weapon/firearms_1.mp3"));
  this.load.audio('firearms_2', require("../assets/audio/sound_effects/fire_weapon/firearms_2.mp3"));
  this.load.audio('firearms_3', require("../assets/audio/sound_effects/fire_weapon/firearms_3.mp3"));
  this.load.audio('firearms_4', require("../assets/audio/sound_effects/fire_weapon/firearms_4.mp3"));
  this.load.audio('firearms_5', require("../assets/audio/sound_effects/fire_weapon/firearms_5.mp3"));
  this.load.audio('firearms_6', require("../assets/audio/sound_effects/fire_weapon/firearms_6.mp3"));

  this.load.audio('missile_1', require("../assets/audio/sound_effects/fire_weapon/missile_1.mp3"));
  this.load.audio('missile_2', require("../assets/audio/sound_effects/fire_weapon/missile_2.mp3"));
  this.load.audio('missile_3', require("../assets/audio/sound_effects/fire_weapon/missile_3.mp3"));

  // this.load.audio('explosion_1', require("../assets/audio/sound_effects/explosions/explosion_1.mp3"));
  // this.load.audio('explosion_2', require("../assets/audio/sound_effects/explosions/explosion_2.mp3"));
  // this.load.audio('explosion_3', require("../assets/audio/sound_effects/explosions/explosion_3.mp3"));

}

export {preload}
