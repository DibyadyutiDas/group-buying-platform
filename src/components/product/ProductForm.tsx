import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { useProducts } from '../../context/ProductContext';

const ProductForm: React.FC = () => {
  const navigate = useNavigate();
  const { addNewProduct } = useProducts();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    image: '',
    category: '',
    estimatedPurchaseDate: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      // Basic validation
      if (!formData.title.trim()) {
        throw new Error('Title is required');
      }
      
      if (!formData.description.trim()) {
        throw new Error('Description is required');
      }
      
      if (!formData.price || parseFloat(formData.price) <= 0) {
        throw new Error('Price must be greater than 0');
      }
      
      if (!formData.category.trim()) {
        throw new Error('Category is required');
      }
      
      if (!formData.estimatedPurchaseDate) {
        throw new Error('Estimated purchase date is required');
      }
      
      // If no image is provided, use a placeholder
      const image = formData.image.trim() || 'https://images.pexels.com/photos/4483610/pexels-photo-4483610.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
      
      await addNewProduct({
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        image,
        category: formData.category,
        estimatedPurchaseDate: formData.estimatedPurchaseDate
      });
      
      // Redirect to products page after successful submission
      navigate('/products');
      
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };
  
  const categories = [
    'Electronics',
    'Furniture',
    'Clothing',
    'Home & Kitchen',
    'Sports & Outdoors',
    'Books',
    'Toys & Games',
    'Beauty & Personal Care',
    'Other'
  ];
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
          <p>{error}</p>
        </div>
      )}
      
      <Input
        label="Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Enter product title"
        required
        fullWidth
      />
      
      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="px-3 py-2 bg-white border shadow-sm border-gray-300 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-blue-500 block w-full rounded-md sm:text-sm focus:ring-1"
          placeholder="Describe the product"
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Price"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          placeholder="0.00"
          min="0"
          step="0.01"
          required
          fullWidth
        />
        
        <div className="mb-4">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="px-3 py-2 bg-white border shadow-sm border-gray-300 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-blue-500 block w-full rounded-md sm:text-sm focus:ring-1"
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <Input
        label="Image URL (optional)"
        name="image"
        type="url"
        value={formData.image}
        onChange={handleChange}
        placeholder="https://example.com/image.jpg"
        fullWidth
      />
      
      <Input
        label="Estimated Purchase Date"
        name="estimatedPurchaseDate"
        type="date"
        value={formData.estimatedPurchaseDate}
        onChange={handleChange}
        min={new Date().toISOString().split('T')[0]}
        required
        fullWidth
      />
      
      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/products')}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          isLoading={loading}
          disabled={loading}
        >
          Add Product
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;