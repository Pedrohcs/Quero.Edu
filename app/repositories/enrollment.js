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