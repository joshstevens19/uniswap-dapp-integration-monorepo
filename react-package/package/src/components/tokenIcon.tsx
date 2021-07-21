import React from 'react';
import { TokenImage } from 'uniswap-dapp-integration-shared';

const TokenIcon = ({
  classes,
  tokenImageContext,
}: {
  classes: string;
  tokenImageContext: TokenImage;
}): JSX.Element => (
  <span>
    {!tokenImageContext.isSvg && (
      <img src={tokenImageContext.image} className={classes} />
    )}
    {tokenImageContext.isSvg && (
      <span className={classes}>
        <span
          dangerouslySetInnerHTML={{
            __html: tokenImageContext.image,
          }}
        ></span>
      </span>
    )}
  </span>
);

export default TokenIcon;
