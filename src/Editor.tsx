import Quill from "quill";
import { useEffect, useRef } from "react";

export default function Editor() {
  const toolbarRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);

  useEffect(() => {
    if (!editorRef.current || quillRef.current) {
      return;
    }

    const quill = new Quill(editorRef.current, {
      modules: { toolbar: "toolbar" },
    });
    quillRef.current = quill;
  }, []);

  return (
    <>
      <div ref={toolbarRef}></div>
      <div
        id="customEditor"
        ref={editorRef}
        className="bg-white w-3xl p-4 rounded"
      ></div>
    </>
  );
}
