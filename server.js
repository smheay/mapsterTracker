// Import npm packages
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
require('dotenv').config();



const app = express();
const PORT = process.env.PORT || 5000; // Step 1

// HTTP request logger
app.use(morgan('tiny'));

app.use(cors());
app.use(express.json());

//Require and uses files
const exercisesRouter = require('./routes/exercises');
const usersRouter = require('./routes/users');

app.use('/exercises', exercisesRouter);
app.use('/users', usersRouter);


//datasae connection 
//heroku database connection


mongoose.connect(process.env.ATLAS_URI, { 
  useNewUrlParser: true, 
  useCreateIndex: true, 
  useUnifiedTopology: true}
);

//connected confirm
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})




//heroku deploy
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}


//Starts the server
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});