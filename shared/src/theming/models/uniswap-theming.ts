import { UniswapThemeTextAndColor } from './uniswap-theme-text-and-colour';

export interface UniswapTheming {
  backgroundColor?: string | undefined;
  textColor?: string | undefined;
  button?: UniswapThemeTextAndColor;
  panel?: UniswapThemeTextAndColor;
}
