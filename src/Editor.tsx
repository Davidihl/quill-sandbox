import {
  AlignCenterOutlined,
  AlignLeftOutlined,
  AlignRightOutlined,
  BoldOutlined,
  ItalicOutlined,
} from "@ant-design/icons";
import { Button, Divider, Radio, Select } from "antd";
import Quill from "quill";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import DOMPurify from "dompurify";
import "./editor.css";
import "quill/dist/quill.snow.css";

import { StyleAttributor, Scope } from "parchment";
import { useDebounce } from "@uidotdev/usehooks";

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

  const [textAlign, setTextAlign] = useState<string>("left");

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

      quill.on("selection-change", (range) => {
        console.log(range);
        if (!range) return;
        const formats = quill.getFormat(range);
        console.log(formats["text-align"] || "left");

        // Update state for each format
        setTextAlign((formats["text-align"] || "left") as string);
      });
    }
  }, [toolbarLocation]);

  useDebounce(() => {
    if (!quillRef.current) {
      return;
    }
    quillRef.current.on("text-change", () => {
      if (convertedHtml.current) {
        convertedHtml.current.innerText =
          quillRef.current?.getSemanticHTML() || "";
      }
    });
  }, 1000);

  const toolbar: ReactNode = (
    <div ref={toolbarRef}>
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

      <Divider type="vertical" />
      <Select
        size="small"
        defaultValue={false}
        onChange={(value) => {
          quillRef.current?.format("size", `${value}%`);
        }}
        options={[
          { value: false, label: "100%" },
          { value: 200, label: "200%" },
        ]}
      />

      <Divider type="vertical" />
      <Radio.Group
        value={textAlign}
        size="small"
        onChange={(event) => {
          quillRef.current?.format("text-align", event.target.value);
          setTextAlign(event.target.value);
        }}
      >
        <Radio.Button value="left">
          <AlignLeftOutlined />
        </Radio.Button>
        <Radio.Button value="center">
          <AlignCenterOutlined />
        </Radio.Button>
        <Radio.Button value="right">
          <AlignRightOutlined />
        </Radio.Button>
        <Radio.Button value="justify">
          <div className="relative">
            <AlignLeftOutlined />
            <AlignRightOutlined className="absolute left-0 top-[4px]" />
          </div>
        </Radio.Button>
      </Radio.Group>
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
          }}
        />
        <div className="mt-4 mb-2 text-xs">Converted Quill HTML:</div>
        <div
          ref={convertedHtml}
          className="p-4 border font-mono text-xs border-gray-300 bg-gray-100 rounded break-all"
        />
      </div>
    </>
  );
}
