import { ExtendedToken } from './extended-token';

export interface SupportedTokenResult extends ExtendedToken {
  canShow: boolean;
}
