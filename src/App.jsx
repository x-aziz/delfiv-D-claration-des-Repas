import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";

// Delfiv System Components
import MealForm from "./components/MealForm";
import KitchenView from "./components/KitchenView";

// Delfiv System Components
import DelfivMealForm from "./components/DelfivMealForm";
import DelfivKitchenView from "./components/DelfivKitchenView";

// New Components
import VacationManagement from "./components/VacationManagement";
import DutyDashboard from "./components/DutyDashboard";

import "./styles.css";
import { authService } from "./services/authService";

function App() {
  const isAuthenticated = authService.isAuthenticated();

  return (
    <Router>
      <div className="app-container">
        {isAuthenticated && <Navbar />}
        
        <Routes>
          {/* Login Route */}
          <Route 
            path="/login" 
            element={
              isAuthenticated ? (
                authService.isCurrentUserAdmin() ? (
                  <Navigate to="/kitchen" replace />
                ) : (
                  <Navigate to="/" replace />
                )
              ) : (
                <Login />
              )
            } 
          />

          {/* Protected Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />

          {/* Expense Form - All authenticated users */}
          <Route path="/form" element={
            <ProtectedRoute>
              <MealForm />
            </ProtectedRoute>
          } />

          {/* Kitchen View - Admin Only */}
          <Route path="/kitchen" element={
            <ProtectedRoute adminOnly={true}>
              <KitchenView />
            </ProtectedRoute>
          } />

          {/* Meal Declaration - All authenticated users */}
          <Route path="/delfiv-declaration" element={
            <ProtectedRoute>
              <DelfivMealForm />
            </ProtectedRoute>
          } />

          {/* Meal Kitchen View - Admin Only */}
          <Route path="/delfiv-cuisine" element={
            <ProtectedRoute adminOnly={true}>
              <DelfivKitchenView />
            </ProtectedRoute>
          } />

          {/* Vacation Management - Employees only */}
          <Route path="/vacation" element={
            <ProtectedRoute>
              <VacationManagement />
            </ProtectedRoute>
          } />

          {/* Duty Dashboard - All authenticated users */}
          <Route path="/duties" element={
            <ProtectedRoute>
              <DutyDashboard />
            </ProtectedRoute>
          } />

          {/* Redirect to login if not authenticated */}
          <Route path="*" element={
            isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;