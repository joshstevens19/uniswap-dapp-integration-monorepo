import React from 'react';
import {
  TradeContext,
  UniswapDappSharedLogic,
} from 'uniswap-dapp-integration-shared';

const SwapQuoteInfo = ({
  uniswapDappSharedLogic,
  tradeContext,
}: {
  uniswapDappSharedLogic: UniswapDappSharedLogic;
  tradeContext: TradeContext | undefined;
}): JSX.Element => {
  return (
    <div>
      {tradeContext && (
        <div className="uni-ic__swap-quote">
          <div className="uni-ic__swap-quote-container">
            <div className="uni-ic__swap-quote-price">
              <div
                color="text"
                className="uni-ic__swap-quote-price-text"
                style={{
                  padding: '0.1rem 0.5rem 0.1rem 0.35rem',
                  fontSize: '14px',
                }}
              >
                <span>Best rate on {tradeContext.uniswapVersion}</span>
              </div>
              <div
                color="text"
                className="uni-ic__swap-quote-price-text"
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  display: 'flex',
                  fontSize: '14px',
                }}
              >
                <span>
                  1 {tradeContext!.fromToken.symbol} ={' '}
                  {uniswapDappSharedLogic.workOutOneEqualTo()}{' '}
                  {tradeContext!.toToken.symbol}
                </span>
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
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
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
                            {tradeContext.liquidityProviderFee}{' '}
                            {tradeContext.fromToken.symbol}
                          </div>
                        </div>
                        <div className="uni-ic__tooltip__item">
                          <div className="uni-ic__tooltip__item__title">
                            <div className="uni-ic__tooltip__item__title__content">
                              Route
                            </div>
                          </div>
                          <div className="uni-ic__tooltip__item__value">
                            {tradeContext.routeText}
                          </div>
                        </div>
                        {tradeContext.minAmountConvertQuote && (
                          <div className="uni-ic__tooltip__item">
                            <div className="uni-ic__tooltip__item__title">
                              <div className="uni-ic__tooltip__item__title__content">
                                Minimum received
                              </div>
                            </div>
                            <div className="uni-ic__tooltip__item__value">
                              {tradeContext.minAmountConvertQuote}{' '}
                              {tradeContext.toToken.symbol}
                            </div>
                          </div>
                        )}
                        {tradeContext.maximumSent && (
                          <div className="uni-ic__tooltip__item">
                            <div className="uni-ic__tooltip__item__title">
                              <div className="uni-ic__tooltip__item__title__content">
                                Maximum sent
                              </div>
                            </div>
                            <div className="uni-ic__tooltip__item__value">
                              {tradeContext.maximumSent}{' '}
                              {tradeContext.fromToken.symbol}
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
