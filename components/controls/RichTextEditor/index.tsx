import ReactQuill from "react-quill-new";
import { FC } from "react";

import "react-quill-new/dist/quill.snow.css";
import "./style.css";

type RichTextEditorProps = {
  value: string;
  placeholder?: string;
  onChange: (...event: unknown[]) => void;
};

const RichTextEditor: FC<RichTextEditorProps> = (props) => (
  <ReactQuill
    theme="snow"
    value={props.value}
    onChange={props.onChange}
    placeholder={props.placeholder}
  />
);

export default RichTextEditor;
