const server = require('../../server')

module.exports.getById = async function(name, password) {
    try {
        const client = await server.connect()
        const users = await client.query(`SELECT * FROM users WHERE name = '${name}' AND password = '${password}'`)
        return users.rows
    } catch(error) {
        throw new Error(error.message)
    }
}