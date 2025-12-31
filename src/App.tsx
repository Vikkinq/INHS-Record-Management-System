import "./App.css";

import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import MainPage from "./pages/main/MainPage";

// import AdminRoute from "./app/routes/AdminRoute";
import ProtectedRoute from "./app/routes/ProtectedRoute";
import PublicRoute from "./app/routes/PublicRoute";

import TestAuth from "./components/auth/TestAuth";
import EmployeeProfile from "./pages/employee/EmployeeProfile";
import EmployeeFiles from "./components/employee/EmployeeFiles";

function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/test"
        element={
          <ProtectedRoute>
            <TestAuth />
          </ProtectedRoute>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/employee/:employeeId"
        element={
          <ProtectedRoute>
            <EmployeeProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/employee/:employeeId/files"
        element={
          <ProtectedRoute>
            <EmployeeFiles />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
