const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

morgan.token('body', (req, res) => JSON.stringify(req.body))

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

app.get('/persons/', (request, response) => {
    response.json(persons)
})

app.get('/persons/:id/', (request, response) => {
    const person = persons.find(person => person.id === Number(request.params.id))

    if (person) {
        response.json(person)
    } else {
        response.status(404).send()
    }
})

app.delete('/persons/:id/', ((req, res) => {
    persons = persons.filter(person => person.id !== Number(req.params.id))
    res.status(204).send()
}))

app.get('/info/', (request, response) => {
    response.send(`Phonebook has info for ${persons.length} people<br/>${new Date().toString()}`)
})

app.post('/persons/', ((req, res) => {
    if (!req.body.name) {
        return res.status(400).json({error: 'Name is missing'})
    } else if (!req.body.number) {
        return res.status(400).json({error: 'Number is missing'})
    } else if (persons.map(person => person.name).includes(req.body.name)) {
        return res.status(400).send({error: 'Name already exists'})
    }

    const newEntry = {
        name: req.body.name,
        number: req.body.number,
        id: Math.trunc(Math.random() * 10000)
    }

    persons = persons.concat(newEntry)

    res.json(newEntry)
}))

app.listen(process.env.PORT || 3001)
