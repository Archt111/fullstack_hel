const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

/*
blogsRouter.get('/', (request, response) => {
  Blog.find({}).then(blogs => {
    response.json(blogs)
  })
})
 */
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})
  
/*
blogsRouter.post('/', (request, response) => {
  const blog = new Blog(request.body)

  blog.save().then(result => {
    response.status(201).json(result)
  })
})
blogsRouter.post('/', async (request, response) => {
    const blog = new Blog(request.body)
    const result = await blog.save()
    response.status(201).json(result)
  })

blogsRouter.post('/', async (request, response) => {
  const { title, url } = request.body
  if (!title || !url) {
    return response.status(400).end()
  }
  const user = await User.findOne({})
  const blog = new Blog({ ...request.body, user: user._id })
  const result = await blog.save()
  user.blogs = user.blogs.concat(result._id)
  await user.save()
  response.status(201).json(result)
})
*/

blogsRouter.post('/', async (request, response) => {
    const { title, url } = request.body
    if (!title || !url) return
    response.status(400).end()

    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) return
    response.status(401).json({ error: 'token invalid'})

    const user = await User.findById(decodedToken.id)
    const blog = new Blog({ ...request.body, user: user._id })
    const result = await blog.save()
    user.blogs = user.blogs.concat(result._id)
    await user.save()
    response.status(201).json(result)

})

blogsRouter.delete('/:id', async (request, response) => {
  const deleted = await Blog.findByIdAndDelete(request.params.id)
  if (!deleted) return response.status(404).end()
  response.status(204).end()
}) 

blogsRouter.put('/:id', async (request, response) => {
  const { likes } = request.body
  if (typeof likes !== 'number') return response.status(400).json({ error: 'likes must be a number' })
  const blog = await Blog.findById(request.params.id)
  if (!blog) return response.status(404).end()
  blog.likes = likes
  const updated = await blog.save()
  response.json(updated)
})
module.exports = blogsRouter
