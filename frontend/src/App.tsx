import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import Login from './Login';
import Register from './Register';
import Books from './Books';
import AddBook from './AddBook';
import EditBook from './EditBook';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/books" element={<Books />} />
          <Route path="/books/new" element={<AddBook />} />
          <Route path="/books/:id/edit" element={<EditBook />} />
          <Route path="/" element={<Navigate to="/books" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;