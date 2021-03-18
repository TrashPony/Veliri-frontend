import router from "../../router/router";
import {logMsg} from "./log";
import {addError} from "./inventory";

export default function createLobbyPlugin(WS) {
  return store => {

    WS.onopen = function () {
      console.log("Connection lobby opened..." + this.readyState);
      store.commit({
        type: 'setWSConnectState',
        service: 'lobby',
        connect: true,
        error: false,
        reconnect: false,
        ws: WS,
      });
    };

    WS.onclose = function (i) {
      store.commit({
        type: 'setWSConnectState',
        service: 'lobby',
        connect: false,
        error: true,
        ws: WS,
      });
      console.log("lobby закрыт" + i);
    };

    WS.onmessage = function (msg) {
      lobbyReader(JSON.parse(msg.data), store, WS)
    };
  };
}

function lobbyReader(data, store, ws) {

  if (data.event) logMsg(data.event, data);
  if (data.e) logMsg(data.e, data);

  if (data.event === "BaseStatus") {

    store.commit({
      type: 'setBaseFullStatus',
      state: data.msg.base,
      resources: data.msg.inventory_slots,
      fraction: data.msg.fraction,
      stories: data.msg.stories
    });

    store.commit({
      type: 'setVisibleLoader',
      visible: false,
    });
  }

  if (data.event === "WorkbenchStorage") {

    store.commit({
      type: 'setBlueWork',
      works: data.msg.blue_works,
    });

    let state = store.getters.getWorkbenchState.select_bp;
    if (state.type_select === 'work' && state.blue_work) {

      if (data.msg.blue_works.hasOwnProperty(state.blue_work.id)) {
        ws.send(JSON.stringify({
          event: "SelectWork",
          id: state.blue_work.id,
          count: Number(state.count),
          start_time: state.start_time,
          to_time: state.to_time,
        }));
      } else {
        store.commit({
          type: 'setSelectBP',
          type_select: null,
          blue_print: null,
          blue_work: null,
        });
      }
    }
  }

  if (data.event === "SelectBP") {
    store.commit({
      type: 'setSelectBP',
      type_select: 'bp',
      blue_print: data.msg.blue_print,
      bp_item: data.msg.bp_item,
      preview_recycle_slots: data.msg.preview_recycle_slots,
      count: data.msg.count,
      mineral_tax: 100 + (data.msg.efficiency - data.msg.user_work_skill_detail_percent),
      time_tax: data.msg.user_work_skill_time_percent,
      time: data.msg.time,
      storage_slot: data.msg.storage_slot,
      max_count: data.msg.max_count,
      user_work_skill_detail_percent: data.msg.user_work_skill_detail_percent,
    });
  }

  if (data.event === "SelectWork") {
    store.commit({
      type: 'setSelectBP',
      type_select: 'work',
      blue_print: data.msg.blue_print,
      blue_work: data.msg.blue_work,
      bp_item: data.msg.bp_item,
      count: data.msg.count,
      preview_recycle_slots: data.msg.preview_recycle_slots,
      max_count: data.msg.max_count,
      to_time: data.msg.to_time,
      start_time: data.msg.start_time,
    });
  }

  if (data.event === "dialog") {
    store.commit({
      type: 'setOpenDialog',
      page: data.dialog_page,
    });
  }

  if (data.event === 'choiceFractionComplete') {
    ws.close();

    store.commit({
      type: 'setVisibleLoader',
      visible: true,
      text: 'Создаем искуственные проблемы...',
    });

    store.getters.getWSByService('chat').socket.send(JSON.stringify({
      event: "OpenChat",
    }));
    router.push('/lobby');
  }

  if (data.event === "choiceFraction") {
    router.push('/choice_fraction');
  }

  if (data.event === "Error") {

    if (data.error === 'body damage' || data.error === 'no body') {
      store.commit({
        type: 'setExitBase',
        exit: false,
      });
    }

    addError(data.error, store)
  }

  if (data.event === "updateRecycler") {
    store.commit({
      type: 'setRecycler',
      recycle_slots: data.msg.recycle_slots,
      preview_recycle_slots: data.msg.preview_recycle_slots,
      user_recycle_skill: data.msg.user_recycle_skill,
      lost_recycle_slots: data.msg.lost_recycle_slots,
      tax_recycle_slots: data.msg.tax_recycle_slots,
    });
  }

  if (data.event === "updatePrefabricatedMenu") {
    store.commit({
      type: 'setPrefabricatedMenu',
      details: data.msg.inventory_slots,
      detail_need_items: data.msg.need_items,
      detail_max_counts: data.msg.max_counts,
      detail_bps: data.msg.blue_prints,
    });
  }

  if (data.event === "getPrefabricatedNeedItems") {
    store.commit({
      type: 'setNeedItemsForSelectDetail',
      needItems: data.msg.need_item,
    });
  }

  if (data.event === "baseNotWork") {
    store.commit({
      type: 'setBaseWorkStatus',
      typeBase: "not_work",
    });
  }

  if (data.event === "hostileBase") {
    store.commit({
      type: 'setBaseWorkStatus',
      typeBase: "hostile",
    });
  }


  if (data.event === "StartOutBase") {
    store.commit({
      type: 'setExitBase',
      exit: true,
    });
  }

  if (data.event === "OutBase") {
    store.commit({
      type: 'setExitBase',
      exit: false,
    });

    store.commit({
      type: 'setVisibleLoader',
      visible: true,
      text: 'Подключаемся к игре...'
    });

    router.push('/global')
  }

  if (data.event === "ToGate") {
    router.push('/gate')
  }

  if (data.event === "training") {
    store.commit({
      type: 'setTraining',
      training: data.count,
    });
  }

  if (data.event === "GetAssortmentFractionStore") {
    store.commit({
      type: 'setFractionStoreAssortment',
      assortment: data.msg.assortment,
    });

    store.commit({
      type: 'setFractionStoreUserPoints',
      user_fraction_points: data.msg.user_fraction_points,
    });
  }

  if (data.event === 'UpdateFractionPoints') {
    store.commit({
      type: 'setFractionStoreUserPoints',
      user_fraction_points: data.msg.user_fraction_points,
    });
  }

  // todo не для демы
  if (data.event === "GetDetails") {
    //FillDetailMarket(JSON.parse(jsonMessage).base, JSON.parse(jsonMessage).inventory_slots, JSON.parse(jsonMessage).storage)
  }
}
