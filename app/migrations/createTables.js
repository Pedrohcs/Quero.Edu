const studentModel = require('../models/student')
const enrollmentModel = require('../models/enrollment')
const billModel = require('../models/bill')

module.exports.createTables = async function() {
    await studentModel.createTable()
    await enrollmentModel.createTable()
    await billModel.createTable()
}