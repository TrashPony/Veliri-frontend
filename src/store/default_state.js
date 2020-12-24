const getDefaultState = () => {
  return {
    training: {
      point: 0,
      needIntoHangar: false,
    },
    Settings: {
      volume: 0.1,
      SFXVolume: 0.1,
      Language: "RU",
    },
    EndLoad: {
      chat: false,
      inventory: false,
      market: false,
      global: false,
      lobby: false,
      visible: false,
      text: '',
    },
    /** Notifications[id] = {html: template} **/
    Notifications: {},
    WaitGame: {
      usersWait: 0,
      MyWait: null,
    },
    // тут лежит все что связано с игровыми ИНТЕРФЕЙСАМИ игровые обьекты лежат в сторедже самой игры game/storage
    Game: {
      thorium_slots: null,
      user: null,
      anomalies: null,
      role: "",
      sector: {
        base: null,
        capture_time: null,
      },
      open_objects: {},
      availableAmmo: {},
      current_speed: 0,
    },
    Battle: null,
    KillsNotify: [],
    PointsNotify: [],
    GameUser: {},
    UserPlayers: [],
    User: {},
    Chat: {
      currentChatID: 0,
      groups: [],
      users: {},
      notifys: {},
      allGroups: {},
      friends: {},
      avatars: {},
      group: {
        /** тут хранится вся мета отряда игрока (пати/группа) **/
        members: {},
        leaderID: 0,
        state: null,
        uuid: "",
      },
      sessionGroup: {
        /** тут хранится вся мета отряда игрока (пати/группа) для сессионных игр **/
        members: {},
        leaderID: 0,
        state: null,
        uuid: "",
      },
      corporation: {}, /** тут хранится вся мета корпорации игрока **/
      corporations: {}, /** все корпорации в игре **/
      mySkills: {}, /** скилы игрока **/
      violators: {},
      distressSignals: {},
    },
    Market: {
      assortment: {
        ammo: null,
        blueprints: null,
        body: null,
        boxes: null,
        detail: null,
        equip: null,
        recycle: null,
        resource: null,
        trash: null,
        weapon: null,
      },
      orders: null,
      my_orders: null,
      my_credits: 0,
      count_items: {}, // что бы игрок знал сколько у него итемов на складе под каждый ордер
      filters: {
        // указывает на фильтр по которому будет ариентироватся таблицы заказов
        selectType: '', // ['ammo', 'body', 'weapon', 'equip', 'resource', 'blueprints', 'boxes', 'trash']
        item: null,
        ammo: {
          type: '', // ['laser', 'missile', 'firearms']
          size: 0,  // [1, 2, 3]
          id: 0,
        },
        weapon: {
          type: '', // ['laser', 'missile', 'firearms']
          size: 0,  // [1, 2, 3]
          id: 0,
        },
        body: {
          type: '',
          size: 0,  // [1, 2, 3]
          id: 0,
        },
        equip: {
          type: '',
          size: 0,  // [1, 2, 3]
          id: 0,
        },
        resource: {
          type: '',  // [resource, recycle, detail]
          size: 0,
          id: 0,
        },
        blueprints: {
          type: '', //  ['ammo', 'body', 'weapon', 'equip', 'detail', 'boxes', 'map']
          size: 0,
          id: 0,
        },
        boxes: {
          type: '',
          size: 0,
          id: 0,
        },
        trash: {
          type: '',
          size: 0,
          id: 0,
        }
      }
    },
    Inventory: {
      warehouse: "", // squadInventory, storage, box:ID
      warehouses: {},
      equipPanel: null,
      selectEquip: null,
      cellSize: 50,
      filters: {category: "all"},

      /** используется что бы подсвечивать допустимые ячейки в инвентаре, примеры использования по типам **/
      // type: 'equip', type_slot: [1,2,3], mining: [false, true]
      // type: 'weapon', standard_size: {small:[false, true], medium:[false, true], big:[false, true]}
      // type: 'ammo', type: ['laser', 'firearms', 'missile'], standard_size: [1,2,3]
      // type: 'body'
      findFilter: null,

      inBase: 0,
      unit: null,
      squadName: null,
      stateMS: null,
      baseSquads: null,

      stateSkill: {}, /** влияние скилов игрок на основные характеристики машинки **/
      fine: {}, /** шарактериситики на которые наложен штраф из за несоотвествия скила и шмота **/
      stateEquip: {},
      stateBodyBonus: {},
    },
    /** если у игрока открыт диалог то автоматически откроется окно с активной странице **/
    OpenDialog: {
      page: null,
      mission: null,
      visited_pages: null,
    },
    Missions: {
      missions: null,
      currentMissionUUID: null,
      currentAction: null,
      helper: null, /** обьект который позволяет видеть на мини карте или даже в игре подсказки по мисии **/
      points: null,
    },
    WorldMap: {
      userMapID: null,
      maps: null,
      previewPath: null,
      mapInfo: {}, /** подробная информация о каждой карте [id] {bases: , etc...}**/
    },
    UsersStat: {
      users: {},
    },
    Interface: {
      resolution: window.screen.availWidth + ':' + window.screen.availHeight,
      state: {},
      allowIDs: {},
      openQueue: [],
    },
    /** когда игрок находится на базе то вот работает этот сервис, так сложилось что у него такое название **/
    Lobby: {
      base: {
        state: null,
        resources: null,
        fraction: null, // т.к. база может быть не центральная(заводы, установки) то фракции там может не быть
        exit: false,
      },
      recycler: {
        recycle_slots: null,
        preview_recycle_slots: null,
        user_recycle_skill: null,
      },
      prefabricated_menu: {
        details: null,
        detail_need_items: null,
        detail_max_counts: null,
        detail_bps: null,
        select_detail: {detail: null, needItems: null, maxCount: null, count: null},
      },
      workbench: {
        blue_works: null,
        select_bp: {
          // bp - выбран блюпринт из инвентаря для того что бы создать, work - работа что бы посмотреть/отменить
          type_select: null,
          blue_print: null,
          bp_item: null,
          preview_recycle_slots: null,
          count: null,
          mineral_tax: null,
          time_tax: null,
          time: null,
          storage_slot: null,
          max_count: null,
          user_work_skill_detail_percent: null,
          blue_work: null,
          start_time: null,
          to_time: null,
        },
      },
    },
    BuildMenu: {
      blueprints: null,
      needItems: {},
      overBP: null,
    },
    NeedOpenComponents: {
      /** в общем т.к. тут один поток данных, а в моем интерфейсы мелкие компоненты должны уметь открыть
       более высокий уровень (модальники), то вот эта штука заставляет открывать компоненты
       тут хранятся обьекты с полями id: component:, component определяет тип окна **/
    },
    MapEditor: {
      maps: null,
      typeCoordinates: null,
    },
    ServerState: {
      count_bots: 0,
      count_players: 0,
      count_calc_move: 0,
      count_bullets: 0,
      count_objects: 0,
      count_transports: 0,
      count_reservoirs: 0,
      count_boxes: 0,
      count_signals: 0,
      ai_move: 0,
      meteorite_wait_end: 0,
      maps_ticks: null,
      players: null,
      maps: null,
      maps_dynamic_objects: null,
      maps_reservoirs: null,
      maps_geo_zones: null,
      maps_boxes: null,
      maps_bullets: null,
      short_info_map: null,
      maps_units: null,
      maps_evacuations: null,
      maps_signals: null,
    },
    HandBook: {} // описания и названия предмедов на разных языках
  }
};

export {getDefaultState}
