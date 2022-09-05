const express = require('express')
const bodyParser = require('body-parser')

const studentRoute = require('./routes/student')
const enrollmentRoute = require('./routes/enrollment')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/students', studentRoute)
app.use('/enrollments', enrollmentRoute)

module.exports = app