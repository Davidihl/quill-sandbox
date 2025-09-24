import Quill from "quill";
import { useEffect, useRef, useState } from "react";
import DOMPurify from "dompurify";
import "quill/dist/quill.snow.css";
import "./editor-snow-customization.css";

import { StyleAttributor, Scope } from "parchment";
import { useDebounce } from "@uidotdev/usehooks";

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
  const toolbarRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);
  const convertedHtml = useRef<HTMLDivElement>(null);
  const [toolbarLocation, setToolbarLocation] = useState<HTMLElement | null>();

  useEffect(() => {
    if (!editorRef.current || !editorContainerRef.current || quillRef.current) {
      return;
    }
    const toolbarDiv: HTMLElement | null =
      document.getElementById("global-toolbar");
    setToolbarLocation(toolbarDiv);

    if (toolbarLocation) {
      const toolbarOptions = [
        ["bold", "italic", "underline", "strike"], // toggled buttons
        ["blockquote", "code-block"],
        ["link", "image", "video", "formula"],

        [{ header: 1 }, { header: 2 }], // custom button values
        [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
        [{ script: "sub" }, { script: "super" }], // superscript/subscript
        [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
        [{ direction: "rtl" }], // text direction

        [{ size: ["50%", false, "200%"] }],
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
        formats: ["size"],
      });
      quill.format("size", false);
      quillRef.current = quill;

      toolbarRef.current = editorContainerRef.current.querySelector(
        'div[role="toolbar"].ql-toolbar.ql-snow'
      );

      if (toolbarRef.current) {
        toolbarLocation.appendChild(toolbarRef.current);
      }

      return () => {
        toolbarLocation.innerHTML = "";
      };
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

  return (
    <>
      <div ref={editorContainerRef} className="bg-white w-3xl p-4 rounded">
        <div ref={editorRef} />
      </div>
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
