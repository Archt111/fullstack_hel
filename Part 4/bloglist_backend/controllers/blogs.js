const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const logger = require('../utils/logger')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const start = Date.now()
  logger.info('[debug] GET /api/blogs start')
  // caveman debug: if slow, mongo query maybe stuck
  try {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    logger.info(`[debug] GET /api/blogs ok in ${Date.now() - start}ms, count=${blogs.length}`)
    response.json(blogs)
  } catch (error) {
    logger.error(`[debug] GET /api/blogs fail in ${Date.now() - start}ms: ${error.message}`)
    throw error
  }
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const { title, url, author } = request.body
  if (!title || !url) return response.status(400).end()

  const existingBlog = await Blog.findOne({ title, author, url })
  if (existingBlog) {
    return response.status(400).json({ error: 'blog already exists' })
  }

  const user = request.user
  const blog = new Blog({ ...request.body, user: user._id })
  const result = await blog.save()
  
  user.blogs = user.blogs.concat(result._id)
  await user.save()
  const userwBlog = await result.populate('user', { username: 1, name: 1 })
  response.status(201).json(userwBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (!blog) return response.status(404).end()
  if (blog.user.toString() !== request.user._id.toString()) {
    return response.status(403).json({ error: 'not authorized to delete this blog' })
  }
  await blog.deleteOne()
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const { likes } = request.body
  if (typeof likes !== 'number') return response.status(400).json({ error: 'likes must be a number' })
  
    const blog = await Blog.findById(request.params.id)
  if (!blog) return response.status(404).end()
  blog.likes = likes
  const updated = await blog.save()
  const userwBlog = await updated.populate('user', { username: 1, name: 1 })
  response.json(userwBlog)
})

module.exports = blogsRouter
