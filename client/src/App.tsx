import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthPage from './pages/AuthPage';
import TaskManagerPage from './pages/TaskManagerPage';


const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/tasks"
            element={
              <PrivateRoute>
                <TaskManagerPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/"
            element={<Navigate to="/tasks" replace />}
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;