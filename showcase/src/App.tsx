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

  const [metamaskInstalled, setMetamaskInstalled] = React.useState<
    undefined | boolean
  >(false);

  const [loading, setLoading] = React.useState<boolean>(true);

  useEffect(() => {
    (async () => {
      const ethereum = (window as any).ethereum;
      if (!ethereum) {
        setMetamaskInstalled(false);
        setLoading(false);
        return;
      }

      setMetamaskInstalled(true);

      // MetaMask
      const accounts = await (window as any).ethereum.request({
        method: 'eth_requestAccounts',
      });

      const uniswapDappSharedLogicContext: UniswapDappSharedLogicContext = {
        supportedNetworkTokens: [
          {
            chainId: ChainId.MAINNET,
            defaultInputToken: ETH.MAINNET().contractAddress,
            defaultOutputToken: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
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
              {
                contractAddress: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
              },
              {
                contractAddress: '0x6b175474e89094c44da98b954eedeac495271d0f',
              },
              {
                contractAddress: '0xc944e90c64b2c07662a292be6244bdf05cda44a7',
              },
              {
                contractAddress: '0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e',
              },
              {
                contractAddress: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
              },
            ],
          },
        ],
        ethereumAddress: accounts[0],
        ethereumProvider: (window as any).ethereum,
      };

      setUniswapDappSharedLogicContext(uniswapDappSharedLogicContext);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="App">
      {loading && (
        <div className="uni-ic__loading">
          <svg
            className="uni-ic__loading__svg-container"
            height="100"
            width="100"
            viewBox="0 0 100 100"
          >
            <circle
              className="uni-ic__loading__svg bg"
              cx="50"
              cy="50"
              r="45"
            ></circle>
            <circle
              className="uni-ic__loading__svg animate"
              cx="50"
              cy="50"
              r="45"
            ></circle>
          </svg>
        </div>
      )}

      {!loading && (
        <div>
          {uniswapDappSharedLogicContext !== undefined && metamaskInstalled && (
            <UniswapReact
              uniswapDappSharedLogicContext={uniswapDappSharedLogicContext}
            />
          )}
          {!metamaskInstalled && (
            <p>This showcase only supports MetaMask please install it.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
