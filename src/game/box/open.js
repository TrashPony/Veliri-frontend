import store from "../../store/store";

function OpenBox(inventory, box_id, size, error, open) {

  store.getters.getWSByService('inventory').socket.send(JSON.stringify({
    event: "openInventory"
  }));

  if (open) {

    if (error === "need password") {

      store.commit({
        type: 'toggleWindow',
        id: 'boxPass' + box_id,
        component: 'boxPass',
        meta: {
          boxID: box_id,
          action: 'open',
        },
        forceOpen: true,
      });

      return;
    }

    store.commit({
      type: 'toggleWindow',
      id: 'boxPass' + box_id,
      forceClose: true,
    });

    store.commit({
      type: 'setCurrentWarehouse',
      warehouse: 'box:' + box_id,
    });

    store.commit({
      type: 'toggleWindow',
      id: 'wrapperInventoryAndStorage',
      forceOpen: true,
    });
  }
}

export {OpenBox}
