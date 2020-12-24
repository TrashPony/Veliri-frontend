import urls from '../const'
import createChatPlugin from './wsServices/chat';
import createGlobalPlugin from './wsServices/global';
import createLobbyPlugin from './wsServices/lobby';
import createInventoryPlugin from './wsServices/inventory';
import createMarketPlugin from './wsServices/market';
import createMapEditorPlugin from "./wsServices/map_editor";

import store from './store'
import Vue from 'vue'

const mutations = {
  resetState(state) {

  },
  reconnectWS(state, payload) {

    if (state.connections[payload.service].connect && !payload.force) {
      return
    }

    if (state.connections[payload.service].reconnect) return;

    state.connections[payload.service] = {
      socket: null,
      connect: false,
      error: false,
      reconnect: true,
    };

    try {
      state.connections[payload.service].close();
    } catch (e) {
    }

    if (payload.service === 'chat') {
      const chatWS = new WebSocket(urls.socketChatURL);
      let chat = createChatPlugin(chatWS);
      chat(store);
    }

    if (payload.service === 'global') {
      const globalWS = new WebSocket(urls.socketGlobalURL);
      let global = createGlobalPlugin(globalWS);
      global(store);
    }

    if (payload.service === 'lobby') {
      const lobbyWS = new WebSocket(urls.socketLobbyURL);
      let lobby = createLobbyPlugin(lobbyWS);
      lobby(store);
    }

    if (payload.service === 'inventory') {
      const inventoryWS = new WebSocket(urls.socketInventoryURL);
      let inventory = createInventoryPlugin(inventoryWS);
      inventory(store);
    }

    if (payload.service === 'market') {
      const marketWS = new WebSocket(urls.socketMarketURL);
      let market = createMarketPlugin(marketWS);
      market(store);
    }

    if (payload.service === 'map_editor') {
      const marketWS = new WebSocket(urls.socketMapEditor);
      let market = createMapEditorPlugin(marketWS);
      market(store);
    }
  },
  setWSConnectState(state, payload) {
    Vue.set(state.connections[payload.service], 'connect', payload.connect);
    Vue.set(state.connections[payload.service], 'reconnect', payload.reconnect);
    state.connections[payload.service].error = payload.error;
    state.connections[payload.service].socket = payload.ws;
  },
  addNotification(state, payload) {
    let app = this;

    if (!state.Notifications.hasOwnProperty(payload.id)) {
      if (payload.removeSec) {

        payload.newHtml = payload.html.replace(/time_place/gi, payload.removeSec);
        Vue.set(state.Notifications, payload.id, {html: payload.newHtml, time: payload.removeSec});

        let time = setInterval(function () {
          if (state.Notifications.hasOwnProperty(payload.id) && state.Notifications[payload.id].time > 0) {

            let newTime = state.Notifications[payload.id].time - 1;
            payload.newHtml = payload.html.replace(/time_place/gi, newTime);
            Vue.set(state.Notifications, payload.id, {html: payload.newHtml, time: newTime, input: payload.input});
          } else {
            app.commit({
              type: 'removeNotification',
              id: payload.id,
            });
            clearInterval(time)
          }

        }, 1000)
      } else {
        Vue.set(state.Notifications, payload.id, {html: payload.html});
      }

      if (payload.input) {
        Vue.set(state.Notifications[payload.id], 'input', payload.input);
      }
    }
  },
  removeNotification(state, payload) {
    Vue.delete(state.Notifications, payload.id);
  },
  /** WINDOWS MANAGER **/
  setWindowState(state, payload) {

    if (!state.Interface.state) {
      state.Interface.state = {}
    }

    if (!state.Interface.state[state.Interface.resolution]) {
      state.Interface.state[state.Interface.resolution] = {};
    }

    state.Interface.state[state.Interface.resolution][payload.id] = payload.state;

    if (payload.state.open) {
      this.commit({
        type: 'setWindowZIndex',
        id: payload.id,
      });
    } else {
      if (!state.Interface.allowIDs.hasOwnProperty(payload.id)) {
        delete state.Interface.state[state.Interface.resolution][payload.id]
      }
    }
  },
  setWindowZIndex(state, payload) {
    let windowIndex = state.Interface.openQueue.indexOf(payload.id);
    if (windowIndex > -1) {
      state.Interface.openQueue.splice(windowIndex, 1);
    }

    /** это немного не повьюшному но вот как то так, это позволяет выводить открываемые/выделяемые окна на передний план **/
    if (state.Interface.state && state.Interface.state[state.Interface.resolution]) {
      for (let id in state.Interface.state[state.Interface.resolution]) {
        if (state.Interface.state[state.Interface.resolution].hasOwnProperty(id)) {
          let modal = document.getElementById(id);
          if (modal) {
            let z = state.Interface.openQueue.indexOf(id);
            if (z < 1) {
              z = 1;
            }
            modal.style.zIndex = z;
          }
        }
      }
    }

    state.Interface.openQueue.push(payload.id)
    if (state.Interface.openQueue.length > 15) {
      state.Interface.openQueue.shift();
    }

    let modal = document.getElementById(payload.id);
    if (modal) modal.style.zIndex = state.Interface.openQueue.indexOf(payload.id);
  },
  toggleWindow(state, payload) {

    if (state.NeedOpenComponents.hasOwnProperty(payload.id)) {
      payload.open = !state.NeedOpenComponents[payload.id].open
    } else {
      payload.open = true;
    }

    if (payload.forceOpen) {
      payload.open = true;
    }

    if (payload.forceClose) {
      payload.open = false;
    }

    let window = {
      id: payload.id,
      component: payload.component,
      open: payload.open,
      meta: payload.meta,
    };

    if (payload.open) {
      this.commit({
        type: 'setWindowZIndex',
        id: payload.id,
      });
    }

    Vue.set(state.NeedOpenComponents, payload.id, window);

    if (!payload.open && !state.Interface.allowIDs.hasOwnProperty(payload.id)) {
      Vue.delete(state.NeedOpenComponents, payload.id)
    }
  },
  removeAllWindowsByComponentName(state, payload) {
    for (let i in state.NeedOpenComponents) {
      if (state.NeedOpenComponents.hasOwnProperty(i) && state.NeedOpenComponents[i].component === payload.component) {
        this.commit({
          type: 'toggleWindow',
          id: state.NeedOpenComponents[i].id,
          component: state.NeedOpenComponents[i].component,
          forceClose: true,
        });
      }
    }
  },
  setInterfaceState(state, payload) {

    Vue.set(state.Interface, 'state', payload.user_interface);
    Vue.set(state.Interface, 'allowIDs', payload.allow_window_save);

    if (payload.user_interface && payload.user_interface[state.Interface.resolution]) {
      for (let id in payload.user_interface[state.Interface.resolution]) {

        if (!payload.user_interface[state.Interface.resolution].hasOwnProperty(id)) continue;

        Vue.set(state.NeedOpenComponents, id, {
          id: id,
          open: payload.user_interface[state.Interface.resolution][id].open
        });
      }
    }
  },
  setEndLoadServices(state, payload) {
    Vue.set(state.EndLoad, payload.service, true);
  },

  setVisibleLoader(state, payload) {
    Vue.set(state.EndLoad, 'visible', payload.visible);
    Vue.set(state.EndLoad, 'text', payload.text);
  },

  updateReservoir(state, payload) {
    if (state.NeedOpenComponents.hasOwnProperty(payload.id) && state.NeedOpenComponents[payload.id].meta) {
      Vue.set(state.NeedOpenComponents[payload.id].meta, 'count', payload.count);
    }
  },

  /** CHAT **/
  setTraining(state, payload) {
    Vue.set(state.training, 'point', payload.training);
  },
  setTrainingIntoHangar(state, payload) {
    Vue.set(state.training, 'needIntoHangar', payload.need);
  },
  setChatState(state, payload) {

    if (payload.groups[payload.currentChatID]) {
      state.Chat.currentChatID = payload.currentChatID;
    } else {
      state.Chat.currentChatID = 0
    }

    state.Chat.groups = payload.groups;
    state.Chat.notifys = payload.notifys;
    if (payload.user) state.User = payload.user;
  },
  setGameUserSate(state, payload) {
    state.GameUser = payload.gameUser;
    state.UserPlayers = payload.userPlayers;
  },
  setWaitGame(state, payload) {
    Vue.set(state.WaitGame, 'usersWait', payload.count);
    Vue.set(state.WaitGame, 'MyWait', payload.wait_player);
    Vue.set(state, 'Battle', payload.battle);
  },
  setCurrentChatIDGroup(state, payload) {
    if (!state.Chat.groups[payload.id]) {
      return
    }

    state.Chat.currentChatID = payload.id;
    Vue.set(state.Chat.groups[payload.id], 'newMessage', false);
  },
  newChatMessage(state, payload) {
    if (!state.Chat.groups[payload.id]) {
      return
    }

    if (!state.Chat.groups[payload.id].history) {
      state.Chat.groups[payload.id].history = [];
    }

    state.Chat.groups[payload.id].history.push(payload.msg);
    Vue.set(state.Chat.groups[payload.id], 'newMessage', true);
  },
  clearChatGroupHistory(state, payload) {
    if (state.Chat.groups[payload.id]) state.Chat.groups[payload.id].history = [];
  },
  setNewMessageChatStateGroup(state, payload) {
    Vue.set(state.Chat.groups[payload.id], 'newMessage', payload.notify);
  },
  setAllGroupsInChat(state, payload) {
    Vue.set(state.Chat, 'allGroups', payload.groups);
  },
  updateChatUsers(state, payload) {
    Vue.set(state.Chat.users, payload.group.id, payload.users);
  },
  addNotify(state, payload) {
    Vue.set(state.Chat.notifys, payload.notify.uuid, payload.notify);
  },
  removeNotify(state, payload) {
    Vue.delete(state.Chat.notifys, payload.uuid);
  },
  setFriends(state, payload) {
    Vue.set(state.Chat, 'friends', {users: payload.friends, statuses: payload.statuses});
  },
  setGroup(state, payload) {

    if (payload.members !== "") {
      payload.members = JSON.parse(payload.members)
    }

    Vue.set(state.Chat.group, 'members', payload.members);
    Vue.set(state.Chat.group, 'leaderID', payload.leader);
    Vue.set(state.Chat.group, 'uuid', payload.uuid);
  },
  setSessionGroup(state, payload) {

    if (payload.members !== "") {
      payload.members = JSON.parse(payload.members)
    }

    Vue.set(state.Chat.sessionGroup, 'members', payload.members);
    Vue.set(state.Chat.sessionGroup, 'leaderID', payload.leader);
    Vue.set(state.Chat.sessionGroup, 'uuid', payload.uuid);
  },
  setStateGroup(state, payload) {
    Vue.set(state.Chat.group, 'state', payload.state);
  },
  setSessionStateGroup(state, payload) {
    Vue.set(state.Chat.sessionGroup, 'state', payload.state);
  },
  addAvatar(state, payload) {
    Vue.set(state.Chat.avatars, payload.id, payload.avatar);
  },
  setCorporationState(state, payload) {
    Vue.set(state.Chat, 'corporation', {
      info: payload.info,
      members: payload.members,
      roles: payload.roles,
      inviteRequest: payload.inviteRequest
    });
  },
  setAllCorporations(state, payload) {
    Vue.set(state.Chat, 'corporations', payload.corporations);
  },
  setMySkills(state, payload) {
    Vue.set(state.Chat, 'mySkills', payload.skills);
  },
  setViolators(state, payload) {
    Vue.set(state.Chat, 'violators', payload.violators);
    Vue.set(state.Chat, 'distressSignals', payload.distressSignals);
  },
  addKillsNotify(state, payload) {
    state.KillsNotify.push(payload.notify)
  },
  addPointsNotify(state, payload) {
    state.PointsNotify.push(payload.notify)
  },
  /** INVENTORY **/
  setInventoryState(state, payload) {

    if (state.Inventory.warehouse === '') {
      Vue.set(state.Inventory, 'warehouse', payload.warehouse);
    }

    let equipPanel = null
    if (payload.equipPanel !== '') {
      equipPanel = JSON.parse(payload.equipPanel)
    }

    Vue.set(state.Inventory, 'equipPanel', equipPanel);
    Vue.set(state.Inventory, 'inBase', payload.inBase);
    Vue.set(state.Inventory, 'unit', payload.unit);
    Vue.set(state.Inventory, 'squadName', payload.squadName);
    Vue.set(state.Inventory, 'stateMS', payload.stateMS);
    Vue.set(state.Inventory, 'baseSquads', payload.baseSquads);
    Vue.set(state.Inventory, 'stateSkill', payload.stateSkill);
    Vue.set(state.Inventory, 'stateEquip', payload.stateEquip);
    Vue.set(state.Inventory, 'stateBodyBonus', payload.stateBodyBonus);
    Vue.set(state.Inventory, 'fine', payload.fine);
  },
  updateWarehouse(state, payload) {

    if (!state.Inventory.warehouses) {
      Vue.set(state.Inventory, 'warehouses', {});
    }

    for (let i in payload.inventory) {
      if (payload.inventory.hasOwnProperty(i)) payload.inventory[i] = JSON.parse(payload.inventory[i])
    }

    if (!state.Inventory.warehouses.hasOwnProperty(payload.warehouse)) {
      let warehouse = {
        capacity: payload.capacity,
        size: payload.size,
        inventory: payload.inventory,
        title: payload.title,
      };
      Vue.set(state.Inventory.warehouses, payload.warehouse, warehouse);
    } else {
      Vue.set(state.Inventory.warehouses[payload.warehouse], 'capacity', payload.capacity);
      Vue.set(state.Inventory.warehouses[payload.warehouse], 'size', payload.size);
      Vue.set(state.Inventory.warehouses[payload.warehouse], 'inventory', payload.inventory);
      Vue.set(state.Inventory.warehouses[payload.warehouse], 'title', payload.title);
    }

    if (payload.meta) {
      Vue.set(state.Inventory.warehouses[payload.warehouse], 'meta', payload.meta);
    }
  },
  removeWarehouse(state, payload) {
    Vue.delete(state.Inventory.warehouses, payload.warehouse);
  },
  setCurrentWarehouse(state, payload) {
    Vue.set(state.Inventory, 'warehouse', payload.warehouse);
  },
  setInventoryFilters(state, payload) {
    Vue.set(state.Inventory, 'filters', payload.filters);
  },
  setFindFilter(state, payload) {
    Vue.set(state.Inventory, 'findFilter', payload.filters);
  },

  /** Market **/
  setMarketState(state, payload) {
    Vue.set(state.Market.assortment, 'ammo', payload.assortment.ammo);
    Vue.set(state.Market.assortment, 'blueprints', payload.assortment.blueprints);
    Vue.set(state.Market.assortment, 'body', payload.assortment.body);
    Vue.set(state.Market.assortment, 'boxes', payload.assortment.boxes);
    Vue.set(state.Market.assortment, 'detail', payload.assortment.detail);
    Vue.set(state.Market.assortment, 'equip', payload.assortment.equip);
    Vue.set(state.Market.assortment, 'recycle', payload.assortment.recycle);
    Vue.set(state.Market.assortment, 'resource', payload.assortment.resource);
    Vue.set(state.Market.assortment, 'trash', payload.assortment.trash);
    Vue.set(state.Market.assortment, 'weapon', payload.assortment.weapon);

    Vue.set(state.Market, 'orders', payload.orders);
    Vue.set(state.Market, 'my_orders', payload.my_orders);
    Vue.set(state.Market, 'my_credits', payload.my_credits);
  },

  setCountItems(state, payload) {
    Vue.set(state.Market.count_items, payload.order_id, payload.count);
  },

  setMarketFilter(state, payload) {
    Vue.set(state.Market.filters, 'selectType', payload.main);
    Vue.set(state.Market.filters, 'item', payload.item);
    if (payload.main !== '') {
      Vue.set(state.Market.filters[payload.main], 'type', payload.filterType);
      Vue.set(state.Market.filters[payload.main], 'size', payload.size);
      Vue.set(state.Market.filters[payload.main], 'id', payload.id);
    }
  },

  /** WorldMap **/
  setWorldMapState(state, payload) {
    Vue.set(state.WorldMap, 'maps', payload.maps);
    Vue.set(state.WorldMap, 'userMapID', payload.id);
  },
  setPreviewPath(state, payload) {
    Vue.set(state.WorldMap, 'previewPath', payload.previewPath);
  },
  setMapInfo(state, payload) {
    Vue.set(state.WorldMap.mapInfo, payload.mapID, {bases: payload.bases});
  },
  /** UsersStat **/
  addUserState(state, payload) {
    if (payload.user.user_id) {
      Vue.set(state.UsersStat.users, payload.user.user_id, payload.user);
    } else {
      Vue.set(state.UsersStat.users, payload.user.id, payload.user);
    }
  },

  /** Dialog **/
  setOpenDialog(state, payload) {
    Vue.set(state.OpenDialog, 'page', payload.page);
    Vue.set(state.OpenDialog, 'mission', payload.mission);
    Vue.set(state.OpenDialog, 'visited_pages', payload.visited_pages);
  },

  /** Missions **/
  setMission(state, payload) {

    if (payload.missions && payload.missions.hasOwnProperty(payload.mission_uuid)) {
      for (let i in payload.missions[payload.mission_uuid].actions) {
        for (let number in payload.need_items_slots) {
          if (Number(payload.missions[payload.mission_uuid].actions[i].number) === Number(number)) {
            payload.missions[payload.mission_uuid].actions[i].need_items_slots = payload.need_items_slots[number];
          }
        }
      }
    }

    Vue.set(state.Missions, 'missions', payload.missions);
    Vue.set(state.Missions, 'currentMissionUUID', payload.mission_uuid);
  },
  setCurrentAction(state, payload) {
    Vue.set(state.Missions, 'currentAction', payload.currentAction);
  },
  setHelper(state, payload) {
    Vue.set(state.Missions, 'helper', payload.helper);
  },
  setPoints(state, payload) {
    Vue.set(state.Missions, 'points', payload.points);
  },
  /** Lobby **/
  setBaseFullStatus(state, payload) {
    if (payload.state !== "") Vue.set(state.Lobby.base, 'state', JSON.parse(payload.state));
    if (payload.resources !== "") Vue.set(state.Lobby.base, 'resources', JSON.parse(payload.resources));
    Vue.set(state.Lobby.base, 'fraction', payload.fraction);
  },
  setBaseStatus(state, payload) {
    Vue.set(state.Lobby.base, 'state', payload.state);
  },
  setExitBase(state, payload) {
    Vue.set(state.Lobby.base, 'exit', payload.exit);
  },

  /** Workbench **/
  setBlueWork(state, payload) {
    Vue.set(state.Lobby.workbench, 'blue_works', payload.works);
  },
  setSelectBP(state, payload) {
    Vue.set(state.Lobby.workbench.select_bp, 'type_select', payload.type_select);
    Vue.set(state.Lobby.workbench.select_bp, 'blue_print', payload.blue_print);
    Vue.set(state.Lobby.workbench.select_bp, 'bp_item', payload.bp_item);
    Vue.set(state.Lobby.workbench.select_bp, 'preview_recycle_slots', payload.preview_recycle_slots);
    Vue.set(state.Lobby.workbench.select_bp, 'count', payload.count);
    Vue.set(state.Lobby.workbench.select_bp, 'mineral_tax', payload.mineral_tax);
    Vue.set(state.Lobby.workbench.select_bp, 'time_tax', payload.time_tax);
    Vue.set(state.Lobby.workbench.select_bp, 'time', payload.time);
    Vue.set(state.Lobby.workbench.select_bp, 'max_count', payload.max_count);
    Vue.set(state.Lobby.workbench.select_bp, 'storage_slot', payload.storage_slot);
    Vue.set(state.Lobby.workbench.select_bp, 'blue_work', payload.blue_work);
    Vue.set(state.Lobby.workbench.select_bp, 'start_time', payload.start_time);
    Vue.set(state.Lobby.workbench.select_bp, 'to_time', payload.to_time);
  },
  setCountSelectBP(state, payload) {
    Vue.set(state.Lobby.workbench.select_bp, 'count', payload.count);
  },

  /** Recycler **/
  setRecycler(state, payload) {
    Vue.set(state.Lobby.recycler, 'recycle_slots', payload.recycle_slots);
    Vue.set(state.Lobby.recycler, 'preview_recycle_slots', payload.preview_recycle_slots);
    Vue.set(state.Lobby.recycler, 'user_recycle_skill', payload.user_recycle_skill);
  },

  /** PrefabricatedMenu **/
  setPrefabricatedMenu(state, payload) {
    Vue.set(state.Lobby.prefabricated_menu, 'details', payload.details);
    Vue.set(state.Lobby.prefabricated_menu, 'detail_need_items', payload.detail_need_items);
    Vue.set(state.Lobby.prefabricated_menu, 'detail_max_counts', payload.detail_max_counts);
    Vue.set(state.Lobby.prefabricated_menu, 'detail_bps', payload.detail_bps);
  },
  setSelectDetail(state, payload) {
    Vue.set(state.Lobby.prefabricated_menu.select_detail, 'detail', payload.detail);
    Vue.set(state.Lobby.prefabricated_menu.select_detail, 'maxCount', payload.maxCount);
    Vue.set(state.Lobby.prefabricated_menu.select_detail, 'count', payload.count);
  },
  setNeedItemsForSelectDetail(state, payload) {
    Vue.set(state.Lobby.prefabricated_menu.select_detail, 'needItems', payload.needItems);
  },
  setCountForSelectDetail(state, payload) {
    Vue.set(state.Lobby.prefabricated_menu.select_detail, 'count', payload.count);
  },

  /** Game **/
  setThoriumSlots(state, payload) {

    for (let i in payload.thorium_slots) {
      if (payload.thorium_slots.hasOwnProperty(i)) payload.thorium_slots[i] = JSON.parse(payload.thorium_slots[i])
    }

    Vue.set(state.Game, 'thorium_slots', payload.thorium_slots);
  },
  setUser(state, payload) {
    Vue.set(state.Game, 'user', payload.user);
  },
  setUserUnit(state, payload) {
    Vue.set(state.Inventory, 'unit', payload.unit);
  },
  setUnitSpeed(state, payload) {
    Vue.set(state.Game, 'current_speed', payload.speed);
  },
  setUnitHP(state, payload) {
    Vue.set(state.Inventory.unit, 'hp', payload.hp);
  },
  setUnitEnergy(state, payload) {
    Vue.set(state.Inventory.unit, 'power', payload.energy);
  },
  setStateUnit(state, payload) {
    Vue.set(state.Inventory, 'stateMS', payload.stateMS);
  },
  setSector(state, payload) {
    Vue.set(state.Game.sector, 'base', payload.base);
    Vue.set(state.Game.sector, 'capture_time', payload.capture_time);
  },
  setEquipPanel(state, payload) {

    let equipPanel = null
    if (payload.equipPanel !== '') {
      equipPanel = JSON.parse(payload.equipPanel)
    }

    Vue.set(state.Inventory, 'equipPanel', equipPanel);
  },
  setSelectEquip(state, payload) {
    Vue.set(state.Inventory, 'selectEquip', payload.selectEquip);
  },
  setAnomalies(state, payload) {
    Vue.set(state.Game, 'anomalies', payload.anomalies);
  },
  addOpenObjects(state, payload) {
    Vue.set(state.Game.open_objects, payload.id, {
      dynamic_object: payload.dynamic_object,
      other_user: payload.other_user,
      box: payload.box,
      inventory: payload.inventory,
      size: payload.size,
    });
  },
  setPlayerRole(state, payload) {
    Vue.set(state.Game, 'role', payload.role);
  },
  /** Build Menu **/
  setBuildMenuBps(state, payload) {
    Vue.set(state.BuildMenu, 'blueprints', payload.blueprints);
  },
  setNeedItemsBP(state, payload) {
    Vue.set(state.BuildMenu.needItems, payload.id_blueprint, payload.structure);
  },
  setOverBP(state, payload) {
    Vue.set(state.BuildMenu, 'overBP', payload.id);
  },

  /** ammo reload **/
  setAvailableAmmo(state, payload) {
    Vue.set(state.Game, 'availableAmmo', payload.availableAmmo)
  },

  /** Map editor **/
  setMapsInMapEditor(state, payload) {
    Vue.set(state.MapEditor, 'maps', payload.maps)
  },

  setTypeCoordinates(state, payload) {
    Vue.set(state.MapEditor, 'typeCoordinates', payload.typeCoordinates)
  },

  /** Volume, SFXVolume **/
  setVolume(state, payload) {
    Vue.set(state.Settings, 'volume', payload.volume)
  },
  setSFXVolume(state, payload) {
    Vue.set(state.Settings, 'SFXVolume', payload.SFXVolume)
  },
  setLanguage(state, payload) {
    Vue.set(state.Settings, 'Language', payload.language)
  },

  /** ServerState **/
  setServerState(state, payload) {
    //Vue.set(state, 'ServerState', payload.data);

    state.ServerState = payload.data
    // Vue.set(state.ServerState, 'count_bots', payload.data.count_bots);
    // Vue.set(state.ServerState, 'count_players', payload.data.count_players);
    // Vue.set(state.ServerState, 'count_calc_move', payload.data.count_calc_move);
    // Vue.set(state.ServerState, 'count_bullets', payload.data.count_bullets);
    // Vue.set(state.ServerState, 'count_objects', payload.data.count_objects);
    // Vue.set(state.ServerState, 'count_transports', payload.data.count_transports);
    // Vue.set(state.ServerState, 'count_reservoirs', payload.data.count_reservoirs);
    // Vue.set(state.ServerState, 'count_boxes', payload.data.count_boxes);
    // Vue.set(state.ServerState, 'count_signals', payload.data.count_signals);
    //
    // Vue.set(state.ServerState, 'ai_move', payload.data.ai_move);
    // Vue.set(state.ServerState, 'meteorite_wait_end', payload.data.meteorite_wait_end);
    // Vue.set(state.ServerState, 'maps_ticks', payload.data.maps_ticks);
    // Vue.set(state.ServerState, 'players', payload.data.players);
    // Vue.set(state.ServerState, 'maps', payload.data.maps);
    // Vue.set(state.ServerState, 'short_info_map', payload.data.short_info_map);
    // Vue.set(state.ServerState, 'maps_dynamic_objects', payload.data.maps_dynamic_objects);
    // Vue.set(state.ServerState, 'maps_reservoirs', payload.data.maps_reservoirs);
    // Vue.set(state.ServerState, 'maps_geo_zones', payload.data.maps_geo_zones);
    // Vue.set(state.ServerState, 'maps_boxes', payload.data.maps_boxes);
    // Vue.set(state.ServerState, 'maps_bullets', payload.data.maps_bullets);
    // Vue.set(state.ServerState, 'maps_units', payload.data.maps_units);
    // Vue.set(state.ServerState, 'maps_evacuations', payload.data.maps_evacuations);
    // Vue.set(state.ServerState, 'maps_signals', payload.data.maps_signals);
  },
  setHandBook(state, payload) {
    Vue.set(state, 'HandBook', payload.description_items)
  }
};

export default mutations;
