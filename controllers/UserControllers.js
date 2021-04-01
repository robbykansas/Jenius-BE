const User = require('../models/User')
const Redis = require('ioredis')
const redis = new Redis({host:"redis", port: 6379})
const { createToken } = require("../helpers/jwt");
const os = require('os')

class UserControllers{
  static async login(req, res, next) {
    try {
      const emailAddress = req.body.emailAddress
      // const user = await User.find({emailAddress})
      const user = await User.findOne({emailAddress})
      if (user) {
        // let obj = {}
        // if (user.length > 1) {
          // obj = {
          //   id: [],
          //   accountNumber: [],
          //   emailAddress: user[0].emailAddress,
          //   identityNumber: []
          // }
          // user.forEach(data => {obj.id.push(data._id); obj.accountNumber.push(data.accountNumber); obj.identityNumber.push(data.identityNumber)})
        // } else {
          // obj = {
          //   id: user._id,
          //   accountNumber: user.accountNumber,
          //   emailAddress: user.emailAddress,
          //   identityNumber: user.identityNumber
          // }
        // }
        // console.log(obj)
        let obj = {
          id: user._id,
          accountNumber: user.accountNumber,
          emailAddress: user.emailAddress,
          identityNumber: user.identityNumber
        }
        res.status(200).json({ access_token: createToken(obj)})
      } else {
        throw {
          status: 401,
          message: 'Invalid email'
        }
      }
    } catch (e) {
      next (e)
    }
  }

  static async getAll(req, res, next) {
    try {
      const cache = await redis.get('users')
      if (cache) {
        return res.status(200).json(JSON.parse(cache))
      } else {
        const users = await User.find()
        await redis.set('users', JSON.stringify(users))
        console.log(`running on ` + os.type())
        res.status(200).json(users)
      }
    } catch (e) {
      next (e)
    }
  }

  static async getLoggedIn(req, res, next) {
    try {
      // const user = await User.find({emailAddress: req.loggedInUser.emailAddress})
      const user = await User.findOne({_id: req.loggedInUser.id})
      res.status(200).json(user)
    } catch (e) {
      next (e)
    }
  }

  static async findAccount(req, res, next) {
    try {
      const user = await User.findOne({accountNumber: req.params.accountNumber})
      res.status(200).json(user)
    } catch (e) {
      next (e)
    }
  }

  static async findIdentity(req, res, next) {
    try {
      const user = await User.findOne({identityNumber: req.params.identityNumber})
      res.status(200).json(user)
    } catch (e) {
      next (e)
    }
  }

  static async createUser(req, res, next) {
    try {
      const user = new User({
        userName: req.body.userName,
        accountNumber: req.body.accountNumber,
        emailAddress: req.body.emailAddress,
        identityNumber: req.body.identityNumber
      })
      await user.save()
      // redis.del('users')
      const pipeline = redis.pipeline()
      pipeline.del('users')
      const users = await User.find()
      pipeline.set('users', JSON.stringify(users))
      pipeline.exec()
      res.status(201).json(user)
    } catch (e) {
      next (e)
    }
  }

  static async updateUser(req, res, next) {
    try {
      const accountNumber = req.params.accountNumber
      const obj = {
        userName: req.body.userName,
        accountNumber: req.body.accountNumber,
        emailAddress: req.body.emailAddress,
        identityNumber: req.body.identityNumber
      }
      const updateUser = await User.findOneAndUpdate({accountNumber}, obj, {returnOriginal: false})
      // redis.del('users')
      const pipeline = redis.pipeline()
      pipeline.del('users')
      const users = await User.find()
      pipeline.set('users', JSON.stringify(users))
      pipeline.exec()
      res.status(200).json(updateUser)
    } catch (e) {
      next (e)
    }
  }

  static async deleteUser(req, res, next) {
    try {
      await User.findOneAndDelete({accountNumber: req.params.accountNumber})
      // redis.del('users')
      const pipeline = redis.pipeline()
      pipeline.del('users')
      const users = await User.find()
      pipeline.set('users', JSON.stringify(users))
      pipeline.exec()
      res.status(200).json('data deleted')
    } catch (e) {
      next (e)
    }
  }
}

module.exports = UserControllers