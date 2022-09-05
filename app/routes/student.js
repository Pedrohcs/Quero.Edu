const express = require('express')
const studentController = require('../controllers/student')

const router = express.Router()

router.post('/', createStudent)

router.get('/', getStudents)

module.exports = router

async function createStudent(req, res) {
    try {
        let studentId = await studentController.createStudent(req.body)
        res.status(201).send({ 'id': studentId })
    } catch(error) {
        res.status(error.code  || 500).send(error.message)
    }
}

async function getStudents(req, res) {
    try {
        let page = req.query && req.query.page ? req.query.page : 1
        let count = req.query && req.query.count ? req.query.count : 5
        let students = await studentController.getStudents(page, count)
        res.status(201).send(students)
    } catch(error) {
        res.status(error.code  || 500).send(error.message)
    }
}