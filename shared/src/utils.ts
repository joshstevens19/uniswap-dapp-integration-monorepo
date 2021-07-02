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
   * Deep clone a object
   * @param object The object
   */
  public static deepClone<T>(object: T): T {
    return JSON.parse(JSON.stringify(object)) as T;
  }
}
