import type { ThemeConfig } from 'antd';
import type { ReactElement } from 'react';
import type {Color} from "antd/es/color-picker";

export type Theme = {
  name: string;
  key: string;
  config: ThemeConfig & {palette?: Record<string, string>};
};

export type AliasToken = Exclude<ThemeConfig['token'], undefined>;
export type TokenValue = string | number | string[] | number[] | boolean;
export type TokenName = keyof AliasToken;

export interface ComponentDemo {
  tokens?: TokenName[];
  demo: ReactElement;
  key: string;
}

export interface MutableTheme extends Theme {
  onThemeChange?: (newTheme: ThemeConfig, path: string[]) => void;
  onReset?: (path: string[]) => void;
  onAbort?: (path: string[]) => void;
  getCanReset?: (path: string[]) => boolean;
}

export type PreviewerProps = {
  onSave?: (themeConfig: ThemeConfig) => void;
  showTheme?: boolean;
  theme?: Theme;
  onThemeChange?: (config: ThemeConfig) => void;
};

export type SelectedToken = {
  seed?: string[];
  map?: string[];
  alias?: string[];
};

export type CustomPresetItem = {
  label: string;
  defaultOpen?: boolean;
  colors: {name: string; color: string | Color; }[]
};

export type CustomPresetItemColor = {
  name: string;
  color: string | Color;
};
