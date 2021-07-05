import { Component, OnInit } from '@angular/core';
import {
  ChainId,
  UniswapDappSharedLogicContext,
} from 'uniswap-dapp-integration-shared';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public uniswapDappSharedLogicContext:
    | UniswapDappSharedLogicContext
    | undefined;

  /**
   * On load
   */
  async ngOnInit(): Promise<void> {
    // MetaMask
    const accounts = await (window as any).ethereum.request({
      method: 'eth_requestAccounts',
    });

    this.uniswapDappSharedLogicContext = {
      supportedNetworkTokens: [
        {
          chainId: ChainId.MAINNET,
          defaultInputToken: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          defaultOutputToken: '0xDe30da39c46104798bB5aA3fe8B9e0e1F348163F',
          supportedTokens: [
            { contractAddress: '0x419D0d8BdD9aF5e606Ae2232ed285Aff190E711b' },
            { contractAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7' },
            { contractAddress: '0x1985365e9f78359a9B6AD760e32412f4a445E862' },
            { contractAddress: '0x5EeAA2DCb23056F4E8654a349E57eBE5e76b5e6e' },
            { contractAddress: '0xDe30da39c46104798bB5aA3fe8B9e0e1F348163F' },
          ],
        },
        {
          chainId: ChainId.RINKEBY,
          defaultInputToken: '0xc778417E063141139Fce010982780140Aa0cD5Ab',
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
  }
}
