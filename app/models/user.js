const server = require('../../server')

module.exports.createTable = async function() {
    try {
        const client = await server.connect()
        try {
            await client.query('SELECT * FROM users LIMIT 1')
        } catch(error) {
            if (error.message === 'relation "users" does not exist' && error.code === '42P01') {
                await client.query(`CREATE TABLE users(
                                        id SERIAL PRIMARY KEY,
                                        name VARCHAR(40) UNIQUE NOT NULL,
                                        password VARCHAR(40) NOT NULL
                                    )`)
                await client.query(`INSERT INTO users(name, password) VALUES ($1, $2)`, ['admin_ops', 'billing'])
            }
        }
    } catch(error) {
        console.error(`[createTable] Error creating student table. ${error.message}`)
    }
}