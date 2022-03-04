const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();   // run the server
const port = 4000;      // run at port 3000

mongoose.connect('mongodb://localhost/notetaking');    // connect the database

// Import routes from notes
const noteRoutes = require('./notes/routes');
// Import routes from user
const userRoutes = require('./users/routes');

// Attach these routes to the app:
app.use('/notes', noteRoutes);
app.use('/users', userRoutes);
// Parse any JSON used in the app:
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));


app.listen(port, () => {
    console.log(`Tha app is running on http://localhost:${port}`);
})
