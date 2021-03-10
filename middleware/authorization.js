const User = require('../models/User')

module.exports = async(req, res, next)=>{
  try{
    const data = await User.findOne({
      accountNumber: req.params.accountNumber,
      emailAddress: req.loggedInUser.emailAddress
    })
    if(data){
        next()
    }
    else{
        res.status(401).json({message: `you aren't authorized to access this`})
    }
  } catch (e) {
    console.log('access error')
    res.status(500).json({message: 'internal server error'})
  }
}