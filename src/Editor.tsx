import { BoldOutlined, ItalicOutlined } from "@ant-design/icons";
import { Button } from "antd";
import Quill from "quill";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import "quill/dist/quill.core.css";

import { StyleAttributor, Scope } from "parchment";
export const SizeStyle = new StyleAttributor("size", "font-size", {
  scope: Scope.INLINE,
});
export const WidthStyle = new StyleAttributor("width", "width", {
  scope: Scope.INLINE,
});
export const HeightStyle = new StyleAttributor("height", "height", {
  scope: Scope.INLINE,
});
export const FontWeight = new StyleAttributor("font-weight", "font-weight", {
  scope: Scope.INLINE,
});
export const FontFamily = new StyleAttributor("font-family", "font-family", {
  scope: Scope.INLINE,
});
export const TextAlign = new StyleAttributor("text-align", "text-align", {
  scope: Scope.BLOCK,
});
Quill.register(FontWeight, true);
Quill.register(SizeStyle, true);
Quill.register(HeightStyle, true);
Quill.register(WidthStyle, true);
Quill.register(FontFamily, true);
Quill.register(TextAlign, true);

export default function Editor() {
  const toolbarRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);
  const [toolbarLocation, setToolbarLocation] = useState<HTMLElement | null>();

  useEffect(() => {
    if (!editorRef.current || quillRef.current) {
      return;
    }
    const toolbarDiv: HTMLElement | null =
      document.getElementById("global-toolbar");
    setToolbarLocation(toolbarDiv);

    if (toolbarLocation) {
      const quill = new Quill(editorRef.current, {
        modules: { toolbar: toolbarRef.current },
      });
      quillRef.current = quill;
    }
  }, [toolbarLocation]);

  const toolbar: ReactNode = (
    <div ref={toolbarRef}>
      <span className="ql-formats">
        <Button
          type="text"
          size="small"
          className="ql-bold"
          icon={<BoldOutlined />}
        />
        <Button
          type="text"
          size="small"
          className="ql-italic"
          icon={<ItalicOutlined />}
        />
      </span>
      <span className="ql-formats">
        <select className="ql-align"></select>
      </span>
    </div>
  );

  return (
    <>
      {toolbarLocation && createPortal(toolbar, toolbarLocation)}
      <div
        id="customEditor"
        ref={editorRef}
        className="bg-white w-3xl p-4 rounded"
      ></div>
    </>
  );
}
