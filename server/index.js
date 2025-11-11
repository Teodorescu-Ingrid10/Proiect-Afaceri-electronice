const express = require("express");
const dotenv = require("dotenv");
const morgan = require('morgan');

const app = express();
dotenv.config();

const PORT = process.env.PORT || 3001;

app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Hello' })
})

app.listen(PORT, () => {
    console.log(`Server successfully started on port ${PORT}`)
})