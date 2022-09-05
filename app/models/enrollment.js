const server = require('../../server')

module.exports.createTable = async function() {
    try {
        const client = await server.connect()
        try {
            await client.query('SELECT * FROM enrollments LIMIT 1')
        } catch(error) {
            if (error.message === 'relation "enrollments" does not exist' && error.code === '42P01')
                await client.query(`CREATE TABLE enrollments(
                                        id SERIAL PRIMARY KEY,
                                        amount INTEGER NOT NULL CHECK ( amount > 0 ),
                                        installments INTEGER NOT NULL CHECK ( installments > 1 ) ,
                                        due_day INTEGER NOT NULL CHECK ( due_day > 0 AND due_day < 32 ) ,
                                        student_id INTEGER NOT NULL REFERENCES students(id)
                                    )`)
        }
    } catch(error) {
        console.error(`[createTable] Error creating student table. ${error.message}`)
    }
}