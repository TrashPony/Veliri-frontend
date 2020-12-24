import {logMsg} from "./log";

export default function createMarketPlugin(WS) {
  return store => {

    WS.onopen = function () {
      console.log("Connection market opened..." + this.readyState);

      store.commit({
        type: 'setWSConnectState',
        service: 'market',
        connect: true,
        error: false,
        reconnect: false,
        ws: WS,
      });

      store.commit({
        type: 'setEndLoadServices',
        service: 'market',
      });

      WS.send(JSON.stringify({
        event: "openMarket"
      }));
    };

    WS.onclose = function (i) {
      store.commit({
        type: 'setWSConnectState',
        service: 'market',
        connect: false,
        error: true,
        ws: WS,
      });
      console.log(i, 'market закрыл');
    };

    WS.onmessage = function (msg) {
      if (msg.data) MarketReader(JSON.parse(msg.data), store)
    };
  };
}

function MarketReader(data, store) {

  if (data.event) logMsg(data.event, data);
  if (data.e) logMsg(data.e, data);

  if (data.error) {
    alert(data.error);
    return;
  }

  if (data.event === 'getItemsInStorage') {
    store.commit({
      type: 'setCountItems',
      order_id: data.order_id,
      count: data.count,
    });
  } else {
    store.commit({
      type: 'setMarketState',
      assortment: data.assortment,
      orders: data.orders,
      my_orders: data.my_orders,
      my_credits: data.credits,
    });
  }
}
