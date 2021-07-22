<script>
import { default as TokenIcon } from './token-icon.vue';

export default {
  name: 'Approval',
  components: {
    TokenIcon,
  },
  props: ['logic', 'tradeContext'],
};
</script>

<template>
  <button
    class="uni-ic__swap-allow uni-ic__theme-background-button"
    v-if="
      tradeContext &&
        tradeContext.approvalTransaction &&
        tradeContext.fromBalance?.hasEnough
    "
    v-on:click="logic.approveAllowance()"
  >
    <div class="uni-ic__swap-allow-container">
      <span>
        <TokenIcon
          classes="uni-ic__swap-allow-icon"
          :context="logic.inputToken.tokenImageContext"
        />

        <span
          v-if="
            logic.miningTransaction === undefined ||
              logic.miningTransaction?.status === transactionStatus.rejected
          "
          >You must give the Uniswap smart contract permisson to use your
          {{ tradeContext.fromToken.symbol }}. You only have to do this once per
          token per uniswap version. Click here to approve the permissons.
        </span>

        <span
          v-if="
            logic.miningTransaction?.status ===
              transactionStatus.waitingForConfirmation
          "
          >Waiting for confirmation....</span
        >
        <span
          v-if="logic.miningTransaction?.status === transactionStatus.mining"
          >Waiting for your transaction to be mined...</span
        >
      </span>
    </div>
  </button>
</template>
