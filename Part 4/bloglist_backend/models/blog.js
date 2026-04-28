const mongoose = require('mongoose')

const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: {type: Number, default: 0},
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

blogSchema.set('toJSON', {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString()
    delete returnedObj._id
    delete returnedObj.__v
  }
})
module.exports = mongoose.model('Blog', blogSchema)
