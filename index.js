import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";
import {
  commentCreateValidation,
  loginValidation,
  postCreateValidation,
  registerValidation,
} from "./validations/auth.js";
import * as UserController from "./controllers/UserController.js";
import * as PostController from "./controllers/PostController.js";
import * as CommentController from "./controllers/CommentController.js";

import checkAuth from "./utils/checkAuth.js";
import handleValidationError from "./utils/handleValidationError.js";

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("DB Ok"))
  .catch((err) => console.log("error", err));

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });
const app = express();
app.get("/", (req, res) => {
  res.send("Hello");
});
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.post(
  "/auth/login",
  loginValidation,
  handleValidationError,
  UserController.login
);
app.post(
  "/auth/register",
  registerValidation,
  handleValidationError,
  UserController.register
);
app.get("/auth/me", checkAuth, UserController.getMe);
app.get("/tags", PostController.getLastTags);

app.get("/posts", PostController.getAll);
app.get("/posts/tags", PostController.getLastTags);

app.post(
  "/posts",
  checkAuth,
  postCreateValidation,
  handleValidationError,
  PostController.create
);

app.get("/comments", CommentController.getAll);

app.post(
  "/comments",
  checkAuth,
  commentCreateValidation,
  handleValidationError,
  CommentController.create
);
app.delete("/comments/:id", checkAuth, CommentController.remove);

app.get("/posts/:id", PostController.getOne);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch("/posts/:id", handleValidationError, PostController.update);

app.listen(process.env.PORT || 4444, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("server ok");
  }
});
