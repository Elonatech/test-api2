const mongoose = require("mongoose");
const slugify = require("slugify");
const Blog = require("../models/blogModel");

const addSlugsToExistingBlogs = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    const blogs = await Blog.find({ slug: { $exists: false } });
    for (const blog of blogs) {
      blog.slug = slugify(blog.title, { lower: true, strict: true });
      await blog.save();
      console.log(`Slug added for blog: ${blog.title}`);
    }

    console.log("Slugs added to all existing blogs!");
    process.exit();
  } catch (error) {
    console.error("Error adding slugs:", error);
    process.exit(1);
  }
};

addSlugsToExistingBlogs();
