import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Play from "./pages/Play";

const PageRouter: React.FC = () => {
  return (
    <Router basename="pulipuli">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/play/:vcode/:pid" element={<Play />} />
      </Routes>
    </Router>
  );
};

export default PageRouter;
