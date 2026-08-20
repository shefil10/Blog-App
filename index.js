import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import crypto from "crypto";
import cors from "cors";
import mongoose, { mongo } from "mongoose";
import Blog from "./models/Blog.js";

const app = express();
// let blogs = [
//   {
//     id: 1,
//     title: "Burnt Offerings",
//     author: "Shafi",
//     content:
//       "Military operations involving unspecified fire, conflagration and hot substance, military personnel, initial encounter",
//     published: "2025-08-12T12:20:43Z",
//     updated: "2026-05-27T04:09:07Z",
//   },
//   {
//     id: 2,
//     title: "Statues Also Die (Statues meurent aussi, Les)",
//     author: "shafi",
//     content:
//       "Unspecified fracture of shaft of left fibula, subsequent encounter for open fracture type IIIA, IIIB, or IIIC with malunion",
//     published: "2026-01-06T12:26:03Z",
//     updated: "2026-01-13T07:38:22Z",
//   },
// ];
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      const allowedOrigins = ["http://localhost:5173"];

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  }),
);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to my port" });
});
app.get("/api/v1/blogs", async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ error: error.message || "Something Went Wrong" });
  }
});

app.get("/api/v1/blogs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);

    // const blog = blogs.find((item) => {
    //   return item.id.toString() === id;
    // });

    if (!blog) {
      res.status(404).json({ error: "Blog Not Found" });
    }

    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ error: error.message || "Something Went Wrong" });
  }
});
app.patch("/api/v1/blogs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, content } = req.body;
    const blog = await Blog.findByIdAndUpdate(
      id,
      {
        title: title,
        content: content,
        author: author,
      },
      { new: true },
    );

    if (!blog) res.status(404).json({ error: "Blog Not found" });

    res.status(200).json({
      message: "Updated successfully",
      blog,
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Something Went Wrong" });
  }
  // const { id } = req.params;
  // const { title, author, content } = req.body;

  // const blog = blogs.find((item) => {
  //   return item.id.toString() === id;
  // });

  // if (!blog) res.status(404).json({ error: "Blog Not found" });

  // if (title) blog.title = title;
  // if (author) blog.author = author;
  // if (content) blog.content = content;

  // blog.updated = new Date();

  // res.status(200).json({
  //   message: "Updated successfully",
  //   blog,
  // });
});
app.post("/api/v1/blogs", async (req, res) => {
  try {
    const { title, content, author } = req.body;
    if (!title || !content || !author) {
      return res
        .status(401)
        .json({ message: "Title, content, author is required" });
    }

    // method1-using DB

    // const newBlog = await Blog.create({
    //   title:title,
    //   content:content,
    //   author:author,
    // });

    // method -2

    const newBlog = new Blog({
      title: title,
      content: content,
      author: author,
    });
    await newBlog.save();
    res.status(200).json({ message: "Successfully created Blog", newBlog });
  } catch (error) {
    res.status(500).json({ error: error.message || "Something went wrong" });
  }
});

// old way

// const newBlog = {
//   id: crypto.randomUUID(),
//   title: title,
//   author: author,
//   content: content,
//   published: new Date(),
//   updated: new Date(),
// };
// blogs.push(newBlog);

app.delete("/api/v1/blogs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) {
      res.status(404).json({ error: "Blog Not Found" });
    }
    res.status(200).json({
      message: "Deleted successfully",
      blog,
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Something went wrong" });
  }
});

// old way
//   const { id } = req.params;

//   blogs = blogs.filter((item) => {
//     return item.id.toString() !== id;
//   });

//   res.status(200).json({
//     message: "Deleted successfully",
//     blogs,
//   });
// });

const port = 3000;
try {
  await mongoose.connect(process.env.MONGODB_URL);
  console.log("DataBase Connected");
  app.listen(port, () => {
    console.log(`Server connected successfully on port ${port}`);
  });
} catch (error) {
  console.log(error);
  process.exit(1);
}
