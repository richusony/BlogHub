import { Link, useNavigate } from 'react-router-dom';
import React, { useContext, useState } from 'react';
import { UserContext } from '../context/userContext';

const DefaultNavbar = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState('Home');
  const userProfileImage = `https://api.dicebear.com/9.x/bottts/webp?seed=${user?.firstName}`;

  const navItems = [
    { page: 'Home', path: "/" },
    { page: 'Categories', path: "/" },
    { page: 'About', path: "/" },
    { page: 'Contact', path: "/" },
  ];

  const handleNavItemClick = (item) => {
    setActiveNavItem(item.page);
    setIsMenuOpen(false);
    navigate(item.path);
  }

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="font-semibold text-xl text-gray-800">BlogHub</Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <span
                  key={item.page}
                  className={`transition-all ease-linear inline-flex items-center px-1 pt-1 border-b-2 text-sm cursor-pointer font-medium ${activeNavItem === item.page
                    ? 'border-purple-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  onClick={() => handleNavItemClick(item)}
                >
                  {item.page}
                </span>
              ))}
            </div>
          </div>

          {user ?
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <button className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                <span className="sr-only">View notifications</span>
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              <div className="ml-3 relative">
                <div>
                  <button onClick={()=>navigate("/profile")} type="button" className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500" id="user-menu-button" aria-expanded="false" aria-haspopup="true">
                    <span className="sr-only">Open user menu</span>
                    <img className="h-8 w-8 rounded-full" src={userProfileImage} alt="user" />
                  </button>
                </div>
              </div>
            </div>
            :
            <>
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
            </>
          }
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className={`${isMenuOpen ? 'block' : 'hidden'} sm:hidden`} id="mobile-menu">
        <div className="pt-2 pb-3 space-y-1">
          {navItems.map((item) => (
            <span
              key={item.page}
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${activeNavItem === item.page
                ? 'bg-purple-50 border-purple-500 text-purple-700'
                : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                }`}
              onClick={() => handleNavItemClick(item)}
            >
              {item.page}
            </span>
          ))}
        </div>
        <div className="pt-4 pb-3 border-t border-gray-200">
          <div onClick={()=>navigate("/profile")} className="flex items-center px-4">
            <div className="flex-shrink-0">
              <img className="h-10 w-10 rounded-full" src={userProfileImage} alt="user" />
            </div>
            <div className="ml-3">
              <div className="text-base font-medium text-gray-800">{user?.firstName}</div>
              <div className="text-sm font-medium text-gray-500">{user?.email}</div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default DefaultNavbar