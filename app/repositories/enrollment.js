const server = require('../../server')

module.exports.create = async function(attributes, quantityAttributes, enrollment) {
    try {
        const client = await server.connect()
        let response = await client.query(`INSERT INTO enrollments(${attributes}) VALUES (${quantityAttributes}) RETURNING *`, enrollment)
        return response.rows[0]
    } catch(error) {
        throw new Error(error.message)
    }
}

module.exports.getAllEnrollments = async function(limit, offset) {
    try {
        const client = await server.connect()
        let response = await client.query(`SELECT enrollments.id, enrollments.student_id, enrollments.amount, enrollments.installments, enrollments.due_day,
                                            ARRAY_AGG(bills.id) bills_id,
                                            ARRAY_AGG(bills.amount) bills_amount,
                                            ARRAY_AGG(bills.due_date) bills_due_date,
                                            ARRAY_AGG(bills.status) bills_status
                                            FROM enrollments
                                            INNER JOIN bills
                                            ON bills.enrollment = enrollments.id
                                            GROUP By enrollments.id
                                            ORDER BY enrollments.id
                                            LIMIT ${limit}
                                            OFFSET ${offset}`)
        return response.rows
    } catch(error) {
        throw new Error(error.message)
    }
}