require('./config/config');

const express = require('express');
const mongoose = require('mongoose');

const app = express();

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(require('./routes/usuarios'));

mongoose.connect(process.env.URLDB, { useNewUrlParser: true }, (err, res) => {

    if (err) throw err;

    console.log('Base de Datos ONLINE!!!');

});


mongoose.set('useCreateIndex', true);

app.listen(process.env.PORT, () => {
    console.log("Escuchando en el puerto: ", process.env.PORT);
});