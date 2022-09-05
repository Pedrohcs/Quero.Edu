const server = require('../../server')

module.exports.create = async function(attributes, quantityAttributes, student) {
    try {
        const client = await server.connect()
        await client.query(`INSERT INTO students(${attributes}) VALUES (${quantityAttributes})`, student)
    } catch(error) {
        throw new Error(error.message)
    }
}

module.exports.getByCpf = async function(cpf) {
    try {
        const client = await server.connect()
        const students = await client.query(`SELECT * FROM students WHERE cpf = '${cpf}'`)
        return students.rows[0]
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