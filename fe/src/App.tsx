import { Suspense } from "react";
import "./index.css"; // renamed global.css → index.css
import WorkflowBuilder from "./pages/WorkflowBuilder";

function App() {
  return (
    <div className="font-sans antialiased">
      <Suspense fallback={null}>
        <WorkflowBuilder />
      </Suspense>
    </div>
  );
}

export default App;
