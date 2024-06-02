import type {AliasToken} from "antd/es/theme/interface";
import {isPaletteColor} from "./isColor";
import {getColor} from "./getColor";
import type {MutableTheme, Theme} from "antd-token-previewer";

export const getColoredToken = (token: Partial<AliasToken>, isColor: boolean, palette: Record<string, string> = {}): Partial<AliasToken> => {
  return  Object.keys(token).reduce((acc, key) => {
    const tokenKey = key as keyof AliasToken;
    if (isPaletteColor(token[tokenKey] as string, palette)) {
      return  {...acc, [tokenKey]: isColor ? getColor(token[tokenKey] as string, palette) : token[tokenKey]};
    }
    return acc;
  }, {} as Partial<AliasToken>);
}

export const getColoredTheme = (theme: MutableTheme): Theme => {
  return {
    ...theme,
    config: {
      ...theme.config,
      token: {...theme.config.token, ...getColoredToken(theme.config.token || {}, true, theme.config.palette)},
      components: theme.config?.components ? Object.keys(theme.config?.components).reduce((acc, key) => {
        const value = (theme.config?.components as any)?.[key];
        acc[key] = {...value, ...getColoredToken(value, true, theme.config.palette)}
        return acc;
      }, {} as any) : undefined
    }
  };
}
