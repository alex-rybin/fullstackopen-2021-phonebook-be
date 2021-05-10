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

const errorHandler = (error, req, res, next) => {
    console.error(error.message)

    if (error.name === 'ValidationError') {
        return res.status(400).send({error: error.message})
    }

    next(error)
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
        .then(() => res.status(204).send())
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

    Person.findByIdAndUpdate(req.params.id, person, {
        runValidators: true,
        context: 'query',
        new: true
    },)
        .then(updatedPerson => res.json(updatedPerson))
        .catch(error => next(error))
}))

app.use(errorHandler)

app.listen(process.env.PORT || 3001)
