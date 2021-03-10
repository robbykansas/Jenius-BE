const User = require('../models/User')
const Redis = require('ioredis')
const redis = new Redis()
const { createToken } = require("../helpers/jwt");

class UserControllers{
  static async login(req, res, next) {
    try {
      const emailAddress = req.body.emailAddress
      const user = await User.findOne({emailAddress})
      let obj = {
        id: user._id,
        accountNumber: user.accountNumber,
        emailAddress: user.emailAddress,
        identityNumber: user.identityNumber
      }
      if (user) {
        res.status(200).json({ access_token: createToken(obj)})
      } else {
        throw {
          status: 401,
          message: 'Invalid email/password'
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
        res.status(200).json(users)
      }
    } catch (e) {
      next (e)
    }
  }

  static async getLoggedIn(req, res, next) {
    try {
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
      redis.del('users')
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
      redis.del('users')
      res.status(200).json(updateUser)
    } catch (e) {
      next (e)
    }
  }

  static async deleteUser(req, res, next) {
    try {
      await User.findOneAndDelete({accountNumber: req.params.accountNumber})
      redis.del('users')
      res.status(200).json('data deleted')
    } catch (e) {
      next (e)
    }
  }
}

module.exports = UserControllers