import BigNumber from 'bignumber.js';
import React, { useEffect } from 'react';
import {
  SwapSwitchResponse,
  TradeDirection,
  UniswapDappSharedLogic,
  UniswapDappSharedLogicContext,
  Utils as UniswapUtils,
} from 'uniswap-dapp-integration-shared';
import { ExtendedToken } from 'uniswap-dapp-integration-shared/dist/token/models/extended-token';
import 'uniswap-dapp-integration-shared/styles/uniswap.css';
import Approval from './components/approval';
import ConfirmSwap from './components/confirmSwap';
import Header from './components/header';
import Loading from './components/loading';
import SwapQuoteInfo from './components/swapQuoteInfo';
import TokenIcon from './components/tokenIcon';
import TokensModal from './components/tokensModal';
import TransactionModal from './components/transactionModal';

let uniswapDappSharedLogic: undefined | UniswapDappSharedLogic;

const UniswapReact = ({
  uniswapDappSharedLogicContext,
}: {
  uniswapDappSharedLogicContext: UniswapDappSharedLogicContext;
}): JSX.Element => {
  const [loading, setLoading] = React.useState(true);
  const [inputToken, setInputToken] = React.useState<ExtendedToken>();
  const [inputBalance, setInputBalance] = React.useState<string | undefined>();
  const [inputValue, setInputValue] = React.useState('');
  const [outputToken, setOutputToken] = React.useState<ExtendedToken>();
  const [outputBalance, setOutputBalance] = React.useState<
    string | undefined
  >();
  const [outputValue, setOutputValue] = React.useState('');
  const [supportedNetwork, setSupportedNetwork] = React.useState(false);
  const [chainId, setChainId] = React.useState<number | undefined>();

  const utils = UniswapUtils;

  useEffect(() => {
    (async () => {
      const sharedLogic = new UniswapDappSharedLogic(
        uniswapDappSharedLogicContext,
      );

      if (uniswapDappSharedLogicContext.defaultInputValue) {
        setInputValue(uniswapDappSharedLogicContext.defaultInputValue);
      }

      await sharedLogic!.init();

      if (sharedLogic!.tradeContext?.expectedConvertQuote) {
        setOutputValue(sharedLogic!.tradeContext.expectedConvertQuote);
      }

      uniswapDappSharedLogic = sharedLogic;

      setSupportedNetwork(uniswapDappSharedLogic.supportedNetwork);
      uniswapDappSharedLogic.supportedNetwork$.subscribe((supported) => {
        setSupportedNetwork(supported);
      });

      setChainId(uniswapDappSharedLogic.chainId);
      uniswapDappSharedLogic.chainId$.subscribe((chainId) => {
        setChainId(chainId);
      });

      setInputToken(uniswapDappSharedLogic.inputToken);
      setInputBalance(
        utils.toPrecision(uniswapDappSharedLogic.inputToken.balance),
      );
      uniswapDappSharedLogic.inputToken$.subscribe((token) => {
        setInputToken(token);
        setInputBalance(utils.toPrecision(token.balance));
      });

      setOutputToken(uniswapDappSharedLogic.outputToken);
      if (uniswapDappSharedLogic.outputToken) {
        setOutputBalance(
          utils.toPrecision(uniswapDappSharedLogic.outputToken.balance),
        );
      }
      uniswapDappSharedLogic.outputToken$.subscribe((token) => {
        setOutputToken(token);
        setOutputBalance(utils.toPrecision(token.balance));
      });

      uniswapDappSharedLogic.newPriceTradeContextAvailable.subscribe(
        (tradeContext) => {
          if (tradeContext.quoteDirection === TradeDirection.input) {
            setOutputValue(tradeContext.expectedConvertQuote);
          } else {
            setInputValue(tradeContext.expectedConvertQuote);
          }
        },
      );

      setLoading(false);
      uniswapDappSharedLogic.loading.subscribe((loading) => {
        setLoading(loading);
      });
    })();
  }, []);

  const changeInputTradePrice = async (amount: string) => {
    setInputValue(amount);
    if (!amount || new BigNumber(amount).isEqualTo(0)) {
      setOutputValue('');
      return;
    }

    await uniswapDappSharedLogic!.changeTradePrice(
      amount,
      TradeDirection.input,
    );
    setOutputValue(uniswapDappSharedLogic!.tradeContext!.expectedConvertQuote);
  };

  const changeOutputTradePrice = async (amount: string) => {
    setOutputValue(amount);
    if (!amount || new BigNumber(amount).isEqualTo(0)) {
      setInputValue('');
      return;
    }

    await uniswapDappSharedLogic!.changeTradePrice(
      amount,
      TradeDirection.output,
    );

    setInputValue(uniswapDappSharedLogic!.tradeContext!.expectedConvertQuote);
  };

  const switchSwap = async () => {
    const swapState = await uniswapDappSharedLogic!.swapSwitch();
    setInputValue(swapState.inputValue);
    setOutputValue(swapState.outputValue);
  };

  return (
    <div className="uniswap-dapp-react">
      {loading && <Loading />}

      {!loading && uniswapDappSharedLogic && (
        <div>
          <div className="uni-ic uni-ic__theme-background">
            {supportedNetwork && inputToken && (
              <div>
                <Header uniswapDappSharedLogic={uniswapDappSharedLogic} />
                <div className="uni-ic__swap-container">
                  <div className="uni-ic__swap-content">
                    <div className="uni-ic__swap-input-container">
                      <div className="uni-ic__swap-input-content uni-ic__theme-panel">
                        <div className="uni-ic__swap-input-content-main">
                          <button
                            className="uni-ic__swap-input-content-main-from-currency-container uni-ic__theme-panel"
                            onClick={() =>
                              uniswapDappSharedLogic!.openTokenSelectorFrom()
                            }
                          >
                            <span className="uni-ic__swap-input-content-main-from-currency">
                              <TokenIcon
                                classes="uni-ic__swap-input-content-main-from-currency-icon"
                                tokenImageContext={inputToken.tokenImageContext}
                              />

                              <span className="uni-ic__swap-input-content-main-from-currency-symbol">
                                {inputToken.symbol}
                              </span>
                              <svg
                                width="12"
                                height="7"
                                viewBox="0 0 12 7"
                                fill="none"
                                className="uni-ic__swap-input-content-main-from-currency-choose"
                              >
                                <path
                                  d="M0.97168 1L6.20532 6L11.439 1"
                                  stroke="#AEAEAE"
                                ></path>
                              </svg>
                            </span>
                          </button>
                          <input
                            className="uni-ic__swap-input-content-main-from uni-ic__theme-panel"
                            autoComplete="off"
                            autoCorrect="off"
                            type="number"
                            step="any"
                            placeholder="0.0"
                            // onInput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                            maxLength={inputToken.decimals}
                            value={inputValue}
                            onChange={(e) => {
                              changeInputTradePrice(e.target.value);
                            }}
                            spellCheck="false"
                          />
                        </div>
                        <div className="uni-ic__swap-content-balance-and-price-container">
                          <div className="uni-ic__swap-content-balance-and-price">
                            <div className="uni-ic__swap-content-balance-and-price__balance">
                              <div className="uni-ic__swap-content-balance-and-price__balance-text">
                                <span>
                                  Balance: {inputBalance} {inputToken.symbol}
                                </span>
                              </div>
                            </div>
                            {inputValue && inputToken!.fiatPrice && (
                              <div className="uni-ic__swap-content-balance-and-price__price">
                                ~$
                                <span className="uni-ic__swap-content-balance-and-price__price-text">
                                  {utils.toPrecision(
                                    inputToken!.fiatPrice.times(inputValue),
                                  )}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      className="uni-ic__swap-divider uni-ic__theme-panel"
                      onClick={() => switchSwap()}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#000000"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <polyline points="19 12 12 19 5 12"></polyline>
                      </svg>
                    </div>

                    <div className="uni-ic__swap-output-container">
                      <div className="uni-ic__swap-output-content uni-ic__theme-panel">
                        <div className="uni-ic__swap-output-content-main">
                          <button
                            className="uni-ic__swap-output-content-main-select uni-ic__theme-panel"
                            onClick={() =>
                              uniswapDappSharedLogic!.openTokenSelectorTo()
                            }
                          >
                            {!outputToken && (
                              <span className="uni-ic__swap-output-content-main-select-content">
                                <span className="uni-ic__swap-output-content-main-select-content-title">
                                  Select a token
                                </span>
                                <svg
                                  width="12"
                                  height="7"
                                  viewBox="0 0 12 7"
                                  fill="none"
                                  className="uni-ic__swap-output-content-main-select-content-icon"
                                >
                                  <path
                                    d="M0.97168 1L6.20532 6L11.439 1"
                                    stroke="#AEAEAE"
                                  ></path>
                                </svg>
                              </span>
                            )}

                            {outputToken && (
                              <span className="uni-ic__swap-input-content-main-from-currency">
                                <TokenIcon
                                  classes="uni-ic__swap-input-content-main-from-currency-icon"
                                  tokenImageContext={
                                    outputToken.tokenImageContext
                                  }
                                />

                                <span className="uni-ic__swap-input-content-main-from-currency-symbol">
                                  {outputToken.symbol}
                                </span>
                                <svg
                                  width="12"
                                  height="7"
                                  viewBox="0 0 12 7"
                                  fill="none"
                                  className="uni-ic__swap-input-content-main-from-currency-choose"
                                >
                                  <path
                                    d="M0.97168 1L6.20532 6L11.439 1"
                                    stroke="#AEAEAE"
                                  ></path>
                                </svg>
                              </span>
                            )}
                          </button>
                          <input
                            className="uni-ic__swap-output-content-main-from uni-ic__theme-panel"
                            autoComplete="off"
                            autoCorrect="off"
                            type="number"
                            step="any"
                            placeholder="0.0"
                            // oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                            maxLength={outputToken?.decimals}
                            value={outputValue}
                            onChange={(e) => {
                              changeOutputTradePrice(e.target.value);
                            }}
                            spellCheck="false"
                          />
                        </div>
                        {outputToken && (
                          <div className="uni-ic__swap-content-balance-and-price-container">
                            <div className="uni-ic__swap-content-balance-and-price">
                              <div className="uni-ic__swap-content-balance-and-price__balance">
                                <div className="uni-ic__swap-content-balance-and-price__balance-text">
                                  <span>
                                    Balance: {outputBalance}{' '}
                                    {outputToken!.symbol}
                                  </span>
                                </div>
                              </div>
                              {outputValue && outputToken!.fiatPrice && (
                                <div className="uni-ic__swap-content-balance-and-price__price">
                                  ~$
                                  <span className="uni-ic__swap-content-balance-and-price__price-text">
                                    {utils.toPrecision(
                                      outputToken.fiatPrice.times(outputValue),
                                    )}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <SwapQuoteInfo
                    uniswapDappSharedLogic={uniswapDappSharedLogic}
                  />
                  <Approval uniswapDappSharedLogic={uniswapDappSharedLogic} />

                  <div className="uni-ic__swap-button-container">
                    <button
                      className="uni-ic__swap-button uni-ic__theme-background-button"
                      onClick={() => uniswapDappSharedLogic!.showConfirmSwap()}
                      disabled={
                        utils.isZero(outputValue) ||
                        uniswapDappSharedLogic.tradeContext
                          ?.hasEnoughAllowance === false ||
                        uniswapDappSharedLogic.tradeContext?.fromBalance
                          ?.hasEnough === false
                      }
                    >
                      <div className="uni-ic__swap-button-text">
                        {utils.isZero(outputValue) && (
                          <span>Enter an amount</span>
                        )}

                        {!utils.isZero(outputValue) &&
                          uniswapDappSharedLogic.tradeContext?.fromBalance
                            ?.hasEnough && <span>Swap</span>}

                        {!utils.isZero(outputValue) &&
                          !uniswapDappSharedLogic.tradeContext?.fromBalance
                            ?.hasEnough && (
                            <span>
                              Insufficient{' '}
                              {
                                uniswapDappSharedLogic.tradeContext?.fromToken
                                  ?.symbol
                              }{' '}
                              balance
                            </span>
                          )}
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {!supportedNetwork && (
              <div className="uni-ic__error">
                <p>
                  <strong>Chain id {chainId} is a unsupported network.</strong>
                </p>
              </div>
            )}
          </div>

          <TokensModal
            uniswapDappSharedLogic={uniswapDappSharedLogic}
            switchSwapCompleted={(swapCompleted: SwapSwitchResponse) => {
              setInputValue(swapCompleted.inputValue);
              setOutputValue(swapCompleted.outputValue);
            }}
          />

          <ConfirmSwap uniswapDappSharedLogic={uniswapDappSharedLogic} />

          <TransactionModal uniswapDappSharedLogic={uniswapDappSharedLogic} />
        </div>
      )}
    </div>
  );
};

export default UniswapReact;
