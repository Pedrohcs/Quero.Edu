const express = require('express')
const middleware = require('../utils/middlewares')
const enrollmentController = require('../controllers/enrollment')

const router = express.Router()

router.post('/', middleware.authenticateHeader, createEnrollment)

router.get('/', getEnrollments)

module.exports = router

async function createEnrollment(req, res) {
    try {
        let enrollment = await enrollmentController.createEnrollment(req.body)
        res.status(201).send(enrollment)
    } catch(error) {
        res.status(error.code  || 500).send(error.message)
    }
}

async function getEnrollments(req, res) {
    try {
        let page = req.query && req.query.page ? req.query.page : 1
        let count = req.query && req.query.count ? req.query.count : 5
        let enrollments = await enrollmentController.getEnrollments(page, count)
        res.status(201).send(enrollments)
    } catch(error) {
        res.status(error.code  || 500).send(error.message)
    }
}