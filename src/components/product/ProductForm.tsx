import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import Input from '../common/Input';
import { useProducts } from '../../context/ProductContext';
import { useToast } from '../../context/ToastContext';

const ProductForm: React.FC = () => {
  const navigate = useNavigate();
  const { addNewProduct } = useProducts();
  const { error: showError } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    image: '',
    category: '',
    estimatedPurchaseDate: ''
  });
  
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      errors.title = 'Title must be at least 3 characters';
    } else if (formData.title.length > 100) {
      errors.title = 'Title cannot exceed 100 characters';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      errors.description = 'Description must be at least 10 characters';
    } else if (formData.description.length > 1000) {
      errors.description = 'Description cannot exceed 1000 characters';
    }
    
    if (!formData.price) {
      errors.price = 'Price is required';
    } else if (parseFloat(formData.price) <= 0) {
      errors.price = 'Price must be greater than 0';
    } else if (parseFloat(formData.price) > 1000000) {
      errors.price = 'Price cannot exceed $1,000,000';
    }
    
    if (!formData.category.trim()) {
      errors.category = 'Category is required';
    }
    
    if (!formData.estimatedPurchaseDate) {
      errors.estimatedPurchaseDate = 'Estimated purchase date is required';
    } else {
      const selectedDate = new Date(formData.estimatedPurchaseDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate <= today) {
        errors.estimatedPurchaseDate = 'Estimated purchase date must be in the future';
      }
    }
    
    if (formData.image && formData.image.trim()) {
      try {
        new URL(formData.image);
      } catch {
        errors.image = 'Please enter a valid URL';
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showError('Validation Error', 'Please fix the errors in the form');
      return;
    }
    
    try {
      setLoading(true);
      
      // If no image is provided, use a placeholder
      const image = formData.image.trim() || 'https://images.pexels.com/photos/4483610/pexels-photo-4483610.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
      
      await addNewProduct({
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        image,
        category: formData.category,
        estimatedPurchaseDate: formData.estimatedPurchaseDate,
        createdBy: "anonymous" // This will be replaced by the backend with actual user id
      });
      
      // Redirect to products page after successful submission
      navigate('/products');
      
    } catch (err) {
      console.error('Failed to add product:', err);
      showError('Error', 'Failed to add product. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const categories = [
    'Electronics',
    'Fashion',
    'Home & Garden',
    'Sports',
    'Books',
    'Health & Beauty',
    'Other'
  ];
  
  // Get tomorrow's date as minimum date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Product Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Enter product title"
        required
        fullWidth
        error={validationErrors.title}
      />
      
      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className={`px-3 py-2 bg-white dark:bg-gray-800 border shadow-sm border-gray-300 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-blue-500 block w-full rounded-md sm:text-sm focus:ring-1 ${
            validationErrors.description ? 'border-red-500 dark:border-red-400' : ''
          }`}
          placeholder="Describe the product in detail"
          required
        />
        {validationErrors.description && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.description}</p>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Price ($)"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          placeholder="0.00"
          min="0"
          step="0.01"
          required
          fullWidth
          error={validationErrors.price}
        />
        
        <div className="mb-4">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`px-3 py-2 bg-white dark:bg-gray-800 border shadow-sm border-gray-300 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-blue-500 block w-full rounded-md sm:text-sm focus:ring-1 ${
              validationErrors.category ? 'border-red-500 dark:border-red-400' : ''
            }`}
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {validationErrors.category && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.category}</p>
          )}
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
        error={validationErrors.image}
      />
      
      <Input
        label="Estimated Purchase Date"
        name="estimatedPurchaseDate"
        type="date"
        value={formData.estimatedPurchaseDate}
        onChange={handleChange}
        min={minDate}
        required
        fullWidth
        error={validationErrors.estimatedPurchaseDate}
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