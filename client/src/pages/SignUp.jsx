import { useState } from 'react';
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";
import { Link } from 'react-router-dom';
import { validateEmail, validatePassword } from '../utils/helper';

export default function SignUp() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if(!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      return Toastify({
        text: "Fill all fields",
        duration: 3000,
        destination: "",
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "left", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #A554F6, #5547E7)",
        },
        onClick: function () { } // Callback after click
      }).showToast();
    }

    if (!validateEmail(formData.email)) {
      return Toastify({
        text: "Enter a valid email",
        duration: 3000,
        destination: "",
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "left", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #A554F6, #5547E7)",
        },
        onClick: function () { } // Callback after click
      }).showToast();
    }

    if (!validatePassword(formData.password)) {
      return Toastify({
        text: "Password must be 8 characters includes uppercase, lowercase, and digits",
        duration: 3000,
        destination: "",
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "left", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #A554F6, #5547E7)",
        },
        onClick: function () { } // Callback after click
      }).showToast();
    }

    console.log('Form submitted:', formData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 px-6 py-8 text-white">
          <h2 className="text-3xl font-bold mb-2">Create Account</h2>
          <p className="text-purple-100">Sign up to get started!</p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="John"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Doe"
              />
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="text"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="john@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="••••••••"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold py-3 px-4 rounded-md hover:opacity-90 transition duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              Sign Up
            </button>
          </div>
        </form>
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <p className="text-sm text-center text-gray-600">
            Already have an account?{' '}
            <Link to="/signin" className="font-medium text-purple-600 hover:text-purple-500">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}