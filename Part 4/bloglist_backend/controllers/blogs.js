const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const { title, url } = request.body
  if (!title || !url) return response.status(400).end()

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
