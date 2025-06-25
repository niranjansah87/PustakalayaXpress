import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Books from './pages/Books';
import BookForm from './pages/BookForm';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/books" 
            element={
              <ProtectedRoute>
                <Books />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/books/new" 
            element={
              <ProtectedRoute>
                <BookForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/books/:id/edit" 
            element={
              <ProtectedRoute>
                <BookForm />
              </ProtectedRoute>
            } 
          />
          <Route path="/" element={<Navigate to="/books" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;