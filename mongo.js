const mongoose = require('mongoose')

const url =`mongodb+srv://phonebook-api:${password}@cluster0.thbcc.mongodb.net/phonebook-app?retryWrites=true&w=majority
`

if (process.argv.length < 3) {
  console.log('Please provide the password, name and number as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url =`mongodb+srv://phonebook-api:${password}@cluster0.thbcc.mongodb.net/phonebook-app?retryWrites=true&w=majority
`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if(process.argv.length === 3) {
  Person.find({}).then(result => {
    result.forEach(note => {
      console.log(note)
    })
    mongoose.connection.close()
  })
} else if(process.argv.length === 5) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })
  
  person.save().then(result => {
    console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
    mongoose.connection.close()
  })
} else {
  console.log('Please provide the password, name and number as an argument: node mongo.js <password>')
  process.exit(1)
  mongoose.connection.close()
}


