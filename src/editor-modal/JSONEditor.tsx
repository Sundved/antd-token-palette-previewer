import React, { useEffect, useRef } from 'react';
import type { JSONEditorPropsOptional } from 'vanilla-jsoneditor';
import { JSONEditor, Mode } from 'vanilla-jsoneditor';

const Editor: React.FC<JSONEditorPropsOptional & { visible?: boolean }> = ({
  visible,
  ...props
}) => {
  const editorRef = useRef<JSONEditor | null>(null);
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    editorRef.current = new JSONEditor({
      target: container.current as HTMLDivElement,
      props: { mode: props.mode || Mode.text },
    });
    return () => {
      editorRef.current?.destroy();
    };
  }, []);

  useEffect(() => {
    editorRef.current?.updateProps(props);
  }, [props]);

  return (
    <div
      ref={container}
      className="vanilla-jsoneditor-react"
      style={{ display: visible ? 'block' : 'none' }}
    />
  );
};

export default Editor;
