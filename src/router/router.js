import Vue from "vue";
import VueRouter from 'vue-router'
import Login from '../components/Auth/Login'
import Registration from '../components/Auth/Registration'
import Lobby from '../components/Lobby/Lobby'
import Global from '../components/Global/Global'
import Gate from '../components/Gate/Gate'
import MapEditor from '../components/Editors/MapEditor'
import ServerState from '../components/ServerState/ServerState'
import ChoiceFraction from '../components/ChoiceFraction/ChoiceFraction'

import Index from '../components/Index/Index'
import Main from '../components/Index/Main'

import Wiki from '../components/Index/Wiki/Wiki'
import ContentList from '../components/Index/Wiki/ContentList'
import Bodies from '../components/Index/Wiki/WikiPages/Bodies'
import Weapons from '../components/Index/Wiki/WikiPages/Weapons'

Vue.use(VueRouter);

const router = new VueRouter({
  //mode: 'history',
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
            {path: 'weapons', component: Weapons}
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
    {path: '/server_state', component: ServerState, meta: {title: ""}},
  ]
});

export default router
