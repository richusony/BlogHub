import moment from "moment";
import axiosInstance from '../axiosConfig';
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import DefaultNavbar from '../components/DefaultNavbar';
import DefaultFooter from "../components/DefaultFooter";

export default function Component() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(()=>{
    getAllBlogs();
  },[])

  const filteredPosts = blogs.filter(blog =>
    blog?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog?.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getAllBlogs = async () => {
    try {
      const { data } = await axiosInstance.get("/blogs");
      setBlogs(data);
    } catch (error) { }
  }

  return (
    <div className="bg-gradient-to-br from-purple-100 to-indigo-200">
      {/* Navbar */}
      <DefaultNavbar />

      {/* Main Content */}
      <div className="min-h-screen container mx-auto px-4 py-8">
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
            <div onClick={() => navigate("/blog/"+post?._id)} key={post?._id} className="bg-white rounded-lg shadow-md overflow-hidden">
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
      <DefaultFooter />
    </div>
  )
}