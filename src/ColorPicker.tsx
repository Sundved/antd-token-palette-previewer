import type { ColorPickerProps } from 'antd';
import {Col, ColorPicker as AntdColorPicker, Divider, Row} from 'antd';
import type { FC } from 'react';
import React, {useMemo} from 'react';
import type {MutableTheme} from "./interface";
import CustomColorPresets from "./CustomColorPresets";
import type {CustomPresetItem} from "./interface";
import type {Color} from "antd/es/color-picker";
import {getColor} from "./utils/getColor";

type Props = ColorPickerProps & {
  onChangeComplete?: (color: Color | string) => void;
  theme?: MutableTheme
}

const ColorPicker: FC<Props> = ({theme, onChangeComplete, value, ...props}) => {
  const presets = useMemo(() => {
    const {palette} = theme?.config || {};

    if (palette) {
      return Object.keys(palette).reduce((acc, item) => {
        const [color] = item.split(/(\d+)/);

        const paletteItem = acc.find(({label}) => label === color);

        if (paletteItem) {
          paletteItem.colors.push({name: item, color: palette[item]});
        } else {
          acc.push({label: color, colors: [{name: item, color: palette[item]}]})
        }

        return acc;
      }, [] as CustomPresetItem[])
    }

    return [];
  }, [theme?.config]);
  const color = value && typeof value === 'string'? getColor(value, theme?.config?.palette) : value

  const customPanelRender: ColorPickerProps['panelRender'] = (
    _,
    { components: { Picker } },
  ) => (
    <Row justify="space-between" wrap={false} style={{minWidth: 370}}>
      <Col span={11}>
        <CustomColorPresets prefixCls="ant-color-picker" presets={presets} onChange={onChangeComplete} value={color} />
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
