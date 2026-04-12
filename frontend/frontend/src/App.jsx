import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Default page is now Login */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected Dashboard page */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* If the URL doesn't match anything, go to Login */}
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;