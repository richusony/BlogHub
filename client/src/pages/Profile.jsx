import moment from "moment";
import axiosInstance from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContext';
import DefaultNavbar from '../components/DefaultNavbar';
import React, { useContext, useEffect, useState } from 'react';
import { handleToast, validateImageFile } from '../utils/helper';

// Mock user data
const userData = {
  bio: "Passionate writer and tech enthusiast. I love sharing my knowledge and experiences through my blog posts.",
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const [blogPosts, setBlogPosts] = useState([]);
  const { user, logout } = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(null);
  const [originalBlog, setOriginalBlog] = useState(null);
  const [newPost, setNewPost] = useState({ _id: '', title: '', description: '', blogImage: null });

  useEffect(() => {
    if (!user) return navigate("/signin");
    getUserPostedBlogs();
  }, [user]);

  const getUserPostedBlogs = async () => {
    try {
      const { data } = await axiosInstance.get("/my-blogs");
      setBlogPosts(data);
    } catch (error) {
      return handleToast(error?.response?.data?.error);
    }
  }

  const handleEdit = (id) => {
    setIsEditing(id);
    setOriginalBlog(blogPosts.find(post => post._id === id));
  }

  const handleSave = async (blog) => {
    if (!blog.title || !blog.description || !blog.blogImage) {
      return handleToast("All Fields are required");
    }

    if (typeof blog.blogImage !== "string") {
      const imageError = validateImageFile(blog.blogImage);
      if (imageError) return handleToast(imageError);
    }

    setIsEditing(null);

    const formData = new FormData();
    formData.append("_id", blog._id);
    formData.append("title", blog.title);
    formData.append("description", blog.description);
    formData.append("blogImage", blog.blogImage);

    try {
      const { data } = await axiosInstance.patch("/update-blog", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      });

      setBlogPosts(posts => posts.map(post => post?._id === blog._id ?
        {
          _id: data._id,
          title: data.title || originalBlog.title, // Use the original title if data.title is undefined
          description: data.description || originalBlog.description, // Use the original description if data.description is undefined
          blogImage: data.blogImage || originalBlog.blogImage
        } : post))
      setOriginalBlog(null);

      return handleToast("Blog Updated");
    } catch (error) {
      return handleToast(error?.response?.data?.error);
    }
  }

  const handleCancel = () => {
    setIsEditing(null)
    // Reset any changes made during editing
    setBlogPosts(posts => posts.map(post => post?._id === originalBlog._id ?
      {
        _id: originalBlog._id,
        title: originalBlog.title, // Use the original title if data.title is undefined
        description: originalBlog.description, // Use the original description if data.description is undefined
        blogImage: originalBlog.blogImage
      } : post))
  }

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure?");
    if (!confirm) return;

    try {
      const res = await axiosInstance.delete("/remove-blog/" + id);
      setBlogPosts(blogPosts.filter(post => post._id !== id));
      return handleToast("Blog Deleted Successfully");
    } catch (error) {
      return handleToast(error?.response?.data?.error);
    }
  }

  const handleNewPostChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'blogImage') {
      const file = files[0];
      if (!file) return;

      const error = validateImageFile(file);
      if (error) {
        return handleToast(error);
      }
      setNewPost(prev => ({ ...prev, [name]: file }));
    } else {
      setNewPost(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleNewPostSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.title || !newPost.description || !newPost.blogImage) {
      return handleToast("All Fields are required");
    }

    const imageError = validateImageFile(newPost.blogImage);
    if (imageError) return handleToast(imageError);

    const formData = new FormData();
    formData.append("title", newPost.title);
    formData.append("description", newPost.description);
    formData.append("blogImage", newPost.blogImage);
    try {
      const { data } = await axiosInstance.post("/create-blog", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      });

      setNewPost({ title: '', description: '', blogImage: null });
      setBlogPosts([...blogPosts, data]);

      return handleToast("Blog Posted Successfully");
    } catch (error) {
      return handleToast(error?.response?.data?.error);
    }
  }

  const handleImageChange = (e, postId) => {
    const file = e.target.files[0];

    if (!file) return;

    const error = validateImageFile(file);
    if (error) {
      return handleToast(error);
    }

    if (file) {
      // const imageUrl = URL.createObjectURL(file)
      setBlogPosts(posts => posts.map(post => post?._id === postId ? { ...post, blogImage: file } : post))
    }
  }

  const handleLogoutUser = async () => {
    try {
      const res = await axiosInstance.delete("/logout");
      console.log(res);
      logout();
      navigate("/signin");
    } catch (error) {
      return handleToast(error?.response?.data?.error);
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
          <form onSubmit={handleNewPostSubmit} key={"newPostForm"} className="mb-8 bg-white shadow sm:rounded-lg">
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
          <div key={"BlogPostList"} className="space-y-6">
            {blogPosts.length > 0 && blogPosts.map(post => (
              <div key={post?._id} className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="md:flex">
                  <div className="md:flex-shrink-0">
                    <img className="h-48 w-full object-cover md:w-48 md:h-full" src={post?.blogImage} alt={post?.title} />
                  </div>
                  <div className="p-8 w-full">
                    {isEditing === post?._id ? (
                      <div className="space-y-4">
                        <div>
                          <label htmlFor={`edit-title-${post?._id}`} className="block text-sm font-medium text-gray-700">Title</label>
                          <input
                            type="text"
                            id={`edit-title-${post?._id}`}
                            value={post?.title}
                            onChange={(e) => setBlogPosts(posts => posts.map(p => p._id === post?._id ? { ...p, title: e.target.value } : p))}
                            className="py-1 px-1 mt-1 focus:ring-purple-500 focus:border-purple-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label htmlFor={`edit-description-${post?._id}`} className="block text-sm font-medium text-gray-700">description</label>
                          <textarea
                            id={`edit-description-${post?._id}`}
                            value={post?.description}
                            onChange={(e) => setBlogPosts(posts => posts.map(p => p._id === post?._id ? { ...p, description: e.target.value } : p))}
                            className="py-1 px-2 mt-1 focus:ring-purple-500 focus:border-purple-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            rows="3"
                          ></textarea>
                        </div>
                        <div>
                          <label htmlFor={`edit-image-${post?._id}`} className="block text-sm font-medium text-gray-700">Image</label>
                          <input
                            type="file"
                            id={`edit-image-${post?._id}`}
                            onChange={(e) => handleImageChange(e, post?._id)}
                            accept="image/*"
                            name="blogImage"
                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                          />
                        </div>
                        <div className="flex space-x-2">
                          <button onClick={() => handleSave(post)} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                            Save
                          </button>
                          <button onClick={handleCancel} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{post?.title.length > 80 ? post?.title.substring(0, 80) + "..." : post?.title}</h3>
                        <p className="text-gray-600 mb-2">{moment(post?.updatedAt).format("YYYY-MM-DD")}</p>
                        <p className="text-gray-700 mb-4">{post?.description.length > 100 ? post?.description.substring(0, 100) + "..." : post?.description}</p>
                        <div className="flex space-x-2">
                          <button onClick={() => handleEdit(post?._id)} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            Edit
                          </button>
                          <button onClick={() => handleDelete(post?._id)} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
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