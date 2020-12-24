const actions = {
  removeThorium(context, payload) {
    context.getters.getWSByService('inventory').socket.send(JSON.stringify({
      event: "RemoveThorium",
      thorium_slot: Number(payload.slot)
    }));
  },
};


export default actions;
