const server = require('../../server')

module.exports.createTable = async function() {
    try {
        const client = await server.connect()
        try {
            await client.query('SELECT * FROM bills LIMIT 1')
        } catch(error) {
            if (error.message === 'relation "bills" does not exist' && error.code === '42P01')
                await client.query(`CREATE TABLE bills(
                                        id SERIAL PRIMARY KEY,
                                        amount INTEGER NOT NULL CHECK ( amount > 0 ),
                                        due_date TIMESTAMP NOT NULL,
                                        status VARCHAR(7) NOT NULL CHECK ( status = 'open' OR status = 'pending' OR status = 'paid' ) ,
                                        enrollment INTEGER NOT NULL REFERENCES enrollments(id)
                                    )`)
        }
    } catch(error) {
        console.error(`[createTable] Error creating student table. ${error.message}`)
    }
}