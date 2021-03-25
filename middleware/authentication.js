const User = require('../models/User')
const { verifyToken } = require('../helpers/jwt')

module.exports = async(req, res, next) => {
  try{
    const token = req.headers.access_token
    if (!token) {
      throw({
        status: 401,
        message: 'please login first'
      })
    } else {
      const decoded = verifyToken(token)
      req.loggedInUser = decoded
      // const user = await User.find({emailAddress: decoded.emailAddress})
      const user = await User.findOne({_id: decoded.id})
      if (user) {
        next()
      } else {
        throw({
          status: 401,
          message: 'please login first'
        })
      }
    }
  } catch (e) {
    next (e)
  }
}