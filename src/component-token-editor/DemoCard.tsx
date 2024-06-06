import { Card, ConfigProvider, Tag, theme as antTheme } from 'antd';
import type { FC } from 'react';
import React, { useMemo, useState } from 'react';
import type { ComponentDemo, MutableTheme } from '../interface';
import { useLocale } from '../locale';
import { HIGHLIGHT_COLOR } from '../utils/constants';
import { getColoredToken } from '../utils/getColoredTheme';

export interface DemoCardProps {
  demo: ComponentDemo;
  theme: MutableTheme;
}

const DemoCard: FC<DemoCardProps> = ({ theme, demo: item }) => {
  const antToken = antTheme.useToken();
  const themeToken = theme.config?.token || {};
  const locale = useLocale();
  const coloredToken = getColoredToken(themeToken, true, theme?.config);

  const token = { ...antToken.token, ...coloredToken };

  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);

  const toggle = (targetToken: string) => () => {
    setSelectedTokens((prev) => {
      return prev.includes(targetToken)
        ? prev.filter((t) => t !== targetToken)
        : [...prev, targetToken];
    });
  };

  const tokenOverride = useMemo(() => {
    return selectedTokens.reduce<any>((result, t) => {
      result[t] = HIGHLIGHT_COLOR;
      return result;
    }, {});
  }, [selectedTokens]);

  const shownTokens = useMemo(() => {
    return item.tokens?.filter((t) => t.toLowerCase().includes('color')) ?? [];
  }, [item.tokens]);

  return (
    <Card
      bodyStyle={{
        padding: 0,
      }}
    >
      <div style={{ padding: 20 }}>
        <ConfigProvider
          theme={{
            token: { ...coloredToken, ...tokenOverride },
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
          }}
        >
          {item.demo}
        </ConfigProvider>
      </div>
      {shownTokens.length > 0 && (
        <div
          style={{
            background: token.colorFillQuaternary,
            padding: '12px 20px 20px',
            borderRadius: `0 0 ${token.borderRadiusLG}px ${token.borderRadiusLG}px`,
            boxShadow: 'inset 0 2px 4px 0 rgba(25,15,15,0.07)',
          }}
        >
          <div style={{ color: token.colorTextDescription, marginBottom: 12 }}>
            {locale.demo.relatedTokensDescription}
          </div>
          {shownTokens.map((t) => (
            <Tag
              bordered={false}
              key={t}
              onClick={toggle(t)}
              color={selectedTokens.includes(t) ? 'blue' : undefined}
              style={{ cursor: 'pointer', userSelect: 'none' }}
            >
              {t}
            </Tag>
          ))}
        </div>
      )}
    </Card>
  );
};

export default DemoCard;
