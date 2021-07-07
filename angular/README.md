# Uniswap angular

[![npm version](https://badge.fury.io/js/uniswap-angular.svg)](https://badge.fury.io/js/uniswap-angular)
![downloads](https://img.shields.io/npm/dw/uniswap-angular)

# Installing

## npm

```bash
$ npm install uniswap-angular
```

## yarn

```bash
$ yarn add uniswap-angular
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

It very simple to get uniswap angular up and running below is a simple example in how to get it working, this example assumes the ethereum provider is injected in the window but can be configured any way you like. we shall talk about the config later in the documentation.

## your.component.ts

```ts
import { Component, OnInit } from '@angular/core';
import {
  UniswapDappSharedLogicContext,
  ChainId,
  ETH,
} from 'uniswap-dapp-integration-shared';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class YourComponent implements OnInit {
  public uniswapDappSharedLogicContext:
    | UniswapDappSharedLogicContext
    | undefined;

  /**
   * On load
   */
  async ngOnInit(): Promise<void> {
    const accounts = await (window as any).ethereum.request({
      method: 'eth_requestAccounts',
    });

    this.uniswapDappSharedLogicContext = {
      supportedNetworkTokens: [
        {
          chainId: ChainId.MAINNET,
          defaultInputToken: ETH.MAINNET().contractAddress,
          defaultOutputToken: '0xDe30da39c46104798bB5aA3fe8B9e0e1F348163F',
          supportedTokens: [
            { contractAddress: ETH.MAINNET().contractAddress },
            { contractAddress: '0x419D0d8BdD9aF5e606Ae2232ed285Aff190E711b' },
            { contractAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7' },
            { contractAddress: '0x1985365e9f78359a9B6AD760e32412f4a445E862' },
            { contractAddress: '0x5EeAA2DCb23056F4E8654a349E57eBE5e76b5e6e' },
            { contractAddress: '0xDe30da39c46104798bB5aA3fe8B9e0e1F348163F' },
          ],
        },
        {
          chainId: ChainId.RINKEBY,
          defaultInputToken: ETH.RINKEBY().contractAddress,
          defaultOutputToken: '0xef0e839cf88e47be676e72d5a9cb6ced99fad1cf',
          supportedTokens: [
            { contractAddress: ETH.RINKEBY().contractAddress },
            {
              contractAddress: '0xef0e839cf88e47be676e72d5a9cb6ced99fad1cf',
            },
          ],
        },
      ],
      ethereumAddress: accounts[0],
      ethereumProvider: (window as any).ethereum,
      theming: {
        backgroundColor: 'red',
        button: { textColor: 'white', backgroundColor: 'blue' },
        panel: { textColor: 'black', backgroundColor: 'yellow' },
        textColor: 'orange',
      },
    };
  }
}
```

## your.component.html

```html
<lib-uniswap-angular-swapper
  *ngIf="uniswapDappSharedLogicContext"
  [uniswapDappSharedLogicContext]="uniswapDappSharedLogicContext"
></lib-uniswap-angular-swapper>
```

## Account changes and chain changes

If your ethereum provider follows `https://eips.ethereum.org/EIPS/eip-1193` spec then this should just work. As long as your provider emits `accountsChanged` on a account change and `chainChanged` on a chain change then this will all happen automatically for you. If for some reason you can not support this then we have exposed 2 inputs for you to emit values to when they change.

### accountChanged

```ts
@Input() accountChanged: Observable<string> | undefined;
```

When the account changes just emit the new account value to this input, example below:

#### your.component.ts

```ts
import { Component, OnInit } from '@angular/core';
import {
  UniswapDappSharedLogicContext,
  ChainId,
} from 'uniswap-dapp-integration-shared';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class YourComponent implements OnInit {
  public uniswapDappSharedLogicContext:
    | UniswapDappSharedLogicContext
    | undefined;

  public accountChangedSubject: Subject<string> = new Subject<string>();

  /**
   * On load
   */
  async ngOnInit(): Promise<void> {
    const accounts = await (window as any).ethereum.request({
      method: 'eth_requestAccounts',
    });

    this.uniswapDappSharedLogicContext = {
      supportedNetworkTokens: [
        {
          chainId: ChainId.MAINNET,
          defaultInputToken: ETH.MAINNET().contractAddress,
          defaultOutputToken: '0xDe30da39c46104798bB5aA3fe8B9e0e1F348163F',
          supportedTokens: [
            { contractAddress: ETH.MAINNET().contractAddress },
            { contractAddress: '0x419D0d8BdD9aF5e606Ae2232ed285Aff190E711b' },
            { contractAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7' },
            { contractAddress: '0x1985365e9f78359a9B6AD760e32412f4a445E862' },
            { contractAddress: '0x5EeAA2DCb23056F4E8654a349E57eBE5e76b5e6e' },
            { contractAddress: '0xDe30da39c46104798bB5aA3fe8B9e0e1F348163F' },
          ],
        },
        {
          chainId: ChainId.RINKEBY,
          defaultInputToken: ETH.RINKEBY().contractAddress,
          defaultOutputToken: '0xef0e839cf88e47be676e72d5a9cb6ced99fad1cf',
          supportedTokens: [
            { contractAddress: ETH.RINKEBY().contractAddress },
            {
              contractAddress: '0xef0e839cf88e47be676e72d5a9cb6ced99fad1cf',
            },
          ],
        },
      ],
      ethereumAddress: accounts[0],
      ethereumProvider: (window as any).ethereum,
      theming: {
        backgroundColor: 'red',
        button: { textColor: 'white', backgroundColor: 'blue' },
        panel: { textColor: 'black', backgroundColor: 'yellow' },
        textColor: 'orange',
      },
    };
  }

  public accountChanged(account: string): void {
    this.accountChangedSubject.next(account);
  }
}
```

#### your.component.html

```html
<lib-uniswap-angular-swapper
  *ngIf="uniswapDappSharedLogicContext"
  [uniswapDappSharedLogicContext]="uniswapDappSharedLogicContext"
  [accountChanged]="accountChangedSubject.asObservable()"
></lib-uniswap-angular-swapper>
```

### chainChanged

```ts
@Input() chainChanged: Observable<any> | undefined;
```

When the chain changes just emit the new ethereum provider, if there is no need for your ethereum provider to change or the instance you passed to the lib is the property that has changed then you do not need to pass us the new ethereum provider. example below:

#### your.component.ts

```ts
import { Component, OnInit } from '@angular/core';
import {
  UniswapDappSharedLogicContext,
  ChainId,
} from 'uniswap-dapp-integration-shared';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class YourComponent implements OnInit {
  public uniswapDappSharedLogicContext:
    | UniswapDappSharedLogicContext
    | undefined;

  public chainChangedSubject: Subject<any> = new Subject<any>();

  /**
   * On load
   */
  async ngOnInit(): Promise<void> {
    const accounts = await (window as any).ethereum.request({
      method: 'eth_requestAccounts',
    });

    this.uniswapDappSharedLogicContext = {
      supportedNetworkTokens: [
        {
          chainId: ChainId.MAINNET,
          defaultInputToken: ETH.MAINNET().contractAddress,
          defaultOutputToken: '0xDe30da39c46104798bB5aA3fe8B9e0e1F348163F',
          supportedTokens: [
            { contractAddress: ETH.MAINNET().contractAddress },
            { contractAddress: '0x419D0d8BdD9aF5e606Ae2232ed285Aff190E711b' },
            { contractAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7' },
            { contractAddress: '0x1985365e9f78359a9B6AD760e32412f4a445E862' },
            { contractAddress: '0x5EeAA2DCb23056F4E8654a349E57eBE5e76b5e6e' },
            { contractAddress: '0xDe30da39c46104798bB5aA3fe8B9e0e1F348163F' },
          ],
        },
        {
          chainId: ChainId.RINKEBY,
          defaultInputToken: ETH.RINKEBY().contractAddress,
          defaultOutputToken: '0xef0e839cf88e47be676e72d5a9cb6ced99fad1cf',
          supportedTokens: [
            { contractAddress: ETH.RINKEBY().contractAddress },
            {
              contractAddress: '0xef0e839cf88e47be676e72d5a9cb6ced99fad1cf',
            },
          ],
        },
      ],
      ethereumAddress: accounts[0],
      ethereumProvider: (window as any).ethereum,
      theming: {
        backgroundColor: 'red',
        button: { textColor: 'white', backgroundColor: 'blue' },
        panel: { textColor: 'black', backgroundColor: 'yellow' },
        textColor: 'orange',
      },
    };
  }

  public chainChanged(newEthereumProvider: any): void {
    this.chainChangedSubject.next(newEthereumProvider);
  }
}
```

#### your.component.html

```html
<lib-uniswap-angular-swapper
  *ngIf="uniswapDappSharedLogicContext"
  [uniswapDappSharedLogicContext]="uniswapDappSharedLogicContext"
  [chainChanged]="chainChangedSubject.asObservable()"
></lib-uniswap-angular-swapper>
```

Thats it it now will be integrated in your dApp, now lets talk about the config you can pass it.

## Config

### UniswapDappSharedLogicContext

```ts
export interface UniswapDappSharedLogicContext {
  supportedNetworkTokens: {
    chainId: ChainId;
    defaultInputToken?: string | undefined;
    defaultOutputToken?: string | undefined;
    supportedTokens: {
      tokenImageContext?: {
        image: string;
        isSvg: boolean;
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
  defaultInputValue?: string | undefined;
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
        // svg make sure you set `isSvg` to true. If you pass in a image url even
        // if that is a `.svg` pass in `isSvg` as false
        tokenImageContext?: {
          image: string;
          isSvg: boolean;
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

**TODO: SORT WITH NEW SDK AND ANGULAR PACKAGE TO MAKE SURE `useWETHAsERC20Route` IS EXPOSED**

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
  // if not supplied it will be false by default
  // when this is false it will class WETH as native eth
  // and call methods like `swapETHForExactTokens` etc
  // so if you swapped AAVE > WETH you would get native ETH and
  // not the erc20 WETH
  // when this is false it treat WETH as a erc20 token
  // and call methods like `swapExactTokensForTokens`,
  // so if you swapped AAVE > WETH you would get ERC20 WETH and
  // not the native ETH
  useWETHAsERC20Route: false;
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

### defaultInputValue

The default input value you want it to start on, say you wanted to deep link 1 WETH > AAVE you can pass in 1 here. It should be the formatted value so what you would render on the UI. If nothing is supplied it won't have anything defined in the input.
