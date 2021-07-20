import React, { useEffect } from 'react';
import {
  MiningTransaction,
  TransactionStatus,
  UniswapDappSharedLogic,
} from 'uniswap-dapp-integration-shared';

const TransactionModal = ({
  uniswapDappSharedLogic,
}: {
  uniswapDappSharedLogic: UniswapDappSharedLogic;
}): JSX.Element => {
  const [miningTransaction, setMiningTransaction] = React.useState<
    MiningTransaction | undefined
  >(uniswapDappSharedLogic.miningTransaction);

  const [miningTransactionStatus, setMiningTransactionStatus] = React.useState<
    TransactionStatus | undefined
  >();

  useEffect(() => {
    uniswapDappSharedLogic.miningTransaction$.subscribe(
      (_miningTransaction) => {
        setMiningTransaction(_miningTransaction);
        setMiningTransactionStatus(_miningTransaction?.status);
      },
    );
  }, []);

  const transactionStatus = TransactionStatus;
  const viewOnEtherscan = () => {
    if (miningTransaction?.blockExplorerLink) {
      window.open(miningTransaction.blockExplorerLink, '_blank');
    }
  };

  return (
    <div id="uni-ic__modal-transaction" className="uni-ic__modal">
      <div
        className="
      uni-ic__modal__content uni-ic__modal-transaction uni-ic__theme-background
    "
      >
        {miningTransactionStatus === transactionStatus.completed && (
          <span
            className="uni-ic__modal__close"
            onClick={() => uniswapDappSharedLogic.hideTransaction()}
          >
            &times;
          </span>
        )}

        {(miningTransactionStatus ===
          transactionStatus.waitingForConfirmation ||
          miningTransactionStatus === transactionStatus.mining ||
          miningTransactionStatus === transactionStatus.completed) && (
          <div className="uni-ic__modal-transaction__state">
            {miningTransactionStatus !== transactionStatus.completed && (
              <div className="uni-ic__modal-transaction__state__loading">
                <svg
                  className="uni-ic__modal-transaction__state__loading-spinner"
                  width="94"
                  height="94"
                  viewBox="0 0 94 94"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M92 47C92 22.1472 71.8528 2 47 2C22.1472 2 2 22.1472 2 47C2 71.8528 22.1472 92 47 92"
                    stroke="#2172E5"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}

            <div className="uni-ic__modal-transaction__state__info">
              <div className="uni-ic__modal-transaction__state__info-confirmation">
                {miningTransactionStatus ===
                  transactionStatus.waitingForConfirmation && (
                  <span>Waiting For Confirmation</span>
                )}
                {miningTransactionStatus === transactionStatus.mining && (
                  <span>Mining</span>
                )}
                {miningTransactionStatus === transactionStatus.completed && (
                  <span>Swap complete</span>
                )}
              </div>
              <div className="uni-ic__modal-transaction__state__info-quote">
                <div className="uni-ic__modal-transaction__state__info-quote-info">
                  {(miningTransactionStatus ===
                    transactionStatus.waitingForConfirmation ||
                    miningTransactionStatus === transactionStatus.mining) && (
                    <span>Swapping</span>
                  )}
                  {miningTransactionStatus === transactionStatus.completed && (
                    <span>Swapped</span>
                  )}{' '}
                  {uniswapDappSharedLogic.tradeContext?.baseConvertRequest}{' '}
                  {uniswapDappSharedLogic.tradeContext?.fromToken?.symbol} for{' '}
                  {uniswapDappSharedLogic.tradeContext?.expectedConvertQuote}{' '}
                  {uniswapDappSharedLogic.tradeContext?.toToken?.symbol}
                </div>
              </div>
              <div className="uni-ic__modal-transaction__state__action">
                {miningTransactionStatus ===
                  transactionStatus.waitingForConfirmation && (
                  <span>Confirm this transaction in your wallet</span>
                )}

                {(miningTransactionStatus === transactionStatus.mining ||
                  miningTransactionStatus === transactionStatus.completed) && (
                  <button
                    onClick={() => viewOnEtherscan()}
                    className="uni-ic__theme-background-button"
                  >
                    View tx on etherscan
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {miningTransactionStatus === transactionStatus.rejected && (
          <div className="uni-ic__modal-transaction__rejected">
            <div
              className="uni-ic__modal-transaction__rejected__content"
              style={{ marginTop: '20px', padding: '2rem 0px' }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#DA2D2B"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ strokeWidth: '1.5' }}
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <div
                className="uni-ic__modal-transaction__rejected__content-text"
                style={{
                  textAlign: 'center',
                  width: '85%',
                  wordBreak: 'break-word',
                }}
              >
                Transaction rejected.
              </div>
            </div>

            <div className="uni-ic__modal-transaction__rejected__dismiss">
              <button
                className="uni-ic__modal-transaction__rejected__dismiss-button uni-ic__theme-background-button"
                onClick={() => uniswapDappSharedLogic.hideTransaction()}
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionModal;
