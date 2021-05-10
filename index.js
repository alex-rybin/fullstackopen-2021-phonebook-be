require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

morgan.token('body', req => JSON.stringify(req.body))

app.use(express.json())
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.static('build'))


let persons = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1
    },
    {
        name: "Ada Lovelace",
        number: "39-44-5323523",
        id: 2
    },
    {
        name: "Dan Abramov",
        number: "12-43-234345",
        id: 3
    },
    {
        name: "Mary Poppendieck",
        number: "39-23-6423122",
        id: 4
    }
]

const errorHandler = (error, req, res) => {
    console.error(error.message)

    return error => res.status(500).json({error})
}


app.get('/persons/', (req, res, next) => {
    Person.find()
        .then(result => res.json(result))
        .catch(error => next(error))
})

app.get('/persons/:id/', (req, res, next) => {
    const handleFind = result => {
        if (result) {
            res.json(result)
        } else {
            res.status(404).send()
        }
    }

    Person.findById(req.params.id)
        .then(handleFind)
        .catch(next)
})

app.delete('/persons/:id/', ((req, res, next) => {
    Person.findByIdAndDelete(req.params.id)
        .then(result => res.status(204).send())
        .catch(error => next(error))
}))

app.get('/info/', (req, res, next) => {
    Person.count()
        .then(count => res.send(`Phonebook has info for ${count} people<br/>${new Date().toString()}`))
        .catch(next)
})

app.post('/persons/', ((req, res, next) => {
    if (!req.body.name) {
        return res.status(400).json({error: 'Name is missing'})
    } else if (!req.body.number) {
        return res.status(400).json({error: 'Number is missing'})
    }

    const person = new Person(req.body)

    person.save()
        .then(savedPerson => res.json(savedPerson))
        .catch(error => next(error))
}))

app.put('/persons/:id/', ((req, res, next) => {
    const person = {number: req.body.number}

    Person.findByIdAndUpdate(req.params.id, person, {new: true})
        .then(updatedPerson => res.json(updatedPerson))
        .catch(error => next(error))
}))

app.use(errorHandler)

app.listen(process.env.PORT || 3001)
