import Quill from "quill";
import { useEffect, useRef } from "react";
import "quill/dist/quill.snow.css";
import "./editor-snow-customization.css";

import { StyleAttributor, Scope } from "parchment";

export const FontColor = new StyleAttributor("color", "color", {
  scope: Scope.INLINE,
});
export const SizeStyle = new StyleAttributor("size", "font-size", {
  whitelist: ["50%", "200%"],
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
  scope: Scope.INLINE,
});
Quill.register(FontWeight, true);
Quill.register(SizeStyle, true);
Quill.register(HeightStyle, true);
Quill.register(WidthStyle, true);
Quill.register(FontFamily, true);
Quill.register(TextAlign, true);
Quill.register(FontColor, true);

export default function Editor() {
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);
  const convertedHtml = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!editorRef.current || !editorContainerRef.current || quillRef.current) {
      return;
    }

    const toolbarOptions = [
      ["bold", "italic", "underline", "strike"], // toggled buttons
      ["blockquote", "code-block"],
      ["link", "image", "video", "formula"],

      [{ header: 1 }, { header: 2 }], // custom button values
      [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
      [{ script: "sub" }, { script: "super" }], // superscript/subscript
      [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
      [{ direction: "rtl" }], // text direction

      [{ size: ["small", false, "large", "huge"] }], // custom dropdown
      [{ header: [1, 2, 3, 4, 5, 6, false] }],

      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ font: [] }],
      [{ align: [] }],

      ["clean"], // remove formatting button
    ];

    const quill = new Quill(editorRef.current, {
      modules: {
        toolbar: toolbarOptions,
      },
      theme: "snow",
      placeholder: "Insert text here",
    });
    quill.format("size", false);
    quillRef.current = quill;
  }, []);

  return (
    <>
      <div ref={editorContainerRef} className="bg-white w-3xl p-4 rounded">
        <div ref={editorRef} />
      </div>
      <div className="bg-white w-3xl p-4 rounded">
        <div className="mt-4 mb-2 text-xs">Converted Quill HTML:</div>
        <div
          ref={convertedHtml}
          className="p-4 border font-mono text-xs border-gray-300 bg-gray-100 rounded break-all"
        />
      </div>
    </>
  );
}
