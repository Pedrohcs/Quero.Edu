const server = require('../../server')

module.exports.create = async function(attributes, quantityAttributes, student) {
    try {
        const client = await server.connect()
        let response = await client.query(`INSERT INTO students(${attributes}) VALUES (${quantityAttributes}) RETURNING id`, student)
        return response.rows[0]
    } catch(error) {
        throw new Error(error.message)
    }
}

module.exports.getById = async function(id) {
    try {
        const client = await server.connect()
        const students = await client.query(`SELECT * FROM students WHERE id = '${id}'`)
        return students.rows
    } catch(error) {
        throw new Error(error.message)
    }
}

module.exports.getBypage = async function(limit, offset) {
    try {
        const client = await server.connect()
        const count = await client.query(`SELECT * FROM students LIMIT ${limit} OFFSET ${offset}`)
        return count.rows
    } catch(error) {
        throw new Error(error.message)
    }
}