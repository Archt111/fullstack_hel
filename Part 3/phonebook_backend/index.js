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

app.get(URL, (req, res, next) => {
  console.log('phonebook:')
  Person.find({})
        .then(phonebook => {res.json(phonebook)})
        .catch(err => {next(err)})
});



app.get('/info', (req, res, next) => {
  Person.countDocuments({})
    .then(count => res.send(`<p>Phonebook has info of ${count} people</p>
                             <p>${new Date().toString()}</p>`))
    .catch(next);
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

app.delete(`${URL}/:id`, (req, res,next) =>{
    const id = req.params.id
    Person.findByIdAndDelete(id)
          .then(person => {
            if (!person){return res.status(404).json({error: "Person not found"})}
            res.status(200).json({deleted: `Person ${id} has been deleted`})
          }).catch(err => next(err))
  })


app.post(URL, (req, res,next) => {
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
          }).catch(next)
  })

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

// error handling middleware
const mongoose = require('mongoose');

const unknownEndpoint = (req, res) => {
  res.status(404).json({ error: 'unknown endpoint' });
};

const errorHandler = (err, req, res, next) => {
  console.error(err.name, err.message);

  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'malformed id' });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }

  // duplicate key error from unique index
  if (err.code === 11000) {
    return res.status(400).json({ error: 'name must be unique' });
  }

  return res.status(500).json({ error: 'internal server error' });
};

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})