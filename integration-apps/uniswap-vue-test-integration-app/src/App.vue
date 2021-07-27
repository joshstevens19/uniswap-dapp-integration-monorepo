<template>
  <div id="app">
    <uniswap-vue
      :uniswapDappSharedLogicContext="uniswapDappSharedLogicContext"
      v-if="uniswapDappSharedLogicContext"
    />
  </div>
</template>

<script>
import UniswapVue from 'uniswap-vue'
import { ChainId, ETH } from 'uniswap-dapp-integration-shared'

export default {
  name: 'App',
  components: {
    UniswapVue
  },
  data () {
    return {
      uniswapDappSharedLogicContext: undefined
    }
  },
  async mounted () {
    const addresses = await window.ethereum.request({
      method: 'eth_requestAccounts'
    })

    this.uniswapDappSharedLogicContext = {
      supportedNetworkTokens: [
        {
          chainId: ChainId.MAINNET,
          defaultInputValue: '0.000001',
          defaultInputToken: ETH.MAINNET().contractAddress,
          defaultOutputToken: '0xde30da39c46104798bb5aa3fe8b9e0e1f348163f',
          supportedTokens: [
            {
              contractAddress: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984'
            },
            { contractAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7' },
            { contractAddress: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9' },
            { contractAddress: '0xde30da39c46104798bb5aa3fe8b9e0e1f348163f' }
          ]
        },
        {
          chainId: ChainId.RINKEBY,
          defaultInputToken: ETH.RINKEBY().contractAddress,
          defaultOutputToken: '0xef0e839cf88e47be676e72d5a9cb6ced99fad1cf',
          supportedTokens: [
            {
              contractAddress: '0xef0e839cf88e47be676e72d5a9cb6ced99fad1cf'
            }
          ]
        }
      ],
      ethereumAddress: addresses[0],
      ethereumProvider: window.ethereum
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
