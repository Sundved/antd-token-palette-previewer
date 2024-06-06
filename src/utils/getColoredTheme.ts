import type { AliasToken, MutableTheme, Theme } from '../interface';
import { getColor } from './getColor';
import { isGlobalColor, isPaletteColor } from './isColor';

export const getColoredToken = (
  token: Partial<AliasToken>,
  isColor: boolean,
  themeConfig?: Theme['config'],
): Partial<AliasToken> => {
  return Object.keys(token).reduce((acc, key) => {
    const tokenKey = key as keyof AliasToken;
    if (
      isPaletteColor(token[tokenKey] as string, themeConfig?.palette) ||
      isGlobalColor(token[tokenKey] as string, themeConfig?.token)
    ) {
      return {
        ...acc,
        [tokenKey]: isColor
          ? getColor(token[tokenKey] as string, themeConfig)
          : token[tokenKey],
      };
    }

    return acc;
  }, {} as Partial<AliasToken>);
};

export const getColoredTheme = (theme: MutableTheme): Theme => {
  return {
    ...theme,
    config: {
      ...theme.config,
      token: {
        ...theme.config.token,
        ...getColoredToken(theme.config.token || {}, true, theme.config),
      },
      components: theme.config?.components
        ? Object.keys(theme.config?.components).reduce((acc, key) => {
            const value = (theme.config?.components as any)?.[key];
            acc[key] = {
              ...value,
              ...getColoredToken(value, true, theme.config),
            };
            return acc;
          }, {} as any)
        : undefined,
    },
  };
};
