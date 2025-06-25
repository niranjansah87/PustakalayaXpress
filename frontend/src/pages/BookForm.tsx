import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import { BookFormData, Book } from '../types/book';
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
    price: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fetchLoading, setFetchLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit && id) {
      fetchBook(parseInt(id));
    }
  }, [id, isEdit]);

  const fetchBook = async (bookId: number) => {
    try {
      setFetchLoading(true);
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('User not authenticated.');
        return;
      }

      const response = await axios.get(API_ENDPOINTS.BOOKS.DETAIL(bookId), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const book: Book = response.data;

      setFormData({
        name: book.book_name, // Map book_name to name
        author: book.author_name, // Map author_name to author
        publication: book.publication_name, // Map publication_name to publication
        published_date: book.published_date,
        price: typeof book.price === 'string' ? parseFloat(book.price) : book.price,
      });
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch book details. Please try again.');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('User not authenticated.');
        return;
      }

      // Map formData to backend field names
      const payload = {
        book_name: formData.name,
        author_name: formData.author,
        publication_name: formData.publication,
        published_date: formData.published_date,
        price: parseFloat(formData.price.toString()),
      };

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
    } catch (err: any) {
      setError(err.response?.data?.detail || `Failed to ${isEdit ? 'update' : 'create'} book. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? (value === '' ? 0 : parseFloat(value) || 0) : value,
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