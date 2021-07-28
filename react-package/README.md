# Uniswap react

[![npm version](https://badge.fury.io/js/uniswap-react.svg)](https://badge.fury.io/js/uniswap-react)
![downloads](https://img.shields.io/npm/dw/uniswap-react)

## About

Integrating uniswap within your dApp should be a simple thing but with all the complex stuff that goes into making it work, managing transaction status, calling the correct methods on the swap, maintaining the users balances, syncing the fiat prices, producing the token icons, handling all the UI making it work on every browser, i could keep going. On top of this you don't really want to pop a window for the user to swap using the uniswap widget, you want to keep the user experience consistent with your dApp. The idea of this library is to give you a really easy but fully flexible way you can integrate with uniswap with only a few lines of code. You can customise mostly everything from what tokens you support to what colour you want it to be themed as! This will turn integrating uniswap into a few lines of code task.

## Features 🚀

🚀 Integrate it into your existing dApp with a few lines of code
<br/>
🚀 Supports uniswap v2 and v3 prices together and returns the best price
<br/>
🚀 Queries all the best routes and finds the best price for you
<br/>
🚀 Reactive logic so when the price moves or your trade expiries it generates you a new one but alerts the user (queries new trades on every new block)
<br/>
🚀 Reactive fiat price so users can see the amount the trade is in fiat, this updates as the price changes as well
<br/>
🚀 Reactive balance syncing so the user can see their correct balance all the time (syncs on every new block)
<br/>
🚀 Supports all major browsers
<br/>
🚀 Is fully responsive
<br/>
🚀 Fully customisable, style it as you want, support whatever tokens you want and much more
<br/>
🚀 Uses the awesome [simple-uniswap-sdk](https://github.com/uniswap-integration/simple-uniswap-sdk) for all the uniswap on chain logic
<br/>
🚀 Fully typescript supported with full generated typings
<br/>
🚀 and much more!!

## Live demo

You can view a live demo [here](https://uniswap-dapp-integration.netlify.app). You will need MetaMask installed. It only uses a few tokens just to show the demo working.

# Installing

## npm

```bash
$ npm install uniswap-react
```

## yarn

```bash
$ yarn add uniswap-react
```

## Peer dependencies you must install

You must also install `uniswap-dapp-integration-shared` package for this to work.

### npm

```bash
$ npm install uniswap-dapp-integration-shared
```

### yarn

```bash
$ yarn add uniswap-dapp-integration-shared
```

# Usage

It very simple to get uniswap angular up and running below is a simple example in how to get it working, this example assumes the ethereum provider is injected in the window (MetaMask) but can be configured any way you like. This example does not show the logging out handling or a user without MetaMask installed, its purely to showing you how you would get this lib up and running. We shall talk about the config later in the documentation.

## YourComponent.tsx

```ts
import React, { useEffect } from 'react';
import {
  ChainId,
  ETH,
  UniswapDappSharedLogicContext,
} from 'uniswap-dapp-integration-shared';
import UniswapReact from 'uniswap-react';
import './App.css';

function YourComponent() {
  const [uniswapDappSharedLogicContext, setUniswapDappSharedLogicContext] =
    React.useState<undefined | UniswapDappSharedLogicContext>(undefined);

  useEffect(() => {
    (async () => {
      // MetaMask example
      const accounts = await (window as any).ethereum.request({
        method: 'eth_requestAccounts',
      });

      // basic config!
      const uniswapDappSharedLogicContext: UniswapDappSharedLogicContext = {
        supportedNetworkTokens: [
          {
            chainId: ChainId.MAINNET,
            defaultInputToken: ETH.MAINNET().contractAddress,
            defaultOutputToken: '0xde30da39c46104798bb5aa3fe8b9e0e1f348163f',
            supportedTokens: [
              { contractAddress: ETH.MAINNET().contractAddress },
              { contractAddress: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984' },
              { contractAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7' },
              { contractAddress: '0x1985365e9f78359a9B6AD760e32412f4a445E862' },
              { contractAddress: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9' },
              { contractAddress: '0xDe30da39c46104798bB5aA3fe8B9e0e1F348163F' },
            ],
          },
          {
            chainId: ChainId.RINKEBY,
            defaultInputToken: ETH.RINKEBY().contractAddress,
            defaultOutputToken: '0xef0e839cf88e47be676e72d5a9cb6ced99fad1cf',
            supportedTokens: [
              { contractAddress: ETH.RINKEBY().contractAddress },
              { contractAddress: '0xef0e839cf88e47be676e72d5a9cb6ced99fad1cf' },
            ],
          },
        ],
        ethereumAddress: accounts[0],
        ethereumProvider: (window as any).ethereum,
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
```

## Account changes and chain changes

If your ethereum provider follows `https://eips.ethereum.org/EIPS/eip-1193` spec then this should just work. As long as your provider emits `accountsChanged` on a account change and `chainChanged` on a chain change then this will all happen automatically for you.

## Config

### UniswapDappSharedLogicContext

```ts
export interface UniswapDappSharedLogicContext {
  supportedNetworkTokens: {
    chainId: ChainId;
    defaultInputValue?: string | undefined;
    defaultInputToken?: string | undefined;
    defaultOutputToken?: string | undefined;
    supportedTokens: {
      tokenImageContext?: {
        image: string;
        isSvg?: boolean | undefined;
      };
      contractAddress: string;
    }[];
  }[];
  ethereumAddress: string;
  ethereumProvider: any;
  settings?: UniswapPairSettings | undefined;
  theming?: {
    backgroundColor?: string | undefined;
    textColor?: string | undefined;
    button?: {
      textColor?: string | undefined;
      backgroundColor?: string | undefined;
    };
    panel?: {
      textColor?: string | undefined;
      backgroundColor?: string | undefined;
    };
  };
}

export declare class UniswapPairSettings {
  slippage: number;
  deadlineMinutes: number;
  disableMultihops: boolean;
  uniswapVersions: UniswapVersion[];
  constructor(settings?: {
    slippage?: number | undefined;
    deadlineMinutes?: number | undefined;
    disableMultihops?: boolean | undefined;
    uniswapVersions?: UniswapVersion[] | undefined;
  });
}

export declare enum UniswapVersion {
  v2 = 'v2',
  v3 = 'v3',
}
```

### supportedNetworkTokens - required

The is the config which maps your chains you want to support with the tokens you want to be swappable lets break down the config.

```ts
supportedNetworkTokens: {
    // the chain this mapping is for so if this was MAINNET you would import the `ChainId`
    // enum from `uniswap-dapp-integration-shared` and do `ChainId.MAINNET`
    chainId: ChainId;
    // the deep linked input amount
    // if not passed input will have nothing deep linked in
    // it should always be the formatted string aka 0.0001 ETH
    // you pass ether value ('0.0001'). Same with tokens you pass in
    // the formatted value
    defaultInputValue?: string | undefined;
    // the default input token you want to show
    // if nothing is passed in it will use WETH
    defaultInputToken?: string | undefined;
    // the default output token you want to show
    // if nothing passed it then it will pick nothing
    // as default
    defaultOutputToken?: string | undefined;
    // an array of all the tokens you want to support
    // should include any that you supplied above
    supportedTokens: {
        // if not supplied it try to get the image from trust
        // wallet github assets `https://github.com/trustwallet/assets`
        // image accepts a svg string or url for the image, if you pass in a
        // svg html string make sure you set `isSvg` to true. If you pass in a image url even
        // if that is a `.svg` pass in `isSvg` as false
        tokenImageContext?: {
          image: string;
          isSvg?: boolean | undefined;
        },
        // the contract address for the token
        contractAddress: string;
    }[];
  }[];
```

### ethereumAddress - requied

The ethereum address for the user.

### ethereumProvider - required

This is the ethereum provider you are using to send these transaction. It must confirm to the `https://eips.ethereum.org/EIPS/eip-1193`. If your using MetaMask for example you can just pass in the ethereum provider from the window aka `window.ethereum`. If your using a integrated wallet you should pass in your own custom provider which hooks onto the JSONRPC calls and on `eth_sendTransaction` it does what your dApp expects.

### settings

This is the settings you want to use on uniswap. `UniswapPairSettings` is a class.

```ts
export declare class UniswapPairSettings {
  // if not supplied it will use `0.005` which is 0.5%
  // please pass it in as a full number decimal so 0.7%
  // would be 0.007
  slippage: number;
  // if not supplied it will use 20 a deadline minutes
  deadlineMinutes: number;
  // if not supplied it will try to use multihops
  // if this is true it will require swaps to direct
  // pairs
  disableMultihops: boolean;
  // for example if you only wanted to turn on quotes for v3 and not v3
  // you can only support the v3 enum same works if you only want v2 quotes
  // if you do not supply anything it query both v2 and v3
  uniswapVersions: UniswapVersion[];
  constructor(settings?: {
    slippage?: number | undefined;
    deadlineMinutes?: number | undefined;
    disableMultihops?: boolean | undefined;
    uniswapVersions?: UniswapVersion[] | undefined;
  });
}
```

### theming

This allows you to theme the component which matches your dApp.

```ts
  theming?: {
    // The main background colour this will
    // apply to the main component and the modals
    backgroundColor?: string | undefined;
    // The text colour for the main body
    textColor?: string | undefined;
    // The button theme
    button?: {
      // The text colour for the buttons
      textColor?: string | undefined;
      // the background colour for the buttons
      backgroundColor?: string | undefined;
    };
    // The main area panels
    panel?: {
      // The text colour for the panels
      textColor?: string | undefined;
      // The background colour for the panels
      backgroundColor?: string | undefined;
    };
  };
```
