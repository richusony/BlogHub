import moment from "moment";
import axiosInstance from '../axiosConfig';
import { useEffect, useState } from 'react';
import DefaultNavbar from '../components/DefaultNavbar';

// Mock data for blog posts
const blogPosts = [
  { id: 1, title: "Getting Started with React", author: "Jane Doe", date: "2023-05-15", category: "React", excerpt: "Learn the basics of React and start building your first application. This comprehensive guide will walk you through the core concepts and help you set up your development environment.", image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.hkWNtyeRI7DxlY_f4bBcNwHaE7%26pid%3DApi&f=1&ipt=4a9c089c46f9eb1c77ce89a3ae88ebb3dad566cec79e2c3e81f779e4f9e0aac4&ipo=images" },
  { id: 2, title: "Advanced CSS Techniques", author: "John Smith", date: "2023-05-14", category: "CSS", excerpt: "Discover advanced CSS techniques to create stunning layouts and animations. From CSS Grid to custom properties, elevate your styling skills to the next level.", image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.hkWNtyeRI7DxlY_f4bBcNwHaE7%26pid%3DApi&f=1&ipt=4a9c089c46f9eb1c77ce89a3ae88ebb3dad566cec79e2c3e81f779e4f9e0aac4&ipo=images" },
  { id: 3, title: "JavaScript ES6 Features", author: "Emily Johnson", date: "2023-05-13", category: "JavaScript", excerpt: "Explore the powerful features introduced in ECMAScript 6 and how to use them in your projects. Learn about arrow functions, destructuring, and more.", image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.hkWNtyeRI7DxlY_f4bBcNwHaE7%26pid%3DApi&f=1&ipt=4a9c089c46f9eb1c77ce89a3ae88ebb3dad566cec79e2c3e81f779e4f9e0aac4&ipo=images" },
  { id: 4, title: "Building RESTful APIs", author: "Michael Brown", date: "2023-05-12", category: "Backend", excerpt: "Learn how to design and implement RESTful APIs for your web applications. This guide covers best practices, authentication, and common pitfalls to avoid.", image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.hkWNtyeRI7DxlY_f4bBcNwHaE7%26pid%3DApi&f=1&ipt=4a9c089c46f9eb1c77ce89a3ae88ebb3dad566cec79e2c3e81f779e4f9e0aac4&ipo=images" },
  { id: 5, title: "Introduction to Machine Learning", author: "Sarah Wilson", date: "2023-05-11", category: "AI", excerpt: "Get started with machine learning concepts and implement your first ML model. This beginner-friendly guide will introduce you to key algorithms and practical applications.", image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.hkWNtyeRI7DxlY_f4bBcNwHaE7%26pid%3DApi&f=1&ipt=4a9c089c46f9eb1c77ce89a3ae88ebb3dad566cec79e2c3e81f779e4f9e0aac4&ipo=images" },
]

export default function Component() {
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(()=>{
    getAllBlogs();
  },[])

  const filteredPosts = blogs.filter(blog =>
    blog?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog?.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog?.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getAllBlogs = async () => {
    try {
      const { data } = await axiosInstance.get("/blogs");
      setBlogs(data);
    } catch (error) { }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200">
      {/* Navbar */}
      {/* <nav className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between">
            <div className="flex space-x-7">
              <div>
                <a href="#" className="flex items-center py-4 px-2">
                  <span className="font-semibold text-gray-500 text-lg">BlogHub</span>
                </a>
              </div>
              <div className="hidden md:flex items-center space-x-1">
                {navItems.map((item) => (
                  <a
                    key={item}
                    href="#"
                    className={`py-4 px-2 font-semibold transition duration-300 ${activeNavItem === item
                        ? 'text-purple-500 border-b-4 border-purple-500'
                        : 'text-gray-500 hover:text-purple-500'
                      }`}
                    onClick={() => handleNavItemClick(item)}
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-3">
              <a href="/signin" className="py-2 px-2 font-medium text-gray-500 rounded hover:bg-purple-500 hover:text-white transition duration-300">Log In</a>
              <a href="/signup" className="py-2 px-2 font-medium text-white bg-purple-500 rounded hover:bg-purple-400 transition duration-300">Sign Up</a>
            </div>
            <div className="md:hidden flex items-center">
              <button className="outline-none mobile-menu-button" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <svg className="w-6 h-6 text-gray-500 hover:text-purple-500"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
          {navItems.map((item) => (
            <a
              key={item}
              href="#"
              className={`block py-2 px-4 text-sm ${activeNavItem === item
                  ? 'bg-purple-500 text-white'
                  : 'hover:bg-purple-500 hover:text-white'
                } transition duration-300`}
              onClick={() => handleNavItemClick(item)}
            >
              {item}
            </a>
          ))}
          <a href="#" className="block py-2 px-4 text-sm hover:bg-purple-500 hover:text-white transition duration-300">Log In</a>
          <a href="#" className="block py-2 px-4 text-sm hover:bg-purple-500 hover:text-white transition duration-300">Sign Up</a>
        </div>
      </nav> */}
      <DefaultNavbar />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Welcome to BlogHub</h1>

        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search blogs..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Blog Posts */}
        <div className="space-y-8">
          {filteredPosts.map(post => (
            <div key={post?.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/3 lg:w-1/4">
                  <div className="h-48 md:h-full w-full relative">
                    <img
                      src={post?.blogImage}
                      alt={`Cover image for ${post?.title}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="p-6 md:p-8 md:w-2/3 lg:w-3/4">
                  <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">{post?.category}</div>
                  <a href="#" className="block mt-1 text-lg leading-tight font-medium text-black hover:underline">{post?.title.length > 100 ? post?.description.substring(0,100) + "...": post?.title}</a>
                  <p className="mt-2 text-gray-500">{post?.description.length > 200 ? post?.description.substring(0,200) + "...": post?.description}</p>
                  <div className="mt-4">
                    <span className="text-gray-600 text-sm">By {post?.userId?.firstName + " " + post?.userId?.lastName} | {moment(post?.updatedAt).format("YYYY-MM-DD")}</span>
                  </div>
                  <a href="#" className="mt-4 inline-block text-purple-500 hover:text-purple-600 font-semibold">Read More</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between">
            <div className="w-full md:w-1/3 mb-6 md:mb-0">
              <h3 className="text-lg font-semibold mb-2">About BlogHub</h3>
              <p className="text-gray-400">BlogHub is a platform for sharing knowledge and ideas. Join our community of writers and readers today!</p>
            </div>
            <div className="w-full md:w-1/3 mb-6 md:mb-0">
              <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
              <ul className="text-gray-400">
                <li><a href="#" className="hover:text-white">Home</a></li>
                <li><a href="#" className="hover:text-white">Categories</a></li>
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div className="w-full md:w-1/3">
              <h3 className="text-lg font-semibold mb-2">Connect With Us</h3>
              <ul className="text-gray-400">
                <li><a href="#" className="hover:text-white">Facebook</a></li>
                <li><a href="#" className="hover:text-white">Twitter</a></li>
                <li><a href="#" className="hover:text-white">Instagram</a></li>
                <li><a href="#" className="hover:text-white">LinkedIn</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-400 text-sm">
            © 2023 BlogHub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}