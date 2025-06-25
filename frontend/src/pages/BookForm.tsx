import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import { BookFormData, Book, ErrorResponse } from '../types/book';
import { API_ENDPOINTS } from '../config/api';

const BookForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState<BookFormData>({
    name: '',
    author: '',
    publication: '',
    published_date: '',
    price: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fetchLoading, setFetchLoading] = useState(isEdit);

  const fetchBook = useCallback(async (bookId: number) => {
    try {
      setFetchLoading(true);
      const token = localStorage.getItem('accessToken');
      const userId = localStorage.getItem('userId');
      if (!token || !userId) {
        setError('User not authenticated. Please log in again.');
        navigate('/login');
        return;
      }

      console.log('Fetching book with ID:', bookId);
      console.log('User ID:', userId);
      console.log('Using token:', token);
      console.log('API Endpoint:', API_ENDPOINTS.BOOKS.DETAIL(bookId));

      const response = await axios.get(API_ENDPOINTS.BOOKS.DETAIL(bookId), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const book: Book = response.data;

      console.log('Book response:', response.data);

      setFormData({
        name: book.book_name,
        author: book.author_name,
        publication: book.publication_name,
        published_date: book.published_date,
        price: typeof book.price === 'string' ? parseFloat(book.price) : book.price,
      });
    } catch (err: unknown) {
      console.error('Fetch book error:', err);
      let errorMessage = 'Failed to fetch book details. Please try again.';
      if (err instanceof Error && 'response' in err) {
        const axiosError = err as { response?: { status: number; data: ErrorResponse } };
        if (axiosError.response?.status === 404) {
          errorMessage = 'Book not found or you do not have permission to edit it.';
          navigate('/books');
        } else if (axiosError.response?.status === 401) {
          errorMessage = 'User not authenticated. Please log in again.';
          navigate('/login');
        } else if (axiosError.response?.data?.detail) {
          errorMessage = axiosError.response.data.detail;
        }
      }
      setError(errorMessage);
    } finally {
      setFetchLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    if (isEdit && id) {
      const bookId = parseInt(id);
      if (isNaN(bookId)) {
        setError('Invalid book ID.');
        setFetchLoading(false);
        navigate('/books');
        return;
      }
      fetchBook(bookId);
    }
  }, [id, isEdit, navigate, fetchBook]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('User not authenticated. Please log in again.');
        navigate('/login');
        return;
      }

      if (formData.price === '') {
        setError('Price is required.');
        return;
      }

      const payload = {
        book_name: formData.name,
        author_name: formData.author,
        publication_name: formData.publication,
        published_date: formData.published_date,
        price: parseFloat(formData.price.toString()),
      };

      console.log('Submitting payload:', payload);

      if (isEdit && id) {
        await axios.put(API_ENDPOINTS.BOOKS.UPDATE(parseInt(id)), payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(API_ENDPOINTS.BOOKS.CREATE, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      navigate('/books');
    } catch (err: unknown) {
      console.error('Submit error:', err);
      let errorMessage = `Failed to ${isEdit ? 'update' : 'create'} book. Please try again.`;
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
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? (value === '' ? '' : parseFloat(value) || '') : value,
    }));
  };

  if (fetchLoading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="text-lg">Loading book details...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {isEdit ? 'Edit Book' : 'Add New Book'}
            </h2>
            <p className="text-gray-600 mt-1">
              {isEdit ? 'Update the book information' : 'Fill in the details to add a new book'}
            </p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Book Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter the book title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Author Name *
              </label>
              <input
                type="text"
                name="author"
                required
                value={formData.author}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter the author's name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Publication Name *
              </label>
              <input
                type="text"
                name="publication"
                required
                value={formData.publication}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter the publisher's name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Published Date *
              </label>
              <input
                type="date"
                name="published_date"
                required
                value={formData.published_date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (NPR) *
              </label>
              <input
                type="number"
                name="price"
                required
                step="100"
                min="0"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter price (e.g., 1900)"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-6">
              <button
                type="button"
                onClick={() => navigate('/books')}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : (isEdit ? 'Update Book' : 'Add Book')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default BookForm;