import { FC } from "react";
import ReactQuill from "react-quill-new";

import "react-quill-new/dist/quill.snow.css";
import "./style.css";

type RichTextEditorProps = {
  value: string;
  placeholder?: string;
  onChange: (...event: unknown[]) => void;
  disabled?: boolean;
};

const RichTextEditor: FC<RichTextEditorProps> = (props) => {
  const modules = !props.disabled ? { toolbar: true } : { toolbar: false };

  return (
    <ReactQuill
      theme="snow"
      value={props.value}
      onChange={props.onChange}
      placeholder={props.placeholder}
      readOnly={props.disabled}
      modules={modules}
    />
  );
};

export default RichTextEditor;
