import router from "../../router/router";
import {unitInfo} from "../../game/unit/mouse_body_over";
import {gameStore} from "../../game/store";
import {showMessage} from "../../game/text/message";
import {logMsg} from "./log";
import {addError} from "./inventory";
import Vue from "vue";

export default function createChatPlugin(WS) {
  return store => {

    WS.onopen = function () {
      console.log("Connection chat opened..." + this.readyState);

      WS.send(JSON.stringify({
        event: "OpenChat",
      }));

      store.commit({
        type: 'setWSConnectState',
        service: 'chat',
        connect: true,
        error: false,
        reconnect: false,
        ws: WS,
      });
    };

    WS.onclose = function (i) {
      store.commit({
        type: 'setWSConnectState',
        service: 'chat',
        connect: false,
        error: true,
        ws: WS,
      });

      if (location.href.includes('lobby') || location.href.includes('global') || location.href.includes('gate')) {
        router.push('/login');
      }

      console.log("chat закрыт" + i);
    };

    WS.onmessage = function (msg) {
      ChatReader(JSON.parse(msg.data), store, WS)
    };
  };
}

function ChatReader(data, store, ws) {

  if (data.event) logMsg(data.event, data);
  if (data.e) logMsg(data.e, data);

  if (data.event === 'OpenChat') {
    let currentChatID = store.getters.getChatState.currentChatID;

    if (data.group && data.force_select_group) {
      if (data.group.local) {
        currentChatID = data.group.id
      } else {
        store.getters.getWSByService('chat').socket.send(JSON.stringify({
          event: "ChangeGroup",
          group_id: Number(data.group.id),
        }));
      }
    }

    store.commit({
      type: 'setChatState',
      groups: data.groups,
      notifys: data.notifys,
      user: data.user,
      currentChatID: currentChatID,
    });

    if (data.group_id_notify !== 0) {
      store.commit({
        type: 'setNewMessageChatStateGroup',
        id: data.group_id_notify,
        notify: true,
      });
    }

    parseGroupHistory(data.group, data.group_history, store)
  }

  if (data.event === "ToGate") {
    if (location.href.includes('gate')) {
      router.push('/gate');
    }
  }

  if (data.event === "newNotify") {
    notify(data, store, ws)
  }

  if (data.event === "DeleteNotify") {
    store.commit({
      type: 'removeNotify',
      uuid: data.uuid,
    });
  }

  if (data.event === 'GetAllGroups') {
    store.commit({
      type: 'setAllGroupsInChat',
      groups: data.groups,
    });
  }

  if (data.event === "setWindowsState") {

    store.commit({
      type: 'setHandBook',
      description_items: data.description_items,
    });

    store.commit({
      type: 'setInterfaceState',
      user_interface: JSON.parse(data.user_interface),
      allow_window_save: data.allow_windows,
    });

    store.commit({
      type: 'setEndLoadServices',
      service: 'chat',
    });
  }

  if (data.event === 'NewChatMessage') {

    if (data.group_id === 0) showMessage(data.message);

    store.commit({
      type: 'newChatMessage',
      id: data.group_id,
      msg: data.message,
    });
  }

  if (data.event === "UpdateUsers" || data.event === 'ChangeGroup') {
    store.commit({
      type: 'updateChatUsers',
      group: data.group,
      users: data.users,
    });

    if (data.event === 'ChangeGroup') {
      store.commit({
        type: 'setCurrentChatIDGroup',
        id: data.group.id,
      });
      parseGroupHistory(data.group, data.group_history, store)
    }
  }

  // other reader
  if (data.event === "openMapMenu") {
    store.commit({
      type: 'setWorldMapState',
      maps: data.maps,
      id: data.id,
    });
  }

  if (data.event === "previewPath") {
    store.commit({
      type: 'setPreviewPath',
      previewPath: data.search_maps,
    });
  }

  if (data.event === 'OpenUserStat') {
    if (data.user) {
      store.commit({
        type: 'addUserState',
        user: data.user,
      });
    } else {
      store.commit({
        type: 'addUserState',
        user: data.player,
      });
    }
  }

  if (data.event === "dialog" || data.event === "openDepartmentOfEmployment") {

    if (data.dialog_action) {
      dialogAction(data.dialog_action, store);
    }

    store.commit({
      type: 'setOpenDialog',
      page: data.dialog_page,
      mission: data.mission,
      visited_pages: data.visited_pages,
    });
  }

  if (data.event === "GetMissions") {
    store.commit({
      type: 'setMission',
      missions: data.missions,
      mission_uuid: data.mission_uuid,
      need_items_slots: data.need_items_slots,
    });
  }

  if (data.event === "training") {
    store.commit({
      type: 'setTraining',
      training: data.count,
    });
  }

  if (data.event === "trainingGlobal") {
    TrainingGlobal(data.count, store, ws)
  }

  if (data.event === "FriendInvitation") {
    store.commit({
      type: 'addNotification',
      id: data.invitation.uuid,
      input: { // todo это не очень правильно но мне лень
        inputType: 'FriendInvite',
        meta: data.invitation,
      },
      removeSec: data.invitation.time_out,
      html: `
        <span class="importantly">${data.user_name}</span> хочет с вами дружить.
        <span class="importantly" style="width: 30px; display: inline-block; text-align: center">(time_place)</span>
      `,
    });
  }

  if (data.event === "RejectInvitation") {
    store.commit({
      type: 'removeNotification',
      id: data.uuid,
    });
  }

  if (data.event === "GetFriends") {
    store.commit({
      type: 'setFriends',
      friends: data.short_users,
      statuses: data.online_users,
    });
  }

  if (data.e === 'sgs') {
    store.commit({
      type: 'setSessionGroup',
      members: data.mb,
      leader: data.ld,
      uuid: data.uuid,
    });
  }

  if (data.e === 'gs') {
    store.commit({
      type: 'setGroup',
      members: data.mb,
      leader: data.ld,
      uuid: data.uuid,
    });
  }

  if (data.e === 'sms') {
    store.commit({
      type: 'setSessionStateGroup',
      state: data.ms,
    });
  }

  if (data.e === 'ms') {
    store.commit({
      type: 'setStateGroup',
      state: data.ms,
    });
  }

  if (data.event === 'GroupInvitation') {
    store.commit({
      type: 'addNotification',
      id: data.invitation.uuid,
      input: { // todo это не очень правильно но мне лень
        inputType: 'GroupInvite',
        meta: data.invitation,
      },
      removeSec: data.invitation.time_out,
      html: `
        <span class="importantly">${data.user_name}</span> приглашает в отряд.
        <span class="importantly" style="width: 30px; display: inline-block; text-align: center">(time_place)</span>
      `,
    });
  }

  if (data.event === "GetCorporation") {
    store.commit({
      type: 'setCorporationState',
      info: data.corporation,
      members: data.corporation_members,
      roles: data.corporation_roles,
      inviteRequest: data.invite_requests,
    });
  }

  if (data.event === "CorpInvitation") {
    store.commit({
      type: 'addNotification',
      id: data.invitation.uuid,
      input: { // todo это не очень правильно но мне лень
        inputType: 'CorpInvite',
        meta: data.invitation,
      },
      removeSec: data.invitation.time_out,
      html: `
        <span class="importantly">${data.user_name}</span> приглашает в кластер.
        <span class="importantly" style="width: 30px; display: inline-block; text-align: center">(time_place)</span>
      `,
    });
  }

  if (data.event === "GetCorporations") {
    store.commit({
      type: 'setAllCorporations',
      corporations: data.corporations,
    });
  }

  if (data.event === "GetMySkills") {
    store.commit({
      type: 'setMySkills',
      skills: data.skills,
    });
  }

  if (data.event === "GetViolators") {
    store.commit({
      type: 'setViolators',
      violators: data.violators,
      distressSignals: data.distress_signals,
    });

    for (let userID in data.violators) {
      for (let unitID in gameStore.units) {
        if (Number(userID) === Number(gameStore.units[unitID].owner_id)) {
          unitInfo(gameStore.units[unitID], gameStore.units[unitID].sprite, gameStore.units[unitID].sprite.unitBody)
        }
      }
    }
  }

  if (data.event === "getMapInfo") {
    store.commit({
      type: 'setMapInfo',
      mapID: data.id,
      bases: data.bases,
    });
  }

  if (data.event === "GetPlayers") {

    store.commit({
      type: 'setLanguage',
      language: data.game_user.language,
    });

    store.commit({
      type: 'setGameUserSate',
      gameUser: data.game_user,
      userPlayers: data.players,
    });
  }

  if (data.e === "wg") {
    // console.log(JSON.stringify(data))
    if (data.b && data.bp) data.b.players = data.bp;
    if (data.b && data.ls) data.b.loses = data.ls;
    if (data.b && data.tr) data.b.team_resources = data.tr;
    if (data.b && data.d) data.b.damage = data.d;
    if (data.b && data.k) data.b.kills = data.k;
    if (data.b && data.as) data.b.assist = data.as;
    if (data.b && data.p) data.b.points = data.p;
    if (data.b && data.h) data.b.heal = data.h;

    if (data.b && data.tp) {
      for (let i in data.b.teams) {
        if (data.b.teams.hasOwnProperty(i) && data.tp.hasOwnProperty(data.b.teams[i].uuid)) {
          data.b.teams[i].players = data.tp[data.b.teams[i].uuid].sort();
        }
      }
    }

    store.commit({
      type: 'setWaitGame',
      count: data.c,
      wait_player: data.wp,
      battle: data.b,
    });
  }

  if (data.event === "Error") {
    addError(data.error, store)
  }

  if (data.event === "ServerState") {
    store.commit({
      type: 'setServerState',
      data: data.msg,
    });
  }
}

