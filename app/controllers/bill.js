const sugar = require("sugar")
const billRepository = require('../repositories/bill')

module.exports.createBill = async function(enrollmentId, dueDay, installments, value) {
    try {
        let bills = []
        sugar.extend()

        let todayDate = sugar.Date.create()
        let startDueDate = sugar.Date.create(`${dueDay}/${todayDate.getMonth() + 1}/${todayDate.getFullYear()}`, 'en-GB')
        if (dueDay <= todayDate.getDate())
            startDueDate.addMonths(1)

        let index = 0
        while (index < installments) {
            let { attributes, quantityAttributes, billValues } = formatedBill({
                'amount': value,
                'due_date': startDueDate,
                'status': 'open',
                'enrollment': enrollmentId
            })

            bills = bills.concat(await billRepository.create(attributes, quantityAttributes, billValues))

            startDueDate.addMonths(1)
            index++
        }

        for (let bill of bills) {
            bill['due_date'] = sugar.Date.create(bill['due_date']).format("{dd}/{MM}/{yyyy}")
        }

        return bills
    } catch(error) {
        console.error(`[createBill] Error creating Bill for enrollment ${enrollmentId}. ${error.message}`)
        throw error
    }
}

function formatedBill(newBill) {
    try {
        let attributes = ''
        let quantityAttributes = ''
        let billValues = []
        let index = 1

        for (let key in newBill) {
            if (!attributes)
                attributes += `${key}`
            else
                attributes += `, ${key}`

            billValues.push(newBill[key])

            if (!quantityAttributes)
                quantityAttributes += `\$${index}`
            else
                quantityAttributes += `, \$${index}`
            index ++
        }

        return {
            attributes: attributes,
            quantityAttributes: quantityAttributes,
            billValues: billValues
        }
    } catch(error) {
        throw error
    }
}