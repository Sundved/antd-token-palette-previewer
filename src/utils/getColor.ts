import type { AliasToken, Theme } from '../interface';
import { isGlobalColor, isPaletteColor } from './isColor';

export function getColor(str: string, themeConfig?: Theme['config']) {
  if (isGlobalColor(str, themeConfig?.token)) {
    const value = themeConfig?.token?.[str as keyof AliasToken] as string;
    if (isPaletteColor(value, themeConfig?.palette)) {
      return themeConfig?.palette?.[value];
    }
    return value;
  }
  if (isPaletteColor(str, themeConfig?.palette)) {
    return themeConfig?.palette?.[str];
  }
  return typeof str === 'string' ? str : undefined;
}
