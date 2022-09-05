const server = require('../../server')

module.exports.create = async function(attributes, quantityAttributes, bill) {
    try {
        const client = await server.connect()
        let response = await client.query(`INSERT INTO bills(${attributes}) VALUES (${quantityAttributes}) RETURNING id, amount, due_date, status`, bill)
        return response.rows[0]
    } catch(error) {
        throw new Error(error.message)
    }
}