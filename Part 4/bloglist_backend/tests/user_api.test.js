const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')

beforeEach(async () => {
  await User.deleteMany({})
  await api.post('/api/users').send({ username: 'existing', password: 'secret123', name: 'Existing User' })
})

describe('invalid user creation', () => {
  test('username too short returns 400', async () => {
    const res = await api.post('/api/users')
      .send({ username: 'ab', password: 'secret123', name: 'Test' })
      .expect(400)
    assert.ok(res.body.error)
  })

  test('password/username too short returns 400', async () => {
    const res_usern = await api.post('/api/users')
      .send({ username: 'iv', password: 'abc', name: 'Test' })
      .expect(400)
    assert.ok(res_usern.body.error)

    const res_passwd = await api.post('/api/users')
      .send({ username: 'validuser', password: 'ab', name: 'Test' })
      .expect(400)
    assert.ok(res_passwd.body.error)
  })

  test('duplicate username returns 400', async () => {
    const res = await api.post('/api/users')
      .send({ username: 'existing', password: 'secret123', name: 'Another' })
      .expect(400)
    assert.ok(res.body.error)
  })

  test('invalid user is not saved to db', async () => {
    await api.post('/api/users')
      .send({ username: 'ab', password: 'ab', name: 'Test' })
    const users = await User.find({})
    assert.strictEqual(users.length, 1)
  })
})

after(async () => {
  await mongoose.connection.close()
})
