const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

// --- STEP 2: Total Likes Tests ---
describe('total likes', () => {
  test('of empty list is zero', () => {
    assert.strictEqual(listHelper.totalLikes([]), null)
  })

  test('when list has only one blog, equals the likes of that', () => {
    const listWithOneBlog = [{ likes: 5 }]
    assert.strictEqual(listHelper.totalLikes(listWithOneBlog), 5)
  })

  test('of a bigger list is calculated right', () => {
    const blogs = [{ likes: 2 }, { likes: 3 }, { likes: 5 }]
    assert.strictEqual(listHelper.totalLikes(blogs), 10)
  })
})

describe('favorite blog', () => {
  const manyBlogs = [
    { title: "A", author: "X", likes: 2 },
    { title: "B", author: "Y", likes: 12 }, // The winner
    { title: "C", author: "Z", likes: 10 }
  ]

  test('returns the blog object with the most likes', () => {
    const result = listHelper.favoriteBlog(manyBlogs)
    // Use deepStrictEqual for objects!
    assert.deepStrictEqual(result, {
      title: "B",
      author: "Y",
      likes: 12
    })
  })

  test('when two blogs have same likes, returns one of them', () => {
    const tiedBlogs = [
      { title: "Tie 1", likes: 7 },
      { title: "Tie 2", likes: 7 }
    ]
    const result = listHelper.favoriteBlog(tiedBlogs)
    assert.ok(result.likes === 7)
  })
})