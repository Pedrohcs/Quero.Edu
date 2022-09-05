const userRepository = require('../repositories/user')

module.exports.authenticateHeader = async function(req, res, next) {
    const base64Credentials =  req.headers.authorization.split(' ')[1]
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii')
    const [username, password] = credentials.split(':')

    let user = await userRepository.getById(username, password)
    if (user && user[0]) {
        return next()
    } else {
        return res.status(403).send({"message": "Access not authorized"})
    }
}