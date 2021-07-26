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
  ErrorCodes,
} from 'uniswap-dapp-integration-shared';
import BigNumber from 'bignumber.js';

const DEBOUNCE_DELAY = 250;

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
      inputFiatPrice: undefined,
      outputValue: '',
      outputToken: undefined,
      outputBalance: undefined,
      outputFiatPrice: undefined,
      tradeContext: undefined,
      newPriceTradeContext: undefined,
      subscriptions: [],
      miningTransaction: undefined,
      miningTransactionStatus: undefined,
      selectorOpenFrom: undefined,
      supportedNetwork: false,
      chainId: undefined,
      noLiquidityFound: false,
      debounceTimeout: undefined,
    };
  },
  methods: {
    utils() {
      return UniswapUtils;
    },
    async switchSwap() {
      if (this.noLiquidityFound) {
        return;
      }
      const swapState = await this.logic.swapSwitch();
      this.switchSwapCompleted(swapState);
    },

    toPrecision(value) {
      return this.utils().toPrecision(value);
    },
    formatCurrency(value) {
      return this.utils().formatCurrency(this.toPrecision(value));
    },
    async changeTradePrice(amount, tradeDirection) {
      try {
        await this.logic.changeTradePrice(amount, tradeDirection);
      } catch (error) {
        if (error?.code === ErrorCodes.noRoutesFound) {
          this.handleNoLiquidityFound(true, tradeDirection);
          return false;
        } else {
          throw error;
        }
      }

      this.handleNoLiquidityFound(false, tradeDirection);

      return true;
    },
    async changeInputTradePrice() {
      if (!this.inputValue || new BigNumber(this.inputValue).isEqualTo(0)) {
        this.outputValue = '';
        if (this.debounceTimeout) {
          clearTimeout(this.debounceTimeout);
        }
        return;
      }

      if (this.debounceTimeout) {
        clearTimeout(this.debounceTimeout);
      }

      this.debounceTimeout = setTimeout(
        () => this._changeInputTradePrice(),
        DEBOUNCE_DELAY,
      );
    },
    async _changeInputTradePrice() {
      const success = await this.changeTradePrice(
        this.inputValue,
        TradeDirection.input,
      );
      if (success) {
        this.outputValue = this.logic.tradeContext.expectedConvertQuote;
      } else {
        this.outputValue = '';
      }
    },
    async changeOutputTradePrice() {
      if (!this.outputValue || new BigNumber(this.outputValue).isEqualTo(0)) {
        this.inputValue = '';
        if (this.debounceTimeout) {
          clearTimeout(this.debounceTimeout);
        }
        return;
      }

      if (this.debounceTimeout) {
        clearTimeout(this.debounceTimeout);
      }

      this.debounceTimeout = setTimeout(
        () => this._changeOutputTradePrice(),
        DEBOUNCE_DELAY,
      );
    },
    async _changeOutputTradePrice() {
      const success = await this.changeTradePrice(
        this.outputValue,
        TradeDirection.output,
      );
      if (success) {
        this.inputValue = this.logic.tradeContext.expectedConvertQuote;
      } else {
        this.inputValue = '';
      }
    },

    registerEventListeners() {
      this.$el.addEventListener('switchSwapCompleted', swapSwitchResponse =>
        this.switchSwapCompleted(swapSwitchResponse),
      );
      this.$el.addEventListener('changeTokenCompleted', noLiquidityFound =>
        this.changeTokenCompleted(noLiquidityFound),
      );
    },
    switchSwapCompleted(response) {
      this.inputValue = response.inputValue;
      this.outputValue = response.outputValue;
    },
    changeTokenCompleted(noLiquidityFound) {
      this.handleNoLiquidityFound(
        noLiquidityFound,
        this.logic.tradeContext?.quoteDirection,
      );
    },
    disableMultihopsCompleted(noLiquidityFound) {
      this.handleNoLiquidityFound(
        noLiquidityFound,
        this.logic.tradeContext?.quoteDirection,
      );
    },
    handleNoLiquidityFound(noLiquidityFound, tradeDirection) {
      this.noLiquidityFound = noLiquidityFound;
      if (noLiquidityFound && tradeDirection) {
        if (tradeDirection === TradeDirection.input) {
          this.outputValue = '';
        } else {
          this.inputValue = '';
        }
      }
    },
  },
  async mounted() {
    this.registerEventListeners();

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

    this.subscriptions.push(
      uniswapDappSharedLogic.newPriceTradeContext$.subscribe(context => {
        this.newPriceTradeContext = context;
      }),
    );

    this.subscriptions.push(
      uniswapDappSharedLogic.tradeCompleted$.subscribe(completed => {
        if (completed) {
          this.noLiquidityFound = false;
          this.inputValue = '';
          this.outputValue = '';
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
    this.inputFiatPrice = uniswapDappSharedLogic.inputToken.fiatPrice;
    this.subscriptions.push(
      uniswapDappSharedLogic.inputToken$.subscribe(token => {
        this.inputToken = token;
        this.inputBalance = this.utils().toPrecision(token.balance);
        this.inputFiatPrice = token.fiatPrice;
      }),
    );

    this.outputToken = uniswapDappSharedLogic.outputToken;
    this.outputBalance = this.utils().toPrecision(
      uniswapDappSharedLogic.outputToken.balance,
    );
    this.outputFiatPrice = uniswapDappSharedLogic.outputToken.fiatPrice;
    this.subscriptions.push(
      uniswapDappSharedLogic.outputToken$.subscribe(token => {
        this.outputToken = token;
        this.outputBalance = this.utils().toPrecision(token.balance);
        this.outputFiatPrice = token.fiatPrice;
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
        <Header
          v-if="logic && supportedNetwork && inputToken"
          :logic="logic"
          @disableMultihopsCompleted="disableMultihopsCompleted"
        />

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
                      v-if="inputValue && inputFiatPrice"
                    >
                      ~$
                      <span
                        class="uni-ic__swap-content-balance-and-price__price-text"
                        >{{
                          formatCurrency(inputFiatPrice.times(inputValue))
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
                      v-if="outputValue && outputFiatPrice"
                    >
                      ~$
                      <span
                        class="uni-ic__swap-content-balance-and-price__price-text"
                      >
                        {{
                          formatCurrency(outputFiatPrice.times(outputValue))
                        }}</span
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <template v-if="tradeContext && !noLiquidityFound">
            <SwapQuoteInfo :logic="logic" :tradeContext="tradeContext" />

            <Approval
              :logic="logic"
              :tradeContext="tradeContext"
              :miningTransaction="miningTransaction"
              :miningTransactionStatus="miningTransactionStatus"
            />
          </template>

          <div class="uni-ic__swap-button-container">
            <button
              class="uni-ic__swap-button uni-ic__theme-background-button"
              v-on:click="logic.showConfirmSwap()"
              :disabled="
                utils().isZero(outputValue) ||
                  tradeContext?.hasEnoughAllowance === false ||
                  tradeContext?.fromBalance?.hasEnough === false ||
                  noLiquidityFound
              "
            >
              <div class="uni-ic__swap-button-text">
                <span v-if="utils().isZero(outputValue) && !noLiquidityFound"
                  >Enter an amount</span
                >
                <span
                  v-if="
                    !utils().isZero(outputValue) &&
                      !noLiquidityFound &&
                      tradeContext?.fromBalance?.hasEnough
                  "
                  >Swap</span
                >
                <span
                  v-if="
                    !utils().isZero(outputValue) &&
                      !noLiquidityFound &&
                      !tradeContext?.fromBalance?.hasEnough
                  "
                  >Insufficient
                  {{ tradeContext?.fromToken?.symbol }}
                  balance</span
                >
                <span v-if="noLiquidityFound"
                  >Insufficient liquidity for this trade.
                  <span v-if="logic.uniswapPairSettings.disableMultihops">
                    Try enabling multi-hop trades.</span
                  ></span
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

      <template v-if="logic && supportedNetwork">
        <TokenModal
          :logic="logic"
          :selectorOpenFrom="selectorOpenFrom"
          :inputToken="inputToken"
          :outputToken="outputToken"
          @switchSwapCompleted="switchSwapCompleted"
          @changeTokenCompleted="changeTokenCompleted"
        />

        <ConfirmSwap
          :logic="logic"
          :tradeContext="tradeContext"
          :newPriceTradeContext="newPriceTradeContext"
          :inputFiatPrice="inputFiatPrice"
          :outputFiatPrice="outputFiatPrice"
        />

        <TransactionModal
          :logic="logic"
          :miningTransaction="miningTransaction"
          :miningTransactionStatus="miningTransactionStatus"
        />
      </template>
    </div>
  </div>
</template>
