const express = require('express');
  morgan = require('morgan');

const app = express();

app.use(morgan('common'));


// Movie List
let topMovies = [
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


//GET Requests
app.get('/movies', (req, res) => {
  res.json(topMovies);
});

app.get('/', (req, res) => {
  res.send('My top 10 movies!');
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
