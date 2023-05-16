const mongoose = require("mongoose");

const MovieSchema = mongoose.Schema(
  {
    Poster_Link: String,
    Series_Title: String,
    Released_Year: String,
    Certificate: String,
    Runtime: String,
    Genre: String,
    IMDB_Rating: Number,
    Overview: String,
    Meta_score: Number,
    Director: String,
    Star1: String,
    Star2: String,
    Star3: String,
    Star4: String,
    No_of_Votes: Number,
    Gross: String,
  },
  { strict: false, collection: "movies" }
);

module.exports = mongoose.model("Movies", MovieSchema);
