import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    blogImage: {
        type: String,
        require: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        require: true
    }
}, { timestamps: true});

const BlogModel = mongoose.model("blogs", blogSchema);

export default BlogModel;