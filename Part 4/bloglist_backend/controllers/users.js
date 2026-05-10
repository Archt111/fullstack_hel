const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')
const logger = require('../utils/logger')

usersRouter.post('/', async (request, response, next) => {
  const { username, password, name } = request.body
  logger.info(`[users] create attempt username="${username || ''}"`)

  if (!password || password.length < 3 || !username || username.length < 3) {
    logger.error(`[users] validation failed username="${username || ''}"`)
    return response.status(400).json({ error: 'password and username must be >= 3 characters' })
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10)
    const user = new User({ username, passwordHash, name })
    const savedUser = await user.save()
    logger.info(`[users] create success username="${username}" userId="${savedUser._id}"`)
    response.status(201).json(savedUser)
  } catch (error) {
    logger.error(`[users] create failed username="${username || ''}"`)
    next(error)
  }
})

usersRouter.get('/', async (request, response, next) => {
  try {
    const users = await User.find({}).populate('blogs', { title: 1, url: 1 })
    response.json(users)
  } catch (error) {
    logger.error('[users] list failed')
    next(error)
  }
})

module.exports = usersRouter