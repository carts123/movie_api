const express = require('express');
  morgan = require('morgan');

const app = express();

app.use(morgan('common'));


// Movie List
let movies = [
  {
    title: 'The Dark Knight',
    director: 'Christopher Nolan'
  },
  {
    title: 'Blade Runner',
    director: 'Ridley Scott'
  },
  {
    title: 'Inception',
    director: 'Christopher Nolan'
  },
  {
    title: 'se7en',
    director: 'David Fincher'
  },
  {
    title: 'Fargo',
    director: 'Joel and Ethan Coen'
  },
  {
    title: 'The Matrix',
    director: 'Andy and Lana Wachowski'
  },
  {
    title: 'Good Will Hunting',
    director: 'Gus Van Sant'
  },
  {
    title: 'Monty Python and The Holy Grail',
    director: 'Terry Gilliam and Terry Jones'
  }
];


//Gets the list of movies
app.get('/movies', (req, res) => {
  res.json(movies);
});

// Gets the data about a single movie, by title
app.get('/movies/:title', (req, res) => {
  res.json(movies.find((movie) =>
    { return movie.title === req.params.title }));
});
// Gets the data about a single genre
app.get('/movies/genres', (req, res) => {
  res.json(movies.find((movie) =>
    { return movie.genre === req.params.genre }));
});
// Gets the data about a single director, by name
app.get('/movies/directors/:name', (req, res) => {
  res.json(movies.find((movie) =>
    { return movie.director === req.params.director }));
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

// Removes a movie from the list by ID
app.delete('/movies/:movieID', (req, res) => {
  let movie = movies.find((movie) => { return movie.id === req.params.id });

  if (movie) {
    movies = movies.filter((obj) => { return obj.id !== req.params.id });
    res.status(201).send('Movie ' + req.params.id + ' was deleted.');
  }
});

// Removes a user from the database
app.delete('/users/:username', (req, res) => {
  let user = users.find(user => { return user.id === req.params.id });

  if (user) {
    users = users.filter((obj) => { return obj.id !== req.params.id });
    res.status(201).send('User ' + req.params.id + ' was deleted.');
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
