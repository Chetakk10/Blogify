require('dotenv').config()

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cookiePaser = require('cookie-parser');

const Blog = require('./models/blog');

const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');

const { checkForAuthenicationCookie } = require("./middlewares/authentication");

const app = express();
const PORT = process.env.PORT || 8000;

mongoose.connect(process.env.MONGO_URL).then( (e) => console.log('MongoDB Connected'));
// mongodb://localhost:27017/blogify

app.set('view engine', 'ejs');
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));
app.use(cookiePaser());
app.use(checkForAuthenicationCookie("token"));
app.use(express.static(path.resolve('./public')));

app.get("/", async (req, res) => {
    const allBlogs = await Blog.find({});

    res.render("home", {
        user: req.user,
        blogs: allBlogs,
    });
});

app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.listen(PORT, () => console.log(`Server Started at PORT: ${PORT}`));
