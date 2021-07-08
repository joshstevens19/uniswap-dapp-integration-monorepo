import React from 'react';
import {
  TradeDirection,
  UniswapDappSharedLogic,
  Utils as UniswapUtils,
} from 'uniswap-dapp-integration-shared';

const ConfirmSwap = ({
  uniswapDappSharedLogic,
}: {
  uniswapDappSharedLogic: UniswapDappSharedLogic;
}): JSX.Element => {
  const utils = UniswapUtils;

  return (
    <div>
      {uniswapDappSharedLogic.supportedNetwork &&
        uniswapDappSharedLogic.tradeContext && (
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
                            {utils.toPrecision(
                              uniswapDappSharedLogic.inputToken!.fiatPrice.times(
                                uniswapDappSharedLogic.tradeContext
                                  .baseConvertRequest,
                              ),
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="uni-ic__modal-confirm-swap__input-main">
                      <div className="uni-ic__modal-confirm-swap__input-main__symbol">
                        {!uniswapDappSharedLogic.inputToken.tokenImageContext
                          .isSvg && (
                          <img
                            src={
                              uniswapDappSharedLogic.inputToken
                                .tokenImageContext.image
                            }
                            className="uni-ic__modal-confirm-swap__input-main__symbol__image"
                            style={{ marginRight: '12px' }}
                          />
                        )}
                        {uniswapDappSharedLogic.inputToken.tokenImageContext
                          .isSvg && (
                          <div
                            className="uni-ic__modal-confirm-swap__input-main__symbol__image"
                            style={{ marginRight: '12px' }}
                          >
                            {
                              uniswapDappSharedLogic.inputToken
                                .tokenImageContext.image
                            }
                          </div>
                        )}
                        <div className="uni-ic__modal-confirm-swap__input-main__symbol__label">
                          {uniswapDappSharedLogic.tradeContext.fromToken.symbol}
                        </div>
                      </div>
                      <div className="uni-ic__modal-confirm-swap__input-main__price">
                        <div className="uni-ic__modal-confirm-swap__input-main__price-text">
                          {uniswapDappSharedLogic.tradeContext
                            .quoteDirection === TradeDirection.input && (
                            <span>
                              {
                                uniswapDappSharedLogic.tradeContext
                                  .baseConvertRequest
                              }
                            </span>
                          )}

                          {uniswapDappSharedLogic.tradeContext
                            .quoteDirection === TradeDirection.output && (
                            <span>
                              {
                                uniswapDappSharedLogic.tradeContext
                                  .expectedConvertQuote
                              }
                            </span>
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
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <polyline points="19 12 12 19 5 12"></polyline>
                  </svg>
                </div>
                <div
                  className="uni-ic__modal-confirm-swap__output-container uni-ic__theme-panel"
                  style={{ marginBottom: '0.25rem' }}
                >
                  <div className="uni-ic__modal-confirm-swap__output">
                    <div className="uni-ic__modal-confirm-swap__output-header">
                      <div className="uni-ic__modal-confirm-swap__output-header__text">
                        To
                      </div>
                      {uniswapDappSharedLogic.outputToken?.fiatPrice && (
                        <div className="uni-ic__modal-confirm-swap__output-header__price-container">
                          ~$
                          <span className="uni-ic__modal-confirm-swap__output-header__price">
                            {utils.toPrecision(
                              uniswapDappSharedLogic.outputToken!.fiatPrice!.times(
                                uniswapDappSharedLogic.tradeContext
                                  .expectedConvertQuote,
                              ),
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="uni-ic__modal-confirm-swap__output-main">
                      <div className="uni-ic__modal-confirm-swap__output-main__symbol">
                        {!uniswapDappSharedLogic.outputToken!.tokenImageContext
                          .isSvg && (
                          <img
                            className="uni-ic__modal-confirm-swap__output-main__symbol__image"
                            src={
                              uniswapDappSharedLogic.outputToken!
                                .tokenImageContext.image
                            }
                            style={{ marginRight: '12px' }}
                          />
                        )}

                        {uniswapDappSharedLogic.outputToken!.tokenImageContext
                          .isSvg && (
                          <div
                            className="uni-ic__modal-confirm-swap__output-main__symbol__image"
                            style={{ marginRight: '12px' }}
                          >
                            {
                              uniswapDappSharedLogic.outputToken!
                                .tokenImageContext.image
                            }
                          </div>
                        )}

                        <div className="uni-ic__modal-confirm-swap__output-main__symbol__label">
                          {uniswapDappSharedLogic.tradeContext.toToken.symbol}
                        </div>
                      </div>
                      <div className="uni-ic__modal-confirm-swap__output-main__price">
                        <div className="uni-ic__modal-confirm-swap__output-main__price-text">
                          {uniswapDappSharedLogic.tradeContext
                            .quoteDirection === TradeDirection.input && (
                            <span>
                              {
                                uniswapDappSharedLogic.tradeContext
                                  .expectedConvertQuote
                              }
                            </span>
                          )}

                          {uniswapDappSharedLogic.tradeContext
                            .quoteDirection === TradeDirection.output && (
                            <span>
                              {
                                uniswapDappSharedLogic.tradeContext
                                  .baseConvertRequest
                              }
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="uni-ic__modal-confirm-swap__price"
                  style={{ marginTop: '0.25rem', padding: '0px 1rem' }}
                >
                  <div className="uni-ic__modal-confirm-swap__price__title">
                    Price
                  </div>
                  <button className="uni-ic__modal-confirm-swap__price__rate-button">
                    <div
                      style={{
                        alignItems: 'center',
                        display: 'flex',
                        width: 'fit-content',
                      }}
                    >
                      <div className="uni-ic__modal-confirm-swap__price__rate">
                        1{uniswapDappSharedLogic.tradeContext.fromToken.symbol}{' '}
                        ={uniswapDappSharedLogic.workOutOneEqualTo()}
                        {uniswapDappSharedLogic.tradeContext.toToken.symbol}
                      </div>
                    </div>
                  </button>
                </div>
                <div
                  className="uni-ic__modal-confirm-swap__info-container uni-ic__theme-panel"
                  style={{ marginTop: '0.5rem', padding: '0.75rem' }}
                >
                  <div className="uni-ic__modal-confirm-swap__info">
                    <div className="uni-ic__modal-confirm-swap__info__item">
                      <div className="uni-ic__modal-confirm-swap__info__item__title">
                        <div className="uni-ic__modal-confirm-swap__info__item__title-content">
                          Liquidity Provider Fee
                        </div>
                      </div>
                      <div className="uni-ic__modal-confirm-swap__info__item__value">
                        {
                          uniswapDappSharedLogic.tradeContext
                            .liquidityProviderFee
                        }
                        {uniswapDappSharedLogic.tradeContext.fromToken.symbol}
                      </div>
                    </div>
                    <div className="uni-ic__modal-confirm-swap__info__item">
                      <div className="uni-ic__modal-confirm-swap__info__item__title">
                        <div className="uni-ic__modal-confirm-swap__info__item__title-content">
                          Route
                        </div>
                      </div>
                      <div className="uni-ic__modal-confirm-swap__info__item__value">
                        {uniswapDappSharedLogic.tradeContext.routeText}
                      </div>
                    </div>
                    {uniswapDappSharedLogic.tradeContext
                      .minAmountConvertQuote && (
                      <div className="uni-ic__modal-confirm-swap__info__item">
                        <div className="uni-ic__modal-confirm-swap__info__item__title">
                          <div className="uni-ic__modal-confirm-swap__info__item__title-content">
                            Minimum received
                          </div>
                        </div>
                        <div className="uni-ic__modal-confirm-swap__info__item__value">
                          {
                            uniswapDappSharedLogic.tradeContext
                              .minAmountConvertQuote
                          }
                          {uniswapDappSharedLogic.tradeContext.toToken.symbol}
                        </div>
                      </div>
                    )}
                    {uniswapDappSharedLogic.tradeContext.maximumSent && (
                      <div className="uni-ic__modal-confirm-swap__info__item">
                        <div className="uni-ic__modal-confirm-swap__info__item__title">
                          <div className="uni-ic__modal-confirm-swap__info__item__title-content">
                            Maximum sent
                          </div>
                        </div>
                        <div className="uni-ic__modal-confirm-swap__info__item__value">
                          {uniswapDappSharedLogic.tradeContext.maximumSent}
                          {uniswapDappSharedLogic.tradeContext.fromToken.symbol}
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
                        {uniswapDappSharedLogic.tradeContext.uniswapVersion}
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
                          style={{ marginRight: '8px', minWidth: '24px' }}
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
                        style={{
                          padding: '0.5rem',
                          width: 'fit-content',
                          fontSize: '0.825rem',
                          borderRadius: '12px',
                        }}
                      >
                        Accept
                      </button>
                    </div>
                  </div>
                )}
                <div
                  className="uni-ic__modal-confirm-swap__output-info-container"
                  style={{ padding: '0.75rem 1rem', minWidth: '24px' }}
                >
                  <div
                    className="uni-ic__modal-confirm-swap__output-info"
                    style={{ width: '100%', minWidth: '24px' }}
                  >
                    {uniswapDappSharedLogic.tradeContext
                      .minAmountConvertQuote && (
                      <span>
                        Output is estimated. You will receive at least
                        <b>
                          {
                            uniswapDappSharedLogic.tradeContext
                              .minAmountConvertQuote
                          }
                          {uniswapDappSharedLogic.tradeContext.toToken.symbol}
                        </b>
                        or the transaction will revert.
                      </span>
                    )}
                    {uniswapDappSharedLogic.tradeContext.maximumSent && (
                      <span>
                        Input is estimated. You will sell at most
                        <b>
                          {uniswapDappSharedLogic.tradeContext.maximumSent}
                          {uniswapDappSharedLogic.tradeContext.fromToken.symbol}
                        </b>
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
                    style={{ margin: '10px 0px 0px' }}
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
