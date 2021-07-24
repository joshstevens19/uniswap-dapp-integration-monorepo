import BigNumber from 'bignumber.js';

export class Utils {
  /**
   * To precision
   */
  public static toPrecision(
    value: string | number | BigNumber,
    significantDigits: number = 4,
    significantDigitsForDecimalOnly: boolean = true,
  ): string {
    const parsedValue = new BigNumber(value);
    if (significantDigitsForDecimalOnly) {
      const beforeDecimalsCount = parsedValue.toString().split('.')[0].length;
      return parsedValue
        .precision(
          beforeDecimalsCount + significantDigits,
          BigNumber.ROUND_DOWN,
        )
        .toFixed();
    } else {
      return parsedValue
        .precision(significantDigits, BigNumber.ROUND_DOWN)
        .toFixed();
    }
  }

  /**
   * Format the currency
   * @value The value to format
   */
  public static formatCurrency(value: string | number): string {
    return Number(value)
      .toFixed(2)
      .replace(/\d(?=(\d{3})+\.)/g, '$&,');
  }

  /**
   * Deep clone a object
   * @param object The object
   */
  public static deepClone<T>(object: T): T {
    return JSON.parse(JSON.stringify(object)) as T;
  }

  /**
   * Check if something is zero
   * @param amount The amount
   */
  public static isZero(amount: string | number): boolean {
    if (!amount || amount === '') {
      return true;
    }
    return new BigNumber(amount).eq(0);
  }
}