function dialogAction(action, store) {
  if (action === "close" || action === "start_training" || action === "miss_training") {
    store.commit({
      type: 'setOpenDialog',
      page: null,
      mission: null,
      visited_pages: null,
    });
  }
  if (action === "start_training") {
    store.commit({
      type: 'setTraining',
      training: 1,
    });
  }
}

function TrainingGlobal(lvl, store, ws) {
  if (lvl === 10) {
    store.commit({
      type: 'toggleWindow',
      id: 'helpWrapper',
      meta: {name: 'Управление'},
      forceOpen: true,
    });
    globalProgressTraining(lvl, ws);
  }

  if (lvl === 11) {
    store.commit({
      type: 'toggleWindow',
      id: 'helpWrapper',
      meta: {name: 'Отслеживание выполнения'},
      forceOpen: true,
    });
    globalProgressTraining(lvl, ws);
  }

  if (lvl === 12) {
    store.commit({
      type: 'toggleWindow',
      id: 'helpWrapper',
      meta: {name: 'Панель снаряжения'},
      forceOpen: true,
    });
    globalProgressTraining(lvl, ws);
  }

  if (lvl === 13) {
    store.commit({
      type: 'toggleWindow',
      id: 'helpWrapper',
      meta: {name: 'Руда'},
      forceOpen: true,
    });
    globalProgressTraining(lvl, ws);
  }

  if (lvl === 14) {
    store.commit({
      type: 'toggleWindow',
      id: 'helpWrapper',
      meta: {name: 'Перерабатывающий завод'},
      forceOpen: true,
    });
    globalProgressTraining(lvl, ws);
  }

  if (lvl === 15) {
    store.commit({
      type: 'toggleWindow',
      id: 'helpWrapper',
      meta: {name: 'Чертежи'},
      forceOpen: true,
    });
    globalProgressTraining(lvl, ws);
  }

  if (lvl === 16) {
    store.commit({
      type: 'toggleWindow',
      id: 'helpWrapper',
      meta: {name: 'Завод полуфабрикатов'},
      forceOpen: true,
    });
    globalProgressTraining(lvl, ws);
  }

  if (lvl === 17) {
    store.commit({
      type: 'toggleWindow',
      id: 'helpWrapper',
      meta: {name: 'Аномалии'},
      forceOpen: true,
    });
    globalProgressTraining(lvl, ws);
  }

  if (lvl === 18) {
    store.commit({
      type: 'toggleWindow',
      id: 'helpWrapper',
      meta: {name: 'Строительство'},
      forceOpen: true,
    });
    globalProgressTraining(lvl, ws);
  }

  if (lvl === 19) {
    store.commit({
      type: 'toggleWindow',
      id: 'helpWrapper',
      meta: {name: 'Оружие'},
      forceOpen: true,
    });
    globalProgressTraining(lvl, ws);
  }
}

