const sugar = require('sugar')
const utils = require('../utils/utils')
const studentRepository = require('../repositories/student')

module.exports.createStudent = async function(newStudent) {
    try {
    validateStudent(newStudent)

    let { attributes, quantityAttributes, studentsValues } = formatedStudent(newStudent)
    await studentRepository.create(attributes, quantityAttributes, studentsValues)
    let student = await studentRepository.getByCpf(newStudent.cpf)
    return student.id
    } catch(error) {
        console.error(`[createStudent] Error creating Student ${newStudent.cpf}. ${error.message}`)
        throw error
    }
}

function validateStudent(newStudent) {
    if (!newStudent || !newStudent.name)
        throw { code: 400, message: 'It is mandatory to inform the name of the student'}
    if (!newStudent.cpf)
        throw { code: 400, message: 'It is mandatory to inform the document of the student'}

    if (!utils.isDocumentValid(newStudent.cpf.replace(/\.|-/g, '')))
        throw { code: 400, message: 'The document informed is not a valid cpf'}

    if (newStudent.birthdate) {
        try {
            newStudent.birthdate = sugar.Date.create(newStudent.birthdate, 'en-GB')
        } catch(error) {
            throw { code: 400, message: 'Birthdate entered is invalid'}
        }
    }
    if (newStudent.paymentMethod) {
        newStudent['payment_method'] = newStudent.paymentMethod
        delete newStudent.paymentMethod
    }
    if (!newStudent['payment_method'] || !utils.isPaymentMethodValid(newStudent['payment_method']))
        throw { code: 400, message: 'It is mandatory to inform the student\'s payment method. Accepted values: \'credit_card\', \'boleto\''}
}

function formatedStudent(newStudent) {
    try {
        let attributes = ''
        let quantityAttributes = ''
        let studentsValues = []
        let index = 1

        if (newStudent.paymentMethod) {
            newStudent['payment_method'] = newStudent.paymentMethod
            delete newStudent.paymentMethod
        }

        for (let key in newStudent) {
            if (!attributes)
                attributes += `${key}`
            else
                attributes += `, ${key}`

            studentsValues.push(newStudent[key])

            if (!quantityAttributes)
                quantityAttributes += `\$${index}`
            else
                quantityAttributes += `, \$${index}`
            index ++
        }

        return {
            attributes: attributes,
            quantityAttributes: quantityAttributes,
            studentsValues: studentsValues
        }
    } catch(error) {
        throw error
    }
}

module.exports.getStudents = async function(page = 1, count = 5) {
    try {
        let offset = page == 1 ? 0 : (page * count) - count

        let students = await studentRepository.getBypage(count, offset)

        return {
            'page': page,
            'items': students
        }
    } catch(error) {
        console.error(`[getStudents] Error fetching students from page ${page} and with count ${count}. ${error.message}`)
        throw error
    }
}