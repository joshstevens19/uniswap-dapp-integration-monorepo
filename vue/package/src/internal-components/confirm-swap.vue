<template>
  <div
    id="uni-ic__modal-confirm-swap"
    class="uni-ic__modal"
    v-if="tradeContext"
  >
    <div
      class="uni-ic__modal__content uni-ic__modal-confirm-swap uni-ic__theme-background"
    >
      <span class="uni-ic__modal__close" v-on:click="logic.hideConfirmSwap()"
        >&times;</span
      >
      <p>Confirm swap</p>

      <div
        class="uni-ic__modal-confirm-swap__content"
        v-if="logic.tradeContext"
      >
        <div
          class="uni-ic__modal-confirm-swap__input-container uni-ic__theme-panel"
        >
          <div class="uni-ic__modal-confirm-swap__input">
            <div class="uni-ic__modal-confirm-swap__input-header">
              <div class="uni-ic__modal-confirm-swap__input-header__text">
                From
              </div>
              <div
                class="uni-ic__modal-confirm-swap__input-header__price-container"
                v-if="logic.inputToken.fiatPrice"
              >
                ~$
                <span class="uni-ic__modal-confirm-swap__input-header__price">{{
                  utils().toPrecision(
                    logic.inputToken.fiatPrice.times(
                      tradeContext.baseConvertRequest,
                    ),
                  )
                }}</span>
              </div>
            </div>
            <div class="uni-ic__modal-confirm-swap__input-main">
              <div class="uni-ic__modal-confirm-swap__input-main__symbol">
                <TokenIcon
                  classes="uni-ic__swap-allow-icon"
                  :context="logic.inputToken.tokenImageContext"
                />

                <div
                  class="uni-ic__modal-confirm-swap__input-main__symbol__label"
                >
                  {{ tradeContext.fromToken.symbol }}
                </div>
              </div>
              <div class="uni-ic__modal-confirm-swap__input-main__price">
                <div class="uni-ic__modal-confirm-swap__input-main__price-text">
                  <span v-if="tradeContext.quoteDirection === 'input'">{{
                    tradeContext.baseConvertRequest
                  }}</span>

                  <span v-if="tradeContext.quoteDirection === 'output'">{{
                    tradeContext.expectedConvertQuote
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="uni-ic__modal-confirm-swap__divider uni-ic__theme-panel">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#565A69"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <polyline points="19 12 12 19 5 12"></polyline>
          </svg>
        </div>
        <div
          class="uni-ic__modal-confirm-swap__output-container uni-ic__theme-panel"
        >
          <div class="uni-ic__modal-confirm-swap__output">
            <div class="uni-ic__modal-confirm-swap__output-header">
              <div class="uni-ic__modal-confirm-swap__output-header__text">
                To
              </div>
              <div
                class="uni-ic__modal-confirm-swap__output-header__price-container"
                v-if="logic.outputToken?.fiatPrice"
              >
                ~$
                <span
                  class="uni-ic__modal-confirm-swap__output-header__price"
                  >{{
                    utils().toPrecision(
                      logic.outputToken.fiatPrice.times(
                        tradeContext.expectedConvertQuote,
                      ),
                    )
                  }}</span
                >
              </div>
            </div>
            <div class="uni-ic__modal-confirm-swap__output-main">
              <div class="uni-ic__modal-confirm-swap__output-main__symbol">
                <TokenIcon
                  classes="uni-ic__swap-allow-icon"
                  :context="logic.outputToken.tokenImageContext"
                />

                <div
                  class="uni-ic__modal-confirm-swap__output-main__symbol__label"
                >
                  {{ tradeContext.toToken.symbol }}
                </div>
              </div>
              <div class="uni-ic__modal-confirm-swap__output-main__price">
                <div
                  class="uni-ic__modal-confirm-swap__output-main__price-text"
                >
                  <span v-if="tradeContext.quoteDirection === 'input'">{{
                    tradeContext.expectedConvertQuote
                  }}</span>

                  <span v-if="tradeContext.quoteDirection === 'output'">{{
                    tradeContext.baseConvertRequest
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="uni-ic__modal-confirm-swap__price">
          <div class="uni-ic__modal-confirm-swap__price__title">Price</div>
          <button class="uni-ic__modal-confirm-swap__price__rate-button">
            <div class="uni-ic__modal-confirm-swap__price__rate">
              1
              {{ tradeContext.fromToken.symbol }} =
              {{ logic.workOutOneEqualTo() }}
              {{ tradeContext.toToken.symbol }}
            </div>
          </button>
        </div>
        <div
          class="uni-ic__modal-confirm-swap__info-container uni-ic__theme-panel"
        >
          <div class="uni-ic__modal-confirm-swap__info">
            <div class="uni-ic__modal-confirm-swap__info__item">
              <div class="uni-ic__modal-confirm-swap__info__item__title">
                <div
                  class="uni-ic__modal-confirm-swap__info__item__title-content"
                >
                  Liquidity Provider Fee
                </div>
              </div>
              <div class="uni-ic__modal-confirm-swap__info__item__value">
                {{ tradeContext.liquidityProviderFee }}
                {{ tradeContext.fromToken.symbol }}
              </div>
            </div>
            <div class="uni-ic__modal-confirm-swap__info__item">
              <div class="uni-ic__modal-confirm-swap__info__item__title">
                <div
                  class="uni-ic__modal-confirm-swap__info__item__title-content"
                >
                  Route
                </div>
              </div>
              <div class="uni-ic__modal-confirm-swap__info__item__value">
                {{ tradeContext.routeText }}
              </div>
            </div>
            <!-- <div class="uni-ic__modal-confirm-swap__info__item">
            <div class="uni-ic__modal-confirm-swap__info__item__title">
              <div
                class="uni-ic__modal-confirm-swap__info__item__title-content"
              >
                Price Impact
              </div>
            </div>
            <div class="uni-ic__modal-confirm-swap__info__item__value">
              -0.03%
            </div>
          </div> -->
            <div
              class="uni-ic__modal-confirm-swap__info__item"
              v-if="logic.tradeContext.minAmountConvertQuote"
            >
              <div class="uni-ic__modal-confirm-swap__info__item__title">
                <div
                  class="uni-ic__modal-confirm-swap__info__item__title-content"
                >
                  Minimum received
                </div>
              </div>
              <div class="uni-ic__modal-confirm-swap__info__item__value">
                {{ tradeContext.minAmountConvertQuote }}
                {{ tradeContext.toToken.symbol }}
              </div>
            </div>
            <div
              class="uni-ic__modal-confirm-swap__info__item"
              v-if="logic.tradeContext.maximumSent"
            >
              <div class="uni-ic__modal-confirm-swap__info__item__title">
                <div
                  class="uni-ic__modal-confirm-swap__info__item__title-content"
                >
                  Maximum sent
                </div>
              </div>
              <div class="uni-ic__modal-confirm-swap__info__item__value">
                {{ tradeContext.maximumSent }}
                {{ tradeContext.fromToken.symbol }}
              </div>
            </div>
            <div class="uni-ic__modal-confirm-swap__info__item">
              <div class="uni-ic__modal-confirm-swap__info__item__title">
                <div
                  class="uni-ic__modal-confirm-swap__info__item__title-content"
                >
                  Slippage tolerance
                </div>
              </div>
              <div class="uni-ic__modal-confirm-swap__info__item__value">
                {{ logic.uniswapPairSettings.slippage * 100 }}%
              </div>
            </div>
            <div class="uni-ic__modal-confirm-swap__info__item">
              <div class="uni-ic__modal-confirm-swap__info__item__title">
                <div
                  class="uni-ic__modal-confirm-swap__info__item__title-content"
                >
                  Uniswap version
                </div>
              </div>
              <div class="uni-ic__modal-confirm-swap__info__item__value">
                {{ tradeContext.uniswapVersion }}
              </div>
            </div>
          </div>
        </div>
        <div
          class="uni-ic__modal-confirm-swap__price-updated-container"
          v-if="logic.newPriceTradeContext"
        >
          <div class="uni-ic__modal-confirm-swap__price-updated">
            <div class="uni-ic__modal-confirm-swap__price-updated__text">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path
                  d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
                ></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <div
                class="uni-ic__modal-confirm-swap__price-updated__text-content"
              >
                Price Updated
              </div>
            </div>
            <button
              class="
              uni-ic__modal-confirm-swap__price-updated__action
              uni-ic__theme-background-button
            "
              v-on:click="logic.acceptPriceChange()"
            >
              Accept
            </button>
          </div>
        </div>
        <div class="uni-ic__modal-confirm-swap__output-info-container">
          <div class="uni-ic__modal-confirm-swap__output-info">
            <span v-if="logic.tradeContext.minAmountConvertQuote">
              Output is estimated. You will receive at least
              <b
                >{{ tradeContext.minAmountConvertQuote }}
                {{ tradeContext.toToken.symbol }}</b
              >
              or the transaction will revert.
            </span>
            <span v-if="logic.tradeContext.maximumSent">
              Input is estimated. You will sell at most
              <b
                >{{ tradeContext.maximumSent }}
                {{ tradeContext.fromToken.symbol }}</b
              >
              or the transaction will revert.
            </span>
          </div>
        </div>
      </div>

      <div class="uni-ic__modal-confirm-swap__action-container">
        <div class="uni-ic__modal-confirm-swap__action">
          <button
            id="confirm-swap-or-send"
            class="
            uni-ic__modal-confirm-swap__action__button
            uni-ic__theme-background-button
          "
            :disabled="logic.newPriceTradeContext"
            v-on:click="logic.swapTransaction()"
          >
            <div class="uni-ic__modal-confirm-swap__action__button-text">
              Confirm Swap
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { default as TokenIcon } from './token-icon.vue';
import { Utils as UniswapUtils } from 'uniswap-dapp-integration-shared';

export default {
  name: 'ConfirmSwap',
  components: {
    TokenIcon,
  },
  props: ['logic', 'tradeContext'],
  methods: {
    utils() {
      return UniswapUtils;
    },
  },
};
</script>
