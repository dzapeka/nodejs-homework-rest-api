const express = require('express');
const logger = require('morgan');
const cors = require('cors');

const routes = require('./routes');

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());

app.use('/avatars', express.static('public/avatars'));
app.use('/api', routes);

app.use((req, res) => {
  res.status(404).json({
    message: 'Not found',
    status: 'error',
    code: 404,
    data: 'Not found',
  });
});

app.use((err, req, res) => {
  console.error(err);
  res.status(500).json({
    message: err.message,
    status: 'fail',
    code: 500,
    data: 'Internal Server Error',
  });
});

module.exports = app;
