const jwt = require('jsonwebtoken')

function createToken(data) {
    const access_token = jwt.sign(data, 'secret')
    return access_token
}

function verifyToken(token) {
    const decode = jwt.verify(token, 'secret')
    return decode
}

module.exports = {
    createToken,
    verifyToken
}