<script>
import { defineComponent } from 'vue';
// Uncomment import and local "components" registration if library is not registered globally.
// import { UniswapVueSample } from '@/entry.esm';
// import { ChainId, ETH } from 'uniswap-dapp-integration-shared';

export default defineComponent({
  name: 'ServeDev',
  // components: {
  //  UniswapVueSample,
  // }
  data() {
    return {
      uniswapDappSharedLogicContext: null,
      account: null,
    };
  },
  async mounted() {
    this.account = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });
    //   // this.uniswapDappSharedLogicContext = {
    //   //   supportedNetworkTokens: [
    //   //     {
    //   //       chainId: ChainId.MAINNET,
    //   //       defaultInputToken: ETH.MAINNET().contractAddress,
    //   //       defaultOutputToken: '0xde30da39c46104798bb5aa3fe8b9e0e1f348163f',
    //   //       supportedTokens: [
    //   //         { contractAddress: '0x419D0d8BdD9aF5e606Ae2232ed285Aff190E711b' },
    //   //         { contractAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7' },
    //   //         // { contractAddress: '0x1985365e9f78359a9B6AD760e32412f4a445E862' },
    //   //         { contractAddress: '0x5EeAA2DCb23056F4E8654a349E57eBE5e76b5e6e' },
    //   //         { contractAddress: '0xde30da39c46104798bb5aa3fe8b9e0e1f348163f' },
    //   //       ],
    //   //     },
    //   //     {
    //   //       chainId: ChainId.RINKEBY,
    //   //       defaultInputToken: ETH.RINKEBY().contractAddress,
    //   //       defaultOutputToken: '0xef0e839cf88e47be676e72d5a9cb6ced99fad1cf',
    //   //       supportedTokens: [
    //   //         {
    //   //           contractAddress: '0xef0e839cf88e47be676e72d5a9cb6ced99fad1cf',
    //   //         },
    //   //       ],
    //   //     },
    //   //   ],
    //   //   ethereumAddress: this.account,
    //   //   ethereumProvider: window.ethereum,
    //   //   // theming: {
    //   //   //   backgroundColor: 'red',
    //   //   //   button: { textColor: 'white', backgroundColor: 'blue' },
    //   //   //   panel: { textColor: 'black', backgroundColor: 'yellow' },
    //   //   //   textColor: 'orange',
    //   //   // },
    //   // };
  },
});
</script>

<template>
  <div id="app">
    <!-- <uniswap-vue
      v-if="uniswapDappSharedLogicContext"
      :uniswapDappSharedLogicContext="uniswapDappSharedLogicContext"
    /> -->

    <uniswap-vue />
  </div>
</template>
