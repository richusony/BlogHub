import { useNavigate } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/userContext';
import DefaultNavbar from '../components/DefaultNavbar';
import axiosInstance from '../axiosConfig';
import { validateImageFile } from '../utils/helper';

// Mock user data
const userData = {
  name: "John Doe",
  email: "john.doe@example.com",
  bio: "Passionate writer and tech enthusiast. I love sharing my knowledge and experiences through my blog posts.",
  avatar: "/placeholder.svg?height=200&width=200"
}

// Mock blog posts data
const initialBlogPosts = [
  { id: 1, title: "Getting Started with React", date: "2023-05-15", description: "Learn the basics of React and start building your first application...", image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.hkWNtyeRI7DxlY_f4bBcNwHaE7%26pid%3DApi&f=1&ipt=4a9c089c46f9eb1c77ce89a3ae88ebb3dad566cec79e2c3e81f779e4f9e0aac4&ipo=images" },
  { id: 2, title: "Advanced CSS Techniques", date: "2023-05-14", description: "Discover advanced CSS techniques to create stunning layouts and animations...", image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.hkWNtyeRI7DxlY_f4bBcNwHaE7%26pid%3DApi&f=1&ipt=4a9c089c46f9eb1c77ce89a3ae88ebb3dad566cec79e2c3e81f779e4f9e0aac4&ipo=images" },
  { id: 3, title: "JavaScript ES6 Features", date: "2023-05-13", description: "Explore the powerful features introduced in ECMAScript 6 and how to use them...", image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.hkWNtyeRI7DxlY_f4bBcNwHaE7%26pid%3DApi&f=1&ipt=4a9c089c46f9eb1c77ce89a3ae88ebb3dad566cec79e2c3e81f779e4f9e0aac4&ipo=images" },
]

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout } = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(null);
  const [blogPosts, setBlogPosts] = useState(initialBlogPosts);
  const [newPost, setNewPost] = useState({ title: '', description: '', blogImage: null });

  useEffect(() => {
    // console.log("user",user);
    if (!user) return navigate("/signin");
  }, [user])

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
    const { name, value, files } = e.target;
    if (name === 'blogImage') {
      const file = files[0];
      if (!file) return;

      const error = validateImageFile(file);
      if (error) {
        return Toastify({
          text: error,
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
      setNewPost(prev => ({ ...prev, [name]: file }));
    } else {
      setNewPost(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleNewPostSubmit = async (e) => {
    e.preventDefault()
    // const id = Math.max(...blogPosts.map(post => post.id)) + 1
    // const imageUrl = newPost.image ? URL.createObjectURL(newPost.image) : "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.hkWNtyeRI7DxlY_f4bBcNwHaE7%26pid%3DApi&f=1&ipt=4a9c089c46f9eb1c77ce89a3ae88ebb3dad566cec79e2c3e81f779e4f9e0aac4&ipo=images"
    // setBlogPosts([{ id, date: new Date().toISOString().split('T')[0], ...newPost, image: imageUrl }, ...blogPosts])
    // setNewPost({ title: '', description: '', image: null })
    // Here you would typically send an API request to create the new post

    const formData = new FormData();
    formData.append("title", newPost.title);
    formData.append("description", newPost.description);
    formData.append("blogImage", newPost.blogImage);
    try {
      const res = await axiosInstance.post("/create-blog", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      });

    setNewPost({ title: '', description: '', blogImage: null });
    return Toastify({
        text: "Blog Posted Successfully",
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
    } catch (error) {
      return Toastify({
        text: error?.response?.data?.error,
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
  }

  const handleImageChange = (e, postId) => {
    const file = e.target.files[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setBlogPosts(posts => posts.map(post => post.id === postId ? { ...post, image: imageUrl } : post))
    }
  }

  const handleLogoutUser = async () => {
    try {
      const res = await axiosInstance.delete("/logout");
      console.log(res);
      logout();
      navigate("/signin");
    } catch (error) {
      return Toastify({
        text: error?.response?.data?.error,
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
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200">
      {/* Navbar */}
      <DefaultNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 relative">
            <h3 className="text-lg leading-6 font-medium text-gray-900">User Profile</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">{userData.bio}</p>
            <button onClick={handleLogoutUser} className='absolute top-4 right-4 py-1 px-4 bg-red-500 text-white rounded shadow-md'>Logout</button>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Full name</dt>
                <dd className="mt-1 text-sm text-gray-900">{user?.firstName + " " + user?.lastName}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Email address</dt>
                <dd className="mt-1 text-sm text-gray-900">{user?.email}</dd>
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
                      className="py-2 px-2 shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </div>
                <div className="sm:col-span-6">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                  <div className="mt-1">
                    <textarea
                      id="description"
                      name="description"
                      value={newPost.description}
                      onChange={handleNewPostChange}
                      rows="3"
                      className="py-1 px-2 shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      required
                    ></textarea>
                  </div>
                </div>
                <div className="sm:col-span-6">
                  <label htmlFor="blogImage" className="block text-sm font-medium text-gray-700">Image</label>
                  <div className="mt-1">
                    <input
                      type="file"
                      id="blogImage"
                      name="blogImage"
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
                            onChange={(e) => setBlogPosts(posts => posts.map(p => p.id === post.id ? { ...p, title: e.target.value } : p))}
                            className="mt-1 focus:ring-purple-500 focus:border-purple-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label htmlFor={`edit-description-${post.id}`} className="block text-sm font-medium text-gray-700">description</label>
                          <textarea
                            id={`edit-description-${post.id}`}
                            value={post.description}
                            onChange={(e) => setBlogPosts(posts => posts.map(p => p.id === post.id ? { ...p, description: e.target.value } : p))}
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
                        <p className="text-gray-700 mb-4">{post.description}</p>
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