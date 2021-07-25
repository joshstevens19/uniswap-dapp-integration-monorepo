import React from 'react';
import { UniswapDappSharedLogic } from 'uniswap-dapp-integration-shared';

const Header = ({
  uniswapDappSharedLogic,
  disableMultihopsCompleted
}: {
  uniswapDappSharedLogic: UniswapDappSharedLogic;
  disableMultihopsCompleted: (noLiquidityFound: boolean) => void;
}): JSX.Element => {
  const [slippageCustom, setSlippageCustom] = React.useState<
    undefined | number
  >(undefined);
  const [transactionDeadline, setTransactionDeadline] = React.useState<
    undefined | number
  >(uniswapDappSharedLogic.uniswapPairSettings.deadlineMinutes);
  const [slippage, setSlippage] = React.useState<number>(
    uniswapDappSharedLogic.uniswapPairSettings.slippage,
  );
  const [disableMultihops, setDisableMultihops] = React.useState<boolean>(
    uniswapDappSharedLogic.uniswapPairSettings.disableMultihops,
  );

  const setUniswapSlippage = async (
    slippageAmount: number,
    isCustom: boolean = false,
  ) => {
    if (slippageAmount === 0) {
      slippageAmount = 0.5;
    }
    await uniswapDappSharedLogic.setSlippage(slippageAmount);
    setSlippage(slippageAmount / 100);
    if (isCustom) {
      setSlippageCustom(slippage);
    }
  };

  const setUniswapTransactionDeadline = async (deadline: number) => {
    await uniswapDappSharedLogic.setTransactionDeadline(deadline);
    setTransactionDeadline(deadline);
  };

  const setUniswapDisableMultihops = async (isDisabled: boolean) => {
    let thrownError = false;
    try {
      await uniswapDappSharedLogic.setDisableMultihops(isDisabled);
    } catch(error) {
      thrownError = true;
    }
    setDisableMultihops(isDisabled);

    disableMultihopsCompleted(thrownError);
  };

  return (
    <div className="uni-ic__header-container">
      <div className="uni-ic__header-content">
        <div className="uni-ic__header-content-title">Swap</div>
        <div className="uni-ic__header-content-settings">
          <button
            className="uni-ic__header-content-settings-button"
            onClick={() => uniswapDappSharedLogic.toggleSettings()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="sc-gbOuXE daxFHC"
            >
              <circle _ngcontent-exx-c45="" cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          </button>

          <span className="uni-ic__settings-container uni-ic-hidden uni-ic__theme-panel">
            <div className="uni-ic__settings">
              <div className="uni-ic__settings-transaction-title">
                Transaction Settings
              </div>
              <div className="uni-ic__settings-transaction">
                <div className="uni-ic__settings-transaction-slippage-container">
                  <div className="uni-ic__settings-transaction-slippage">
                    <div className="uni-ic__settings-transaction-slippage-title">
                      Slippage tolerance
                    </div>
                    <span style={{ marginLeft: '4px' }}>
                      <div style={{ display: 'inline' }}>
                        <div className="uni-ic__settings-transaction-slippage-info">
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
                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                          </svg>

                          <div className="uni-ic__tooltip-wrapper">
                            <div className="uni-ic__tooltip-container">
                              <div className="uni-ic__tooltip">
                                <span>
                                  Your transaction will revert if the price
                                  changes unfavourably by more then this
                                  percentage.
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </span>
                  </div>

                  <div className="uni-ic__settings-transaction-slippage-options">
                    <button
                      className={`uni-ic__settings-transaction-slippage-option ${
                        slippage === 0.001 ? 'selected' : ''
                      }`}
                      onClick={() => setUniswapSlippage(0.1)}
                    >
                      0.1%
                    </button>

                    <button
                      className={`uni-ic__settings-transaction-slippage-option ${
                        slippage === 0.005 ? 'selected' : ''
                      }`}
                      onClick={() => setUniswapSlippage(0.5)}
                    >
                      0.5%
                    </button>
                    <button
                      className={`uni-ic__settings-transaction-slippage-option ${
                        slippage === 0.01 ? 'selected' : ''
                      }`}
                      onClick={() => setUniswapSlippage(1)}
                    >
                      1%
                    </button>
                    <button
                      className={`uni-ic__settings-transaction-slippage-manual ${
                        slippage !== 0.01 &&
                        slippage !== 0.005 &&
                        slippage !== 0.001
                          ? 'selected'
                          : ''
                      }`}
                    >
                      <div className="uni-ic__settings-transaction-slippage-manual-content">
                        <input
                          placeholder="custom"
                          type="number"
                          step="any"
                          className="uni-ic__settings-transaction-slippage-manual-input"
                          value={slippageCustom}
                          onChange={(e) => {
                            setUniswapSlippage(Number(e.target.value));
                          }}
                        />
                        %
                      </div>
                    </button>
                  </div>
                  <div className="uni-ic__settings-transaction-slippage-warning">
                    {slippage > 0.01 && (
                      <span>Your transaction may be frontrun</span>
                    )}
                    {0.0005 > slippage && (
                      <span>Your transaction may fail</span>
                    )}
                  </div>
                </div>
                <div className="uni-ic__settings-transaction-deadline-container">
                  <div className="uni-ic__settings-transaction-deadline">
                    <div className="uni-ic__settings-transaction-deadline-title">
                      Transaction deadline
                    </div>
                    <span style={{ marginLeft: '4px' }}>
                      <div style={{ display: 'inline' }}>
                        <div className="uni-ic__settings-transaction-deadline-info">
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
                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                          </svg>
                          <div className="uni-ic__tooltip-wrapper">
                            <div className="uni-ic__tooltip-container">
                              <div className="uni-ic__tooltip">
                                <span>
                                  The transaction will revert if it is pending
                                  for more than this period of time.
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </span>
                  </div>
                  <div className="uni-ic__settings-transaction-deadline-minute">
                    <button className="uni-ic__settings-transaction-deadline-minute-button">
                      <input
                        placeholder="20"
                        className="uni-ic__settings-transaction-deadline-minute-input"
                        type="number"
                        min="1"
                        step="1"
                        value={transactionDeadline}
                        onChange={(e) => {
                          setUniswapTransactionDeadline(Number(e.target.value));
                        }}
                      />
                    </button>
                    <div className="uni-ic__settings-transaction-deadline-minute-label">
                      minutes
                    </div>
                  </div>
                </div>
              </div>
              <div className="uni-ic__settings-interface-header">
                Interface Settings
              </div>
              <div className="uni-ic__settings-interface-multihops-container">
                <div className="uni-ic__settings-interface-multihops-text-container">
                  <div className="uni-ic__settings-interface-multihops-text">
                    Disable Multihops
                  </div>
                  <span style={{ marginLeft: '4px' }}>
                    <div style={{ display: 'inline-block' }}>
                      <div className="uni-ic__settings-interface-multihops-text-info">
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
                          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                          <line x1="12" y1="17" x2="12.01" y2="17"></line>
                        </svg>
                        <div className="uni-ic__tooltip-wrapper">
                          <div className="uni-ic__tooltip-container">
                            <div className="uni-ic__tooltip">
                              <span>Restricts swap to direct pairs only </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </span>
                </div>
                <button className="uni-ic__settings-interface-multihops-actions">
                  <span
                    onClick={() => setUniswapDisableMultihops(true)}
                    className={`uni-ic__settings-interface-multihops-actions-on ${
                      disableMultihops ? 'selected' : ''
                    }`}
                  >
                    On
                  </span>
                  <span
                    onClick={() => setUniswapDisableMultihops(false)}
                    className={`uni-ic__settings-interface-multihops-actions-off ${
                      !disableMultihops ? 'selected' : ''
                    }`}
                  >
                    Off
                  </span>
                </button>
              </div>
            </div>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Header;
