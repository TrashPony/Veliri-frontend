export default function createDialogEditorPlugin(WS) {
  return store => {

    WS.onopen = function () {
      console.log("Connection dialog_editor opened..." + this.readyState);

      store.commit({
        type: 'setWSConnectState',
        service: 'dialog_editor',
        connect: true,
        error: false,
        reconnect: false,
        ws: WS,
      });

      store.commit({
        type: 'setEndLoadServices',
        service: 'dialog_editor',
      });

      WS.send(JSON.stringify({
        event: "OpenEditor"
      }));

      WS.send(JSON.stringify({
        event: "GetAllMissions"
      }));
    };

    WS.onclose = function (i) {
      store.commit({
        type: 'setWSConnectState',
        service: 'dialog_editor',
        connect: false,
        error: true,
        ws: WS,
      });
      console.log(i, 'dialog_editor закрыл');
    };

    WS.onmessage = function (msg) {
      if (msg.data) DialogEditorReader(JSON.parse(msg.data), store)
    };
  };
}

function DialogEditorReader(data, store) {

  if (data.event === "OpenEditor") {

    let dialogs = {}
    for (let i in data.dialogs) {
      dialogs[i] = JSON.parse(data.dialogs[i])
      dialogs[i].pages = JSON.parse(data.pages[i])
    }
    // console.log(dialogs)
    // console.log(data.pages)

    store.commit({
      type: 'setDialogsInDialogEditor',
      dialogs: dialogs,
    });
  }

  if (data.event === "GetDialog") {
    //ViewDialog(data.dialog);
  }

  if (data.event === "GetAllMissions") {
    console.log(data)
    store.commit({
      type: 'setMissionInMissionEditor',
      missions: data.missions,
      items: data.action_items,
      actions: data.mission_actions,
      rewardItems: data.reward_items,
    });
  }
}
