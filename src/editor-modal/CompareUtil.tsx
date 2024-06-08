import { Button, Skeleton } from 'antd';
import React, { Suspense, useMemo, useState } from 'react';
import type { Content } from 'vanilla-jsoneditor';
import { compareJson } from '../utils/compareJson';

const ANT_DESIGN_V5_CUSTOM_THEME_PRO_OLD = 'ant-design-v5-custom-theme-pro-old';

const JSONEditor = React.lazy(() => import('./JSONEditor'));

type Props = {
  newJsonText: string;
};

const CompareUtil: React.FC<Props> = ({ newJsonText }) => {
  const initial = useMemo(
    () => localStorage.getItem(ANT_DESIGN_V5_CUSTOM_THEME_PRO_OLD) || '',
    [],
  );
  const [content, setContent] = useState<{
    text: string;
    json?: undefined;
  }>({
    text: initial,
    json: undefined,
  });
  const [showDiff, setShowDiff] = useState(false);

  const handleChange = (newContent: Content) => {
    setContent(newContent as { text: string });
    localStorage.setItem(
      ANT_DESIGN_V5_CUSTOM_THEME_PRO_OLD,
      (newContent as { text: string }).text,
    );
  };
  const handleToggleCompare = () => {
    setShowDiff((prevState) => !prevState);
  };

  return (
    <>
      <Button onClick={handleToggleCompare} style={{ marginLeft: 12 }}>
        {showDiff ? 'Hide diff' : 'Show diff'}
      </Button>
      <div style={{ marginTop: 12 }}>
        <Suspense fallback={<Skeleton />}>
          <JSONEditor
            content={content}
            onChange={handleChange}
            mainMenuBar={false}
            visible={!showDiff}
          />
          <JSONEditor
            content={{ text: compareJson(newJsonText, content.text) }}
            mainMenuBar={false}
            visible={showDiff}
          />
        </Suspense>
      </div>
    </>
  );
};

export default CompareUtil;
