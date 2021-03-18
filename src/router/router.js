import Vue from "vue";
import VueRouter from 'vue-router'
import Login from '../components/Auth/Login'
import Registration from '../components/Auth/Registration'
import VkPopup from '../components/Auth/VkPopup'
import Lobby from '../components/Lobby/Lobby'
import Global from '../components/Global/Global'
import Gate from '../components/Gate/Gate'
import MapEditor from '../components/Editors/MapEditor'
import DialogsEditor from '../components/Editors/DialogsEditor'
import MissionEditor from '../components/Editors/MissionEditor'

import ServerState from '../components/ServerState/ServerState'
import Timers from '../components/ServerState/Timers'

import ChoiceFraction from '../components/ChoiceFraction/ChoiceFraction'

import Index from '../components/Index/Index'
import Main from '../components/Index/Main'

import Wiki from '../components/Index/Wiki/Wiki'
import ContentList from '../components/Index/Wiki/ContentList'
import Bodies from '../components/Index/Wiki/WikiPages/Bodies'
import Weapons from '../components/Index/Wiki/WikiPages/Weapons'
import Equips from '../components/Index/Wiki/WikiPages/Equips'
import Sector from '../components/Index/Wiki/WikiPages/Sector'
import Anomaly from '../components/Index/Wiki/WikiPages/Anomaly'
import Mining from '../components/Index/Wiki/WikiPages/Mining'
import PartsProduction from '../components/Index/Wiki/WikiPages/PartsProduction'
import Law from '../components/Index/Wiki/WikiPages/Law'
import Processing from '../components/Index/Wiki/WikiPages/Processing'
import InstallAndDismantling from '../components/Index/Wiki/WikiPages/InstallAndDismantling'
import Defenders from '../components/Index/Wiki/WikiPages/Defenders'
import Base from '../components/Index/Wiki/WikiPages/Base'
import FractionWar from '../components/Index/Wiki/WikiPages/FractionWar'
import AutoPilot from '../components/Index/Wiki/WikiPages/AutoPilot'
import Expedition from '../components/Index/Wiki/WikiPages/Expedition'
import MapItems from '../components/Index/Wiki/WikiPages/MapItems'
import Teleports from '../components/Index/Wiki/WikiPages/Teleports'
import Missions from '../components/Index/Wiki/WikiPages/Missions'

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/', component: Index, meta: {title: ""},
      children: [
        {path: '', component: Main},
        {
          path: 'wiki', component: Wiki,
          children: [
            {path: '', component: ContentList},
            {path: 'bodies', component: Bodies},
            {path: 'weapons', component: Weapons},
            {path: 'equips', component: Equips},
            {path: 'sector', component: Sector},
            {path: 'anomaly', component: Anomaly},
            {path: 'mining', component: Mining},
            {path: 'parts_production', component: PartsProduction},
            {path: 'law', component: Law},
            {path: 'processing', component: Processing},
            {path: 'install_and_dismantling', component: InstallAndDismantling},
            {path: 'defenders', component: Defenders},
            {path: 'base', component: Base},
            {path: 'fraction_war', component: FractionWar},
            {path: 'auto_pilot', component: AutoPilot},
            {path: 'expedition', component: Expedition},
            {path: 'map_items', component: MapItems},
            {path: 'teleports', component: Teleports},
            {path: 'missions', component: Missions},
          ]
        },
      ]
    },
    {path: '/login', component: Login, meta: {title: ""}},
    {path: '/registration', component: Registration, meta: {title: ""}},
    {path: '/lobby', component: Lobby, meta: {title: ""}},
    {path: '/global', component: Global, meta: {title: ""}},
    {path: '/choice_fraction', component: ChoiceFraction, meta: {title: ""}},
    {path: '/gate', component: Gate, meta: {title: ""}},
    {path: '/map_editor', component: MapEditor, meta: {title: ""}},
    {path: '/dialog_editor', component: DialogsEditor, meta: {title: ""}},
    {path: '/mission_editor', component: MissionEditor, meta: {title: ""}},
    {path: '/server_state', component: ServerState, meta: {title: ""}},
    {path: '/timers', component: Timers, meta: {title: ""}},
    {path: '/vk-oauth', component: VkPopup, meta: {title: ""}},
  ]
});

export default router
