import type { MutableTheme } from 'antd-token-previewer';
import { generateColor } from 'antd/es/color-picker/util';
import type { AliasToken } from '../interface';
import { isGlobalColor, isNormalColor, isPaletteColor } from './isColor';
import { isNumber } from './validators';

type ConvertType = {
  indent: string;
  item: string;
  obj: Record<string, string>;
  palette?: Record<string, string>;
  token?: Partial<AliasToken>;
};

const tokenToStr = ({ indent, item, obj, token, palette }: ConvertType) => {
  const value = obj[item];
  if (item === 'fontFamily') {
    return `${indent}${item}: \`"IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"\``;
  }
  if (palette && isPaletteColor(value, palette)) {
    return `${indent}${item}: color.${value}`;
  }
  if (token && isGlobalColor(value, token)) {
    if (palette && isPaletteColor(value, palette)) {
      return `${indent}${item}: color.${value}`;
    }
  }
  if (isNumber(value)) {
    return `${indent}${item}: ${value}`;
  }
  if (isNormalColor(value) && (value as string).startsWith('rgb')) {
    const color = generateColor(value);
    return `${indent}${item}: '${color.toHexString()}'`;
  }
  return `${indent}${item}: '${value}'`;
};

const componentToStr = ({ indent, item, obj, token, palette }: ConvertType) => {
  return `\n    ${item}: {\n${Object.keys(obj)
    .map((componentItem) =>
      tokenToStr({
        item: componentItem as string,
        obj,
        palette,
        indent,
        token,
      }),
    )
    .join(',\n')}\n    }`;
};

export const convertForDev = (jsonText: string): string => {
  try {
    const {
      palette = {},
      token = {},
      components = {},
    } = JSON.parse(jsonText) as MutableTheme['config'];

    return `export const color = {
${Object.keys(palette)
  .sort()
  .map((item) => tokenToStr({ indent: '  ', item, obj: palette }))
  .join(',\n')}
};

export const LIGHT_THEME: ThemeConfig = {
  token: {
${(Object.keys(token) as (keyof AliasToken)[])
  .sort()
  .map((item) =>
    tokenToStr({
      indent: '  ',
      item,
      obj: token as Record<string, string>,
      palette,
    }),
  )
  .join(',\n')}
  },
  components: {${Object.keys(components)
    .sort()
    .map((item) =>
      componentToStr({
        item,
        obj: (components as Record<string, Record<string, string>>)[item],
        token,
        palette,
        indent: '      ',
      }),
    )}
  }
};
`;
  } catch (e) {
    return 'Parse error';
  }
};
