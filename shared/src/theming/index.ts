import { UniswapTheming } from './models/uniswap-theming';

export class Theming {
  private readonly WIDGET_ID = 'uniswap__716283642843643826';
  constructor(private _theming?: UniswapTheming) {}

  /**
   * Theme component
   */
  public apply(): void {
    let css = '<style>';
    css += this.themeBackgroundColors();
    css += this.themeTextColors();
    css += this.themePanelColors();
    css += this.themeButtonColors();
    css += '<style>';

    document.head.insertAdjacentHTML('beforeend', css);
  }

  /**
   * Theme background colors
   */
  private themeBackgroundColors(): string {
    if (this._theming?.backgroundColor) {
      return `.uni-ic__theme-background {background: ${this._theming.backgroundColor} !important}`;
    }

    return '';
  }

  /**
   * Theme text colours
   */
  private themeTextColors(): string {
    if (this._theming?.textColor) {
      return `.uni-ic,
              .uni-ic__modal,
              .uni-ic__modal button:not(.uni-ic__theme-background-button),
              svg
              {color: ${this._theming.textColor} !important}`;
    }

    return '';
  }

  /**
   * Theme button colours
   */
  private themeButtonColors(): string {
    let css = '';
    if (this._theming?.button?.backgroundColor) {
      css += `background: ${this._theming.button.backgroundColor} !important; `;
    }

    if (this._theming?.button?.textColor) {
      css += `color: ${this._theming.button.textColor} !important`;
    }

    if (css.length > 0) {
      return `.uni-ic__theme-background-button,
              .uni-ic__settings-transaction-slippage-option.selected,
              .uni-ic__settings-interface-multihops-actions-off.selected
              {${css}}`;
    }

    return css;
  }

  /**
   * Theme panel colours
   */
  private themePanelColors(): string {
    let css = '';
    if (this._theming?.panel?.backgroundColor) {
      css += `background: ${this._theming.panel.backgroundColor} !important; border-color: ${this._theming.backgroundColor} !important; `;
    }

    if (this._theming?.panel?.textColor) {
      css += `color: ${this._theming.panel.textColor} !important`;
    }

    if (css.length > 0) {
      return `.uni-ic__theme-panel {${css}}`;
    }

    return css;
  }

  /**
   * Toggle showing and hiding the settings
   */
  public toggleSettings(): void {
    const settingsElement = document.getElementsByClassName(
      'uni-ic__settings-container',
    )[0];
    if (settingsElement.classList.contains('uni-ic-hidden')) {
      settingsElement.classList.remove('uni-ic-hidden');
    } else {
      settingsElement.classList.add('uni-ic-hidden');
      this.apply();
    }
  }

  /**
   * Show the token selector
   */
  public showTokenSelector(): void {
    this.hideSettings();
    const modal = document.getElementById('uni-ic__modal-token')!;
    modal.style.display = 'block';
    this.renderModalWithCorrectPosition(modal, 100);
  }

  /**
   * Hide the token selector
   */
  public hideTokenSelector(): void {
    const modal = document.getElementById('uni-ic__modal-token')!;
    modal.style.display = 'none';
  }

  /**
   * Show the confirm swap modal
   */
  public showConfirmSwap(): void {
    this.hideSettings();
    const modal = document.getElementById('uni-ic__modal-confirm-swap')!;
    modal.style.display = 'block';
    this.renderModalWithCorrectPosition(modal, 200);
  }

  /**
   * Hide the confirm swap modal
   */
  public hideConfirmSwap(): void {
    const modal = document.getElementById('uni-ic__modal-confirm-swap')!;
    modal.style.display = 'none';
  }

  /**
   * Show the transaction
   */
  public showTransaction(): void {
    const modal = document.getElementById('uni-ic__modal-transaction')!;
    modal.style.display = 'block';
    this.renderModalWithCorrectPosition(modal);
  }

  /**
   * Hide the transaction
   */
  public hideTransaction(): void {
    const modal = document.getElementById('uni-ic__modal-transaction')!;
    modal.style.display = 'none';
  }

  /**
   * Hide the settings
   */
  public hideSettings(): void {
    const settingsElement = document.getElementsByClassName(
      'uni-ic__settings-container',
    )[0];
    settingsElement.classList.add('uni-ic-hidden');
  }

  /**
   * render the modal in the correct place so it doesnt appear of screen
   */
  private renderModalWithCorrectPosition(
    modal: HTMLElement,
    minus: number = 0,
  ): void {
    const topBoundingClientRect = document
      .getElementById(this.WIDGET_ID)!
      .getBoundingClientRect().top;
    let paddingNumber = topBoundingClientRect - minus;
    if (paddingNumber < 20) {
      paddingNumber = 20;
    }
    const paddingTop = paddingNumber.toString() + 'px';
    modal.style.paddingTop = paddingTop;
  }
}
