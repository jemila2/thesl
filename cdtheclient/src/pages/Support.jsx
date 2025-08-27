
import React, { useState } from 'react';
import { FiMail, FiPhone, FiMessageSquare, FiHelpCircle } from 'react-icons/fi';

const Support = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log('Support request submitted:', formData);
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    
 
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Customer Support</h1>
      
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Contact Information */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
            <FiHelpCircle className="mr-2" /> Contact Options
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <FiMail className="text-blue-500 mt-1 mr-3" />
              <div>
                <h3 className="font-medium text-gray-800">Email Support</h3>
                <p className="text-gray-600">support@laundryfr.com</p>
                <p className="text-sm text-gray-500">Typically responds within 24 hours</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <FiPhone className="text-blue-500 mt-1 mr-3" />
              <div>
                <h3 className="font-medium text-gray-800">Phone Support</h3>
                <p className="text-gray-600">+1 (555) 123-4567</p>
                <p className="text-sm text-gray-500">Mon-Fri, 9AM-5PM</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <FiMessageSquare className="text-blue-500 mt-1 mr-3" />
              <div>
                <h3 className="font-medium text-gray-800">Live Chat</h3>
                <p className="text-gray-600">Available in-app</p>
                <p className="text-sm text-gray-500">Mon-Fri, 8AM-8PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">FAQs</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-800">How do I track my order?</h3>
              <p className="text-gray-600 text-sm">You can track your order in the 'My Orders' section of your account.</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-800">What are your business hours?</h3>
              <p className="text-gray-600 text-sm">We're open 7 days a week from 7AM to 10PM.</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-800">Do you offer pickup and delivery?</h3>
              <p className="text-gray-600 text-sm">Yes, we offer both services. Delivery fees may apply.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Send us a message</h2>
        
        {submitted && (
          <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
            Thank you! Your message has been submitted. We'll get back to you soon.
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
              required
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
              required
            />
          </div>
          
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
              required
            />
          </div>
          
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
            <textarea
              id="message"
              name="message"
              rows="4"
              value={formData.message}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
              required
            />
          </div>
          
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Submit Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default Support;