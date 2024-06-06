import { Color as RcColor, ColorBlock } from '@rc-component/color-picker';
import {
  Collapse,
  theme as antdTheme,
  Tooltip,
  type CollapseProps,
} from 'antd';
import type { Color } from 'antd/es/color-picker';
import type {
  ColorPickerBaseProps,
  ColorValueType,
} from 'antd/es/color-picker/interface';
import { generateColor } from 'antd/es/color-picker/util';
import classNames from 'classnames';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import type { FC } from 'react';
import React, { useMemo } from 'react';
import type { CustomPresetItem, CustomPresetItemColor } from './interface';

interface ColorPresetsProps extends Pick<ColorPickerBaseProps, 'prefixCls'> {
  presets: CustomPresetItem[];
  value?: ColorValueType;
  onChange?: (value: string) => void;
}

const genPresetColor = (list: ColorPresetsProps['presets']) =>
  list.map((value) => ({
    ...value,
    colors: value.colors.map((item) => ({
      ...item,
      color: generateColor(item.color),
    })),
  }));

const isBright = (value: Color, bgColorToken: string) => {
  const { r, g, b, a } = value.toRgb();
  const hsv = new RcColor(value.toRgbString())
    .onBackground(bgColorToken)
    .toHsv();
  if (a <= 0.5) {
    // Adapted to dark mode
    return hsv.v > 0.5;
  }
  return r * 0.299 + g * 0.587 + b * 0.114 > 192;
};

const genCollapsePanelKey = ({ label }: ColorPresetsProps['presets'][number]) =>
  `panel-${label}`;

const ColorPresets: FC<ColorPresetsProps> = ({
  prefixCls,
  presets,
  value,
  onChange,
}) => {
  const { token } = antdTheme.useToken();
  const [presetsValue] = useMergedState(genPresetColor(presets), {
    value: genPresetColor(presets),
    postState: genPresetColor,
  });
  const colorPresetsPrefixCls = `${prefixCls}-presets`;
  const color = typeof value === 'string' ? generateColor(value) : value;

  const activeKeys = useMemo(
    () =>
      presetsValue.reduce<string[]>((acc, preset) => {
        const { defaultOpen = true } = preset;
        if (defaultOpen) acc.push(genCollapsePanelKey(preset));
        return acc;
      }, []),
    [presetsValue],
  );

  const handleClick = (presetColor: CustomPresetItemColor) => {
    onChange?.(presetColor.name);
  };

  const items: CollapseProps['items'] = presetsValue.map((preset) => ({
    key: genCollapsePanelKey(preset),
    label: (
      <div className={`${colorPresetsPrefixCls}-label`}>{preset?.label}</div>
    ),
    children: (
      <div className={`${colorPresetsPrefixCls}-items`}>
        {Array.isArray(preset?.colors) && preset.colors?.length > 0 ? (
          preset.colors.map((presetColor, index) => (
            <Tooltip
              // eslint-disable-next-line react/no-array-index-key
              key={`preset-${index}-${presetColor.color.toHexString()}`}
              title={`${presetColor.name}: ${presetColor.color.toHexString()}`}
            >
              <span>
                <ColorBlock
                  color={generateColor(presetColor.color).toRgbString()}
                  prefixCls={prefixCls}
                  className={classNames(`${colorPresetsPrefixCls}-color`, {
                    [`${colorPresetsPrefixCls}-color-checked`]:
                      presetColor.color.toHexString() === color?.toHexString(),
                    [`${colorPresetsPrefixCls}-color-bright`]: isBright(
                      presetColor.color,
                      token.colorBgElevated,
                    ),
                  })}
                  onClick={() => handleClick(presetColor)}
                />
              </span>
            </Tooltip>
          ))
        ) : (
          <span className={`${colorPresetsPrefixCls}-empty`}>Empty</span>
        )}
      </div>
    ),
  }));

  return (
    <div className={colorPresetsPrefixCls}>
      <Collapse defaultActiveKey={activeKeys} ghost items={items} />
    </div>
  );
};

export default ColorPresets;
