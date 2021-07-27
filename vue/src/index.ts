import UniswapVue from './uniswap/uniswap.vue';

export default {
  install(Vue) {
    Vue.component('uniswap-vue', UniswapVue);
  },
};
