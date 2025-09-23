import Editor from "./Editor";

function App() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 h-full">
      <div id="global-toolbar" className="bg-white rounded p-4 w-3xl"></div>
      <Editor />
    </div>
  );
}

export default App;
