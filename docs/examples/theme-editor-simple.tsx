import { Button, ConfigProvider, message, theme as antdTheme } from 'antd';
import type { Theme } from 'antd-token-previewer';
import {
  enUS,
  parsePlainConfig,
  parseThemeConfig,
  ThemeEditor,
  zhCN,
} from 'antd-token-previewer';
import 'antd/es/style/reset.css';
import antdZhCN from 'antd/locale/zh_CN';
import React, { useEffect } from 'react';
import { DarkTheme, Light } from '../../src/icons';
import type { ThemeEditorMode } from '../../src/ThemeEditor';
import {palette} from "../../src/consts/palette";

const ANT_DESIGN_V5_CUSTOM_THEME_PRO = 'ant-design-v5-custom-theme-pro';

const Demo = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [lang, setLang] = React.useState('en-US');
  const [advanced, setAdvanced] = React.useState(true);
  const [mode, setMode] = React.useState<ThemeEditorMode>('global');
  const [isDark, setIsDark] = React.useState(false);
  const [theme, setTheme] = React.useState<Theme>({
    name: 'Our theme',
    key: 'secret theme',
    config: {
      palette
    },
  });

  const handleThemeChange = (newTheme: Theme) => {
    console.log(newTheme);
    setTheme(newTheme);
  };

  useEffect(() => {
    const storedConfig = localStorage.getItem(ANT_DESIGN_V5_CUSTOM_THEME_PRO);
    if (storedConfig) {
      setTheme((prev) => ({
        ...prev,
        config: parseThemeConfig(JSON.parse(storedConfig)),
      }));
    }
  }, []);

  const handleSave = () => {
    console.log(theme.config, parsePlainConfig(theme.config));
    localStorage.setItem(
      ANT_DESIGN_V5_CUSTOM_THEME_PRO,
      JSON.stringify(parsePlainConfig(theme.config)),
    );
    messageApi.success('Success');
  };

  return (
    <React.StrictMode>
      {contextHolder}
      <ConfigProvider
        locale={lang === 'zh-CN' ? antdZhCN : undefined}
        theme={{
          hashed: true,
          algorithm: isDark ? antdTheme.darkAlgorithm : undefined,
        }}
      >
        <ThemeEditor
          theme={theme}
          onThemeChange={handleThemeChange}
          locale={lang === 'zh-CN' ? zhCN : enUS}
          advanced={advanced}
          onAdvancedChange={setAdvanced}
          mode={mode}
          onModeChange={setMode}
          actions={
            <>
              <Button
                type="text"
                icon={lang === 'zh-CN' ? '中' : 'EN'}
                onClick={() => setLang(lang === 'en-US' ? 'zh-CN' : 'en-US')}
                style={{ marginRight: 8 }}
              />
              <Button
                type="text"
                icon={
                  isDark ? (
                    <DarkTheme style={{ fontSize: 16 }} />
                  ) : (
                    <Light style={{ fontSize: 16 }} />
                  )
                }
                onClick={() => setIsDark(!isDark)}
                style={{ marginRight: 8 }}
              />
              <Button type="primary" onClick={handleSave}>
                Save
              </Button>
            </>
          }
        />
      </ConfigProvider>
    </React.StrictMode>
  );
};

export default Demo;
