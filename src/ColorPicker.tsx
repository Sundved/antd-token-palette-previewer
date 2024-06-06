import type { ColorPickerProps } from 'antd';
import { Col, ColorPicker as AntdColorPicker, Divider, Row } from 'antd';
import type { Color } from 'antd/es/color-picker';
import type { FC } from 'react';
import React, { useMemo } from 'react';
import CustomColorPresets from './CustomColorPresets';
import type { AliasToken, CustomPresetItem, MutableTheme } from './interface';
import { getColor } from './utils/getColor';
import { isColor } from './utils/isColor';

type Props = ColorPickerProps & {
  onChangeComplete?: (color: Color | string) => void;
  theme?: MutableTheme;
  isComponent: boolean;
};

const ColorPicker: FC<Props> = ({
  theme,
  onChangeComplete,
  value,
  isComponent,
  ...props
}) => {
  const presets = useMemo(() => {
    const { palette, token } = theme?.config || {};
    let list: CustomPresetItem[] = [];

    if (palette) {
      list = Object.keys(palette).reduce((acc, item) => {
        const [color] = item.split(/(\d+)/);

        const paletteItem = acc.find(({ label }) => label === color);

        if (paletteItem) {
          paletteItem.colors.push({ name: item, color: palette[item] });
        } else {
          acc.push({
            label: color,
            colors: [{ name: item, color: palette[item] }],
          });
        }

        return acc;
      }, list);
    }

    if (isComponent && token) {
      list = (Object.keys(token) as (keyof AliasToken)[]).reduce(
        (acc, item) => {
          const tokenItem = token[item] as string;
          if (isColor(tokenItem, theme?.config)) {
            const globalItem = acc.find(({ label }) => label === 'Global');

            if (globalItem) {
              globalItem.colors.push({
                name: item,
                color: getColor(tokenItem, theme?.config) as string,
              });
            } else {
              acc.push({
                label: 'Global',
                colors: [{ name: item, color: tokenItem }],
              });
            }
          }
          return acc;
        },
        list,
      );
    }

    return list;
  }, [theme?.config, isComponent]);
  const color =
    value && typeof value === 'string' ? getColor(value, theme?.config) : value;

  const customPanelRender: ColorPickerProps['panelRender'] = (
    _,
    { components: { Picker } },
  ) => (
    <Row justify="space-between" wrap={false} style={{ minWidth: 370 }}>
      <Col span={11}>
        <CustomColorPresets
          prefixCls="ant-color-picker"
          presets={presets}
          onChange={onChangeComplete}
          value={color}
        />
      </Col>
      <Divider type="vertical" style={{ height: 'auto' }} />
      <Col span={11}>
        <Picker />
      </Col>
    </Row>
  );

  return (
    <AntdColorPicker
      {...props}
      onChangeComplete={onChangeComplete}
      panelRender={presets.length > 0 ? customPanelRender : undefined}
      value={color}
    />
  );
};

export default ColorPicker;
