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
            defaultInputToken: ETH.MAINNET().contractAddress,
            defaultOutputToken: '0xde30da39c46104798bb5aa3fe8b9e0e1f348163f',
            supportedTokens: [
              {
                contractAddress: '0x419D0d8BdD9aF5e606Ae2232ed285Aff190E711b',
              },
              {
                contractAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7',
              },
              {
                contractAddress: '0x5EeAA2DCb23056F4E8654a349E57eBE5e76b5e6e',
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
      {uniswapDappSharedLogicContext !== undefined && (
        <UniswapReact
          uniswapDappSharedLogicContext={uniswapDappSharedLogicContext}
        />
      )}
    </div>
  );
}

export default App;
