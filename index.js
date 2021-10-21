require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const Person = require('./models/person')
const { request } = require('express')

const app = express()

// custom Morgan logging token definition
morgan.token('post-object', (req,res) => {
  if(req.method !== 'POST') return "";

  const name = req.body.name;
  const number = req.body.number;
  return JSON.stringify( {name, number});
});

app.use(express.static('build'))
app.use(express.json())

app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-object'))

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/people', (request, response) => {
  Person.find({}).then(people => {
    response.json(people)
  })
})

app.get('/api/people/:id', (request, response) => {
    Person.findById(request.params.id)
      .then(person => {
        if (person) {
          response.json(person)
        } else {
          response.status(404).end()
        }
      })
      .catch(error => {
        console.log(error)
        response.status(400).send({error: 'malformed id'})
      })

})

app.post('/api/people', (request, response, next) => {
    const body = request.body

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save()
      .then(savedPerson => savedPerson.toJSON())
      .then(savedandFormattedPerson => {
        response.json(savedandFormattedPerson)
      })
      .catch(error => next(error))
})

app.delete('/api/people/:id', (request, response) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/people/:id', (request, response, next) => {
  const body = request.body

    if(!body.name || !body.number) {
        return response.status(400).json({
            error: `Missing ${!body.name ? 'name' : ''}${!body.name && !body.number ? ' and ' : ''}${ !body.number ? 'number' : ''}`
        })
    }

    const person = {
      name: body.name,
      number: body.number
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true })
      .then(updatedPerson => {
        response.json(updatedPerson)
      })
      .catch(error => next(error))
})

app.get('/info', (request, response) => {
  Person.find({}).then(people => {
    response.send(`Phonebook has info for ${people.length} people <br/><br/> ${new Date().toString()}`)
  })
    
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformed id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})