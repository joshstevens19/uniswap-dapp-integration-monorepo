<template>
  <div class="uni-ic__header-container">
    <div class="uni-ic__header-content">
      <div class="uni-ic__header-content-title">
        Swap
      </div>
      <div class="uni-ic__header-content-settings">
        <button
          class="uni-ic__header-content-settings-button"
          v-on:click="logic.toggleSettings()"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="sc-gbOuXE daxFHC"
          >
            <circle _ngcontent-exx-c45="" cx="12" cy="12" r="3"></circle>
            <path
              d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
            ></path>
          </svg>
        </button>

        <span
          class="uni-ic__settings-container uni-ic-hidden uni-ic__theme-panel"
          ><div class="uni-ic__settings">
            <div class="uni-ic__settings-transaction-title">
              Transaction Settings
            </div>
            <div class="uni-ic__settings-transaction">
              <div class="uni-ic__settings-transaction-slippage-container">
                <div class="uni-ic__settings-transaction-slippage">
                  <div class="uni-ic__settings-transaction-slippage-title">
                    Slippage tolerance
                  </div>
                  <span style="margin-left: 4px"
                    ><div style="display: inline">
                      <div class="uni-ic__settings-transaction-slippage-info">
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
                          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                          <line x1="12" y1="17" x2="12.01" y2="17"></line>
                        </svg>

                        <div class="uni-ic__tooltip-wrapper">
                          <div class="uni-ic__tooltip-container">
                            <div class="uni-ic__tooltip">
                              <span>
                                Your transaction will revert if the price
                                changes unfavourably by more then this
                                percentage.
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div></span
                  >
                </div>
                <div class="uni-ic__settings-transaction-slippage-options">
                  <button
                    class="uni-ic__settings-transaction-slippage-option"
                    v-on:click="setUniswapSlippage(0.1)"
                    v-bind:class="{
                      selected: slippage === 0.001,
                    }"
                  >
                    0.1%</button
                  ><button
                    class="uni-ic__settings-transaction-slippage-option"
                    v-on:click="setUniswapSlippage(0.5)"
                    v-bind:class="{
                      selected: slippage === 0.005,
                    }"
                  >
                    0.5%</button
                  ><button
                    class="uni-ic__settings-transaction-slippage-option"
                    v-on:click="setUniswapSlippage(1)"
                    v-bind:class="{
                      selected: slippage === 0.01,
                    }"
                  >
                    1%</button
                  ><button
                    tabindex="-1"
                    class="uni-ic__settings-transaction-slippage-manual"
                    v-bind:class="{
                      selected:
                        slippage !== 0.01 &&
                        slippage !== 0.005 &&
                        slippage !== 0.001,
                    }"
                  >
                    <div
                      class="uni-ic__settings-transaction-slippage-manual-content"
                    >
                      <input
                        placeholder="custom"
                        type="number"
                        step="any"
                        class="uni-ic__settings-transaction-slippage-manual-input"
                        v-model="slippageCustom"
                        v-on:input="setCustomSlippage"
                      />%
                    </div>
                  </button>
                </div>
                <div class="uni-ic__settings-transaction-slippage-warning">
                  <span v-if="slippage > 0.01"
                    >Your transaction may be frontrun</span
                  >
                  <span v-if="0.0005 > slippage"
                    >Your transaction may fail</span
                  >
                </div>
              </div>
              <div class="uni-ic__settings-transaction-deadline-container">
                <div class="uni-ic__settings-transaction-deadline">
                  <div class="uni-ic__settings-transaction-deadline-title">
                    Transaction deadline
                  </div>
                  <span style="margin-left: 4px"
                    ><div style="display: inline">
                      <div class="uni-ic__settings-transaction-deadline-info">
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
                          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                          <line x1="12" y1="17" x2="12.01" y2="17"></line>
                        </svg>
                        <div class="uni-ic__tooltip-wrapper">
                          <div class="uni-ic__tooltip-container">
                            <div class="uni-ic__tooltip">
                              <span>
                                The transaction will revert if it is pending for
                                more than this period of time.
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div></span
                  >
                </div>
                <div class="uni-ic__settings-transaction-deadline-minute">
                  <button
                    tabindex="-1"
                    class="uni-ic__settings-transaction-deadline-minute-button"
                  >
                    <input
                      placeholder="20"
                      class="uni-ic__settings-transaction-deadline-minute-input"
                      type="number"
                      min="1"
                      step="1"
                      v-model="transactionDeadline"
                      v-on:input="setTransactionDeadline"
                    />
                  </button>
                  <div
                    class="uni-ic__settings-transaction-deadline-minute-label"
                  >
                    minutes
                  </div>
                </div>
              </div>
            </div>
            <div class="uni-ic__settings-interface-header">
              Interface Settings
            </div>
            <div class="uni-ic__settings-interface-multihops-container">
              <div class="uni-ic__settings-interface-multihops-text-container">
                <div class="uni-ic__settings-interface-multihops-text">
                  Disable Multihops
                </div>
                <span style="margin-left: 4px"
                  ><div style="display: inline-block">
                    <div class="uni-ic__settings-interface-multihops-text-info">
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
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                      </svg>
                      <div class="uni-ic__tooltip-wrapper">
                        <div class="uni-ic__tooltip-container">
                          <div class="uni-ic__tooltip">
                            <span>Restricts swap to direct pairs only </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div></span
                >
              </div>
              <button class="uni-ic__settings-interface-multihops-actions">
                <span
                  class="uni-ic__settings-interface-multihops-actions-on"
                  v-on:click="setDisableMultihops(true)"
                  v-bind:class="{
                    selected: disableMultihops,
                  }"
                  >On</span
                ><span
                  class="uni-ic__settings-interface-multihops-actions-off"
                  v-bind:class="{
                    selected: !disableMultihops,
                  }"
                  v-on:click="setDisableMultihops(false)"
                  >Off</span
                >
              </button>
            </div>
          </div></span
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Header',
  props: ['logic'],
  data() {
    return {
      slippageCustom: undefined,
      transactionDeadline: undefined,
      disableMultihops: this.logic.uniswapPairSettings.disableMultihops,
      slippage: this.logic.uniswapPairSettings.slippage,
    };
  },
  methods: {
    async setDisableMultihops(value) {
      this.disableMultihops = value;
      let thrownError = false;
      try {
        await this.logic.setDisableMultihops(value);
      } catch (error) {
        thrownError = true;
      }

      this.$emit('disableMultihopsCompleted', thrownError);
    },
    async setUniswapSlippage(slippageAmount, isCustom) {
      if (slippageAmount === 0) {
        slippageAmount = 0.5;
      }
      await this.logic.setSlippage(slippageAmount);
      this.slippage = slippageAmount / 100;
      if (isCustom) {
        this.slippageCustom = slippageAmount;
      }
    },
    async setCustomSlippage() {
      await this.setUniswapSlippage(Number(this.slippageCustom), true);
    },
    async setTransactionDeadline() {
      await this.logic.setTransactionDeadline(deadline);
    },
  },
};
</script>
