import bodyParser from 'body-parser'
import express, { Application } from 'express'
import connectDB from '../config/database'
import { welcomeMessage } from './service'
import {
  addAttendees,
  addSession,
  addSpeakers,
  allSessions,
  deleteSession,
  getSession,
  updateSession,
} from './sessions/session.controller'
import {
  addPerson,
  allPeople,
  deletePerson,
  getPerson,
  updatePerson,
} from './people/person.controller'
import { allSpeakers } from './people/speaker.controller'

const PORT = process.env.PORT || 3000

const app: Application = express()

connectDB()

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', welcomeMessage)

app.get('/sessions', allSessions)
app.post('/session', addSession)
app.get('/session/:id', getSession)
app.put('/session/:id', updateSession)
app.delete('/session/:id', deleteSession)
app.post('/session/:id/speaker', addSpeakers)
app.post('/session/:id/attendee', addAttendees)

app.get('/people', allPeople)
app.post('/person', addPerson)
app.get('/person/:id', getPerson)
app.put('/person/:id', updatePerson)
app.delete('/person/:id', deletePerson)
app.get('/speakers', allSpeakers)

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`)
})
