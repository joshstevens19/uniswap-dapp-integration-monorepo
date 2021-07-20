import React from 'react';
import { TokenImage } from 'uniswap-dapp-integration-shared';

const TokenIcon = ({
  classes,
  tokenImageContext,
}: {
  classes: string;
  tokenImageContext: TokenImage;
}): JSX.Element => (
  <div>
    {!tokenImageContext.isSvg && (
      <img src={tokenImageContext.image} className={classes} />
    )}
    {tokenImageContext.isSvg && (
      <div className={classes}>
        <span
          dangerouslySetInnerHTML={{
            __html: tokenImageContext.image,
          }}
        ></span>
      </div>
    )}
  </div>
);

export default TokenIcon;
