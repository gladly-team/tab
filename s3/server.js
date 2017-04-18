var express = require('express');
var app = express();

app.use(express.static('static'));

app.listen(9000);