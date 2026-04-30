const mongoose = require('mongoose')                                                                                                                          
const userSchema = mongoose.Schema({      
    blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }],                                            
    username: { type: String, required: true, unique: true, miniLength: 3},
    passwordHash: {type: String, miniLength: 3},
    name: String
})

userSchema.set('toJSON', {
transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString()
    delete returnedObj._id
    delete returnedObj.__v
    delete returnedObj.passwordHash //avoid leaks to client
}
})

module.exports = mongoose.model('User', userSchema)