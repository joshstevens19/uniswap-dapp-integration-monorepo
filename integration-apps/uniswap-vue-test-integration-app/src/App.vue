
<template>
   <div id="app">
      <div class="uniswap-container">
      <uniswap-vue
        :uniswapDappSharedLogicContext="uniswapDappSharedLogicContext"
        v-if="uniswapDappSharedLogicContext"
      />
    </div>
  </div>
</template>

<script>
import { ChainId, ETH } from 'uniswap-dapp-integration-shared'

export default {
  name: 'App',
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
  display: flex;
  flex-direction: column;
  width: 100%;
  -webkit-box-align: center;
  align-items: center;
  flex: 1 1 0%;
  z-index: 1;
}

.uniswap-container {
  position: relative;
  max-width: 480px;
  width: 100%;
  background: rgb(255, 255, 255);
  box-shadow: rgb(0 0 0 / 1%) 0px 0px 1px, rgb(0 0 0 / 4%) 0px 4px 8px,
    rgb(0 0 0 / 4%) 0px 16px 24px, rgb(0 0 0 / 1%) 0px 24px 32px;
  border-radius: 24px;
  margin-top: 1rem;
}
</style>
