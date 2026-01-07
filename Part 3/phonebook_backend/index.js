require('dotenv').config()

const Person = require('./models/person')
const express = require('express')
const morgan = require('morgan')
const app = express()
const URL = '/api/persons'
// Middlewares
app.use(express.json())
app.use(morgan(function (tokens, req, res) {
  const log_format = [tokens.method(req, res),
                tokens.url(req, res),
                tokens.status(req, res),
                tokens.res(req, res, 'content-length'), '-',
                tokens['response-time'](req, res), 'ms']

  if (req.method==='POST')  
  {return log_format.concat(JSON.stringify(req.body)).join(' ')}
  return log_format.join(' ')
}))


//app.use(cors()) 
app.use(express.static('dist'))

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    },
    { 
      "id": "5",
      "name": "Arto Bloop", 
      "number": "040-123456"
    },
]

app.get(URL, (req, res, next) => {
  console.log('phonebook:')
  Person.find({})
        .then(phonebook => {res.json(phonebook)})
        .catch(err => {next(err)})
});



app.get('/info', (req, res) => {
    Person.countDocuments({})
          .then(count => res.send(`<p>Phonebook has info of ${count} people</p>
                                   <p>${new Date().toString()}</p>`))
  })

//find person
app.get(`${URL}/:id`, (req, res, next) => {
    const id = req.params.id
    Person.findById(id).then(person =>{
      if (!person) 
          {return res.status(404).json({error: "Person not found"})}
        res.json(person)})
        .catch(err => next(err))
  })

app.delete(`${URL}/:id`, (req, res) =>{
    const id = req.params.id
    Person.findByIdAndDelete(id)
          .then(person => {
            if (!person){return res.status(404).json({error: "Person not found"})}
            res.status(200).json({deleted: `Person ${id} has been deleted`})
          }).catch(err => next(err))
  })


app.post(URL, (req, res) => {
    const new_name = req.body.name.trim()
    const new_number = req.body.number.trim()
    console.log("new person entry is coming")

    if (!new_name || !new_number){
        return res.status(400).json({error: "name or number is missing"})
    }
    Person.findOne({name: new_name})
          .then(person => {
            if(person){return res.status(400).json({ error: "name must be unique"})}
            const new_person = new Person({name: new_name, number: new_number})
            return new_person.save()
          }).then(saved => {if(!saved){return}
              console.log(`added ${new_name} number ${new_number} to phonebook`)
              res.status(201).json(saved)
            }
  )})

app.put(`${URL}/:id`, (req, res, next) => {
    console.log("phone number is new")

    Person.findById(req.params.id)
          .then(person => {
            if(!person){return res.status(404).json({ error: "the person is not found."})}
            person.number = req.body.number.trim()
            person.name = req.body.name.trim()
            return person.save().then(saved => {res.status(201).json(saved)}
          )}
          ).catch(error => next(error))
  })

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})