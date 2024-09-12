import React, { useState } from 'react'

// Mock user data
const user = {
  name: "John Doe",
  email: "john.doe@example.com",
  bio: "Passionate writer and tech enthusiast. I love sharing my knowledge and experiences through my blog posts.",
  avatar: "/placeholder.svg?height=200&width=200"
}

// Mock blog posts data
const initialBlogPosts = [
  { id: 1, title: "Getting Started with React", date: "2023-05-15", excerpt: "Learn the basics of React and start building your first application...", image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.hkWNtyeRI7DxlY_f4bBcNwHaE7%26pid%3DApi&f=1&ipt=4a9c089c46f9eb1c77ce89a3ae88ebb3dad566cec79e2c3e81f779e4f9e0aac4&ipo=images" },
  { id: 2, title: "Advanced CSS Techniques", date: "2023-05-14", excerpt: "Discover advanced CSS techniques to create stunning layouts and animations...", image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.hkWNtyeRI7DxlY_f4bBcNwHaE7%26pid%3DApi&f=1&ipt=4a9c089c46f9eb1c77ce89a3ae88ebb3dad566cec79e2c3e81f779e4f9e0aac4&ipo=images" },
  { id: 3, title: "JavaScript ES6 Features", date: "2023-05-13", excerpt: "Explore the powerful features introduced in ECMAScript 6 and how to use them...", image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.hkWNtyeRI7DxlY_f4bBcNwHaE7%26pid%3DApi&f=1&ipt=4a9c089c46f9eb1c77ce89a3ae88ebb3dad566cec79e2c3e81f779e4f9e0aac4&ipo=images" },
]

export default function ProfilePage() {
  const [blogPosts, setBlogPosts] = useState(initialBlogPosts)
  const [isEditing, setIsEditing] = useState(null)
  const [newPost, setNewPost] = useState({ title: '', excerpt: '', image: null })
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeNavItem, setActiveNavItem] = useState('Profile')

  const handleEdit = (id) => {
    setIsEditing(id)
  }

  const handleSave = (id) => {
    setIsEditing(null)
    // Here you would typically send an API request to update the post
  }

  const handleCancel = () => {
    setIsEditing(null)
    // Reset any changes made during editing
    setBlogPosts(initialBlogPosts)
  }

  const handleDelete = (id) => {
    setBlogPosts(blogPosts.filter(post => post.id !== id))
    // Here you would typically send an API request to delete the post
  }

  const handleNewPostChange = (e) => {
    const { name, value, files } = e.target
    if (name === 'image') {
      setNewPost(prev => ({ ...prev, [name]: files[0] }))
    } else {
      setNewPost(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleNewPostSubmit = (e) => {
    e.preventDefault()
    const id = Math.max(...blogPosts.map(post => post.id)) + 1
    const imageUrl = newPost.image ? URL.createObjectURL(newPost.image) : "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.hkWNtyeRI7DxlY_f4bBcNwHaE7%26pid%3DApi&f=1&ipt=4a9c089c46f9eb1c77ce89a3ae88ebb3dad566cec79e2c3e81f779e4f9e0aac4&ipo=images"
    setBlogPosts([{ id, date: new Date().toISOString().split('T')[0], ...newPost, image: imageUrl }, ...blogPosts])
    setNewPost({ title: '', excerpt: '', image: null })
    // Here you would typically send an API request to create the new post
  }

  const handleImageChange = (e, postId) => {
    const file = e.target.files[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setBlogPosts(posts => posts.map(post => post.id === postId ? {...post, image: imageUrl} : post))
    }
  }

  const navItems = ['Home', 'Categories', 'About', 'Contact', 'Profile']

  const handleNavItemClick = (item) => {
    setActiveNavItem(item)
    setIsMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200">
      {/* Navbar */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="font-semibold text-xl text-gray-800">BlogHub</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navItems.map((item) => (
                  <a
                    key={item}
                    href="#"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      activeNavItem === item
                        ? 'border-purple-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                    onClick={() => handleNavItemClick(item)}
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <button className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                <span className="sr-only">View notifications</span>
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              <div className="ml-3 relative">
                <div>
                  <button type="button" className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500" id="user-menu-button" aria-expanded="false" aria-haspopup="true">
                    <span className="sr-only">Open user menu</span>
                    <img className="h-8 w-8 rounded-full" src={user.avatar} alt="" />
                  </button>
                </div>
              </div>
            </div>
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
              <a
                key={item}
                href="#"
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  activeNavItem === item
                    ? 'bg-purple-50 border-purple-500 text-purple-700'
                    : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                }`}
                onClick={() => handleNavItemClick(item)}
              >
                {item}
              </a>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <img className="h-10 w-10 rounded-full" src={user.avatar} alt="" />
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">{user.name}</div>
                <div className="text-sm font-medium text-gray-500">{user.email}</div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">User Profile</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">{user.bio}</p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Full name</dt>
                <dd className="mt-1 text-sm text-gray-900">{user.name}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Email address</dt>
                <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Blog Posts</h2>
          
          {/* New Post Form */}
          <form onSubmit={handleNewPostSubmit} className="mb-8 bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Create New Post</h3>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={newPost.title}
                      onChange={handleNewPostChange}
                      className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </div>
                <div className="sm:col-span-6">
                  <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">Excerpt</label>
                  <div className="mt-1">
                    <textarea
                      id="excerpt"
                      name="excerpt"
                      value={newPost.excerpt}
                      onChange={handleNewPostChange}
                      rows="3"
                      className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounde

d-md"
                      required
                    ></textarea>
                  </div>
                </div>
                <div className="sm:col-span-6">
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image</label>
                  <div className="mt-1">
                    <input
                      type="file"
                      id="image"
                      name="image"
                      onChange={handleNewPostChange}
                      accept="image/*"
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
              <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                Create Post
              </button>
            </div>
          </form>

          {/* Blog Posts List */}
          <div className="space-y-6">
            {blogPosts.map(post => (
              <div key={post.id} className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="md:flex">
                  <div className="md:flex-shrink-0">
                    <img className="h-48 w-full object-cover md:w-48 md:h-full" src={post.image} alt={post.title} />
                  </div>
                  <div className="p-8 w-full">
                    {isEditing === post.id ? (
                      <div className="space-y-4">
                        <div>
                          <label htmlFor={`edit-title-${post.id}`} className="block text-sm font-medium text-gray-700">Title</label>
                          <input
                            type="text"
                            id={`edit-title-${post.id}`}
                            value={post.title}
                            onChange={(e) => setBlogPosts(posts => posts.map(p => p.id === post.id ? {...p, title: e.target.value} : p))}
                            className="mt-1 focus:ring-purple-500 focus:border-purple-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label htmlFor={`edit-excerpt-${post.id}`} className="block text-sm font-medium text-gray-700">Excerpt</label>
                          <textarea
                            id={`edit-excerpt-${post.id}`}
                            value={post.excerpt}
                            onChange={(e) => setBlogPosts(posts => posts.map(p => p.id === post.id ? {...p, excerpt: e.target.value} : p))}
                            className="mt-1 focus:ring-purple-500 focus:border-purple-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            rows="3"
                          ></textarea>
                        </div>
                        <div>
                          <label htmlFor={`edit-image-${post.id}`} className="block text-sm font-medium text-gray-700">Image</label>
                          <input
                            type="file"
                            id={`edit-image-${post.id}`}
                            onChange={(e) => handleImageChange(e, post.id)}
                            accept="image/*"
                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                          />
                        </div>
                        <div className="flex space-x-2">
                          <button onClick={() => handleSave(post.id)} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                            Save
                          </button>
                          <button onClick={handleCancel} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                        <p className="text-gray-600 mb-2">{post.date}</p>
                        <p className="text-gray-700 mb-4">{post.excerpt}</p>
                        <div className="flex space-x-2">
                          <button onClick={() => handleEdit(post.id)} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            Edit
                          </button>
                          <button onClick={() => handleDelete(post.id)} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}