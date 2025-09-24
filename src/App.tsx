import Editor from "./Editor";
// import EditorSnow from "./EditorSnow";

function App() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 h-full">
      <div id="global-toolbar" className="bg-white rounded p-4 w-3xl"></div>
      <Editor />
      {/* <EditorSnow /> */}
    </div>
  );
}

export default App;
