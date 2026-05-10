const User = require('../models/user')
let token = null

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
  await User.deleteMany({})

  await api.post('/api/users').send({ username: 'testuser2', password: 'test123', name: 'Test User 2' })
  const loginRes = await api.post('/api/login').send({ username: 'testuser2', password: 'test123' })
  
  token = loginRes.body.token
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
  // await api.post('/api/blogs').send(newBlog).expect(201).expect('Content-Type', /application\/json/)
  await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(newBlog).expect(201)

  const res = await api.get('/api/blogs')
  assert.strictEqual(res.body.length, testBlogs.length+1)
  assert.ok(res.body.map(b => b.title).includes('Third blog'))

})

// 4.11 
test('missing likes def to 0', async () => {
    const newBlog = { title: 'No likes blog', author: 'Dave', url: 'http://example.com/4' }
    // const response = await api.post('/api/blogs').send(newBlog).expect(201)
    const response = await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(newBlog).expect(201)

    assert.strictEqual(response.body.likes, 0)
  })
  
// 4.12
test('blog without title is 400', async () => {
  const newBlog = { author: 'Eve', url: 'http://example.com/5', likes: 1 }
  // await api.post('/api/blogs').send(newBlog).expect(400)
  await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(newBlog).expect(400)
})

test('blog without url is 400', async () => {
  const newBlog = { title: 'No url blog', author: 'Eve', likes: 1 }
  await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(newBlog).expect(400)
})

test('duplicate blog is rejected with 400', async () => {
  const newBlog = { title: 'Same blog', author: 'Eve', url: 'http://example.com/same', likes: 1 }
  await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(newBlog).expect(201)
  const duplicateResponse = await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(newBlog).expect(400)
  assert.strictEqual(duplicateResponse.body.error, 'blog already exists')
})

// 4.23
  test('post without token returns 401', async () => {
  const newBlog = { title: 'No token blog', author:'Test', url: 'http://example.com/notoken' }
  await api.post('/api/blogs').send(newBlog).expect(401)
})

/* 4.13 delete
test('delete blog returns 204 if id valid', async () => {
  const blogsInit = await api.get('/api/blogs')
  const blogToDel = blogsInit.body[1]
  await api.delete(`/api/blogs/${blogToDel.id}`).expect(204)
  
  const res = await api.get('/api/blogs')
  assert.strictEqual(res.body.length, testBlogs.length-1)
  assert.ok(!res.body.map(b=>b.title).includes(blogToDel.title))
})
*/

// 4.13 - rewrite: create via POST (so blog has a user), then delete
test('delete blog returns 204 if id valid', async () => {
  const created = await api.post('/api/blogs').set('Authorization', `Bearer ${token}`)
    .send({ title: 'toDel', author: 'Test', url: 'http://example.com/del', likes: 0 }).expect(201)

  await api.delete(`/api/blogs/${created.body.id}`).set('Authorization', `Bearer ${token}`).expect(204)

  const res = await api.get('/api/blogs')
  assert.strictEqual(res.body.length, testBlogs.length)
  assert.ok(!res.body.map(b => b.title).includes('To delete'))
})

// 4.14 update info
test('update likes given id return 200 ', async () => {
  const blogsInit = await api.get('/api/blogs')
  const blogToUpdate = blogsInit.body[0]

  // remember this syntax
  const updatedBlog = { ...blogToUpdate, likes: blogToUpdate.likes + 1 }
  await api.put(`/api/blogs/${blogToUpdate.id}`).send(updatedBlog).expect(200)

  const res = await api.get('/api/blogs')
  assert.strictEqual(res.body[0].likes, testBlogs[0].likes+1)
})

after(async () => {
  await mongoose.connection.close()
})
