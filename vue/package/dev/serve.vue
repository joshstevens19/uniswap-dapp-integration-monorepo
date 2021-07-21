<script>
import { defineComponent } from 'vue';
// Uncomment import and local "components" registration if library is not registered globally.
// import { UniswapVueSample } from '@/entry.esm';

export default defineComponent({
  name: 'ServeDev',
  // components: {
  //  UniswapVueSample,
  // }
});
</script>

<template>
  <div id="app">
    <uniswap-vue-sample />
  </div>
</template>
