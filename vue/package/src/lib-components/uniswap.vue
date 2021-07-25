<script>
import { defineComponent } from 'vue';
import {
  Loading,
  Header,
  TokenIcon,
  SwapQuoteInfo,
  Approval,
  ConfirmSwap,
  TransactionModal,
  TokenModal,
} from '../internal-components';
import 'uniswap-dapp-integration-shared/styles/uniswap.css';
import {
  UniswapDappSharedLogic,
  Utils as UniswapUtils,
  TradeDirection,
} from 'uniswap-dapp-integration-shared';
import BigNumber from 'bignumber.js';

export default defineComponent({
  name: 'UniswapVue',
  components: {
    Loading,
    Header,
    TokenIcon,
    SwapQuoteInfo,
    Approval,
    ConfirmSwap,
    TransactionModal,
    TokenModal,
  },
  props: ['uniswapDappSharedLogicContext'],
  data() {
    return {
      loading: true,
      inputValue: '',
      inputToken: undefined,
      inputBalance: undefined,
      outputValue: '',
      outputToken: undefined,
      outputBalance: undefined,
      tradeContext: undefined,
      subscriptions: [],
      miningTransaction: undefined,
      miningTransactionStatus: undefined,
      selectorOpenFrom: undefined,
      supportedNetwork: false,
      chainId: undefined,
    };
  },
  methods: {
    utils() {
      return UniswapUtils;
    },
    async switchSwap() {
      const swapState = await this.logic.swapSwitch();
      this.switchSwapCompleted(swapState);
    },
    switchSwapCompleted(response) {
      this.inputValue = response.inputValue;
      this.outputValue = response.outputValue;
    },
    toPrecision(value) {
      return this.utils().toPrecision(value);
    },
    formatCurrency(value) {
      return this.utils().formatCurrency(this.toPrecision(value));
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
    const uniswapDappSharedLogic = new UniswapDappSharedLogic(
      this.uniswapDappSharedLogicContext,
    );

    if (this.uniswapDappSharedLogicContext.defaultInputValue) {
      this.inputValue = this.uniswapDappSharedLogicContext.defaultInputValue;
    }

    await uniswapDappSharedLogic.init();

    if (uniswapDappSharedLogic.tradeContext?.expectedConvertQuote) {
      this.outputValue =
        uniswapDappSharedLogic.tradeContext.expectedConvertQuote;
    }

    this.tradeContext = uniswapDappSharedLogic.tradeContext;
    this.subscriptions.push(
      uniswapDappSharedLogic.tradeContext$.subscribe(context => {
        this.tradeContext = context;
        if (context) {
          if (context.quoteDirection === TradeDirection.input) {
            this.outputValue = context.expectedConvertQuote;
          } else {
            this.inputValue = context.expectedConvertQuote;
          }
        }
      }),
    );

    this.supportedNetwork = uniswapDappSharedLogic.supportedNetwork;
    this.subscriptions.push(
      uniswapDappSharedLogic.supportedNetwork$.subscribe(supported => {
        this.supportedNetwork = supported;
      }),
    );

    this.chainId = uniswapDappSharedLogic.chainId;
    this.subscriptions.push(
      uniswapDappSharedLogic.chainId$.subscribe(chainId => {
        this.chainId = chainId;
      }),
    );

    this.miningTransaction = uniswapDappSharedLogic.miningTransaction;
    this.miningTransactionStatus =
      uniswapDappSharedLogic.miningTransaction?.status;
    this.subscriptions.push(
      uniswapDappSharedLogic.miningTransaction$.subscribe(
        _miningTransaction => {
          this.miningTransaction = _miningTransaction;
          this.miningTransactionStatus = _miningTransaction?.status;
        },
      ),
    );

    this.selectorOpenFrom = uniswapDappSharedLogic.selectorOpenFrom;
    this.subscriptions.push(
      uniswapDappSharedLogic.selectorOpenFrom$.subscribe(openFrom => {
        this.selectorOpenFrom = openFrom;
      }),
    );

    this.inputToken = uniswapDappSharedLogic.inputToken;
    this.inputBalance = this.utils().toPrecision(
      uniswapDappSharedLogic.inputToken.balance,
    );
    this.subscriptions.push(
      uniswapDappSharedLogic.inputToken$.subscribe(token => {
        this.inputToken = token;
        this.inputBalance = this.utils().toPrecision(token.balance);
      }),
    );

    this.outputToken = uniswapDappSharedLogic.outputToken;
    this.outputBalance = this.utils().toPrecision(
      uniswapDappSharedLogic.outputToken.balance,
    );
    this.subscriptions.push(
      uniswapDappSharedLogic.outputToken$.subscribe(token => {
        this.outputToken = token;
        this.outputBalance = this.utils().toPrecision(token.balance);
      }),
    );

    this.subscriptions.push(
      uniswapDappSharedLogic.loading$.subscribe(_loading => {
        this.loading = _loading;
      }),
    );

    this.logic = uniswapDappSharedLogic;

    this.loading = false;
  },
  unmounted() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  },
});
</script>

