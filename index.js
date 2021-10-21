require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()

// Morgan logging token definition
morgan.token('post-object', (req,res) => {
  if(req.method !== 'POST') return "";

  const name = req.body.name;
  const number = req.body.number;
  return JSON.stringify( {name, number});
});


app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-object'))
app.use(express.json())

app.use(express.static('build'))

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(people => {
    response.json(people)
  })
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
      response.json(person)
    })
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if(!body.name || !body.number) {
        return response.status(400).json({
            error: `Missing ${!body.name ? 'name' : ''}${!body.name && !body.number ? ' and ' : ''}${ !body.number ? 'number' : ''}`
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    note.save().then(savedNote => {
      response.json(savedNote)
    })
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.get('/info', (request, response) => {
    response.send(`Phonebook has info for ${persons.length} people <br/><br/> ${new Date().toString()}`)
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})