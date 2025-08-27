

import React from 'react';
import { Link } from 'react-router-dom';
import { FaTshirt, FaTruck, FaStar, FaClock } from 'react-icons/fa';
import Navbar from '../components/Navbar';
const Home = () => {
  const formatNaira = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar/>
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
             Laundry Services
          </h1>
          <p className="text-xl mb-8">
            Fast, affordable, and eco-friendly laundry solutions in Nigeria
          </p>
          <Link 
            to="/customer/orders/new" 
            className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition"
          >
            Order Now
          </Link>
        </div>
      </section>

      {/* Services */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                <div className="text-blue-500 text-4xl mb-4">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Simple Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricing.map((plan, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
                <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                <p className="text-4xl font-bold mb-4 text-blue-600">
                  {formatNaira(plan.price)}
                </p>
                <ul className="mb-6 space-y-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <FaStar className="text-yellow-400 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link 
                  to="/orders" 
                  className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Choose Plan
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                  <div>
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">"{testimonial.comment}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8">Sign up now and get 20% off your first order!</p>
          <Link 
            to="/orders" 
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition"
          >
            Book a Pickup Today
          </Link>
        </div>
      </section>
    </div>
  );
};

const services = [
  {
    icon: <FaTshirt />,
    title: "Wash & Fold",
    description: "Professionally cleaned and neatly folded laundry.",
  },
  {
    icon: <FaTruck />,
    title: "Pickup & Delivery",
    description: "We collect and deliver at your convenience.",
  },
  {
    icon: <FaClock />,
    title: "Express Service",
    description: "Get your laundry back in under 24 hours.",
  },
];

const pricing = [
  {
    name: "Basic",
    price: 5000, 
    features: ["5kg Load", "Wash & Fold", "3-Day Turnaround"],
  },
  {
    name: "Standard",
    price: 10000, 
    features: ["10kg Load", "Wash & Fold", "2-Day Turnaround", "Free Pickup"],
  },
  {
    name: "Premium",
    price: 15000, 
    features: ["15kg Load", "Wash & Fold", "24-Hour Service", "Free Pickup"],
  },
];

const testimonials = [
  {
    name: "nuhu",
    comment: "The fastest laundry service in Lagos! Highly recommended.",
  },
  {
    name: "Emeka",
    comment: "My clothes have never been cleaner. Great service!",
  },
];

export default Home;