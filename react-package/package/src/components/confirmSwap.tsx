import React from 'react';
import {
  TradeContext,
  TradeDirection,
  UniswapDappSharedLogic,
  Utils as UniswapUtils
} from 'uniswap-dapp-integration-shared';
import TokenIcon from './tokenIcon';

const ConfirmSwap = ({
  uniswapDappSharedLogic,
  tradeContext,
}: {
  uniswapDappSharedLogic: UniswapDappSharedLogic;
  tradeContext: TradeContext | undefined;
}): JSX.Element => {
  const utils = UniswapUtils;

  return (
    <div>
      {uniswapDappSharedLogic.supportedNetwork && tradeContext && (
        <div id="uni-ic__modal-confirm-swap" className="uni-ic__modal">
          <div className="uni-ic__modal__content uni-ic__modal-confirm-swap uni-ic__theme-background">
            <span
              className="uni-ic__modal__close"
              onClick={() => uniswapDappSharedLogic.hideConfirmSwap()}
            >
              &times;
            </span>
            <p>Confirm swap</p>

            <div className="uni-ic__modal-confirm-swap__content">
              <div className="uni-ic__modal-confirm-swap__input-container uni-ic__theme-panel">
                <div className="uni-ic__modal-confirm-swap__input">
                  <div className="uni-ic__modal-confirm-swap__input-header">
                    <div className="uni-ic__modal-confirm-swap__input-header__text">
                      From
                    </div>
                    {uniswapDappSharedLogic.inputToken!.fiatPrice && (
                      <div className="uni-ic__modal-confirm-swap__input-header__price-container">
                        ~$
                        <span className="uni-ic__modal-confirm-swap__input-header__price">
                          {utils.formatCurrency(utils.toPrecision(
                            uniswapDappSharedLogic.inputToken!.fiatPrice.times(
                              tradeContext.baseConvertRequest,
                            ),
                          ))}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="uni-ic__modal-confirm-swap__input-main">
                    <div className="uni-ic__modal-confirm-swap__input-main__symbol">
                      <TokenIcon
                        classes="uni-ic__modal-confirm-swap__input-main__symbol__image"
                        tokenImageContext={
                          uniswapDappSharedLogic.inputToken.tokenImageContext
                        }
                      />
                      <div className="uni-ic__modal-confirm-swap__input-main__symbol__label">
                        {tradeContext.fromToken.symbol}
                      </div>
                    </div>
                    <div className="uni-ic__modal-confirm-swap__input-main__price">
                      <div className="uni-ic__modal-confirm-swap__input-main__price-text">
                        {tradeContext.quoteDirection ===
                          TradeDirection.input && (
                          <span>{tradeContext.baseConvertRequest}</span>
                        )}

                        {tradeContext.quoteDirection ===
                          TradeDirection.output && (
                          <span>{tradeContext.expectedConvertQuote}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="uni-ic__modal-confirm-swap__divider uni-ic__theme-panel">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#565A69"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <polyline points="19 12 12 19 5 12"></polyline>
                </svg>
              </div>
              <div className="uni-ic__modal-confirm-swap__output-container uni-ic__theme-panel">
                <div className="uni-ic__modal-confirm-swap__output">
                  <div className="uni-ic__modal-confirm-swap__output-header">
                    <div className="uni-ic__modal-confirm-swap__output-header__text">
                      To
                    </div>
                    {uniswapDappSharedLogic.outputToken?.fiatPrice && (
                      <div className="uni-ic__modal-confirm-swap__output-header__price-container">
                        ~$
                        <span className="uni-ic__modal-confirm-swap__output-header__price">
                          {utils.formatCurrency(utils.toPrecision(
                            uniswapDappSharedLogic.outputToken!.fiatPrice!.times(
                              tradeContext.expectedConvertQuote,
                            ),
                          ))}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="uni-ic__modal-confirm-swap__output-main">
                    <div className="uni-ic__modal-confirm-swap__output-main__symbol">
                      <TokenIcon
                        classes="uni-ic__modal-confirm-swap__output-main__symbol__image"
                        tokenImageContext={
                          uniswapDappSharedLogic.outputToken!.tokenImageContext
                        }
                      />

                      <div className="uni-ic__modal-confirm-swap__output-main__symbol__label">
                        {tradeContext.toToken.symbol}
                      </div>
                    </div>
                    <div className="uni-ic__modal-confirm-swap__output-main__price">
                      <div className="uni-ic__modal-confirm-swap__output-main__price-text">
                        {tradeContext.quoteDirection ===
                          TradeDirection.input && (
                          <span>{tradeContext.expectedConvertQuote}</span>
                        )}

                        {tradeContext.quoteDirection ===
                          TradeDirection.output && (
                          <span>{tradeContext.baseConvertRequest}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="uni-ic__modal-confirm-swap__price">
                <div className="uni-ic__modal-confirm-swap__price__title">
                  Price
                </div>
                <button className="uni-ic__modal-confirm-swap__price__rate-button">
                  <div className="uni-ic__modal-confirm-swap__price__rate">
                    <span>
                      1 {tradeContext.fromToken.symbol} ={' '}
                      {uniswapDappSharedLogic.workOutOneEqualTo()}{' '}
                      {tradeContext.toToken.symbol}
                    </span>
                  </div>
                </button>
              </div>
              <div className="uni-ic__modal-confirm-swap__info-container uni-ic__theme-panel">
                <div className="uni-ic__modal-confirm-swap__info">
                  <div className="uni-ic__modal-confirm-swap__info__item">
                    <div className="uni-ic__modal-confirm-swap__info__item__title">
                      <div className="uni-ic__modal-confirm-swap__info__item__title-content">
                        Liquidity Provider Fee
                      </div>
                    </div>
                    <div className="uni-ic__modal-confirm-swap__info__item__value">
                      {tradeContext.liquidityProviderFee}
                      {tradeContext.fromToken.symbol}
                    </div>
                  </div>
                  <div className="uni-ic__modal-confirm-swap__info__item">
                    <div className="uni-ic__modal-confirm-swap__info__item__title">
                      <div className="uni-ic__modal-confirm-swap__info__item__title-content">
                        Route
                      </div>
                    </div>
                    <div className="uni-ic__modal-confirm-swap__info__item__value">
                      {tradeContext.routeText}
                    </div>
                  </div>
                  {tradeContext.minAmountConvertQuote && (
                    <div className="uni-ic__modal-confirm-swap__info__item">
                      <div className="uni-ic__modal-confirm-swap__info__item__title">
                        <div className="uni-ic__modal-confirm-swap__info__item__title-content">
                          Minimum received
                        </div>
                      </div>
                      <div className="uni-ic__modal-confirm-swap__info__item__value">
                        {tradeContext.minAmountConvertQuote}
                        {tradeContext.toToken.symbol}
                      </div>
                    </div>
                  )}
                  {tradeContext.maximumSent && (
                    <div className="uni-ic__modal-confirm-swap__info__item">
                      <div className="uni-ic__modal-confirm-swap__info__item__title">
                        <div className="uni-ic__modal-confirm-swap__info__item__title-content">
                          Maximum sent
                        </div>
                      </div>
                      <div className="uni-ic__modal-confirm-swap__info__item__value">
                        {tradeContext.maximumSent}
                        {tradeContext.fromToken.symbol}
                      </div>
                    </div>
                  )}
                  <div className="uni-ic__modal-confirm-swap__info__item">
                    <div className="uni-ic__modal-confirm-swap__info__item__title">
                      <div className="uni-ic__modal-confirm-swap__info__item__title-content">
                        Slippage tolerance
                      </div>
                    </div>
                    <div className="uni-ic__modal-confirm-swap__info__item__value">
                      {uniswapDappSharedLogic.uniswapPairSettings.slippage *
                        100}
                      %
                    </div>
                  </div>
                  <div className="uni-ic__modal-confirm-swap__info__item">
                    <div className="uni-ic__modal-confirm-swap__info__item__title">
                      <div className="uni-ic__modal-confirm-swap__info__item__title-content">
                        Uniswap version
                      </div>
                    </div>
                    <div className="uni-ic__modal-confirm-swap__info__item__value">
                      {tradeContext.uniswapVersion}
                    </div>
                  </div>
                </div>
              </div>
              {uniswapDappSharedLogic.newPriceTradeContext && (
                <div className="uni-ic__modal-confirm-swap__price-updated-container">
                  <div className="uni-ic__modal-confirm-swap__price-updated">
                    <div className="uni-ic__modal-confirm-swap__price-updated__text">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                        <line x1="12" y1="9" x2="12" y2="13"></line>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                      </svg>
                      <div className="uni-ic__modal-confirm-swap__price-updated__text-content">
                        Price Updated
                      </div>
                    </div>
                    <button
                      className="uni-ic__modal-confirm-swap__price-updated__action uni-ic__theme-background-button"
                      onClick={() =>
                        uniswapDappSharedLogic!.acceptPriceChange()
                      }
                    >
                      Accept
                    </button>
                  </div>
                </div>
              )}
              <div className="uni-ic__modal-confirm-swap__output-info-container">
                <div className="uni-ic__modal-confirm-swap__output-info">
                  {tradeContext.minAmountConvertQuote && (
                    <span>
                      Output is estimated. You will receive at least{' '}
                      <b>
                        {tradeContext.minAmountConvertQuote}{' '}
                        {tradeContext.toToken.symbol}
                      </b>{' '}
                      or the transaction will revert.
                    </span>
                  )}
                  {tradeContext.maximumSent && (
                    <span>
                      Input is estimated. You will sell at most{' '}
                      <b>
                        {tradeContext.maximumSent}{' '}
                        {tradeContext.fromToken.symbol}
                      </b>{' '}
                      or the transaction will revert.
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="uni-ic__modal-confirm-swap__action-container">
              <div className="uni-ic__modal-confirm-swap__action">
                <button
                  id="confirm-swap-or-send"
                  className="uni-ic__modal-confirm-swap__action__button uni-ic__theme-background-button"
                  disabled={
                    uniswapDappSharedLogic.newPriceTradeContext !== undefined
                  }
                  onClick={() => uniswapDappSharedLogic!.swapTransaction()}
                >
                  <div className="uni-ic__modal-confirm-swap__action__button-text">
                    Confirm Swap
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfirmSwap;
