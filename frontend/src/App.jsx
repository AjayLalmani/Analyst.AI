import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import FloatingPaths from "./components/ui/floating-paths";
import Home from "./components/Home";
import Upload from "./components/Upload";
import IndexLineChart from "./components/Chart";
import Chat from "./components/Chat";
import { useState } from "react";
import TestChat from "./components/TestChat";

function App() {
  const [data, setData] = useState({});
  console.log("Data from app : " + JSON.stringify(data));

  return (
    <BrowserRouter>
      {/* ── Persistent background — mounted once, survives route changes ── */}
      <div className="fixed inset-0 bg-[#0a0a0a] z-0 overflow-hidden">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>

      {/* ── Toast notifications ── */}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "rgba(20,20,20,0.9)",
            color: "#ffffff",
            border: "1px solid rgba(255,255,255,0.12)",
            backdropFilter: "blur(12px)",
            fontFamily: "Inter, sans-serif",
            fontSize: "0.875rem",
          },
          success: { iconTheme: { primary: "#34d399", secondary: "#0a0a0a" } },
          error: { iconTheme: { primary: "#f87171", secondary: "#0a0a0a" } },
        }}
      />

      {/* ── Page content sits on top ── */}
      <div className="relative z-[1] min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<Upload handleData={(d) => setData(d)} />} />
          <Route path="/chart" element={<IndexLineChart />} />
          <Route path="/chat" element={<Chat csvData={data} />} />
          <Route path="/test-chat" element={<TestChat csvData={data} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
