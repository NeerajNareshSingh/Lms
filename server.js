const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const users = require('./routes/user.js');
const posts = require('./routes/post.js');
const profiles = require('./routes/profile.js');
const morgan = require("morgan");
const helmet = require("helmet");
const config = require("config");
const MONGOURI = config.get('MONGOURI');
const error = require('./middleware/error.js');
const passport = require("passport");
const errorHandler = require('./helpers/error-handler');
if(!config.get('jwtPrivateKey')){
    console.log("Fatal ERROR : jwtPrivateKey is not defined");
    process.exit(1);
}

// database connection
mongoose.connect(MONGOURI, { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false,useCreateIndex: true} )
        .then(() => console.log("connected to DB"))
        .catch(err => console.log("error in connection "+ err));

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Passport middleware
app.use(passport.initialize());

// Passport config
require('./config/passport')(passport);

app.get('/', (req, res)=>{
     res.send("hello world!")
})

// api routes
app.use('/api/v1/users', users);
app.use('/api/v1/post', posts);
app.use('/api/v1/profile', profiles);

// global error handler
app.use(errorHandler);

// connection to server
const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{console.log(`server is listening on ${PORT}`)});