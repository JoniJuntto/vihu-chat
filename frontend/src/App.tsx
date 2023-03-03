import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Chat from "./Views/Chat";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Chat />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;