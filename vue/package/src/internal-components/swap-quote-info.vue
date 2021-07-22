<template>
  <div class="uni-ic__swap-quote" v-if="tradeContext">
    <div class="uni-ic__swap-quote-container">
      <div class="uni-ic__swap-quote-price">
        <div class="uni-ic__swap-quote-price-text">
          Best rate on
          {{ tradeContext.uniswapVersion }}
        </div>
        <div
          class="uni-ic__swap-quote-price-text"
          style="
          justify-content: center;
          align-items: center;
          display: flex;
          font-size: 14px;
        "
        >
          <span
            >1 {{ tradeContext.fromToken.symbol }} =
            {{ logic.workOutOneEqualTo() }}
            {{ tradeContext.toToken.symbol }}
          </span>
          <div class="uni-ic__swap-quote-price-text-info">
            <div class="uni-ic__swap-quote-price-text-info__container">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
            </div>

            <div class="uni-ic__tooltip-wrapper">
              <div class="uni-ic__tooltip-container">
                <div class="uni-ic__tooltip">
                  <div class="uni-ic__tooltip__item">
                    <div class="uni-ic__tooltip__item__title">
                      <div class="uni-ic__tooltip__item__title__content">
                        Liquidity Provider Fee
                      </div>
                    </div>
                    <div class="uni-ic__tooltip__item__value">
                      {{ tradeContext.liquidityProviderFee }}
                      {{ tradeContext.fromToken.symbol }}
                    </div>
                  </div>
                  <div class="uni-ic__tooltip__item">
                    <div class="uni-ic__tooltip__item__title">
                      <div class="uni-ic__tooltip__item__title__content">
                        Route
                      </div>
                    </div>
                    <div class="uni-ic__tooltip__item__value">
                      {{ tradeContext.routeText }}
                    </div>
                  </div>
                  <div
                    class="uni-ic__tooltip__item"
                    v-if="tradeContext.minAmountConvertQuote"
                  >
                    <div class="uni-ic__tooltip__item__title">
                      <div class="uni-ic__tooltip__item__title__content">
                        Minimum received
                      </div>
                    </div>
                    <div class="uni-ic__tooltip__item__value">
                      {{ tradeContext.minAmountConvertQuote }}
                      {{ tradeContext.toToken.symbol }}
                    </div>
                  </div>
                  <div
                    class="uni-ic__tooltip__item"
                    v-if="tradeContext.maximumSent"
                  >
                    <div class="uni-ic__tooltip__item__title">
                      <div class="uni-ic__tooltip__item__title__content">
                        Maximum sent
                      </div>
                    </div>
                    <div class="uni-ic__tooltip__item__value">
                      {{ tradeContext.maximumSent }}
                      {{ tradeContext.fromToken.symbol }}
                    </div>
                  </div>
                  <div class="uni-ic__tooltip__item">
                    <div class="uni-ic__tooltip__item__title">
                      <div class="uni-ic__tooltip__item__title__content">
                        Slippage tolerance
                      </div>
                    </div>
                    <div class="uni-ic__tooltip__item__value">
                      {{ logic.uniswapPairSettings.slippage * 100 }}%
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

<script>
export default {
  name: 'SwapQuoteInfo',
  props: ['logic', 'tradeContext'],
};
</script>
