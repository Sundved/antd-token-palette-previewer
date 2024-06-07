import type { AliasToken, Theme } from '../interface';

export function isColor(str: string, themeConfig?: Theme['config']) {
  return (
    isNormalColor(str) ||
    isPaletteColor(str, themeConfig?.palette) ||
    isGlobalColor(str, themeConfig?.token)
  );
}

export function isNormalColor(str: string) {
  return (
    typeof str === 'string' && (str.startsWith('rgb') || str.startsWith('#'))
  );
}

export function isGlobalColor(
  str: string | number | boolean,
  token: Partial<AliasToken> = {},
) {
  return typeof str === 'string' && Boolean(token[str as keyof AliasToken]);
}

export function isPaletteColor(
  str: string | number | boolean,
  palette: Record<string, string> = {},
) {
  return typeof str === 'string' && Boolean(palette[str]);
}
