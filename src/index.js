require('dotenv').config();
const express = require('express');
const router = require('./routes');
const cors = require('cors');

const app = express();

app.use(express.json({ limit: '5mb' }));
app.use(cors());

app.use(router);

app.listen(process.env.PORT || 5500);