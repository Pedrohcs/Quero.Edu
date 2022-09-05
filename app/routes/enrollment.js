const express = require('express')
const enrollmentController = require('../controllers/enrollment')

const router = express.Router()

router.post('/', createEnrollment)

module.exports = router

async function createEnrollment(req, res) {
    try {
        let enrollment = await enrollmentController.createEnrollment(req.body)
        res.status(201).send(enrollment)
    } catch(error) {
        res.status(error.code  || 500).send(error.message)
    }
}