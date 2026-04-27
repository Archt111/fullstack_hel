const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
    const { username, password, name } = request.body
    if (!password || password.length < 3 || !username || username.length < 3) {
      return response.status(400).json({ error: 'password and username must be >= 3 characters' })
    }
    const passwordHash = await bcrypt.hash(password, 10)
    const user = new User({ username, passwordHash, name })
    const savedUser = await user.save()
    response.status(201).json(savedUser)
})

usersRouter.get('/', async (request, response) => {
    const users = await User.find({})
    response.json(users)
})

module.exports = usersRouter