<template>
  <div className="uniswap-vue-react" id="uniswap__716283642843643826">
    <Loading v-if="loading" />
    <div v-else>
      <div class="uni-ic uni-ic__theme-background">
        <Header v-if="logic && supportedNetwork && inputToken" :logic="logic" />

        <div
          class="uni-ic__swap-container"
          v-if="logic && supportedNetwork && inputToken"
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
                        :context="inputToken.tokenImageContext"
                      />

                      <span
                        class="uni-ic__swap-input-content-main-from-currency-symbol"
                        >{{ inputToken.symbol }}</span
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
                    v-bind:maxlength="inputToken.decimals"
                    spellcheck="false"
                    v-model="inputValue"
                    :disabled="logic.transactionInProcess()"
                    v-on:input="changeInputTradePrice"
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
                        {{ inputBalance }}
                        {{ inputToken.symbol }}
                      </div>
                    </div>
                    <div
                      class="uni-ic__swap-content-balance-and-price__price"
                      v-if="inputValue && inputToken.fiatPrice"
                    >
                      ~$
                      <span
                        class="uni-ic__swap-content-balance-and-price__price-text"
                        >{{
                          formatCurrency(inputToken.fiatPrice.times(inputValue))
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
                      v-if="!outputToken"
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
                      v-if="outputToken"
                    >
                      <TokenIcon
                        classes="uni-ic__swap-input-content-main-from-currency-icon"
                        :context="outputToken.tokenImageContext"
                      />

                      <span
                        class="uni-ic__swap-input-content-main-from-currency-symbol"
                        >{{ outputToken.symbol }}</span
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
                    class="uni-ic__swap-output-content-main-from uni-ic__theme-panel"
                    autocomplete="off"
                    autocorrect="off"
                    type="number"
                    step="any"
                    placeholder="0.0"
                    oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                    v-bind:maxlength="outputToken?.decimals"
                    spellcheck="false"
                    v-model="outputValue"
                    v-on:input="changeOutputTradePrice"
                    :disabled="logic.transactionInProcess()"
                  />
                </div>
                <div
                  class="uni-ic__swap-content-balance-and-price-container"
                  v-if="outputToken"
                >
                  <div class="uni-ic__swap-content-balance-and-price">
                    <div
                      class="uni-ic__swap-content-balance-and-price__balance"
                    >
                      <div
                        class="uni-ic__swap-content-balance-and-price__balance-text"
                      >
                        Balance:
                        {{ outputBalance }}
                        {{ outputToken.symbol }}
                      </div>
                    </div>
                    <div
                      class="uni-ic__swap-content-balance-and-price__price"
                      v-if="outputValue && outputToken.fiatPrice"
                    >
                      ~$
                      <span
                        class="uni-ic__swap-content-balance-and-price__price-text"
                      >
                        {{
                          formatCurrency(
                            outputToken.fiatPrice.times(outputValue),
                          )
                        }}</span
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <SwapQuoteInfo :logic="logic" :tradeContext="tradeContext" />

          <Approval
            :logic="logic"
            :tradeContext="tradeContext"
            :miningTransaction="miningTransaction"
            :miningTransactionStatus="miningTransactionStatus"
          />

          <div class="uni-ic__swap-button-container">
            <button
              class="uni-ic__swap-button uni-ic__theme-background-button"
              v-on:click="logic.showConfirmSwap()"
              :disabled="
                utils().isZero(outputValue) ||
                  tradeContext?.hasEnoughAllowance === false ||
                  tradeContext?.fromBalance?.hasEnough === false
              "
            >
              <div class="uni-ic__swap-button-text">
                <span v-if="utils().isZero(outputValue)">Enter an amount</span>
                <span
                  v-if="
                    !utils().isZero(outputValue) &&
                      tradeContext?.fromBalance?.hasEnough
                  "
                  >Swap</span
                >
                <span
                  v-if="
                    !utils().isZero(outputValue) &&
                      !tradeContext?.fromBalance?.hasEnough
                  "
                  >Insufficient
                  {{ tradeContext?.fromToken?.symbol }}
                  balance</span
                >
              </div>
            </button>
          </div>
        </div>

        <div class="uni-ic__error" v-if="!supportedNetwork">
          <p>
            <strong>Chain id {{ chainId }} is a unsupported network.</strong>
          </p>
        </div>
      </div>

      <TokenModal
        v-if="logic && supportedNetwork"
        :logic="logic"
        :tradeContext="tradeContext"
        :selectorOpenFrom="selectorOpenFrom"
      />

      <ConfirmSwap
        v-if="logic && supportedNetwork"
        :logic="logic"
        :tradeContext="tradeContext"
      />

      <TransactionModal
        v-if="logic && supportedNetwork"
        :logic="logic"
        :miningTransaction="miningTransaction"
        :miningTransactionStatus="miningTransactionStatus"
      />
    </div>
  </div>
</template>
