require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const { mongoose } = require('./db/mongoose');
const { User } = require('./models/user');
const { Data } = require('./models/data');
const { authenticate } = require('./controller/authenticate');


const app = express();
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT || 3000;

app.use(express.static(__dirname + './../client'));

const routes = require('./views/routes/routes');
routes(app);

app.listen(port);
console.log(`We are live on port ${port}`);

module.exports = { app }