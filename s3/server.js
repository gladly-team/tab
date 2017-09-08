var express = require('express')
var app = express()

app.use(express.static('media'))

app.listen(9000)
