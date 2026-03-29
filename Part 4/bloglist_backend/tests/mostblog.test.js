const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('most blogs', () => {
  const empty_blogs = []

  test('returns null for empty blog', () => {
    const result = listHelper.mostBlogs(empty_blogs)
    assert.deepStrictEqual(result, null)
  })
  const equal_blogs = [
    { author: "Robert C. Martin", likes: 2},
    { author: "Michael Chan", likes: 2 }
  ]

  test('returns the author with the most entries and the correct count', () => {
    const result = listHelper.mostBlogs(blogs)
    const validAuthors = ["Robert C. Martin", "Michael Chan"]
    assert.ok(validAuthors.includes(result.author), `Expected one of ${validAuthors}, but got ${result.author}`)
  })

  const blogs = [
    { author: "Robert C. Martin", likes: 1 },
    { author: "Michael Chan", likes: 2 },
    { author: "Robert C. Martin", likes: 3 }
  ]

  test('returns the author with the most entries and the correct count', () => {
    const result = listHelper.mostBlogs(blogs)
    assert.deepStrictEqual(result, {
      author: "Robert C. Martin",
      blogs: 2
    })
  })
})