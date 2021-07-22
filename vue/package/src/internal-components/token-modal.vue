<template>
  <div id="uni-ic__modal-token" class="uni-ic__modal">
    <div
      class="uni-ic__modal__content uni-ic__modal-tokens uni-ic__theme-background"
    >
      <span class="uni-ic__modal__close" v-on:click="logic.hideTokenSelector()"
        >&times;</span
      >
      <p class="uni-ic__modal-tokens-title">
        Select a token
      </p>
      <div class="uni-ic__modal-tokens-search">
        <input
          type="text"
          placeholder="Search name or paste address"
          autocomplete="off"
          class="uni-ic__modal-tokens-search__input"
          v-model="searchToken"
          v-on:input="searchForToken"
        />
      </div>

      <div style="flex: 1 1 0%; position: relative">
        <div style="overflow: visible; height: 0px">
          <div
            style="
            position: relative;
            height: 210px;
            width: 100%;
            overflow: auto;
            will-change: transform;
            direction: ltr;
          "
          >
            <div style="height: 100%; width: 100%">
              <div
                v-for="token in logic.supportedTokenBalances"
                :key="token.contractAddress"
                v-on:click="changeSelectToken(token.contractAddress)"
                class="uni-ic__modal-tokens-item-container"
                v-bind:class="{
                  selected:
                    (token.contractAddress ===
                      logic.inputToken.contractAddress &&
                      selectorOpenFrom === 'input') ||
                    (token.contractAddress ===
                      logic.outputToken?.contractAddress &&
                      selectorOpenFrom === 'output'),
                }"
              >
                <div class="uni-ic__modal-tokens-item" v-if="token.canShow">
                  <TokenIcon
                    classes="uni-ic__modal-tokens-item-icon"
                    :context="token.tokenImageContext"
                  />

                  <div class="uni-ic__modal-tokens-item-content">
                    <div class="uni-ic__modal-tokens-item-content-symbol">
                      {{ token.symbol }}
                    </div>
                    <div class="uni-ic__modal-tokens-item-content-name">
                      {{ token.name }}
                    </div>
                  </div>
                  <span></span>
                  <div class="uni-ic__modal-tokens-item-balance-content">
                    <div
                      class="uni-ic__modal-tokens-item-balance-content-value"
                    >
                      {{ utils().toPrecision(token.balance) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="resize-triggers">
          <div class="expand-trigger">
            <div style="width: 419px; height: 211px"></div>
          </div>
          <div class="contract-trigger"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  SelectTokenActionFrom,
  Utils as UniswapUtils,
} from 'uniswap-dapp-integration-shared';
import { default as TokenIcon } from './token-icon.vue';

export default {
  name: 'TokenModal',
  components: {
    TokenIcon,
  },
  props: ['logic', 'tradeContext', 'selectorOpenFrom'],
  data() {
    return {
      searchToken: '',
      SelectTokenActionFrom,
    };
  },
  methods: {
    searchForToken() {
      this.logic.search(this.searchToken);
    },
    async changeSelectToken(contractAddress) {
      switch (this.selectorOpenFrom) {
        case this.SelectTokenActionFrom.input:
          if (
            this.tradeContext?.fromToken.contractAddress === contractAddress
          ) {
            this.logic.hideTokenSelector();
            return;
          }

          if (this.tradeContext?.toToken.contractAddress === contractAddress) {
            await this.logic.swapSwitch();
            this.logic.hideTokenSelector();
            return;
          }

          await this.logic.changeToken(contractAddress);
          return;
        case this.SelectTokenActionFrom.output:
          if (this.tradeContext?.toToken.contractAddress === contractAddress) {
            this.logic.hideTokenSelector();
            return;
          }

          if (
            this.tradeContext?.fromToken.contractAddress === contractAddress
          ) {
            await this.logic.swapSwitch();
            this.logic.hideTokenSelector();
            return;
          }

          await this.logic.changeToken(contractAddress);
      }
    },
    utils() {
      return UniswapUtils;
    },
  },
};
</script>
