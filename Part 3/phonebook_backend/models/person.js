require('dotenv').config()
const mongoose = require('mongoose')
mongoose.set('strictQuery',false)


const url = process.env.MONGODB_URI
mongoose.connect(url, { family:4 })
  .then(result => {
    console.log('connected to mongoDB')})
  .catch(error => {
    console.log('error connecting: ', error.message)
  })

const personSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3 },
  number: { type: String, required: true, validate: v => /^\d{2,3}-\d{5,}$/.test(v) }

})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)