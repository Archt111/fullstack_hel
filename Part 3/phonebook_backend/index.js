const express = require('express')
const app = express()
console.log("very beginning")

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
    }
]

app.get('/api/persons', (request, response) => {response.json(persons)})

app.get('/info', (request, response) => 
    {
        response.send(`<p>Phonebook has info of ${persons.length} people</p>
                       <p>${new Date().toString()}</p>`)
    })

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    console.log(`${id}`)
    const person = persons.find(person => person.id === id)
    console.log(`${person}`)

    if (!person) 
        {return res.status(404).json({error: "Person not found"})}
    res.json(person)
})


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})