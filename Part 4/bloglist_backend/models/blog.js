const mongoose = require('mongoose')

const blogSchema = mongoose.Schema({
  url: String,
  title: String,
  author: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  likes: {type: Number, default: 0}
})

blogSchema.set('toJSON', {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString()
    delete returnedObj._id
    delete returnedObj.__v
  }
})
module.exports = mongoose.model('Blog', blogSchema)
