import React from 'react';
import {
  SelectTokenActionFrom,
  SwapSwitchResponse,
  TradeContext,
  UniswapDappSharedLogic,
  Utils as UniswapUtils,
} from 'uniswap-dapp-integration-shared';
import TokenIcon from './tokenIcon';

const TokensModal = ({
  uniswapDappSharedLogic,
  switchSwapCompleted,
  selectorOpenFrom,
  tradeContext,
}: {
  uniswapDappSharedLogic: UniswapDappSharedLogic;
  switchSwapCompleted: (swapSwitchResponse: SwapSwitchResponse) => void;
  selectorOpenFrom: SelectTokenActionFrom;
  tradeContext: TradeContext | undefined;
}): JSX.Element => {
  const [searchToken, setSearchToken] = React.useState('');

  const searchForToken = (search: string) => {
    setSearchToken(search);
    uniswapDappSharedLogic.searchToken(search);
  };

  const changeSelectToken = async (contractAddress: string) => {
    switch (selectorOpenFrom) {
      case SelectTokenActionFrom.input:
        if (tradeContext?.fromToken.contractAddress === contractAddress) {
          uniswapDappSharedLogic.hideTokenSelector();
          return;
        }

        if (tradeContext?.toToken.contractAddress === contractAddress) {
          const swapResponse = await uniswapDappSharedLogic.swapSwitch();
          switchSwapCompleted(swapResponse);
          uniswapDappSharedLogic.hideTokenSelector();
          return;
        }
        await uniswapDappSharedLogic.changeToken(contractAddress);
        return;
      case SelectTokenActionFrom.output:
        if (tradeContext?.toToken.contractAddress === contractAddress) {
          uniswapDappSharedLogic.hideTokenSelector();
          return;
        }

        if (tradeContext?.fromToken.contractAddress === contractAddress) {
          const swapResponse = await uniswapDappSharedLogic.swapSwitch();
          switchSwapCompleted(swapResponse);
          uniswapDappSharedLogic.hideTokenSelector();
          return;
        }

        await uniswapDappSharedLogic.changeToken(contractAddress);
    }
  };

  const utils = UniswapUtils;

  return (
    <div>
      {uniswapDappSharedLogic.supportedNetwork && (
        <div id="uni-ic__modal-token" className="uni-ic__modal">
          <div className="uni-ic__modal__content uni-ic__modal-tokens uni-ic__theme-background">
            <span
              className="uni-ic__modal__close"
              onClick={() => uniswapDappSharedLogic.hideTokenSelector()}
            >
              &times;
            </span>
            <p className="uni-ic__modal-tokens-title">Select a token</p>
            <div className="uni-ic__modal-tokens-search">
              <input
                type="text"
                placeholder="Search name or paste address"
                className="uni-ic__modal-tokens-search__input"
                value={searchToken}
                onChange={(e) => {
                  searchForToken(e.target.value);
                }}
              />
            </div>
            <div style={{ flex: '1 1 0%', position: 'relative' }}>
              <div style={{ overflow: 'visible', height: '0px' }}>
                <div
                  style={{
                    position: 'relative',
                    height: '210px',
                    width: '100%',
                    overflow: 'auto',
                    willChange: 'transform',
                    direction: 'ltr',
                  }}
                >
                  <div style={{ height: '100%', width: '100%' }}>
                    {uniswapDappSharedLogic.supportedTokenBalances.map(
                      (token) => (
                        <div
                          key={token.name}
                          onClick={() =>
                            changeSelectToken(token.contractAddress)
                          }
                          className={`uni-ic__modal-tokens-item-container ${
                            (token.contractAddress ===
                              uniswapDappSharedLogic.inputToken
                                .contractAddress &&
                              selectorOpenFrom === 'input') ||
                            (token.contractAddress ===
                              uniswapDappSharedLogic.outputToken
                                ?.contractAddress &&
                              selectorOpenFrom === 'output')
                              ? 'selected'
                              : ''
                          }`}
                        >
                          {token.canShow && (
                            <div className="uni-ic__modal-tokens-item">
                              <TokenIcon
                                classes="uni-ic__modal-tokens-item-icon"
                                tokenImageContext={token.tokenImageContext}
                              />

                              <div className="uni-ic__modal-tokens-item-content">
                                <div className="uni-ic__modal-tokens-item-content-symbol">
                                  {token.symbol}
                                </div>
                                <div className="uni-ic__modal-tokens-item-content-name">
                                  {token.name}
                                </div>
                              </div>

                              <span></span>

                              <div className="uni-ic__modal-tokens-item-balance-content">
                                <div className="uni-ic__modal-tokens-item-balance-content-value">
                                  {utils.toPrecision(token.balance)}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>
              <div className="resize-triggers">
                <div className="expand-trigger">
                  <div style={{ width: '419px', height: '211px' }}></div>
                </div>
                <div className="contract-trigger"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TokensModal;
