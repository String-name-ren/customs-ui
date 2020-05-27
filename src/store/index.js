import Vue from 'vue';
import Vuex from 'vuex';
import app from './modules/app';
import user from './modules/user';
import tagsView from './modules/tagsView'
import permission from './modules/permission';
import getters from './getters';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    app,
    user,
    tagsView,
    permission
  },
  getters,
  state: {
    lang: localStorage.lang || 'cn'
  },
  mutations: {
    switchLang (state, lang) {
      state.lang = lang
      window.app.$i18n.locale = lang
      localStorage.setItem('lang', lang)
    }
  },
  actions: {}
});

export default store
