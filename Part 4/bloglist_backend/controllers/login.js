const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const loginRouter = require('express').Router()
const User = require('../models/user')
const logger = require('../utils/logger')

loginRouter.post('/', async (request, response, next) => {
  const { username, password } = request.body
  logger.info(`[login] attempt username="${username || ''}"`)

  try {
    const user = await User.findOne({ username })
    const passwordCorrect = user === null
      ? false
      : await bcrypt.compare(password, user.passwordHash)

    if (!(user && passwordCorrect)) {
      logger.error(`[login] failed username="${username || ''}"`)
      return response.status(401).json({ error: 'invalid username or password' })
    }

    const userForToken = { username: user.username, id: user._id }
    const token = jwt.sign(userForToken, process.env.SECRET)

    logger.info(`[login] success username="${username}" userId="${user._id}"`)
    response.status(200).send({
      token,
      username: user.username,
      name: user.name
    })
  } catch (error) {
    logger.error(`[login] unexpected error username="${username || ''}"`)
    next(error)
  }
})

module.exports = loginRouter