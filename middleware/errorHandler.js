module.exports = (e, req, res, next)=>{
    console.log(e)
    if(e.status) {
        res.status(e.status).json({message: e.message})
      } else if (e.name == 'SequelizeUniqueConstraintError') {
        res.status(401).json({message: `name is already used`})
      } else if(e.name == 'SequelizeValidationError'){
        res.status(400).json({message: `${e.message}`})
      } else {
        res.status(500).json({message: 'internal server error'})
      }
}