const _ = require('lodash')


const totalLikes = (blogs) => {
  if (blogs.length === 0) return null
  return blogs.reduce((sum,blog) => {
    return sum + blog.likes;
  }, 0)
}

const dummy = (blogs) => {
  return 1
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) return null
    return blogs.reduce((prev, current) => {
        return (current.likes > prev.likes) ? current :prev
    })
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null
  const groupedBlogs = _.groupBy(blogs, 'author')
  const authorCounts = _.map(groupedBlogs, (authorBlogs, authorName) => ({
    author: authorName,
    blogs: authorBlogs.length
  }))
  return _.maxBy(authorCounts, 'blogs')
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null
  const groupedByAuthor = _.groupBy(blogs, 'author')

  // { author: "Name", likes: total }
  const authorLikes = _.map(groupedByAuthor, (authorBlogs, authorName) => ({
    author: authorName,
    likes: _.sumBy(authorBlogs, 'likes')
  }))
  return _.maxBy(authorLikes, 'likes')
}
module.exports = {
  totalLikes,
  dummy,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}