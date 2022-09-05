const utils = require('../utils/utils')
const studentRepository = require('../repositories/student')
const enrollmentRepository = require('../repositories/enrollment')
const billController = require('./bill')
const sugar = require("sugar");

module.exports.createEnrollment = async function(newEnrollment) {
    try {
        validateEnrollment(newEnrollment)

        let studentResponse = await studentRepository.getById(newEnrollment['student_id'])
        let student = studentResponse && studentResponse[0] ? studentResponse[0] : undefined
        if (!student)
            throw { code: 404, message: 'Informed student not found!'}

        newEnrollment.amount = parseInt(newEnrollment.amount)
        newEnrollment.installments = parseInt(newEnrollment.installments)
        let billValue = parseInt(newEnrollment.amount / newEnrollment.installments)

        let { attributes, quantityAttributes, enrollmentValues } = formatedEnrollment(newEnrollment)
        let enrollment = await enrollmentRepository.create(attributes, quantityAttributes, enrollmentValues)

        let bills = await billController.createBill(enrollment.id, newEnrollment['due_day'], newEnrollment.installments, billValue)
        enrollment.bills = bills

        return enrollment
    } catch(error) {
        console.error(`[createEnrollment] Error creating Enrollment for student ${newEnrollment['student_id']}. ${error.message}`)
        throw error
    }
}

function validateEnrollment(newEnrollment) {
    if (!newEnrollment || !newEnrollment.amount)
        throw { code: 400, message: 'It is mandatory to inform the amount of the enrollment'}
    if (!newEnrollment.installments)
        throw { code: 400, message: 'It is mandatory to inform the installments of the enrollment'}

    if (newEnrollment.dueDay) {
        newEnrollment['due_day'] = newEnrollment.dueDay
        delete newEnrollment.dueDay
    }
    if (!newEnrollment['due_day'] || !utils.isDueDayValid(newEnrollment['due_day']))
        throw { code: 400, message: 'It is mandatory to inform the due day valid of the enrollment'}

    if (newEnrollment.studentId) {
        newEnrollment['student_id'] = newEnrollment.studentId
        delete newEnrollment.studentId
    }
    if (!newEnrollment['student_id'])
        throw { code: 400, message: 'It is mandatory to inform the student of the enrollment'}
}

function formatedEnrollment(newEnrollment) {
    try {
        let attributes = ''
        let quantityAttributes = ''
        let enrollmentValues = []
        let index = 1

        if (newEnrollment.studentId) {
            newEnrollment['student_id'] = newEnrollment.studentId
            delete newEnrollment.studentId
        }

        for (let key in newEnrollment) {
            if (!attributes)
                attributes += `${key}`
            else
                attributes += `, ${key}`

            enrollmentValues.push(newEnrollment[key])

            if (!quantityAttributes)
                quantityAttributes += `\$${index}`
            else
                quantityAttributes += `, \$${index}`
            index ++
        }

        return {
            attributes: attributes,
            quantityAttributes: quantityAttributes,
            enrollmentValues: enrollmentValues
        }
    } catch(error) {
        throw error
    }
}

module.exports.getEnrollments = async function(page = 1, count = 5) {
    try {
        sugar.extend()
        let offset = page == 1 ? 0 : (page * count) - count

        let enrollments = await enrollmentRepository.getAllEnrollments(count, offset)

        for (let enrollment of enrollments) {
            enrollment.bills = []
            enrollment['bills_id'].forEach((billId, index) => {
                enrollment.bills.push({
                    'id': billId,
                    'due_date': enrollment['bills_due_date'][index],
                    'status': enrollment['bills_status'][index],
                    'amount': enrollment['bills_amount'][index],
                })
            })

            delete enrollment['bills_id']
            delete enrollment['bills_due_date']
            delete enrollment['bills_status']
            delete enrollment['bills_amount']
        }

        return {
            'page': page,
            'items': enrollments
        }
    } catch(error) {
        console.error(`[getEnrollments] Error fetching enrollments from page ${page} and with count ${count}. ${error.message}`)
        throw error
    }
}