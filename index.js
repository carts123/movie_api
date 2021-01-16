const express = require('express');
  morgan = require('morgan');
  bodyParser = require('body-parser'),
  uuid = require('uuid');

const app = express();

app.use(bodyParser.json());


// Movie List
let movies = [
  {
    title: 'The Dark Knight',
    director: 'Christopher Nolan',
    genre: 'Action',
    movieID: '1',
  },
  {
    title: 'Blade Runner',
    director: 'Ridley Scott',
    genre: 'Action'
  },
  {
    title: 'Inception',
    director: 'Christopher Nolan',
    genre: 'Thriller'
  },
  {
    title: 'se7en',
    director: 'David Fincher',
    genre: 'Action'
  },
  {
    title: 'Fargo',
    director: 'Joel and Ethan Coen',
    genre: 'Comedy'
  },
  {
    title: 'The Matrix',
    director: 'Andy and Lana Wachowski',
    genre: 'Action'
  },
  {
    title: 'Good Will Hunting',
    director: 'Gus Van Sant',
    genre: 'Drama'
  },
  {
    title: 'Monty Python and The Holy Grail',
    director: 'Terry Gilliam and Terry Jones',
    genre: 'Comedy'
  }
];

let users = [];

//Gets the list of movies
app.get('/movies', (req, res) => {
  res.json(movies);
});

// Gets the data about a single movie, by title
app.get('/movies/:title', (req, res) => {
  res.json(movies.find((movie) =>
    { return movie.title === req.params.title }));
});

// Gets the data about a single genre by name/title
app.get('/movies/genres/:title', (req, res) => {
  res.json(movies.find((movie) =>
    { return movie.title === req.params.title }));
});

// Gets the data about a single director, by name
app.get('/movies/directors/:name', (req, res) => {
  res.json(movies.find((director) =>
    { return director.name === req.params.name }))
});

// Adds data for a new user to register
app.post('/users', (req, res) => {
  let newUser = req.body;

  if (!newUser.name) {
    const message = 'Missing name in request body';
    res.status(400).send(message);
  } else {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).send(newUser);
  }
});

// Update user info (username)
app.put('/users/:username', (req, res) => {
  let user = users.find((user) => {
    return user.name === req.params.username
  });

  if (user) {
    user.name = req.body.newusername;
    res.status(201).send(user);
  }
});

// Adds movie data to their list of favourites
app.post('/users/:username/movies/:movieID', (req, res) => {
  let newMovie = req.body;

  if (!newMovie.title) {
    const message = 'Missing title in request body';
    res.status(400).send(message);
  } else {
    newMovie.id = uuid.v4();
    movies.push(newMovie);
    res.status(201).send(newMovie);
  }
});

// Removes a movie from the list
app.delete('/movies/:movieID', (req, res) => {
  let movie = movies.find((movie) => { return movie.id === req.params.id });

  if (movie) {
    movies = movies.filter((obj) => { return obj.id !== req.params.id });
    res.status(201).send('Movie ' + req.params.id + ' was deleted.');
  }
});

// Removes a user from the database
app.delete('/users/:username', (req, res) => {
  let user = users.find(user => { return user.username === req.params.username });

  if (user) {
    users = users.filter((obj) => { return obj.username !== req.params.username });
    res.status(201).send('User ' + req.params.username + ' was deleted.');
  }
});

app.use('/', express.static('public'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
