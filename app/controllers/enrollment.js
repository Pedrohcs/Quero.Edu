const utils = require('../utils/utils')
const studentRepository = require('../repositories/student')
const enrollmentRepository = require('../repositories/enrollment')
const billController = require('./bill')

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