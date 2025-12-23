const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

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
app.use(cors()) 
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

app.get('/api/persons', (request, response) => {response.json(persons)
  console.log("get all is what it asks for")
})


app.get('/info', (req, res) => {
    res.send(`<p>Phonebook has info of ${persons.length} people</p>
                    <p>${new Date().toString()}</p>`)
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    const person = persons.find(person => person.id === id)
    if (!person) 
        {return res.status(404).json({error: "Person not found"})}
    res.json(person)
})

app.delete('/api/persons/:id', (req, res) =>{
    const id = req.params.id
    const person = persons.find(person => person.id === id)
    if (!person) 
        {return res.status(404).json({error: "Person not found"})}
    persons = persons.filter(person => person.id !== id)
    res.status(200).json({deleted: `Person ${id} has been deleted`})
})


app.post('/api/persons/', (req, res) => {
    const body = req.body
    console.log("new person entry is coming")

    if (!body.name.trim() || !body.number.trim()){
        return res.status(400).json({error: "name or number is missing"})
    }
    if (persons.find(p => p.name === body.name)){
        return res.status(400).json({ error: "name must be unique"})
    }
    const new_person = {
        id : String(Math.floor(Math.random() * 1000000)),
        name : body.name,
        number : body.number
    }
    persons = persons.concat(new_person)
    res.json(new_person)
    
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})