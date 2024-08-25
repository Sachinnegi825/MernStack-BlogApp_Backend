import { Router } from "express";
import {
  getAllPosts,
  createPost,
  editPost,
  getPostById,
  addCommentToPost,
  deletePostById,
} from "../controllers/posts.controller.js";

import { upload } from "../middlerwares/multer.middleware.js";
import { authMiddleware } from "../middlerwares/auth.middleware.js";

const router = Router();

router.route("/getPosts").get(getAllPosts);

router
  .route("/createPost")
  .post(authMiddleware, upload.single("image"), createPost);

router.route("/getPost/:id").get(getPostById);

router
  .route("/editPost/:id")
  .put(authMiddleware, upload.single("image"), editPost);

router.post("/:id/comments", authMiddleware, addCommentToPost);

router.delete("/deletePost/:id", authMiddleware, deletePostById);

export default router;
