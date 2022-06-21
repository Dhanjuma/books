const express = require('express');
const app = express();

const fs = require('fs');

app.use(express.json());

app.use('/', require('./routes/dir'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on Port ${PORT}`));  