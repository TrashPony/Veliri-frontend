//  NODE_ENV определяется при сборке в файле package.json, раздел scripts {}
let urls = {};
let host = window.location.host;

if (NODE_ENV !== 'production') {
  host = 'localhost:8080'
}

urls = {
  socketLobbyURL: "ws://" + host + "/socket/wsLobby",
  socketInventoryURL: "ws://" + host + "/socket/wsInventory",
  socketMarketURL: "ws://" + host + "/socket/wsMarket",
  socketChatURL: "ws://" + host + "/socket/wsChat",
  socketGlobalURL: "ws://" + host + "/socket/wsGlobal",
  socketMapEditor: "ws://" + host + "/socket/wsMapEditor",
  regURL: "http://" + host + "/api/registration",
  loginURL: "http://" + host + "/api/login",
  avatarURL: "http://" + host + "/api/avatar",
  itemURL: "http://" + host + "/api/get_item",
  bpURL: "http://" + host + "/api/get_bp",
  groupAvatarURL: "http://" + host + "/api/chat_group_avatar",
  dialogPicURL: "http://" + host + "/api/get_picture_dialog",
  corpLogoURL: "http://" + host + "/api/get_corporation_logo",
  corpInfoURL: "http://" + host + "/api/get_corporation_main_info",
  userInfoURL: "http://" + host + "/api/get_user_info",
  skillInfoURL: "http://" + host + "/api/get_skill_info",
  bodySlotsInfo: "http://" + host + "/api/get_body_slots",
  getRecycleItems: "http://" + host + "/api/get_recycle_items",
};

if (NODE_ENV === 'production') {
  console.log('There is Production mode');
} else {
  console.log('There is Development mode');
}

export default urls