function globalProgressTraining(lvl, ws) {
  lvl++;
  ws.send(JSON.stringify({
    event: "training",
    count: lvl,
  }));
}

function notify(data, store, ws) {
  if (data.notify.event === "start_battle") {
    if (location.href.includes('lobby')) {
      router.push('/global');
    }
  }

  if (data.notify.event === "end_battle") {
    if (location.href.includes('global')) {
      router.push('/lobby');
    }
  }

  if (data.notify.event === "battle_kill_broadcast") {
    store.commit({
      type: 'addKillsNotify',
      notify: data.notify,
    });
    return;
  }

  if (data.notify.event === "game_point") {
    store.commit({
      type: 'addPointsNotify',
      notify: data.notify,
    });
    return;
  }

  if (data.notify.event === "open_dialog") {
    ws.send(JSON.stringify({
      event: "getCurrentDialog",
    }));
    return;
  }

  if (data.notify.event === "group_exit_queue") {
    addError('Группа неготова', store)
    return;
  }

  if (data.notify.modal_text) {
    if (!data.notify.text.includes('server_hidden')) {
      store.commit({
        type: 'toggleWindow',
        id: data.notify.uuid,
        component: 'modalBlock',
        meta: data.notify,
        forceOpen: true,
      });
    }
    return;
  }

  if (data.notify.update_inventory) {
    store.getters.getWSByService('inventory').socket.send(JSON.stringify({
      event: "openInventory"
    }));
    return;
  }

  if (data.notify.skill_up) {
    store.commit({
      type: 'addNotification',
      id: data.notify.uuid,
      removeSec: 5,
      html: data.notify.text,
    });
  }

  store.commit({
    type: 'addNotify',
    notify: data.notify,
  });
}


function parseGroupHistory(group, history, store) {
  if (group) {
    store.commit({
      type: 'clearChatGroupHistory',
      id: group.id,
    });

    if (history !== "") {
      for (let msg of JSON.parse(history)) {
        if (msg) {
          store.commit({
            type: 'newChatMessage',
            id: group.id,
            msg: msg,
          });
        }
      }
    }
  }
}
