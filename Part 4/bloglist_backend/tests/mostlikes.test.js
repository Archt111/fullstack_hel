const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('most likes', () => {
  const blogs = [
    { author: "Edsger W. Dijkstra", likes: 5 },
    { author: "Michael Chan", likes: 10 },
    { author: "Edsger W. Dijkstra", likes: 12 } 
  ]
  // Dijkstra Total: 17, Chan Total: 10

  test('returns the author with the highest total likes across all blogs', () => {
    const result = listHelper.mostLikes(blogs)
    assert.deepStrictEqual(result, {
      author: "Edsger W. Dijkstra",
      likes: 17
    })
  })

  test('returns null for an empty list', () => {
    assert.strictEqual(listHelper.mostLikes([]), null)
  })
})