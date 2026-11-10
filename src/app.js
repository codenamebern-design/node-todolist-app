import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import morgan from "morgan";
import TASK from "../model/taskSchema.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.set("view engine", "ejs");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// Routes
//! Show task
app.get("/home", async (req, res) => {
  try {
    const task = await TASK.find().sort({
      createdAt: -1,
    });
    res.render("../views/routes/home", { task, title: "Node Todo App" });
  } catch (error) {
    console.error(error);
    res.status(404).redirect("/404");
  }
});

app.get("/", (req, res) => {
  res.redirect("/home");
});

// About Page
app.get("/about", (req, res) => {
  res.render("../views/routes/about", { title: "About Us" });
});

// Create Task | Show a Form
//! Create Task
app.get("/create", (req, res) => {
  res.render("../views/routes/create", { title: "Create a Task" });
});

//!Post request
app.post("/create", async (req, res) => {
  try {
    await TASK.create(req.body);
    res.redirect("/create");
  } catch (error) {
    console.error(error);
    res.status(404).redirect("/404");
  }
});

//Delete8.996 ms - 594
app.post("/delete/:id", async (req, res) => {
  try {
    await TASK.findByIdAndDelete(req.params.id);
    res.redirect("/home");
  } catch (error) {
    console.error(error);
    res.status(404).redirect("/404");
  }
});

// Show the edit form with the old values filled in
app.get("/edit/:id", async (req, res) => {
  try {
    const task = await TASK.findById(req.params.id);
    if (!task) {
      return res
        .status(404)
        .render("../views/routes/404", { title: "Task not found" });
    }
    res.render("../views/routes/edit", { task, title: "Edit Task" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .render("../views/routes/404", { title: "Something went wrong" });
  }
});

// Save the changes
app.post("/edit/:id", async (req, res) => {
  try {
    await TASK.findByIdAndUpdate(
      req.params.id,
      { task: req.body.task, date: req.body.date },
      { runValidators: true },
    );
    res.redirect("/home");
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .render("../views/routes/404", { title: "Something went wrong" });
  }
});

//! 404 Error
app.use((req, res) => {
  res.status(404).render("../views/routes/404", {
    title: "Cannot find what you looking for",
  });
});
