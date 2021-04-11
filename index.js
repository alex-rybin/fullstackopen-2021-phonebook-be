const express = require('express')
const app = express()

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

app.get('/api/persons/', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id/', (request, response) => {
    const person = persons.find(person => person.id === Number(request.params.id))

    if (person) {
        response.json(person)
    } else {
        response.status(404).send()
    }
})

app.delete('/api/persons/:id/', ((req, res) => {
    persons = persons.filter(person => person.id !== Number(req.params.id))
    res.status(204).send()
}))

app.get('/info/', (request, response) => {
    response.send(`Phonebook has info for ${persons.length} people<br/>${new Date().toString()}`)
})

app.listen(3001)
