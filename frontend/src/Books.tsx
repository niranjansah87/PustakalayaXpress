import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import axios from 'axios';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchBooks();
  }, [token, navigate]);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('/api/books/');
      setBooks(response.data);
    } catch (err) {
      setError('Failed to fetch books');
    } finally {
      setLoading(false);
    }
  };

  const deleteBook = async (id:number) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await axios.delete(`/api/books/${id}/`);
        setBooks(books.filter(book => book.id !== id));
      } catch (err) {
        alert('Failed to delete book');
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src="/image.jpg" 
              alt="Pustakalayaexpress" 
              className="h-10 w-auto mr-3"
            />
            <h1 className="text-xl font-bold text-gray-800">Pustakalayaexpress - My Books</h1>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="mb-4">
          <Link
            to="/books/new"
            className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Add New Book
          </Link>
        </div>

        {books.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No books found. Add your first book!</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">Book Name</th>
                  <th className="px-4 py-3 text-left">Author</th>
                  <th className="px-4 py-3 text-left">Publication</th>
                  <th className="px-4 py-3 text-left">Published Date</th>
                  <th className="px-4 py-3 text-left">Price</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book.id} className="border-t">
                    <td className="px-4 py-3">{book.name}</td>
                    <td className="px-4 py-3">{book.author}</td>
                    <td className="px-4 py-3">{book.publication}</td>
                    <td className="px-4 py-3">{book.published_date}</td>
                    <td className="px-4 py-3">${book.price}</td>
                    <td className="px-4 py-3">
                      <Link
                        to={`/books/${book.id}/edit`}
                        className="bg-yellow-500 hover:bg-yellow-700 text-white px-3 py-1 rounded mr-2"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => deleteBook(book.id)}
                        className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Books;