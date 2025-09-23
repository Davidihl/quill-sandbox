import { BoldOutlined, ItalicOutlined } from "@ant-design/icons";
import { Button } from "antd";
import Quill from "quill";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import DOMPurify from "dompurify";
import "./editor.css";
// import "quill/dist/quill.core.css";

import { StyleAttributor, Scope } from "parchment";
export const FontColor = new StyleAttributor("color", "color", {
  scope: Scope.INLINE,
});
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
Quill.register(FontColor, true);

export default function Editor() {
  const toolbarRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);
  const convertedHtml = useRef<HTMLDivElement>(null);
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
      />

      <div className="bg-white w-3xl p-4 rounded">
        <div className="mb-2 text-xs">Copy HTML code here:</div>
        <div
          contentEditable={true}
          className="focus:ring-0 focus:outline-0 p-4 border font-mono text-xs border-gray-300 bg-gray-100 rounded"
          onBlur={(event) => {
            const rawHtml = event.target.innerText;
            const safeHtml = DOMPurify.sanitize(rawHtml, {
              ALLOWED_ATTR: ["style", "class"],
            });

            if (quillRef.current) {
              const deltaContent = quillRef.current.clipboard.convert({
                html: safeHtml,
              });
              quillRef.current.setContents(deltaContent);
            }
            console.log(quillRef.current?.getSemanticHTML());
            if (convertedHtml.current) {
              convertedHtml.current.innerText =
                quillRef.current?.getSemanticHTML() || "";
            }
            // event.currentTarget.innerHTML = "";
          }}
        />
        <div className="mt-4 mb-2 text-xs">Converted Quill HTML</div>
        <div
          ref={convertedHtml}
          className="focus:ring-0 focus:outline-0 p-4 border font-mono text-xs border-gray-300 bg-gray-100 rounded"
        />
      </div>
    </>
  );
}
