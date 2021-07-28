import React, { useEffect } from 'react';
import {
  ChainId,
  ETH,
  UniswapDappSharedLogicContext,
} from 'uniswap-dapp-integration-shared';
import UniswapReact from 'uniswap-react';
import './App.css';

function App() {
  const [uniswapDappSharedLogicContext, setUniswapDappSharedLogicContext] =
    React.useState<undefined | UniswapDappSharedLogicContext>(undefined);

  useEffect(() => {
    (async () => {
      // MetaMask
      const accounts = await (window as any).ethereum.request({
        method: 'eth_requestAccounts',
      });

      const uniswapDappSharedLogicContext: UniswapDappSharedLogicContext = {
        supportedNetworkTokens: [
          {
            chainId: ChainId.MAINNET,
            defaultInputValue: '0.000001',
            defaultInputToken: ETH.MAINNET().contractAddress,
            defaultOutputToken: '0xde30da39c46104798bb5aa3fe8b9e0e1f348163f',
            supportedTokens: [
              {
                contractAddress: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
              },
              {
                contractAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7',
              },
              {
                contractAddress: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
              },
              {
                contractAddress: '0xde30da39c46104798bb5aa3fe8b9e0e1f348163f',
              },
            ],
          },
          {
            chainId: ChainId.RINKEBY,
            defaultInputToken: ETH.RINKEBY().contractAddress,
            defaultOutputToken: '0xef0e839cf88e47be676e72d5a9cb6ced99fad1cf',
            supportedTokens: [
              {
                contractAddress: '0xef0e839cf88e47be676e72d5a9cb6ced99fad1cf',
              },
            ],
          },
        ],
        ethereumAddress: accounts[0],
        ethereumProvider: (window as any).ethereum,
        // theming: {
        //   backgroundColor: 'red',
        //   button: { textColor: 'white', backgroundColor: 'blue' },
        //   panel: { textColor: 'black', backgroundColor: 'yellow' },
        //   textColor: 'orange',
        // },
      };

      setUniswapDappSharedLogicContext(uniswapDappSharedLogicContext);
    })();
  }, []);

  return (
    <div className="App">
      <div className="uniswap-container">
        {uniswapDappSharedLogicContext !== undefined && (
          <UniswapReact
            uniswapDappSharedLogicContext={uniswapDappSharedLogicContext}
          />
        )}
      </div>
    </div>
  );
}

export default App;
