const server = require('../../server')

module.exports.createTable = async function() {
    try {
        const client = await server.connect()
        try {
            await client.query('SELECT * FROM students LIMIT 1')
        } catch(error) {
            if (error.message === 'relation "students" does not exist' && error.code === '42P01')
                await client.query(`CREATE TABLE students(
                                        id SERIAL PRIMARY KEY,
                                        name VARCHAR(40) NOT NULL,
                                        cpf VARCHAR(14) UNIQUE NOT NULL,
                                        birthdate TIMESTAMP,
                                        payment_method VARCHAR(11) CHECK ( payment_method = 'credit_card' OR payment_method = 'boleto' )
                                    )`)
        }
    } catch(error) {
        console.error(`[createTable] Error creating student table. ${error.message}`)
    }
}