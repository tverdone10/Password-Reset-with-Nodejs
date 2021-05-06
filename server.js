const express = require("express");
const mongoose = require("mongoose");
const app = express();

require('dotenv').config()

const PORT = 5000;

// middleware
app.use(express.json()); 
app.use(express.urlencoded());

// Store the connection string here (Better to have it in an env file, but just leaving it here for demonstration purposes)
const atlas_uri = process.env.atlas_uri

// Set up MongoDB Atlas Connection
mongoose.connect(atlas_uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});

// Connect to our database
const connection = mongoose.connection
connection.once("open", () => {
    console.log("MongoDB Atlas connection as been established!")
})

// Connect our routes to the server here
const signup = require("./routes/signup")
const login = require("./routes/login")
app.use("/api/signup", signup)
app.use("/api/login", login)

// Start the server
app.listen(PORT, () => console.log(`server is running on port ${PORT}`))