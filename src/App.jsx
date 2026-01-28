import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";

// delfiv System Components
import MealForm from "./components/MealForm";
import KitchenView from "./components/KitchenView";

// delfiv System Components
import DelfivMealForm from "./components/DelfivMealForm";
import DelfivKitchenView from "./components/DelfivKitchenView";

import "./styles.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />

          {/* delfiv System Routes */}
          <Route path="/form" element={<MealForm />} />
          <Route path="/kitchen" element={<KitchenView />} />

          {/* delfiv System Routes */}
          <Route path="/delfiv-declaration" element={<DelfivMealForm />} />
          <Route path="/delfiv-cuisine" element={<DelfivKitchenView />} />
        </Routes> 
      </div>
    </Router>
  );
}

export default App;
