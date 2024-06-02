import type { GlobalToken, MapToken } from 'antd/es/theme/interface';
import defaultMap from 'antd/es/theme/themes/default';
import seed from 'antd/es/theme/themes/seed';
import formatToken from 'antd/es/theme/util/alias';
import type { MutableTheme } from '../interface';
import { getColoredToken } from './getColoredTheme';

export default function getDesignToken(theme: MutableTheme): GlobalToken {
  const config = theme.config || {};
  const seedToken = { ...seed, ...config.token };
  const mapFn = config.algorithm ?? defaultMap;
  const mapToken = Array.isArray(mapFn)
    ? mapFn.reduce<MapToken>(
        (result, fn) => fn(seedToken, result),
        undefined as any,
      )
    : mapFn(seedToken);
  const coloredToken = getColoredToken(seedToken, false, config?.palette);
  const mergedMapToken = {
    ...mapToken,
    ...coloredToken,
    ...config.components,
    override: config.token ?? {},
  };
  return formatToken(mergedMapToken);
}
