import moment from 'moment';
import axiosInstance from '../axiosConfig';
import React, { useState, useEffect } from 'react';
import DefaultNavbar from '../components/DefaultNavbar';
import DefaultFooter from '../components/DefaultFooter';
import { useNavigate, useParams } from 'react-router-dom';

const BlogDetailPage = () => {
    const { blogId } = useParams();
    const navigate = useNavigate();
    const [blogDetails, setBlogDetails] = useState([]);

    const getBlogDetails = async () => {
        try {
            const { data } = await axiosInstance.get("/blog/" + blogId);
            setBlogDetails(data);
        } catch (error) {
            console.log(error);
            if (error?.response?.status == 404) navigate('/page-not-found')
        }
    }

    useEffect(() => {
        getBlogDetails();
    }, [blogId]);

    if (!blogId) {
        return <div className="text-center text-2xl mt-8">Loading...</div>;
    }

    return (
        <div className="bg-gradient-to-br from-purple-100 to-indigo-200">
            <DefaultNavbar />

            <main className="min-h-screen container mx-auto px-4 py-8">
                <article className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="relative h-64 md:h-96 w-full">
                        <img
                            src={blogDetails?.blogImage}
                            alt={blogDetails?.title}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    </div>
                    <div className="p-6 md:p-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{blogDetails?.title}</h1>
                        <div className="flex items-center text-gray-600 mb-6">
                            <span className="mr-4">{blogDetails?.userId?.firstName + " " + blogDetails?.userId?.lastName}</span>
                            <span className="mr-4">|</span>
                            <span className="mr-4">{moment(blogDetails?.updatedAt).format("YYYY-MM-DD")}</span>
                        </div>
                        <div
                            className="prose prose-lg max-w-none"
                            dangerouslySetInnerHTML={{ __html: blogDetails?.description }}
                        />
                    </div>
                </article>
            </main>

            <DefaultFooter />
        </div>
    );
};

export default BlogDetailPage;