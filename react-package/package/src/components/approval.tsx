import React from 'react';
import {
  TransactionStatus,
  UniswapDappSharedLogic,
} from 'uniswap-dapp-integration-shared';

const Approval = ({
  uniswapDappSharedLogic,
}: {
  uniswapDappSharedLogic: UniswapDappSharedLogic;
}): JSX.Element => {
  const transactionStatus = TransactionStatus;

  return (
    <div>
      {uniswapDappSharedLogic.miningTransaction?.status}
      {uniswapDappSharedLogic.tradeContext?.approvalTransaction &&
        uniswapDappSharedLogic.tradeContext?.fromBalance?.hasEnough && (
          <button
            style={{ width: '100%' }}
            className="uni-ic__swap-allow uni-ic__theme-background-button"
            onClick={() => uniswapDappSharedLogic.approveAllowance()}
          >
            <div className="uni-ic__swap-allow-container">
              <span style={{ display: 'flex', alignItems: 'center' }}>
                {!uniswapDappSharedLogic.inputToken.tokenImageContext.isSvg && (
                  <img
                    src={
                      uniswapDappSharedLogic.inputToken.tokenImageContext.image
                    }
                    className="uni-ic__swap-allow-icon"
                  />
                )}
                {(uniswapDappSharedLogic.miningTransaction === undefined ||
                  uniswapDappSharedLogic.miningTransaction.status ===
                    transactionStatus.rejected) && (
                  <span>
                    You must give the Uniswap smart contract permisson to use
                    your
                    {uniswapDappSharedLogic.tradeContext!.fromToken.symbol}. You
                    only have to do this once per token per uniswap version.
                    Click here to approve the permissons.
                  </span>
                )}

                {uniswapDappSharedLogic.miningTransaction?.status ===
                  transactionStatus.waitingForConfirmation && (
                  <span>Waiting for confirmation....</span>
                )}

                {uniswapDappSharedLogic.miningTransaction?.status ===
                  transactionStatus.mining && (
                  <span>Waiting for your transaction to be mined...</span>
                )}
              </span>
            </div>
          </button>
        )}
    </div>
  );
};

export default Approval;
