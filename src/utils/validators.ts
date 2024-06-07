export type Nullable<T> = T | undefined | null;
type StringOrNumber = string | number;

/**
 * Проверяет значение на равность к undefined или null
 * @param value Nullable<T>
 * @returns value is null | undefined
 */
export function isNullable<T>(value: Nullable<T>): value is null | undefined {
  return value === null || value === undefined;
}

/**
 * Проверяет значение, что оно не равно undefined и null
 * @param value Nullable<T>
 * @returns value is NonNullable<T>
 */
export function isNotNullable<T>(value: Nullable<T>): value is NonNullable<T> {
  return !isNullable(value);
}

/**
 * Проверяет, что значение (число или строка) есть число или строка в виде числа
 * @param value Nullable<StringOrNumber>
 * @returns value is StringOrNumber
 */
export function isNumber(
  value: Nullable<StringOrNumber>,
): value is StringOrNumber {
  if (
    isNullable(value) ||
    (typeof value === 'string' && value.trim().length === 0)
  ) {
    return false;
  }

  const val = Number(value);

  return !isNaN(val);
}
