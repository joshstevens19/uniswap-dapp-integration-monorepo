import { UniswapDappSharedLogic } from 'uniswap-dapp-integration-shared';

export class Store {
  private static _uniswapDappSharedLogic: undefined | UniswapDappSharedLogic;

  public static setUniswapDappSharedLogic(
    uniswapDappSharedLogic: UniswapDappSharedLogic,
  ) {
    this._uniswapDappSharedLogic = uniswapDappSharedLogic;
  }

  public static getUniswapDappSharedLogic() {
    return this._uniswapDappSharedLogic;
  }
}
