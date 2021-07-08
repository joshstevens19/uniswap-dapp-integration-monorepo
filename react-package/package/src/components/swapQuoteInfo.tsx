import React from 'react';
import { UniswapDappSharedLogic } from 'uniswap-dapp-integration-shared';

const SwapQuoteInfo = ({
  uniswapDappSharedLogic,
}: {
  uniswapDappSharedLogic: UniswapDappSharedLogic;
}): JSX.Element => {
  return (
    <div>
      {uniswapDappSharedLogic.tradeContext && (
        <div className="uni-ic__swap-quote">
          <div className="uni-ic__swap-quote-container">
            <div className="uni-ic__swap-quote-price">
              <div
                font-size="14px"
                color="text"
                className="uni-ic__swap-quote-price-text"
                style={{ padding: '0.1rem 0.5rem 0.1rem 0.35rem' }}
              >
                Best rate on
                {uniswapDappSharedLogic.tradeContext.uniswapVersion}
              </div>
              <div
                font-size="14px"
                color="text"
                className="uni-ic__swap-quote-price-text"
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  display: 'flex',
                }}
              >
                1{uniswapDappSharedLogic.tradeContext!.fromToken.symbol} =
                {uniswapDappSharedLogic.workOutOneEqualTo()}
                {uniswapDappSharedLogic.tradeContext!.toToken.symbol}
                <div className="uni-ic__swap-quote-price-text-info">
                  <div
                    style={{
                      padding: '0.25rem',
                      lineHeight: '0',
                      display: 'inline-block',
                    }}
                  >
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

                  <div
                    className="uni-ic__tooltip-wrapper"
                    style={{
                      right: '10px',
                    }}
                  >
                    <div className="uni-ic__tooltip-container">
                      <div className="uni-ic__tooltip">
                        <div className="uni-ic__tooltip__item">
                          <div className="uni-ic__tooltip__item__title">
                            <div className="uni-ic__tooltip__item__title__content">
                              Liquidity Provider Fee
                            </div>
                          </div>
                          <div className="uni-ic__tooltip__item__value">
                            {
                              uniswapDappSharedLogic.tradeContext
                                .liquidityProviderFee
                            }
                            {
                              uniswapDappSharedLogic.tradeContext.fromToken
                                .symbol
                            }
                          </div>
                        </div>
                        <div className="uni-ic__tooltip__item">
                          <div className="uni-ic__tooltip__item__title">
                            <div className="uni-ic__tooltip__item__title__content">
                              Route
                            </div>
                          </div>
                          <div className="uni-ic__tooltip__item__value">
                            {uniswapDappSharedLogic.tradeContext.routeText}
                          </div>
                        </div>
                        {uniswapDappSharedLogic.tradeContext
                          .minAmountConvertQuote && (
                          <div className="uni-ic__tooltip__item">
                            <div className="uni-ic__tooltip__item__title">
                              <div className="uni-ic__tooltip__item__title__content">
                                Minimum received
                              </div>
                            </div>
                            <div className="uni-ic__tooltip__item__value">
                              {
                                uniswapDappSharedLogic.tradeContext
                                  .minAmountConvertQuote
                              }
                              {
                                uniswapDappSharedLogic.tradeContext.toToken
                                  .symbol
                              }
                            </div>
                          </div>
                        )}
                        {uniswapDappSharedLogic.tradeContext.maximumSent && (
                          <div className="uni-ic__tooltip__item">
                            <div className="uni-ic__tooltip__item__title">
                              <div className="uni-ic__tooltip__item__title__content">
                                Maximum sent
                              </div>
                            </div>
                            <div className="uni-ic__tooltip__item__value">
                              {uniswapDappSharedLogic.tradeContext.maximumSent}
                              {
                                uniswapDappSharedLogic.tradeContext.fromToken
                                  .symbol
                              }
                            </div>
                          </div>
                        )}
                        <div className="uni-ic__tooltip__item">
                          <div className="uni-ic__tooltip__item__title">
                            <div className="uni-ic__tooltip__item__title__content">
                              Slippage tolerance
                            </div>
                          </div>
                          <div className="uni-ic__tooltip__item__value">
                            {uniswapDappSharedLogic.uniswapPairSettings
                              .slippage * 100}
                            %
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
      )}
    </div>
  );
};

export default SwapQuoteInfo;
