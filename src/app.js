require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV, IMAGES_PATH } = require('./config');
const Utilities = require('./utilities');
const smsRouter = require('./sms-routes/sms-routes');

const app = express();

if(!Utilities.directoryExists(IMAGES_PATH)) {
    Utilities.makeDirectory(IMAGES_PATH);
}

const morganOption = (NODE_ENV === 'production') ? 'tiny' : 'common';

app.use(morgan(morganOption));
app.use(cors());
app.use(helmet());

app.use('/api/sms', smsRouter);

app.use(function errorHandler(error, req, res, next) {
    let response;
    if (NODE_ENV === 'production') {
        response = { error: { message: 'Server error' } };
    } else {
        response = { error };
    };
    res.status(500).json(response);
});

app.get('/test', (req, res) => {
    res.send('Server is running and accessible.');
});

module.exports = app;
