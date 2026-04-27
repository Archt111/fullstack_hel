const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

/*
blogsRouter.get('/', (request, response) => {
  Blog.find({}).then(blogs => {
    response.json(blogs)
  })
})
 */
blogsRouter.get('/', async (request,
  response) => {
    const blogs = await Blog.find({})
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
*/
blogsRouter.post('/', async (request, response) => {
  const { title, url } = request.body
  if (!title || !url) {
    return response.status(400).end()
  }
  const blog = new Blog(request.body)
  const result = await blog.save()
  response.status(201).json(result)
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()                                                          
}) 

blogsRouter.put('/:id', async (request, response) => {                                
    const {likes} = request.body
    const blog = await Blog.findById(request.params.id)                                 
    if (!blog) return response.status(404).end()
    blog.likes = likes
    const updated = await blog.save()
    response.json(updated)
})
module.exports = blogsRouter
