const express = require('express');
  bodyParser = require('body-parser'),
  uuid = require('uuid');


const morgan = require('morgan');
const app = express();
const mongoose = require('mongoose');
const Models = require('./models.js');
const passport = require( 'passport');
require('./passport');
const cors = require('cors');
const { check, validationResult } = require('express-validator');


const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;
const Directors = Models.Director;

mongoose.connect( process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

//mongoose.connect('mongodb://localhost:27017/myFlixDB'

app.use(bodyParser.json());

app.use(cors());

/**
 * Additional documentation for API calls and responses provided at:
 * https://bchanmyflix.herokuapp.com/documentation.html
 */

/**
 * Import auth.js file for api call to login endpoint and authentication
 */

let auth = require('./auth')(app);

let allowedOrigins = ['http://localhost:8080', 'http://localhost:1234'];

/**
 * API call to homepage
 */
app.get('/', (req, res) => {
	res.send('Welcome to MyCFDB!');
});

/**
 * API call to return information about all movies
 */
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find()
  .then((movies) => {
    res.status(201).json(movies);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});

//Gets the list of users
app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.find()
  .then((users) => {
    res.status(201).json(users);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});

/**
 * API call to return information about a movie by title
 */
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ Title: req.params.Title })
  .then((movie) => {
    res.json(movie);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});


/**
 * API call to return information about a genre by genre name
 */
app.get('/genre/:Genre', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ 'Genre.Name': req.params.Genre })
  .then((movie) => {
    res.json(movie.Genre);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});

/**
 * API call to return information about a director by director name
 */
app.get('/director/:Director', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ 'Director.Name': req.params.Director })
  .then((movie) => {
    res.json(movie.Director);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});

/**
 * API call to return user details by username
 */
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
	Users.findOne({ Username: req.params.Username })
		.then((user) => {
			res.json(user);
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send('Error: ' + err);
		});
});


/**
 * API call to create a new user
 */
app.post('/users',
  [
    check('Username', 'Username is required').isLength({min: 5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ], (req, res) => {

//check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

  let hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOne({ Username: req.body.Username})
  .then((user) => {
    if (user) {
      return res.status(400).send(req.body.Username + "already exists")
    } else {
      Users.create ({
        Username: req.body.Username,
        Password: hashedPassword,
        Email: req.body.Email,
        Birthday: req.body.Birthday,
      })
      .then((user) => {
        res.status(201).json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
    }
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});

/**
 * API call to update a user's information
 */
app.put('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  let hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOneAndUpdate({ Username: req.params.Username},
    {
       $set: {
         Username: req.body.Username,
         Password: hashedPassword,
         Email: req.body.Email,
         Birthday: req.body.Birthday
       }
    },
    { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if(err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
  });

  /**
   * API call to add a movie to a user's list of favourites
   */
app.post('/users/:Username/Movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username }, {
      $push: { FavoriteMovies: req.params.MovieID }
    },
    { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
  });


  /**
   * API call to remove a movie from a user's list of favorites
   */
app.delete('/users/:Username/Movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username }, {
      $pull: { FavoriteMovies: req.params.MovieID }
    },
    { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
  });


  /**
   * API call to delete a user's account
   */
app.delete('/users/:Username', (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

app.use('/', express.static('public'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// listen for requests
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});
