

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Invoice({ customerId }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customer: customerId,
    items: [{ description: '', quantity: 1, price: 500 }],
    discount: 0,
    taxRate: 10, 
    notes: '',
    paymentMethod: 'cash',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'taxRate' || name === 'discount' ? parseFloat(value) || 0 : value
    }));
  };

  // Handle item field changes
  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const newItems = [...formData.items];
    newItems[index] = {
      ...newItems[index],
      [name]: name === 'quantity' || name === 'price' ? parseFloat(value) || 0 : value
    };
    setFormData(prev => ({ ...prev, items: newItems }));
  };

  // Add new empty item
  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, price: 0 }]
    }));
  };

  // Remove item
  const removeItem = (index) => {
    if (formData.items.length <= 1) return;
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, items: newItems }));
  };

  // Calculate totals
  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const tax = subtotal * (formData.taxRate / 100);
    const total = subtotal + tax - formData.discount;
    return { subtotal, tax, total };
  };

  const { subtotal, tax, total } = calculateTotals();

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    // Validate form
    const newErrors = {};
    formData.items.forEach((item, index) => {
      if (!item.description) newErrors[`items[${index}].description`] = 'Description is required';
      if (item.price <= 0) newErrors[`items[${index}].price`] = 'Price must be positive';
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post('/api/invoices', {
        ...formData,
        subtotal,
        tax,
        grandTotal: total
      });
      
      // Redirect to PDF view or invoice details
      navigate(`/invoices/${response.data._id}`);
    } catch (err) {
      console.error('Invoice creation failed:', err);
      setErrors({ submit: err.response?.data?.message || 'Failed to create invoice' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Create New Invoice</h2>
      
      <form onSubmit={handleSubmit}>
        {/* Invoice Items */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Items</h3>
          {formData.items.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-4 mb-4 items-end">
              <div className="col-span-6">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <input
                  type="text"
                  name="description"
                  value={item.description}
                  onChange={(e) => handleItemChange(index, e)}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors[`items[${index}].description`] ? 'border-red-500' : 'border'}`}
                  required
                />
                {errors[`items[${index}].description`] && (
                  <p className="mt-1 text-sm text-red-600">{errors[`items[${index}].description`]}</p>
                )}
              </div>
              
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">Qty</label>
                <input
                  type="number"
                  name="quantity"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, e)}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">Price</label>
                <input
                  type="number"
                  name="price"
                  min="0"
                  step="0.01"
                  value={item.price}
                  onChange={(e) => handleItemChange(index, e)}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors[`items[${index}].price`] ? 'border-red-500' : 'border'}`}
                  required
                />
                {errors[`items[${index}].price`] && (
                  <p className="mt-1 text-sm text-red-600">{errors[`items[${index}].price`]}</p>
                )}
              </div>
              
              <div className="col-span-1 flex items-end">
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  disabled={formData.items.length <= 1}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          
          <button
            type="button"
            onClick={addItem}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add Item
          </button>
        </div>

        {/* Payment Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Tax Rate (%)</label>
            <input
              type="number"
              name="taxRate"
              min="0"
              step="0.1"
              value={formData.taxRate}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Discount (₦)</label>
            <input
              type="number"
              name="discount"
              min="0"
              step="0.01"
              value={formData.discount}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Payment Method</label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="cash">Cash</option>
              <option value="card">Credit Card</option>
              <option value="transfer">Bank Transfer</option>
            </select>
          </div>
        </div>

        {/* Due Date */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Due Date</label>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required
          />
        </div>

        {/* Notes */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        {/* Totals */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="flex justify-between mb-2">
            <span className="font-medium">Subtotal:</span>
            <span>₦{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="font-medium">Tax ({formData.taxRate}%):</span>
            <span>₦{tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="font-medium">Discount:</span>
            <span>-₦{formData.discount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
            <span>Total:</span>
            <span>₦{total.toFixed(2)}</span>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating Invoice...' : 'Create Invoice'}
          </button>
        </div>

        {errors.submit && (
          <div className="mt-4 text-red-600 text-center">
            {errors.submit}
          </div>
        )}
      </form>
    </div>
  );
}

export default Invoice;