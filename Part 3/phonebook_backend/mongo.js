const mongoose = require('mongoose')

const  [, , password, new_name, new_phone] = process.argv
if (!password){
  console.log('Password required!')
  process.exit(1)
}

const url = `mongodb+srv://fullstack:${password}@clusterfso.oekfcyf.mongodb.net/phonebook?appName=ClusterFSO`
mongoose.set('strictQuery',false)

const personSchema = new mongoose.Schema({
  name: {type: String, require: true},
  number: {type: String, require: true}
})
const Person = mongoose.model('Person', personSchema)
personSchema.index({name: 1}, {unique: true})

// second arg is for settings, in this case is to set IP type to be IPv4
mongoose.connect(url, { family: 4 })

// No name, no phone
if (!new_name && !new_phone) {
  console.log('phonebook:')
  Person.find({}).then(persons => {
    persons.forEach(p => console.log(`${p.name} ${p.number}`))
    mongoose.connection.close()
  })
  return
}

if (!new_name || !new_phone) {
  console.log('need both name and phone to add entry')
  process.exit(1)
}

// New name and phone
const person = new Person({name: new_name, number: new_phone})
person.save().then(result => {
  console.log(`added ${new_name} number ${new_phone} to phonebook`)
  mongoose.connection.close()
})
