"use client";

import { FC, useCallback, useMemo, useRef } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

type RichTextEditorProps = {
  value: string;
  placeholder?: string;
  onChange: (html: string, plainText: string) => void;
};

const RichTextEditor: FC<RichTextEditorProps> = ({
  value,
  placeholder,
  onChange,
}) => {
  const quillRef = useRef<ReactQuill | null>(null);

  const handleChange = useCallback(
    (html: string) => {
      const editor = quillRef.current?.getEditor();
      const text = editor?.getText() ?? "";
      onChange(html, text.trimEnd());
    },
    [onChange],
  );

  const modules = useMemo(
    () => ({
      toolbar: [],
    }),

    [],
  );
  const formats: string[] = [];

  return (
    <ReactQuill
      ref={quillRef}
      theme="snow"
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      modules={modules}
      formats={formats}
    />
  );
};

export default RichTextEditor;
