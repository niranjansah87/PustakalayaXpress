import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import { Book, ErrorResponse } from '../types/book';
import { API_ENDPOINTS } from '../config/api';

const Books: React.FC = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('accessToken');

      if (!userId || !token) {
        setError('User not authenticated. Please log in again.');
        navigate('/login');
        return;
      }


      const response = await axios.get(API_ENDPOINTS.BOOKS.LIST_BY_USER(parseInt(userId)), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      
      setBooks(response.data);
    } catch (err: unknown) {
      console.error('Fetch books error:', err);
      let errorMessage = 'Failed to fetch books. Please try again.';
      if (err instanceof Error && 'response' in err) {
        const axiosError = err as { response?: { status: number; data: ErrorResponse } };
        if (axiosError.response?.status === 401) {
          errorMessage = 'User not authenticated. Please log in again.';
          navigate('/login');
        } else if (axiosError.response?.data?.detail) {
          errorMessage = axiosError.response.data.detail;
        }
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('User not authenticated. Please log in again.');
        navigate('/login');
        return;
      }

      console.log('Deleting book with ID:', id);
      await axios.delete(API_ENDPOINTS.BOOKS.DELETE(id), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBooks(books.filter(book => book.id !== id));
      setDeleteConfirm(null);
    } catch (err: unknown) {
      console.error('Delete book error:', err);
      let errorMessage = 'Failed to delete book. Please try again.';
      if (err instanceof Error && 'response' in err) {
        const axiosError = err as { response?: { status: number; data: ErrorResponse } };
        if (axiosError.response?.status === 401) {
          errorMessage = 'User not authenticated. Please log in again.';
          navigate('/login');
        } else if (axiosError.response?.data?.detail) {
          errorMessage = axiosError.response.data.detail;
        }
      }
      setError(errorMessage);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatPrice = (price: number | string) => {
    const priceNum = typeof price === 'string' ? parseFloat(price) : price;
    return isNaN(priceNum) ? '0.00' : `${priceNum.toFixed(2)}`;
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="text-lg">Loading books...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">My Books</h2>
              <p className="text-gray-600 mt-1">Manage your book collection</p>
            </div>
            <Link
              to="/books/new"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
            >
              Add New Book
            </Link>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Books Table */}
        {books.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No books found</h3>
            <p className="text-gray-500 mb-4">Start by adding your first book to the collection.</p>
            <Link
              to="/books/new"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
            >
              Add Your First Book
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">
                    Book Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">
                    Publication
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">
                    Published Date
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">
                    Price (NPR)
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {books.map((book) => (
                  <tr key={book.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {book.book_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {book.author_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {book.publication_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {formatDate(book.published_date)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {formatPrice(book.price)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex space-x-2">
                        <Link
                          to={`/books/${book.id}/edit`}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => setDeleteConfirm(book.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete this book? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Books;