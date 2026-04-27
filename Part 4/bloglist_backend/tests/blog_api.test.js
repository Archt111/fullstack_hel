const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const blog = require('../models/blog')
const testBlogs = [
  {
    title: 'First blog',
    author: 'Alice',
    url: 'http://example.com/1',
    likes: 5
  },
  {
    title: 'Second blog',
    author: 'Bob',
    url: 'http://example.com/2',
    likes: 10
  }
]

// 4.8
beforeEach(async () => {
  await blog.deleteMany({})
  await blog.insertMany(testBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, testBlogs.length)
})

// 4.9 
test('unique id', async() => {
  const res = await api.get('/api/blogs')
  assert.ok(res.body[0].id)
  assert.strictEqual(res.body[0]._id, undefined)
})

// 4.10
test('create post ok', async() => {
  const newBlog = { title: 'Third blog', author: 'Charlie', url: 'http://example.com/3', likes: 3 }
  await api.post('/api/blogs').send(newBlog).expect(201).expect('Content-Type', /application\/json/)
  
  const res = await api.get('/api/blogs')
  assert.strictEqual(res.body.length, testBlogs.length+1)
  assert.ok(res.body.map(b => b.title).includes('Third blog'))

})

// 4.11 
test('missing likes def to 0', async () => {
    const newBlog = { title: 'No likes blog', author: 'Dave', url: 'http://example.com/4' }
    const response = await api.post('/api/blogs').send(newBlog).expect(201)

    assert.strictEqual(response.body.likes, 0)
  })
  
// 4.12
test('blog without title is 400', async () => {
  const newBlog = { author: 'Eve', url: 'http://example.com/5', likes: 1 }
  await api.post('/api/blogs').send(newBlog).expect(400)
})

test('blog without url is 400', async () => {
  const newBlog = { title: 'No url blog', author: 'Eve', likes: 1 }
  await api.post('/api/blogs').send(newBlog).expect(400)
})

after(async () => {
  await mongoose.connection.close()
})
