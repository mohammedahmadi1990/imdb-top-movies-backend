const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Movie = require("./models/Movie");

const app = express();
require("dotenv").config();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const uri = `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@ac-wubprji-shard-00-00.hdqhgh5.mongodb.net:27017,ac-wubprji-shard-00-01.hdqhgh5.mongodb.net:27017,ac-wubprji-shard-00-02.hdqhgh5.mongodb.net:27017/imdb?ssl=true&replicaSet=atlas-7n47qj-shard-0&authSource=admin&retryWrites=true&w=majority`;
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log(error));

// get index
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Route for fetching all movies
app.get("/movies", async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 20; // number of records per page
    const page = Number(req.query.page) || 1; // page number

    const movies = await Movie.find()
      .skip((page - 1) * limit)
      .limit(limit);

    const count = await Movie.countDocuments();

    res.json({
      total: count,
      page: page,
      pageSize: movies.length,
      data: movies,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a movie
app.post("/movies", async (req, res) => {
  const movie = new Movie(req.body);
  try {
    const savedMovie = await movie.save();
    res.status(201).json(savedMovie);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Read a specific movie
app.get("/movies/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (movie == null) {
      return res.status(404).json({ message: "Cannot find movie" });
    }
    res.json(movie);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a movie
app.patch("/movies/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (movie == null) {
      return res.status(404).json({ message: "Cannot find movie" });
    }
    Object.assign(movie, req.body);
    const updatedMovie = await movie.save();
    res.json(updatedMovie);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a movie
app.delete("/movies/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (movie == null) {
      return res.status(404).json({ message: "Cannot find movie" });
    }
    await Movie.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted Movie" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
