<script>
import { defineComponent } from 'vue';
import { Loading, Header, TokenIcon } from '../internal-components';
import 'uniswap-dapp-integration-shared/styles/uniswap.css';
import {
  UniswapDappSharedLogic,
  Utils as UniswapUtils,
  ChainId,
  ETH,
  TradeDirection,
} from 'uniswap-dapp-integration-shared';
import BigNumber from 'bignumber.js';

export default defineComponent({
  name: 'UniswapVue',
  components: {
    Loading,
    Header,
    TokenIcon,
  },
  props: ['uniswapDappSharedLogicContext'],
  data() {
    return {
      loading: true,
      inputValue: '',
      outputValue: '',
      // logic: null,
    };
  },
  methods: {
    utils() {
      return UniswapUtils;
    },
    async switchSwap() {
      const swapState = await this.logic.swapSwitch();
      console.log(swapState);
      this.switchSwapCompleted(swapState);
    },
    switchSwapCompleted(response) {
      this.inputValue = response.inputValue;
      this.outputValue = response.outputValue;
    },
    toPrecision(value) {
      return this.utils().toPrecision(value);
    },
    async changeInputTradePrice() {
      if (!this.inputValue || new BigNumber(this.inputValue).isEqualTo(0)) {
        this.outputValue = '';
        return;
      }

      await this.logic.changeTradePrice(this.inputValue, TradeDirection.input);
      this.outputValue = this.logic.tradeContext.expectedConvertQuote;
    },
    async changeOutputTradePrice() {
      if (!this.outputValue || new BigNumber(this.outputValue).isEqualTo(0)) {
        this.inputValue = '';
        return;
      }
      await this.logic.changeTradePrice(
        this.outputValue,
        TradeDirection.output,
      );
      this.inputValue = this.logic.tradeContext.expectedConvertQuote;
    },
  },
  async mounted() {
    const uniswapDappSharedLogicContext = {
      supportedNetworkTokens: [
        {
          chainId: ChainId.MAINNET,
          defaultInputToken: ETH.MAINNET().contractAddress,
          defaultOutputToken: '0xde30da39c46104798bb5aa3fe8b9e0e1f348163f',
          supportedTokens: [
            { contractAddress: '0x419D0d8BdD9aF5e606Ae2232ed285Aff190E711b' },
            { contractAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7' },
            { contractAddress: '0x5EeAA2DCb23056F4E8654a349E57eBE5e76b5e6e' },
            { contractAddress: '0xde30da39c46104798bb5aa3fe8b9e0e1f348163f' },
          ],
        },
        {
          chainId: ChainId.RINKEBY,
          defaultInputToken: ETH.RINKEBY().contractAddress,
          defaultOutputToken: '0xef0e839cf88e47be676e72d5a9cb6ced99fad1cf',
          supportedTokens: [
            {
              contractAddress: '0xef0e839cf88e47be676e72d5a9cb6ced99fad1cf',
            },
          ],
        },
      ],
      // to do sort!
      ethereumAddress: (
        await window.ethereum.request({
          method: 'eth_requestAccounts',
        })
      )[0],
      ethereumProvider: window.ethereum,
      // theming: {
      //   backgroundColor: 'red',
      //   button: { textColor: 'white', backgroundColor: 'blue' },
      //   panel: { textColor: 'black', backgroundColor: 'yellow' },
      //   textColor: 'orange',
      // },
    };

    const uniswapDappSharedLogic = new UniswapDappSharedLogic(
      uniswapDappSharedLogicContext,
    );

    if (uniswapDappSharedLogicContext.defaultInputValue) {
      this.inputValue = uniswapDappSharedLogicContext.defaultInputValue;
    }

    await uniswapDappSharedLogic.init();

    // this._newPriceTradeContextAvailableSubscription =
    //   this.logic.newPriceTradeContextAvailable.subscribe(
    //     (tradeContext) => {
    //       if (tradeContext.quoteDirection === TradeDirection.input) {
    //         this.outputValue = tradeContext.expectedConvertQuote;
    //       } else {
    //         this.inputValue = tradeContext.expectedConvertQuote;
    //       }
    //     },
    //   );

    if (uniswapDappSharedLogic.tradeContext?.expectedConvertQuote) {
      this.outputValue =
        uniswapDappSharedLogic.tradeContext.expectedConvertQuote;
    }

    // this._loadingUniswapSubscription =
    //   this.logic.loading.subscribe((_loading) => {
    //     this.loading = _loading;
    //   });

    // if (this.accountChanged) {
    //   this._accountChangedSubscription = this.accountChanged.subscribe(
    //     (ethereumAddress: string) => {
    //       this.logic.changeEthereumAddress(ethereumAddress);
    //     },
    //   );
    // }

    // if (this.chainChanged) {
    //   this._chainChangedSubscription = this.chainChanged.subscribe(
    //     (ethereumProvider: any) => {
    //       this.logic.changeChain(ethereumProvider);
    //     },
    //   );
    // }

    this.logic = uniswapDappSharedLogic;

    this.loading = false;
  },
});
</script>

<template>
  <div>
    <Loading v-if="loading" />
    <div v-else>
      <div class="uni-ic uni-ic__theme-background">
        <Header :logic="logic" />

        <div
          class="uni-ic__swap-container"
          v-if="logic && logic.supportedNetwork"
        >
          <div class="uni-ic__swap-content">
            <div class="uni-ic__swap-input-container">
              <div class="uni-ic__swap-input-content uni-ic__theme-panel">
                <div class="uni-ic__swap-input-content-main">
                  <button
                    class="uni-ic__swap-input-content-main-from-currency-container uni-ic__theme-panel"
                    v-on:click="logic.openTokenSelectorFrom()"
                  >
                    <span class="uni-ic__swap-input-content-main-from-currency">
                      <TokenIcon
                        classes="uni-ic__swap-input-content-main-from-currency-icon"
                        :context="logic.inputToken.tokenImageContext"
                      />

                      <span
                        class="uni-ic__swap-input-content-main-from-currency-symbol"
                        >{{ logic.inputToken.symbol }}</span
                      ><svg
                        width="12"
                        height="7"
                        viewBox="0 0 12 7"
                        fill="none"
                        class="uni-ic__swap-input-content-main-from-currency-choose"
                      >
                        <path
                          d="M0.97168 1L6.20532 6L11.439 1"
                          stroke="#AEAEAE"
                        ></path>
                      </svg>
                    </span>
                  </button>
                  <input
                    class="uni-ic__swap-input-content-main-from uni-ic__theme-panel"
                    autocomplete="off"
                    autocorrect="off"
                    type="number"
                    step="any"
                    placeholder="0.0"
                    oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                    v-bind:maxlength="logic.inputToken.decimals"
                    spellcheck="false"
                    v-model="inputValue"
                    v-on:change="changeInputTradePrice"
                  />
                </div>
                <div class="uni-ic__swap-content-balance-and-price-container">
                  <div class="uni-ic__swap-content-balance-and-price">
                    <div
                      class="uni-ic__swap-content-balance-and-price__balance"
                    >
                      <div
                        class="uni-ic__swap-content-balance-and-price__balance-text"
                      >
                        Balance:
                        {{ toPrecision(logic.inputToken.balance) }}
                        {{ logic.inputToken.symbol }}
                      </div>
                    </div>
                    <div
                      class="uni-ic__swap-content-balance-and-price__price"
                      v-if="inputValue && logic.inputToken.fiatPrice"
                    >
                      ~$
                      <span
                        class="uni-ic__swap-content-balance-and-price__price-text"
                        >{{
                          toPrecision(
                            logic.inputToken.fiatPrice.times(inputValue),
                          )
                        }}</span
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="uni-ic__swap-divider uni-ic__theme-panel"
              v-on:click="switchSwap()"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#000000"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <polyline points="19 12 12 19 5 12"></polyline>
              </svg>
            </div>

            <div class="uni-ic__swap-output-container">
              <div class="uni-ic__swap-output-content uni-ic__theme-panel">
                <div class="uni-ic__swap-output-content-main">
                  <button
                    class="
                  uni-ic__swap-output-content-main-select uni-ic__theme-panel
                "
                    v-on:click="logic.openTokenSelectorTo()"
                  >
                    <span
                      class="uni-ic__swap-output-content-main-select-content"
                      v-if="!logic.outputToken"
                      ><span
                        class="
                      uni-ic__swap-output-content-main-select-content-title
                    "
                        >Select a token</span
                      ><svg
                        width="12"
                        height="7"
                        viewBox="0 0 12 7"
                        fill="none"
                        class="uni-ic__swap-output-content-main-select-content-icon"
                      >
                        <path
                          d="M0.97168 1L6.20532 6L11.439 1"
                          stroke="#AEAEAE"
                        ></path>
                      </svg>
                    </span>

                    <span
                      class="uni-ic__swap-input-content-main-from-currency"
                      v-if="logic.outputToken"
                      ><img
                        v-if="!logic.outputToken.tokenImageContext.isSvg"
                        v-bind:src="logic.outputToken.tokenImageContext.image"
                        class="uni-ic__swap-input-content-main-from-currency-icon"
                      />
                      <!-- <div
                        v-if="logic.outputToken.tokenImageContext.isSvg"
                        class="uni-ic__swap-input-content-main-from-currency-icon"
                        [innerHTML]="
                      logic.outputToken.tokenImageContext.image
                        | safe
                    "
                      ></div> -->

                      <span
                        class="uni-ic__swap-input-content-main-from-currency-symbol"
                        >{{ logic.outputToken.symbol }}</span
                      ><svg
                        width="12"
                        height="7"
                        viewBox="0 0 12 7"
                        fill="none"
                        class="uni-ic__swap-input-content-main-from-currency-choose"
                      >
                        <path
                          d="M0.97168 1L6.20532 6L11.439 1"
                          stroke="#AEAEAE"
                        ></path>
                      </svg>
                    </span>
                  </button>
                  <input
                    class="
                  uni-ic__swap-output-content-main-from uni-ic__theme-panel
                "
                    autocomplete="off"
                    autocorrect="off"
                    type="number"
                    step="any"
                    placeholder="0.0"
                    oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                    v-bind:maxlength="logic.outputToken?.decimals"
                    spellcheck="false"
                    v-model="outputValue"
                    @input="changeOutputTradePrice"
                  />
                </div>
                <div
                  class="uni-ic__swap-content-balance-and-price-container"
                  v-if="logic.outputToken"
                >
                  <div class="uni-ic__swap-content-balance-and-price">
                    <div
                      class="uni-ic__swap-content-balance-and-price__balance"
                    >
                      <div
                        class="uni-ic__swap-content-balance-and-price__balance-text"
                      >
                        Balance:
                        {{ toPrecision(logic.outputToken.balance) }}
                        {{ logic.outputToken.symbol }}
                      </div>
                    </div>
                    <div
                      class="uni-ic__swap-content-balance-and-price__price"
                      v-if="outputValue && logic.outputToken.fiatPrice"
                    >
                      ~$
                      <span
                        class="uni-ic__swap-content-balance-and-price__price-text"
                      >
                        {{
                          toPrecision(
                            logic.outputToken.fiatPrice.times(outputValue),
                          )
                        }}</span
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
