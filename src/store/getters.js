const getters = {
  getEndLoad: function (state) {
    return state.EndLoad
  },
  getUser: function (state) {
    return state.User
  },
  getUsers: function (state) {
    return state.UsersStat
  },
  getUserTraining: function (state) {
    return state.training
  },
  getWSByService: state => service => {
    return state.connections[service]
  },
  getChatState: function (state) {
    return state.Chat
  },
  getInterfaceState: function (state) {
    if (!state.Interface.state) {
      return null
    }
    return state.Interface.state[state.Interface.resolution]
  },
  getNeedOpenComponents: function (state) {
    return state.NeedOpenComponents
  },
  getInventory: function (state) {
    return state.Inventory
  },
  getWorldMapState: function (state) {
    return state.WorldMap
  },
  getOpenDialog: function (state) {
    return state.OpenDialog
  },
  getMissions: function (state) {
    return state.Missions
  },
  getBaseStatus: function (state) {
    return state.Lobby.base
  },
  getWorkbenchState: function (state) {
    return state.Lobby.workbench
  },
  getRecyclerState: function (state) {
    return state.Lobby.recycler
  },
  getPrefabricatedMenuState: function (state) {
    return state.Lobby.prefabricated_menu
  },
  getThoriumSlots: function (state) {
    return state.Game.thorium_slots
  },
  getAnomalies: function (state) {
    return state.Game.anomalies
  },
  getUnit: function (state) {
    return state.Inventory.unit
  },
  getUnitSpeed: function (state) {
    return state.Game.current_speed
  },
  getUnitState: function (state) {
    return state.Inventory.stateMS
  },
  getGamePlayer: function (state) {
    return state.Game.user
  },
  getSectorState: function (state) {
    return state.Game.sector
  },
  getBuildMenu: function (state) {
    return state.BuildMenu
  },
  getNotifications: function (state) {
    return state.Notifications
  },
  getOpenObjects: function (state) {
    return state.Game.open_objects
  },
  getMarket: function (state) {
    return state.Market
  },
  getMarketFilter: function (state) {
    return state.Market.filters
  },
  getAvailableAmmo: function (state) {
    return state.Game.availableAmmo
  },
  GetColorDamage: state => percentHP => {
    if (percentHP >= 80) {
      return "#48FF28"
    } else if (percentHP < 80 && percentHP >= 75) {
      return "#fff326"
    } else if (percentHP < 75 && percentHP >= 50) {
      return "#fac227"
    } else if (percentHP < 50 && percentHP >= 25) {
      return "#fa7b31"
    } else if (percentHP < 25) {
      return "#ff2615"
    }
  },
  getMapEditorData: function (state) {
    return state.MapEditor
  },
  getGameUser: function (state) {
    return state.GameUser
  },
  getUserPlayers: function (state) {
    return state.UserPlayers
  },
  getWaitGame: function (state) {
    return state.WaitGame
  },
  getGameRole: function (state) {
    return state.Game.role
  },
  getBattleState: function (state) {
    return state.Battle
  },
  getKillsNotify: function (state) {
    return state.KillsNotify
  },
  getPointsNotify: function (state) {
    return state.PointsNotify
  },
  getGroupState: function (state) {
    return state.Chat.group
  },
  getGroupSessionState: function (state) {
    return state.Chat.sessionGroup
  },
  getSettings: function (state) {
    return state.Settings
  },
  getServerState: function (state) {
    return state.ServerState
  },
  getHandBook: function (state) {
    return state.HandBook
  },
  getTechnologyBodyConfig: function () {
    return {
      Replics: {
        bodies: [
          {
            ids: [9],
            category: "universal light",
            pos: {x: 2, y: 2},
            linesTo: [{x: 3, y: 2}, {x: 3, y: 1}],
          }, {
            ids: [8],
            category: "engineer",
            pos: {x: 4, y: 1},
            linesTo: [],
          }, {
            ids: [10],
            category: "light",
            pos: {x: 4, y: 2},
            linesTo: [{x: 5, y: 2}],
          }, {
            ids: [12],
            category: "medium",
            pos: {x: 6, y: 2},
            linesTo: [{x: 7, y: 3}],
          }, {
            ids: [11],
            category: "transport",
            pos: {x: 8, y: 3},
            linesTo: [],
          },
        ]
      },
      Explores: {
        bodies: [
          {
            ids: [14],
            category: "universal light",
            pos: {x: 2, y: 2},
            linesTo: [{x: 3, y: 2}, {x: 3, y: 1}],
          }, {
            ids: [13],
            category: "engineer",
            pos: {x: 4, y: 1},
            linesTo: [],
          }, {
            ids: [15],
            category: "light",
            pos: {x: 4, y: 2},
            linesTo: [{x: 5, y: 2}],
          }, {
            ids: [17],
            category: "medium",
            pos: {x: 6, y: 2},
            linesTo: [{x: 7, y: 3}],
          }, {
            ids: [16],
            category: "transport",
            pos: {x: 8, y: 3},
            linesTo: [],
          },
        ]
      },
      Reverses: {
        bodies: [
          {
            ids: [19],
            category: "universal light",
            pos: {x: 2, y: 2},
            linesTo: [{x: 3, y: 2}, {x: 3, y: 1}],
          }, {
            ids: [18],
            category: "engineer",
            pos: {x: 4, y: 1},
            linesTo: [],
          }, {
            ids: [20],
            category: "light",
            pos: {x: 4, y: 2},
            linesTo: [{x: 5, y: 2}],
          }, {
            ids: [21],
            category: "medium",
            pos: {x: 6, y: 2},
            linesTo: [{x: 7, y: 3}],
          }, {
            ids: [22],
            category: "transport",
            pos: {x: 8, y: 3},
            linesTo: [],
          },
        ]
      },
      APD: {
        bodies: [
          {
            ids: [23],
            category: "light",
            pos: {x: 2, y: 2},
            linesTo: [{x: 3, y: 2}],
          }, {
            ids: [24],
            category: "medium",
            pos: {x: 4, y: 2},
            linesTo: [{x: 5, y: 2}],
          }, {
            ids: [25],
            category: "heavy",
            pos: {x: 6, y: 2},
            linesTo: [],
          }
        ]
      }
    }
  },
};

export default getters;
