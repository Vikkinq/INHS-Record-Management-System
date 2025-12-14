import "./App.css";

import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";

// import AdminRoute from "./app/routes/AdminRoute";
import ProtectedRoute from "./app/routes/ProtectedRoute";

import TestAuth from "./components/auth/TestAuth";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/test"
        element={
          <ProtectedRoute>
            <TestAuth />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
