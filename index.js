require("dotenv").config();
const express = require("express");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const PageNotFound = require("./helper/NotFound");
const bodyParser = require("body-parser");
const path = require("path");
const User = require("./models/user");
const mongoose = require("mongoose");

// Define the MongoDB URI (update it based on your setup)
const mongo_DB_URI = "mongodb://localhost:27017/mydatabase"; // Use this for local MongoDB
// const mongo_DB_URI = "mongodb+srv://shaik:pblock@localhost:27017/mydatabase?retryWrites=true&w=majority"; // Use this for MongoDB Atlas

const app = express();
const PORT = 3000;

// Set view engine
app.set("view engine", "ejs");
app.set("views", "views");

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));

// Middleware to inject user
app.use((req, res, next) => {
  User.findById("65aaa79a8945687d161ef472")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

// Routes
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(PageNotFound);

// Connect to MongoDB and start the server
mongoose
  .connect(mongo_DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    app.listen(PORT, () => {
      console.log("Database connected successfully");
      User.findOne().then((user) => {
        if (!user) {
          const user = new User({
            name: "test-user",
            email: "test-user@gmail.com",
            cart: {
              items: [],
            },
          });
          user.save();
        } else {
          console.log("User Already Exist");
        }
      });
      console.log(`App is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error connecting to the database:", err);
  });
