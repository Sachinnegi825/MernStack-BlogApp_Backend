import { Posts } from "../models/post.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";

// Controller function to get all posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await Posts.find().populate("author", "username");
    return res
      .status(200)
      .json(new ApiResponse(200, posts, "Posts fetched Successfully"));
  } catch (err) {
    res.status(err.code || 500).json({
      success: false,
      message: err.message,
    });
  }
};

const createPost = async (req, res) => {
  try {
    const { title, content, description } = req.body;

    let imageUrl = null;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const newPost = new Posts({
      title,
      content,
      author: req.user._id,
      description,
      image: imageUrl,
    });

    await newPost.save();

    return res
      .status(201)
      .json(new ApiResponse(201, newPost, "Post Created Successfully"));
  } catch (err) {
    res.status(err.code || 500).json({
      success: false,
      message: err.message,
    });
  }
};

const getPostById = async (req, res) => {
  try {
    const postId = req.params.id.trim();
    const post = await Posts.findById(postId)
      .populate("author", "name")
      .populate({
        path: "comments",
        populate: {
          path: "author",
          select: "name",
        },
      });

    if (!post) {
      return res.status(404).json(new ApiResponse(404, null, "Post not found"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, post, "Post fetched successfully"));
  } catch (err) {
    res.status(err.code || 500).json({
      success: false,
      message: err.message,
    });
  }
};

// Controller function to edit a post
const editPost = async (req, res) => {
  try {
    const postId = req.params.id.trim();
    const { title, content, author, description } = req.body;

    let imageUrl = null;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const updatedPostData = {
      title,
      content,
      author,
      description,
    };

    if (imageUrl) {
      updatedPostData.image = imageUrl;
    }

    const updatedPost = await Posts.findByIdAndUpdate(postId, updatedPostData, {
      new: true,
      runValidators: true,
    });

    if (!updatedPost) {
      return res.status(404).json(new ApiResponse(404, null, "Post not found"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, updatedPost, "Post updated successfully"));
  } catch (err) {
    res.status(err.code || 500).json({
      success: false,
      message: err.message,
    });
  }
};

const addCommentToPost = async (req, res) => {
  try {
    const id = req.params.id.trim();
    const { content } = req.body;
    const newComment = new Comment({
      content,
      author: req.user,
      post: id,
    });

    const savedComment = await newComment.save();

    const post = await Posts.findById(id);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    post.comments.push(savedComment._id);
    await post.save();
    res
      .status(201)
      .json(new ApiResponse(201, savedComment, "Comment Added Succesfully"));
  } catch (err) {
    res.status(err.code || 500).json({
      success: false,
      message: err.message,
    });
  }
};

export const deletePostById = async (req, res) => {
  try {
    const postId = req.params.id.trim();

    const post = await Posts.findById(postId);

    if (!post) {
      return res.status(404).json(new ApiResponse(404, null, "Post not found"));
    }

    if (!post.author.equals(req.user._id)) {
      return res
        .status(403)
        .json(
          new ApiResponse(
            403,
            null,
            "You are not authorized to delete this post"
          )
        );
    }

    await post.deleteOne();

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Post deleted successfully"));
  } catch (err) {
    res.status(err.code || 500).json({
      success: false,
      message: err.message,
    });
  }
};

export { getAllPosts, createPost, editPost, getPostById, addCommentToPost };
