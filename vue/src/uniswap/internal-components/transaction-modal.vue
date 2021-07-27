<template>
  <div id="uni-ic__modal-transaction" class="uni-ic__modal">
    <div
      class="
      uni-ic__modal__content uni-ic__modal-transaction uni-ic__theme-background
    "
    >
      <span
        class="uni-ic__modal__close"
        v-on:click="logic.hideTransaction()"
        v-if="miningTransactionStatus === TransactionStatus.completed"
        >&times;</span
      >

      <div
        class="uni-ic__modal-transaction__state"
        v-if="
          miningTransactionStatus ===
            TransactionStatus.waitingForConfirmation ||
            miningTransactionStatus === TransactionStatus.mining ||
            miningTransactionStatus === TransactionStatus.completed
        "
      >
        <div
          class="uni-ic__modal-transaction__state__loading"
          v-if="miningTransactionStatus !== TransactionStatus.completed"
        >
          <svg
            class="uni-ic__modal-transaction__state__loading-spinner"
            width="94"
            height="94"
            viewBox="0 0 94 94"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M92 47C92 22.1472 71.8528 2 47 2C22.1472 2 2 22.1472 2 47C2 71.8528 22.1472 92 47 92"
              stroke="#2172E5"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <div class="uni-ic__modal-transaction__state__info">
          <div class="uni-ic__modal-transaction__state__info-confirmation">
            <span
              v-if="
                miningTransactionStatus ===
                  TransactionStatus.waitingForConfirmation
              "
              >Waiting For Confirmation</span
            >
            <span v-if="miningTransactionStatus === TransactionStatus.mining"
              >Mining</span
            >

            <span v-if="miningTransactionStatus === TransactionStatus.completed"
              >Swap complete</span
            >
          </div>
          <div class="uni-ic__modal-transaction__state__info-quote">
            <div class="uni-ic__modal-transaction__state__info-quote-info">
              <span
                v-if="
                  miningTransactionStatus ===
                    TransactionStatus.waitingForConfirmation ||
                    miningTransactionStatus === TransactionStatus.mining
                "
                >Swapping
              </span>
              <span
                v-if="miningTransactionStatus === TransactionStatus.completed"
                >Swapped
              </span>
              <span
                v-if="
                  logic.tradeContext.quoteDirection === TradeDirection.input
                "
              >
                {{ logic.tradeContext.baseConvertRequest }}
                {{ logic.tradeContext.fromToken.symbol }} for
                {{ logic.tradeContext.expectedConvertQuote }}
                {{ logic.tradeContext.toToken.symbol }}
              </span>
              <span
                v-if="
                  logic.tradeContext.quoteDirection === TradeDirection.output
                "
              >
                {{ logic.tradeContext.expectedConvertQuote }}
                {{ logic.tradeContext.fromToken.symbol }} for
                {{ logic.tradeContext.baseConvertRequest }}
                {{ logic.tradeContext.toToken.symbol }}
              </span>
            </div>
          </div>
          <div class="uni-ic__modal-transaction__state__action">
            <span
              v-if="
                miningTransactionStatus ===
                  TransactionStatus.waitingForConfirmation
              "
              >Confirm this transaction in your wallet</span
            >
            <button
              v-if="
                miningTransactionStatus === TransactionStatus.mining ||
                  miningTransactionStatus === TransactionStatus.completed
              "
              v-on:click="logic.viewOnEtherscan()()"
              class="uni-ic__theme-background-button"
            >
              View tx on etherscan
            </button>
          </div>
        </div>
      </div>

      <div
        class="uni-ic__modal-transaction__rejected"
        v-if="miningTransactionStatus === TransactionStatus.rejected"
      >
        <div class="uni-ic__modal-transaction__rejected__content">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#DA2D2B"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
            ></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          <div class="uni-ic__modal-transaction__rejected__content-text">
            Transaction rejected.
          </div>
        </div>

        <div class="uni-ic__modal-transaction__rejected__dismiss">
          <button
            class="
            uni-ic__modal-transaction__rejected__dismiss-button
            uni-ic__theme-background-button
          "
            v-on:click="logic.hideTransaction()"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  TransactionStatus,
  TradeDirection,
} from 'uniswap-dapp-integration-shared';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'TransactionModal',
  props: ['logic', 'miningTransaction', 'miningTransactionStatus'],
  data() {
    return {
      TransactionStatus,
      TradeDirection,
    };
  },
});
</script>
