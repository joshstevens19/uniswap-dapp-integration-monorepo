import React from 'react';
import {
  MiningTransaction,
  TradeContext,
  TransactionStatus,
  UniswapDappSharedLogic
} from 'uniswap-dapp-integration-shared';
import TokenIcon from './tokenIcon';

const Approval = ({
  uniswapDappSharedLogic,
  tradeContext, 
  miningTransaction,
  miningTransactionStatus,
}: {
  uniswapDappSharedLogic: UniswapDappSharedLogic;
  tradeContext: TradeContext | undefined;
  miningTransaction: MiningTransaction | undefined;
  miningTransactionStatus: TransactionStatus | undefined;
}): JSX.Element => {
  const transactionStatus = TransactionStatus;

  return (
    <div>
      {tradeContext?.approvalTransaction &&
        tradeContext?.fromBalance?.hasEnough && (
          <button
            className="uni-ic__swap-allow uni-ic__theme-background-button"
            onClick={() => uniswapDappSharedLogic.approveAllowance()}
            disabled={uniswapDappSharedLogic.transactionInProcess()}
          >
            <div className="uni-ic__swap-allow-container">
              <span>
                <TokenIcon
                  classes="uni-ic__swap-allow-icon"
                  tokenImageContext={
                    uniswapDappSharedLogic.inputToken.tokenImageContext
                  }
                />

                {(miningTransaction === undefined ||
                  miningTransactionStatus === transactionStatus.rejected) && (
                  <span>
                    You must give the Uniswap smart contract permisson to use
                    your {tradeContext!.fromToken.symbol}. You only have to do
                    this once per token per uniswap version. Click here to
                    approve the permissons.
                  </span>
                )}

                {miningTransaction?.status ===
                  transactionStatus.waitingForConfirmation && (
                  <span>Waiting for confirmation....</span>
                )}

                {miningTransaction?.status === transactionStatus.mining && (
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
