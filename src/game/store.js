//** т.к. нам не нужна реактивность вью для игры то у нас свой стор с блекджеком и филдами **//
const gameStore = {
  gameInit: false,
  mapEditor: false,
  gameReady: false,
  unitReady: false,
  reload: false,

  HoldAttackMouse: false,
  map: null, //** тут лежит карта с глобальной коорджинатной позициией 0:0, говорит о том что игрок живет тут **//
  maps: null,
  mapsState: {

  },
  // графияеские уровне для рисования статики
  FogOfWar: {
    back: null,
    brush: null,
  },
  StatusLayer: {
    healBoxes: {},
    bars: {},
  },
  bmdTerrain: null,
  flore: null,
  cashTextures: {}, // движовский checkKey() работает через задницу, поэтому это тут

  // игровые обьекты
  objects: {},
  staticObjects: [],

  user_squad_id: null,
  user: null,

  units: {},
  bullets: {},
  drones: {},
  radar_marks: {},
  boxes: {},
  reservoirs: {},
  bases: {},
  shields: {},
  evacuations: {},
  clouds: {},
  cacheAnimate: {},
  missionHelpersCanvas: null,

  mouseInGameChecker: {
    updater: null,
    time: 0
  },
  /** что бы не создавать постоянно новые спрайты после смерти пули попадают сюда **/
  /** [bullet_sprite_name] []bullets **/
  cacheSpriteBullets: {},

  /** всякие методанные редактора карт **/
  mapEditorState: {
    mpID: 0,
    placeObj: null,
    placeTerrain: null,
    selectSprites: {},
    metaText: {},
    labels: {},
    radiusLvl: 50,
    typeCoordinateEdit: null,
    objSpriteNewGeoData: null,
  },
  spawns: {},
};

export {gameStore}
